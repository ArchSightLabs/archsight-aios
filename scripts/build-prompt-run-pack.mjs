#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = fs.realpathSync(process.cwd());
const errors = [];

const args = parseArgs(process.argv.slice(2));
const fixturePath = repoPath(args.fixture);
const fixture = readJson(fixturePath);

const sensitiveTerms = [
  "立信",
  "费敏",
  "闻总",
  "谭总",
  "茅盾中学",
  "鸿益",
  "太鑫",
  "飞双",
  "魔毯",
  "客户内部",
  "培训演示",
  "基础内测",
  "内测模式",
  "内测包",
  "嘉兴",
  "绍兴",
  "杭州",
  "20,000",
  "20000",
  "28,000",
  "28000",
  "17,800",
  "17800"
];

function repoPath(...parts) {
  const target = path.join(root, ...parts);
  const relative = path.relative(root, target);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Path traversal detected: ${target}`);
  }
  return target;
}

function parseArgs(argv) {
  const parsed = {
    out: undefined,
    fixture: "prompts/evaluations/engineering-business-basic-fixtures.json"
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--out") {
      const value = argv[index + 1];
      if (!value) {
        errors.push("--out requires a path");
      } else {
        parsed.out = repoPath(value);
        index += 1;
      }
    } else if (arg === "--fixture") {
      const value = argv[index + 1];
      if (!value) {
        errors.push("--fixture requires a path");
      } else {
        repoPath(value);
        parsed.fixture = value.replace(/\\/g, "/");
        index += 1;
      }
    } else if (arg === "--check") {
      continue;
    } else {
      errors.push(`Unknown argument: ${arg}`);
    }
  }

  return parsed;
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    errors.push(`${path.relative(root, filePath)}: invalid JSON (${error.message})`);
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

function check(condition, message) {
  if (!condition) errors.push(message);
}

function includesSensitiveTerm(value) {
  const raw = typeof value === "string" ? value : JSON.stringify(value);
  return sensitiveTerms.filter((term) => raw.includes(term));
}

function caseInput(item) {
  if (item.markdownFixturePath) {
    return [readText(item.markdownFixturePath)];
  }
  return item.sampleInput;
}

function runPackName() {
  if (fixture?.name === "engineering-business-basic-fixtures") {
    return "engineering-business-basic-run-pack";
  }
  return `${fixture?.name ?? "prompt-fixture"}-run-pack`;
}

function runPackDataBoundary() {
  if (fixture?.name === "engineering-document-writing-fixtures") {
    return "De-identified engineering document writing run pack. Inputs are synthetic or abstracted writing-task shapes; do not add real customer names, contacts, project names, amounts, dates, locations, or raw source documents.";
  }

  return "De-identified weak/basic prompt run pack. Public advisory fixtures use Markdown-normalized synthetic inputs; do not add real customer names, contacts, project names, amounts, dates, locations, or raw source documents.";
}

function runPackInstructions() {
  const instructions = [
    "For each item, use prompt as the instruction and sampleInput as the user-provided material.",
    "When inputFormat is markdown, pass the Markdown text as the material under review.",
    "Run weak and basic variants separately for the same caseId.",
    "Save model outputs into the model-output JSON schema and validate with validate-prompt-model-outputs.mjs."
  ];

  if (fixture?.name === "engineering-document-writing-fixtures") {
    instructions.push("Compare weak and basic outputs against expectedStrongSections, bannedClaims, source provenance, material reuse judgment, and review-gate handoff.");
  } else {
    instructions.push("Compare weak and basic outputs using engineering-business-basic-scorecard.json.");
  }

  return instructions;
}

function buildRunPack() {
  if (!fixture) return undefined;

  const runs = [];
  for (const item of fixture.cases ?? []) {
    const basicPrompt = readText(item.promptPath);
    const sampleInput = caseInput(item);
    const common = {
      caseId: item.id,
      skillId: item.skillId,
      scenario: item.scenario,
      promptVersion: fixture.version,
      inputSummary: item.inputSummary,
      inputFormat: item.markdownFixturePath ? "markdown" : "inline-list",
      sampleInput,
      expectedStrongSections: item.expectedStrongSections,
      bannedClaims: item.bannedClaims,
      weakFailureModes: item.weakFailureModes,
      ...(item.markdownFixturePath ? { markdownFixturePath: item.markdownFixturePath } : {})
    };

    runs.push({
      ...common,
      runId: `${item.id}::weak`,
      variant: "weak",
      promptSource: "fixture.weakPrompt",
      prompt: item.weakPrompt
    });
    runs.push({
      ...common,
      runId: `${item.id}::basic`,
      variant: "basic",
      promptSource: item.promptPath,
      prompt: basicPrompt
    });
  }

  return {
    schema: 1,
    name: runPackName(),
    version: fixture.version,
    fixture: args.fixture,
    dataBoundary: runPackDataBoundary(),
    runInstructions: runPackInstructions(),
    runs
  };
}

function validateRunPack(runPack) {
  if (!fixture || !runPack) return;

  check(runPack.schema === 1, "run pack: schema must be 1");
  check(runPack.version === fixture.version, `run pack: version must match fixture version ${fixture.version}`);
  check(runPack.fixture === args.fixture, "run pack: fixture path mismatch");
  check(Array.isArray(runPack.runs), "run pack: runs must be an array");
  check(runPack.runs?.length === (fixture.cases?.length ?? 0) * 2, "run pack: must include weak and basic runs for every case");

  const sensitiveHits = includesSensitiveTerm(runPack);
  check(sensitiveHits.length === 0, `run pack: sensitive terms leaked (${sensitiveHits.join(", ")})`);

  const fixtureById = new Map((fixture.cases ?? []).map((item) => [item.id, item]));
  const seenRunIds = new Set();
  const variantsByCase = new Map();

  for (const item of runPack.runs ?? []) {
    check(typeof item.runId === "string" && item.runId.length > 0, "run pack item: missing runId");
    check(!seenRunIds.has(item.runId), `${item.runId}: duplicate runId`);
    seenRunIds.add(item.runId);

    const sourceCase = fixtureById.get(item.caseId);
    check(Boolean(sourceCase), `${item.runId}: caseId not found in fixture`);
    check(item.variant === "weak" || item.variant === "basic", `${item.runId}: variant must be weak or basic`);
    check(item.skillId === sourceCase?.skillId, `${item.runId}: skillId mismatch`);
    check(item.promptVersion === fixture.version, `${item.runId}: promptVersion mismatch`);
    check(Array.isArray(item.sampleInput) && item.sampleInput.length > 0, `${item.runId}: sampleInput must be non-empty`);
    check(typeof item.prompt === "string" && item.prompt.length > 0, `${item.runId}: prompt must be non-empty`);
    if (sourceCase?.markdownFixturePath) {
      check(item.inputFormat === "markdown", `${item.runId}: markdown fixture must set inputFormat=markdown`);
      check(item.markdownFixturePath === sourceCase.markdownFixturePath, `${item.runId}: markdownFixturePath mismatch`);
      check(item.sampleInput.length === 1, `${item.runId}: markdown fixture sampleInput must contain one markdown string`);
      check(item.sampleInput[0] === readText(sourceCase.markdownFixturePath), `${item.runId}: sampleInput must match markdown fixture content`);
    }

    const variants = variantsByCase.get(item.caseId) ?? new Set();
    variants.add(item.variant);
    variantsByCase.set(item.caseId, variants);

    if (item.variant === "weak") {
      check(item.prompt === sourceCase?.weakPrompt, `${item.runId}: weak prompt must match fixture weakPrompt`);
      check(item.promptSource === "fixture.weakPrompt", `${item.runId}: weak promptSource mismatch`);
    } else {
      check(item.prompt === readText(sourceCase?.promptPath), `${item.runId}: basic prompt must match promptPath content`);
      check(item.promptSource === sourceCase?.promptPath, `${item.runId}: basic promptSource mismatch`);
    }
  }

  for (const caseId of fixtureById.keys()) {
    const variants = variantsByCase.get(caseId);
    check(variants?.has("weak") && variants?.has("basic"), `${caseId}: missing weak/basic pair`);
  }
}

const runPack = buildRunPack();
validateRunPack(runPack);

if (errors.length > 0) {
  console.error(`Prompt run pack build failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

if (args.out) {
  fs.mkdirSync(path.dirname(args.out), { recursive: true });
  fs.writeFileSync(args.out, `${JSON.stringify(runPack, null, 2)}\n`, "utf8");
  console.log(`Prompt run pack written: ${path.relative(root, args.out)}`);
} else {
  console.log("Prompt run pack validation passed.");
}
