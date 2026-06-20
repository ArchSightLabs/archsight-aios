#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = fs.realpathSync(process.cwd());
const errors = [];
const evidencePath = "prompts/evaluations/skill-runtime/v1.4.0-writing-host-validation.json";
const reportPath = "prompts/evaluations/skill-runtime/v1.4.0-writing-host-validation.md";

const sensitiveTerms = [
  "立信",
  "闻总",
  "谭总",
  "客户内部",
  "培训演示",
  "基础内测",
  "内测模式",
  "内测包"
];

function repoPath(...parts) {
  const target = path.join(root, ...parts);
  const relative = path.relative(root, target);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Path traversal detected: ${target}`);
  }
  return target;
}

function readJson(relativePath) {
  try {
    return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
  } catch (error) {
    errors.push(`${relativePath}: invalid JSON (${error.message})`);
    return undefined;
  }
}

function readText(relativePath) {
  try {
    return fs.readFileSync(repoPath(relativePath), "utf8");
  } catch (error) {
    errors.push(`${relativePath}: ${error.message}`);
    return "";
  }
}

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function check(condition, message) {
  if (!condition) errors.push(message);
}

function includesSensitiveTerm(value) {
  const raw = typeof value === "string" ? value : JSON.stringify(value);
  return sensitiveTerms.filter((term) => raw.includes(term));
}

const evidence = readJson(evidencePath);
const report = readText(reportPath);

if (evidence) {
  check(evidence.schema === 1, "evidence: schema must be 1");
  check(evidence.name === "v1.4.0-writing-host-validation", "evidence: unexpected name");
  check(typeof evidence.aiosVersion === "string" && evidence.aiosVersion.length > 0, "evidence: aiosVersion is required");
  check(Array.isArray(evidence.hostChecks) && evidence.hostChecks.length >= 2, "evidence: hostChecks must cover at least two hosts");
  check(Array.isArray(evidence.cases) && evidence.cases.length >= 4, "evidence: cases must cover host x writing skill matrix");
  check(typeof evidence.scorecardReview?.reviewPath === "string", "evidence: scorecardReview.reviewPath is required");
  check(exists(evidence.scorecardReview?.scorecardPath ?? ""), "evidence: scorecardReview.scorecardPath missing");
  check(exists(evidence.scorecardReview?.reviewPath ?? ""), "evidence: scorecardReview.reviewPath missing");
  check(typeof evidence.releaseGate?.notReadyUntil === "string", "evidence: releaseGate.notReadyUntil is required");
  check(report.includes(evidence.name), "report: must reference evidence name");
  const scorecardReview = evidence.scorecardReview?.reviewPath ? readText(evidence.scorecardReview.reviewPath) : "";

  const sensitiveHits = includesSensitiveTerm(evidence);
  check(sensitiveHits.length === 0, `evidence: sensitive terms leaked (${sensitiveHits.join(", ")})`);

  const expectedPairs = new Set([
    "codex::aios-tender-write",
    "codex::aios-scheme-write",
    "workbuddy::aios-tender-write",
    "workbuddy::aios-scheme-write"
  ]);
  const actualPairs = new Set();
  const allowedStatuses = new Set(["yes", "no", "blocked", "uncertain"]);

  for (const item of evidence.cases ?? []) {
    check(typeof item.caseId === "string" && item.caseId.length > 0, "case: caseId is required");
    check(typeof item.host === "string" && item.host.length > 0, `${item.caseId}: host is required`);
    check(typeof item.skillId === "string" && item.skillId.startsWith("aios-"), `${item.caseId}: skillId is invalid`);
    check(typeof item.expectedGateSkill === "string" && item.expectedGateSkill.startsWith("aios-"), `${item.caseId}: expectedGateSkill is invalid`);
    check(typeof item.sampleWorkspacePath === "string" && exists(item.sampleWorkspacePath), `${item.caseId}: sampleWorkspacePath missing`);
    check(typeof item.triggerPrompt === "string" && item.triggerPrompt.includes(item.skillId), `${item.caseId}: triggerPrompt must mention skillId`);
    check(allowedStatuses.has(item.skillRuntimeConfirmed), `${item.caseId}: invalid skillRuntimeConfirmed`);
    check(Array.isArray(item.evidence) && item.evidence.length > 0, `${item.caseId}: evidence must be non-empty`);
    actualPairs.add(`${item.host}::${item.skillId}`);

    if (item.skillRuntimeConfirmed === "yes") {
      check(typeof item.rawOutputPath === "string" && exists(item.rawOutputPath), `${item.caseId}: confirmed runtime needs rawOutputPath`);
      const raw = readText(item.rawOutputPath);
      check(raw.includes(item.skillId), `${item.caseId}: raw output must include skillId`);
      check(raw.includes(item.expectedGateSkill), `${item.caseId}: raw output must include expected gate skill`);
      check(scorecardReview.includes(item.caseId), `${item.caseId}: scorecard review must mention caseId`);
    } else {
      check(item.rawOutputPath === null, `${item.caseId}: non-confirmed runtime must not point to raw output`);
      check(typeof item.blocker === "string" && item.blocker.length > 0, `${item.caseId}: blocker is required when runtime is not confirmed`);
    }
  }

  for (const expected of expectedPairs) {
    check(actualPairs.has(expected), `evidence: missing case ${expected}`);
  }
}

if (errors.length > 0) {
  console.error(`Skill runtime evidence validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Skill runtime evidence validation passed.");
