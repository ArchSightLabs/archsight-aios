#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const fixturePath = "prompts/evaluations/ceo-arch-review-fixtures.json";
const scorecardPath = "prompts/evaluations/ceo-arch-review-scorecard.json";
const expectedCaseIds = Array.from({ length: 8 }, (_, index) => `R0${index + 1}`);
const applicabilityFields = ["commit", "version", "environment", "time"];
const allowedEvaluationUses = new Set(["development", "held-out"]);
const absolutePathPatterns = [/[A-Za-z]:[\\/]/, /\\\\[^\\]+\\[^\\]+/, /\/(?:home|Users|var\/secrets)\//];

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasNonEmptyStringArray(value, minimum = 1) {
  return Array.isArray(value) && value.length >= minimum && value.every(isNonEmptyString);
}

function collectPrivatePathHits(value) {
  const text = JSON.stringify(value);
  return absolutePathPatterns.filter((pattern) => pattern.test(text)).map((pattern) => pattern.source);
}

export function validateArtifacts(fixtures, scorecard, skillTexts = {}) {
  const errors = [];
  const check = (condition, message) => {
    if (!condition) errors.push(message);
  };

  check(fixtures?.schema === 1, "fixtures: schema must be 1");
  check(fixtures?.name === "ceo-arch-review-fixtures", "fixtures: unexpected name");
  check(fixtures?.dataClassification === "synthetic-deidentified", "fixtures: dataClassification must be synthetic-deidentified");
  check(isNonEmptyString(fixtures?.notice) && fixtures.notice.includes("synthetic"), "fixtures: synthetic-data notice is required");
  check(Array.isArray(fixtures?.cases) && fixtures.cases.length === 8, "fixtures: exactly eight cases are required");

  const actualCaseIds = [];
  for (const item of fixtures?.cases ?? []) {
    actualCaseIds.push(item.id);
    check(expectedCaseIds.includes(item.id), `${item.id ?? "unknown"}: case id must be R01-R08`);
    check(isNonEmptyString(item.title), `${item.id}: title is required`);
    check(allowedEvaluationUses.has(item.evaluationUse), `${item.id}: evaluationUse must be development or held-out`);
    check(["general", "building"].includes(item.projectType), `${item.id}: projectType must be general or building`);
    check(JSON.stringify(item.requestedSkills) === JSON.stringify(["aios-ceo", "aios-arch"]), `${item.id}: requestedSkills must be CEO + Arch only`);
    check(isNonEmptyString(item.originalInstruction), `${item.id}: originalInstruction is required`);
    check(item.permissions?.mode === "read-only", `${item.id}: permission mode must be read-only`);
    check(hasNonEmptyStringArray(item.permissions?.allowed), `${item.id}: allowed actions are required`);
    check(hasNonEmptyStringArray(item.permissions?.prohibited), `${item.id}: prohibited actions are required`);
    check(Array.isArray(item.factPack) && item.factPack.length >= 2, `${item.id}: factPack must have at least two records`);
    check(hasNonEmptyStringArray(item.expectedBehaviors, 3), `${item.id}: expectedBehaviors must have at least three entries`);
    check(hasNonEmptyStringArray(item.prohibitedInferences, 2), `${item.id}: prohibitedInferences must have at least two entries`);
    check(hasNonEmptyStringArray(item.decisionBasis, 2), `${item.id}: decisionBasis must have at least two entries`);
    check(Array.isArray(item.counterfactuals) && item.counterfactuals.length >= 1, `${item.id}: at least one counterfactual is required`);

    for (const fact of item.factPack ?? []) {
      check(isNonEmptyString(fact.id), `${item.id}: fact id is required`);
      check(isNonEmptyString(fact.kind), `${item.id}/${fact.id}: fact kind is required`);
      check(isNonEmptyString(fact.claim), `${item.id}/${fact.id}: claim is required`);
      check(isNonEmptyString(fact.source) && !path.isAbsolute(fact.source), `${item.id}/${fact.id}: source must be repository-relative`);
      check(isNonEmptyString(fact.performed), `${item.id}/${fact.id}: performed is required`);
      for (const field of applicabilityFields) {
        check(isNonEmptyString(fact.applicability?.[field]), `${item.id}/${fact.id}: applicability.${field} is required`);
      }
      check(isNonEmptyString(fact.gaps), `${item.id}/${fact.id}: gaps are required`);
    }

    for (const counterfactual of item.counterfactuals ?? []) {
      check(isNonEmptyString(counterfactual.changedFact), `${item.id}: counterfactual.changedFact is required`);
      check(isNonEmptyString(counterfactual.expectedShift), `${item.id}: counterfactual.expectedShift is required`);
    }
  }

  check(JSON.stringify(actualCaseIds) === JSON.stringify(expectedCaseIds), "fixtures: cases must be unique and ordered R01-R08");
  check((fixtures?.cases ?? []).some((item) => item.evaluationUse === "held-out"), "fixtures: at least one held-out case is required");
  check((fixtures?.cases ?? []).some((item) => item.projectType === "general"), "fixtures: at least one general non-building case is required");
  check(collectPrivatePathHits(fixtures).length === 0, "fixtures: absolute or private-looking path detected");

  check(scorecard?.schema === 1, "scorecard: schema must be 1");
  check(scorecard?.fixtureName === fixtures?.name, "scorecard: fixtureName mismatch");
  check(scorecard?.fixtureVersion === fixtures?.version, "scorecard: fixtureVersion mismatch");
  check(scorecard?.reviewMode === "manual-semantic-review", "scorecard: reviewMode must make manual semantic review explicit");
  check(Array.isArray(scorecard?.hardFailures) && scorecard.hardFailures.length >= 8, "scorecard: at least eight hard failures are required");
  check(Array.isArray(scorecard?.positiveCriteria) && scorecard.positiveCriteria.length >= 6, "scorecard: positive decision-value criteria are required");
  check(isNonEmptyString(scorecard?.checkerLimit), "scorecard: checkerLimit is required");

  const hardFailureIds = new Set((scorecard?.hardFailures ?? []).map((item) => item.id));
  const positiveIds = new Set((scorecard?.positiveCriteria ?? []).map((item) => item.id));
  check(hardFailureIds.size === (scorecard?.hardFailures ?? []).length, "scorecard: hard failure ids must be unique");
  check(positiveIds.size === (scorecard?.positiveCriteria ?? []).length, "scorecard: positive criterion ids must be unique");
  for (const item of scorecard?.positiveCriteria ?? []) {
    check(isNonEmptyString(item.id) && isNonEmptyString(item.label), "scorecard: positive criteria need id and label");
    check(Number.isInteger(item.weight) && item.weight > 0, `${item.id}: weight must be a positive integer`);
  }
  for (const required of scorecard?.passRule?.requiredCriteria ?? []) {
    check(positiveIds.has(required), `scorecard: unknown required criterion ${required}`);
  }

  const reviewCaseIds = (scorecard?.caseReviews ?? []).map((item) => item.caseId);
  check(JSON.stringify(reviewCaseIds) === JSON.stringify(expectedCaseIds), "scorecard: caseReviews must cover R01-R08 in order");
  for (const review of scorecard?.caseReviews ?? []) {
    check(hasNonEmptyStringArray(review.manualQuestions, 2), `${review.caseId}: manualQuestions must have at least two entries`);
    for (const criterion of review.requiredCriteria ?? []) {
      check(positiveIds.has(criterion), `${review.caseId}: unknown positive criterion ${criterion}`);
    }
  }

  if (Object.keys(skillTexts).length > 0) {
    check(skillTexts.protocol?.includes("评审任务合同"), "protocol: review task contract anchor missing");
    check(skillTexts.protocol?.includes("证据记录与适用性"), "protocol: evidence applicability anchor missing");
    check(skillTexts.protocol?.includes("事实状态、优先级与决策边界"), "protocol: state and decision boundary anchor missing");
    check(skillTexts.ceo?.includes("../../governance/arbitration-protocol.md"), "aios-ceo: shared protocol reference missing");
    check(skillTexts.ceo?.includes("成熟度状态"), "aios-ceo: rubric-gated maturity status missing");
    check(!skillTexts.ceo?.includes("## 成熟度评分"), "aios-ceo: unconditional maturity score section remains");
    check(skillTexts.arch?.includes("../../governance/arbitration-protocol.md"), "aios-arch: shared protocol reference missing");
    check(skillTexts.arch?.includes("静态追踪"), "aios-arch: static trace boundary missing");
    check(skillTexts.arch?.includes("事实状态"), "aios-arch: finding state field missing");
  }

  return errors;
}

function readJson(root, relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function runCli() {
  const root = fs.realpathSync(process.cwd());
  const fixtures = readJson(root, fixturePath);
  const scorecard = readJson(root, scorecardPath);
  const skillTexts = {
    protocol: fs.readFileSync(path.join(root, "governance/arbitration-protocol.md"), "utf8"),
    ceo: fs.readFileSync(path.join(root, "skills/aios-ceo/SKILL.md"), "utf8"),
    arch: fs.readFileSync(path.join(root, "skills/aios-arch/SKILL.md"), "utf8")
  };
  const errors = validateArtifacts(fixtures, scorecard, skillTexts);
  if (errors.length > 0) {
    console.error(`CEO/Arch review evaluation validation failed with ${errors.length} error(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log("CEO/Arch review evaluation validation passed (schema and contract anchors only; model behavior not graded)." );
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirectRun) runCli();
