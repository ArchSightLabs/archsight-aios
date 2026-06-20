#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { findSensitiveTerms, loadLocalSensitiveTerms } from "./lib/local-sensitive-terms.mjs";

const root = fs.realpathSync(process.cwd());
const errors = [];

const scorecardSpecs = [
  {
    fixturePath: "prompts/evaluations/engineering-business-basic-fixtures.json",
    scorecardPath: "prompts/evaluations/engineering-business-basic-scorecard.json"
  },
  {
    fixturePath: "prompts/evaluations/engineering-document-writing-fixtures.json",
    scorecardPath: "prompts/evaluations/engineering-document-writing-scorecard.json"
  }
];
const sensitiveTerms = loadLocalSensitiveTerms(root);

function repoPath(...parts) {
  const target = path.join(root, ...parts);
  const relative = path.relative(root, target);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Path traversal detected: ${target}`);
  }
  return target;
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    errors.push(`${path.relative(root, filePath)}: invalid JSON (${error.message})`);
    return undefined;
  }
}

function check(condition, message) {
  if (!condition) errors.push(message);
}

function includesSensitiveTerm(value) {
  return findSensitiveTerms(value, sensitiveTerms);
}

function weightedScore(scores, criteria) {
  const totalWeight = criteria.reduce((sum, item) => sum + item.weight, 0);
  return (
    criteria.reduce((sum, item) => {
      return sum + scores[item.id] * item.weight;
    }, 0) / totalWeight
  );
}

function validateScorecard(fixturePathValue, scorecardPathValue) {
  const fixture = readJson(repoPath(fixturePathValue));
  const scorecard = readJson(repoPath(scorecardPathValue));
  if (!fixture || !scorecard) {
    return;
  }

  check(scorecard.schema === 1, "scorecard: schema must be 1");
  check(scorecard.version === fixture.version, `scorecard: version must match fixture version ${fixture.version}`);
  check(scorecard.fixture === fixturePathValue, `${scorecardPathValue}: fixture path mismatch`);
  check(Array.isArray(scorecard.criteria) && scorecard.criteria.length > 0, "scorecard: criteria must be a non-empty array");
  check(Array.isArray(scorecard.cases) && scorecard.cases.length === fixture.cases.length, "scorecard: case count mismatch");

  const sensitiveHits = includesSensitiveTerm(scorecard);
  check(sensitiveHits.length === 0, `scorecard: sensitive terms leaked (${sensitiveHits.join(", ")})`);

  const criteriaIds = new Set();
  let totalWeight = 0;
  for (const criterion of scorecard.criteria ?? []) {
    check(/^[a-z0-9_]+$/.test(criterion.id), `${criterion.id ?? "unknown"}: invalid criterion id`);
    check(!criteriaIds.has(criterion.id), `${criterion.id}: duplicate criterion`);
    criteriaIds.add(criterion.id);
    check(Number.isInteger(criterion.weight) && criterion.weight > 0, `${criterion.id}: weight must be a positive integer`);
    totalWeight += criterion.weight ?? 0;
    check(typeof criterion.description === "string" && criterion.description.length > 0, `${criterion.id}: missing description`);
  }
  check(totalWeight === 100, `scorecard: criteria weights must total 100, got ${totalWeight}`);

  const fixtureById = new Map((fixture.cases ?? []).map((item) => [item.id, item]));
  const expectedIds = [...fixtureById.keys()].sort();
  const actualIds = (scorecard.cases ?? []).map((item) => item.caseId).sort();
  check(JSON.stringify(actualIds) === JSON.stringify(expectedIds), "scorecard: case coverage mismatch");

  for (const item of scorecard.cases ?? []) {
    const sourceCase = fixtureById.get(item.caseId);
    check(Boolean(sourceCase), `${item.caseId}: caseId not found in fixtures`);
    check(item.winner === "basic", `${item.caseId}: winner must be basic`);
    check(typeof item.decisionBasis === "string" && item.decisionBasis.length > 0, `${item.caseId}: missing decisionBasis`);
    check(Array.isArray(item.basicPromptGains) && item.basicPromptGains.length > 0, `${item.caseId}: basicPromptGains must be non-empty`);
    check(
      JSON.stringify(item.observedWeakFailures ?? []) === JSON.stringify(sourceCase?.weakFailureModes ?? []),
      `${item.caseId}: observedWeakFailures must match fixture weakFailureModes`
    );

    for (const scoreSetName of ["weakScores", "basicScores"]) {
      const scoreSet = item[scoreSetName] ?? {};
      const scoreIds = Object.keys(scoreSet).sort();
      check(JSON.stringify(scoreIds) === JSON.stringify([...criteriaIds].sort()), `${item.caseId}: ${scoreSetName} coverage mismatch`);
      for (const criterionId of criteriaIds) {
        const value = scoreSet[criterionId];
        check(Number.isInteger(value) && value >= 1 && value <= 5, `${item.caseId}: ${scoreSetName}.${criterionId} must be 1-5`);
      }
    }

    const weakTotal = weightedScore(item.weakScores, scorecard.criteria);
    const basicTotal = weightedScore(item.basicScores, scorecard.criteria);
    check(
      basicTotal - weakTotal >= scorecard.minimumWeightedDelta,
      `${item.caseId}: weighted improvement ${Number(basicTotal - weakTotal).toFixed(2)} is below minimum ${scorecard.minimumWeightedDelta}`
    );
  }

  check(scorecard.overallDecision?.winner === "basic", "scorecard: overall winner must be basic");
  check(typeof scorecard.overallDecision?.notAClaim === "string", "scorecard: overallDecision.notAClaim is required");
}

for (const spec of scorecardSpecs) {
  validateScorecard(spec.fixturePath, spec.scorecardPath);
}

if (errors.length > 0) {
  console.error(`Prompt scorecard validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Prompt scorecard validation passed.");
