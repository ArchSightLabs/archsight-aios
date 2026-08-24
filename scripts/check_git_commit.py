#!/usr/bin/env python3
"""校验 ArchSight 中文 Conventional + Lore Commit 信息。"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

CJK_RE = re.compile(r"[\u3400-\u4dbf\u4e00-\u9fff]")
CONVENTIONAL_RE = re.compile(
    r"^(?P<type>[a-z][a-z0-9-]*)(?:\((?P<scope>[^()\r\n]+)\))?(?P<breaking>!)?:[ \t]+(?P<description>.+)$"
)
TRAILER_RE = re.compile(r"^([A-Za-z][A-Za-z0-9-]*):[ \t]*(.*)$")
TEMPORARY_RE = re.compile(r"^(?:fixup!|squash!)\s+")
ZERO_SHA_RE = re.compile(r"^0+$")
ENUMS = {
    "Confidence": {"low", "medium", "high"},
    "Scope-risk": {"narrow", "moderate", "broad"},
    "Reversibility": {"clean", "messy", "irreversible"},
}
REQUIRED = ("Confidence", "Scope-risk", "Tested")


@dataclass(frozen=True)
class ParsedMessage:
    subject: str
    body: str
    trailers: tuple[tuple[str, str], ...]
    malformed_trailer_block: bool


def contains_chinese(value: str) -> bool:
    return bool(CJK_RE.search(value))


def parse_message(message: str) -> ParsedMessage:
    lines = message.replace("\r\n", "\n").replace("\r", "\n").rstrip("\n").split("\n")
    if not lines:
        return ParsedMessage("", "", (), False)
    subject = lines[0].strip()
    trailer_start = len(lines)
    while trailer_start > 0 and TRAILER_RE.match(lines[trailer_start - 1]):
        trailer_start -= 1
    trailers = tuple(
        (match.group(1), match.group(2).strip())
        for line in lines[trailer_start:]
        if (match := TRAILER_RE.match(line))
    )
    malformed = False
    if trailers:
        malformed = trailer_start < 2 or lines[trailer_start - 1].strip() != ""
        body_lines = lines[1 : trailer_start - 1] if not malformed else lines[1:trailer_start]
    else:
        body_lines = lines[1:]
        malformed = any(TRAILER_RE.match(line) for line in body_lines)
    return ParsedMessage(subject, "\n".join(body_lines).strip(), trailers, malformed)


def validate_message(message: str, *, shared_boundary: bool = False) -> list[str]:
    parsed = parse_message(message)
    issues: list[str] = []
    if not parsed.subject:
        return ["标题为空"]
    if TEMPORARY_RE.match(parsed.subject):
        return ["共享边界不允许 fixup!/squash! 临时提交"] if shared_boundary else []
    conventional = CONVENTIONAL_RE.match(parsed.subject)
    if not conventional:
        issues.append("标题必须使用 Conventional 格式：type(scope): 中文动机说明")
    elif not contains_chinese(conventional.group("description")):
        issues.append("Conventional 标题的动机说明必须包含中文")
    if not parsed.body:
        issues.append("正文为空，必须用中文解释为什么改")
    elif not contains_chinese(parsed.body):
        issues.append("正文必须包含中文说明")
    if parsed.malformed_trailer_block:
        issues.append("trailer 必须位于消息末尾的连续区块，并与正文空一行")

    values: dict[str, list[str]] = {}
    for key, value in parsed.trailers:
        values.setdefault(key, []).append(value)
        if not value:
            issues.append(f"trailer {key} 的值为空")
        elif key in ENUMS and value not in ENUMS[key]:
            choices = "|".join(sorted(ENUMS[key]))
            issues.append(f"trailer {key} 必须为 {choices}")
    for key in REQUIRED:
        if key not in values:
            issues.append(f"缺少必需 trailer：{key}")
    return issues


def git(repo: Path, *args: str) -> str:
    result = subprocess.run(
        ["git", "-C", str(repo), *args],
        text=True,
        encoding="utf-8",
        errors="replace",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    if result.returncode:
        raise RuntimeError(result.stderr.strip() or "Git 命令失败")
    return result.stdout


def revision_message(repo: Path, revision: str) -> str:
    return git(repo, "show", "-s", "--format=%B", revision)


def revisions_in_range(repo: Path, revision_range: str) -> list[str]:
    output = git(repo, "rev-list", "--reverse", revision_range)
    return [line for line in output.splitlines() if line]


def resolve_ref(repo: Path, ref: str) -> str | None:
    try:
        return git(repo, "rev-parse", "--verify", ref).strip() or None
    except RuntimeError:
        return None


def merge_base(repo: Path, left: str, right: str) -> str | None:
    try:
        return git(repo, "merge-base", left, right).strip() or None
    except RuntimeError:
        return None


def outgoing_range(repo: Path, head: str = "HEAD") -> str:
    for candidate in ("@{upstream}", "origin/main", "origin/master"):
        resolved = resolve_ref(repo, candidate)
        if resolved and (base := merge_base(repo, head, resolved)):
            return f"{base}..{head}"
    parent = resolve_ref(repo, f"{head}^")
    return f"{parent}..{head}" if parent else head


def pre_push_ranges(repo: Path, stdin_text: str) -> list[str]:
    ranges: list[str] = []
    for raw_line in stdin_text.splitlines():
        fields = raw_line.split()
        if len(fields) != 4:
            continue
        _local_ref, local_sha, _remote_ref, remote_sha = fields
        if ZERO_SHA_RE.match(local_sha):
            continue
        if not ZERO_SHA_RE.match(remote_sha):
            ranges.append(f"{remote_sha}..{local_sha}")
            continue
        ranges.append(outgoing_range(repo, local_sha))
    return list(dict.fromkeys(ranges))


def github_event_range(repo: Path, event_path: Path) -> str:
    event = json.loads(event_path.read_text(encoding="utf-8-sig"))
    pull_request = event.get("pull_request")
    if isinstance(pull_request, dict):
        base = pull_request.get("base", {}).get("sha")
        head = pull_request.get("head", {}).get("sha")
        if base and head:
            return f"{base}..{head}"
    before = str(event.get("before") or "")
    after = str(event.get("after") or "")
    if before and after and not ZERO_SHA_RE.match(before):
        return f"{before}..{after}"
    if after and not ZERO_SHA_RE.match(after):
        parent = resolve_ref(repo, f"{after}^")
        return f"{parent}..{after}" if parent else after
    return outgoing_range(repo)


def validate_revisions(repo: Path, revisions: list[str], *, shared_boundary: bool) -> int:
    failures = 0
    for revision in revisions:
        message = revision_message(repo, revision)
        issues = validate_message(message, shared_boundary=shared_boundary)
        if issues:
            failures += 1
            subject = message.splitlines()[0] if message.splitlines() else ""
            print(f"[失败] {revision[:12]} {subject}", file=sys.stderr)
            for issue in issues:
                print(f"  - {issue}", file=sys.stderr)
    if failures:
        print(f"中文 Conventional + Lore Commit 门禁失败：{failures} 个提交不合规。", file=sys.stderr)
        return 1
    print(f"中文 Conventional + Lore Commit 门禁通过：已校验 {len(revisions)} 个提交。")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, default=Path.cwd())
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--message-file", type=Path)
    group.add_argument("--revision")
    group.add_argument("--range", dest="revision_range")
    group.add_argument("--outgoing", action="store_true")
    group.add_argument("--pre-push", action="store_true")
    group.add_argument("--github-event", type=Path)
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    repo = args.repo.resolve()
    if args.message_file:
        message = args.message_file.read_text(encoding="utf-8-sig")
        issues = validate_message(message)
        if issues:
            for issue in issues:
                print(f"中文 Conventional + Lore Commit 门禁失败：{issue}", file=sys.stderr)
            return 1
        print("中文 Conventional + Lore Commit 门禁通过。")
        return 0
    if args.revision:
        revisions = [args.revision]
    elif args.revision_range:
        revisions = revisions_in_range(repo, args.revision_range)
    elif args.outgoing:
        revisions = revisions_in_range(repo, outgoing_range(repo))
    elif args.github_event:
        revisions = revisions_in_range(repo, github_event_range(repo, args.github_event))
    else:
        ranges = pre_push_ranges(repo, sys.stdin.read())
        revisions = []
        for value in ranges:
            revisions.extend(revisions_in_range(repo, value))
        revisions = list(dict.fromkeys(revisions))
    return validate_revisions(repo, revisions, shared_boundary=not bool(args.revision))


if __name__ == "__main__":
    raise SystemExit(main())
