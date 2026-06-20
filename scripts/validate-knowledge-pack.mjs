#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = fs.realpathSync(process.cwd());
const cli = path.join(root, "bin", "archsight-aios.mjs");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "archsight-aios-knowledge-pack-"));
const packPath = path.join(tempRoot, "knowledge-pack.json");
const inputPath = path.join(tempRoot, "lookup-input.json");
const scorecardPath = path.join(root, "prompts", "evaluations", "engineering-knowledge-pack-scorecard.json");

function run(args, options = {}) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd: root,
    encoding: "utf8",
    ...options
  });
  if (result.status !== 0) {
    throw new Error(`${args.join(" ")} failed\n${result.stdout}\n${result.stderr}`);
  }
  return result;
}

try {
  const scorecard = JSON.parse(fs.readFileSync(scorecardPath, "utf8"));
  assert.equal(scorecard.schema, 1);
  assert.equal(scorecard.sampleCase.packId, "scheme-review-reference");
  assert.equal(scorecard.criteria.reduce((sum, item) => sum + item.weight, 0), 100);
  const weightedScore = scorecard.criteria.reduce((sum, item) => {
    return sum + scorecard.sampleCase.scores[item.id] * item.weight;
  }, 0) / 100;
  assert.ok(weightedScore >= scorecard.sampleCase.minimumPassingWeightedScore);

  run(["knowledge:validate", "--cwd", "templates/knowledge-pack-samples", "--name", "scheme-review"]);
  run([
    "knowledge:compile",
    "--cwd",
    "templates/knowledge-pack-samples",
    "--name",
    "scheme-review",
    "--out",
    packPath
  ]);

  const inspect = JSON.parse(run(["knowledge:inspect", "--pack", packPath]).stdout);
  assert.equal(inspect.packId, "scheme-review-reference");
  assert.equal(inspect.counts.clauses, 4);
  assert.equal(inspect.counts.evalQuestions, 5);

  const lookup = JSON.parse(run([
    "knowledge:lookup",
    "--pack",
    packPath,
    "--query",
    "高支模方案是否应检查计算书"
  ]).stdout);
  assert.equal(lookup.status, "found");
  assert.equal(lookup.applicability, "applicable");
  assert.equal(lookup.citations[0].clauseId, "CLAUSE-HIGH-FORMWORK");
  assert.equal(lookup.sourceVersion, "SYN-2026.01");

  const evalReport = JSON.parse(run(["knowledge:eval", "--pack", packPath]).stdout);
  assert.equal(evalReport.failed, 0);
  assert.equal(evalReport.passed, 5);

  fs.writeFileSync(
    inputPath,
    JSON.stringify({
      knowledgePackPath: packPath,
      query: "高支模方案是否应检查计算书"
    }),
    "utf8"
  );
  const capability = JSON.parse(run([
    "capability:call",
    "--capability",
    "knowledge.norm_lookup",
    "--agent",
    "vitruvius",
    "--skill",
    "aios-knowledge",
    "--input",
    inputPath
  ]).stdout);
  assert.equal(capability.toolResult.status, "found");
  assert.equal(capability.decision.action, "proceed");
  assert.equal(capability.evidence.serverInfo.name, "archsight-aios-knowledge-reference");

  console.log("Knowledge Pack validation passed.");
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
