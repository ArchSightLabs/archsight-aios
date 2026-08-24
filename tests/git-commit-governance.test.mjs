import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const validator = path.join(root, "scripts", "check_git_commit.py");

function validate(message) {
  const directory = mkdtempSync(path.join(tmpdir(), "archsight-commit-"));
  const messageFile = path.join(directory, "message.txt");
  try {
    writeFileSync(messageFile, message, "utf8");
    return spawnSync("python", [validator, "--repo", root, "--message-file", messageFile], {
      cwd: root,
      encoding: "utf8",
      env: { ...process.env, PYTHONUTF8: "1" },
    });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    encoding: "utf8",
    env: { ...process.env, PYTHONUTF8: "1" },
    ...options,
  });
}

const valid = `ci(governance): 防止英文提交进入共享历史

本次治理让本地和服务端使用同一条中文提交规则。

Confidence: high
Scope-risk: narrow
Tested: node --test tests/git-commit-governance.test.mjs
`;

test("接受中文 Conventional + Lore Commit", () => {
  const result = validate(valid);
  assert.equal(result.status, 0, result.stderr);
});

test("拒绝纯英文提交", () => {
  const result = validate(valid.replace("ci(governance): 防止英文提交进入共享历史", "ci(governance): Add commit governance"));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Conventional 标题的动机说明必须包含中文/u);
});

test("拒绝缺少 Conventional 前缀的中文标题", () => {
  const result = validate(valid.replace("ci(governance): ", ""));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Conventional 格式/u);
});

test("接受直接记录测试命令的 Tested trailer", () => {
  const result = validate(valid);
  assert.equal(result.status, 0, result.stderr);
});

test("GitHub event 范围会拦截绕过本地 Hook 的提交", () => {
  const directory = mkdtempSync(path.join(tmpdir(), "archsight-commit-range-"));
  try {
    assert.equal(run("git", ["init", "-q"], { cwd: directory }).status, 0);
    run("git", ["config", "user.name", "测试者"], { cwd: directory });
    run("git", ["config", "user.email", "test@example.invalid"], { cwd: directory });
    writeFileSync(path.join(directory, "one.txt"), "1", "utf8");
    run("git", ["add", "one.txt"], { cwd: directory });
    assert.equal(run("git", ["commit", "-q", "-F", "-"], { cwd: directory, input: valid }).status, 0);
    const base = run("git", ["rev-parse", "HEAD"], { cwd: directory }).stdout.trim();
    writeFileSync(path.join(directory, "two.txt"), "2", "utf8");
    run("git", ["add", "two.txt"], { cwd: directory });
    assert.equal(run("git", ["commit", "-q", "-m", "English only"], { cwd: directory }).status, 0);
    const head = run("git", ["rev-parse", "HEAD"], { cwd: directory }).stdout.trim();
    const eventPath = path.join(directory, "event.json");
    writeFileSync(eventPath, JSON.stringify({ pull_request: { base: { sha: base }, head: { sha: head } } }), "utf8");

    const result = run("python", [validator, "--repo", directory, "--github-event", eventPath], { cwd: directory });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /English only/u);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
