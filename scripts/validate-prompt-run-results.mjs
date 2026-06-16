#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = fs.realpathSync(process.cwd());
const errors = [];
const diagnostics = [];

const fixturePath = repoPath("prompts/evaluations/engineering-business-basic-fixtures.json");
const fixture = readJson(fixturePath);
const args = parseArgs(process.argv.slice(2));

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

function parseArgs(argv) {
  const parsed = {
    file: undefined,
    init: undefined,
    force: false,
    checkTemplate: argv.length === 0
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--file") {
      const value = argv[index + 1];
      if (!value) {
        errors.push("--file requires a path");
      } else {
        parsed.file = repoPath(value);
        index += 1;
      }
    } else if (arg === "--init") {
      const value = argv[index + 1];
      if (!value) {
        errors.push("--init requires a path");
      } else {
        parsed.init = repoPath(value);
        index += 1;
      }
    } else if (arg === "--force") {
      parsed.force = true;
    } else if (arg === "--check-template") {
      parsed.checkTemplate = true;
    } else {
      errors.push(`Unknown argument: ${arg}`);
    }
  }

  if ([parsed.file, parsed.init, parsed.checkTemplate].filter(Boolean).length > 1) {
    errors.push("Use only one mode: --file, --init, or --check-template");
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

function check(condition, message) {
  if (!condition) errors.push(message);
}

function includesSensitiveTerm(value) {
  const raw = typeof value === "string" ? value : JSON.stringify(value);
  return sensitiveTerms.filter((term) => raw.includes(term));
}

function outputText(value) {
  if (Array.isArray(value)) return value.join("\n");
  if (typeof value === "string") return value;
  return "";
}

function expectedRuns() {
  if (!fixture) return [];

  return (fixture.cases ?? []).flatMap((item) => [
    {
      runId: `${item.id}::weak`,
      caseId: item.id,
      variant: "weak",
      promptSource: "fixture.weakPrompt",
      promptVersion: fixture.version,
      expectedStrongSections: item.expectedStrongSections,
      bannedClaims: item.bannedClaims,
      weakFailureModes: item.weakFailureModes
    },
    {
      runId: `${item.id}::basic`,
      caseId: item.id,
      variant: "basic",
      promptSource: item.promptPath,
      promptVersion: fixture.version,
      expectedStrongSections: item.expectedStrongSections,
      bannedClaims: item.bannedClaims,
      weakFailureModes: item.weakFailureModes
    }
  ]);
}

function createTemplate() {
  return {
    schema: 1,
    name: "engineering-business-basic-run-results",
    version: fixture?.version ?? "0.1",
    fixture: "prompts/evaluations/engineering-business-basic-fixtures.json",
    runPack: "prompts/evaluations/engineering-business-basic-run-pack.generated.json",
    isExample: false,
    dataBoundary:
      "Fill this file with de-identified weak/basic model outputs only. Do not include customer names, contacts, project names, exact amounts, or raw source documents.",
    outputs: expectedRuns().map((item) => ({
      runId: item.runId,
      caseId: item.caseId,
      variant: item.variant,
      promptVersion: item.promptVersion,
      model: "",
      ranAt: "",
      notes: "",
      promptSource: item.promptSource,
      expectedStrongSections: item.expectedStrongSections,
      bannedClaims: item.bannedClaims,
      weakFailureModes: item.weakFailureModes,
      output: []
    }))
  };
}

function validateTemplateShape(template) {
  check(template.schema === 1, "run results: schema must be 1");
  check(template.version === fixture?.version, `run results: version must match fixture version ${fixture?.version}`);
  check(template.fixture === "prompts/evaluations/engineering-business-basic-fixtures.json", "run results: fixture path mismatch");
  check(Array.isArray(template.outputs), "run results: outputs must be an array");
  check(template.outputs?.length === expectedRuns().length, "run results: output count must match weak/basic run count");

  const sensitiveHits = includesSensitiveTerm(template);
  check(sensitiveHits.length === 0, `run results: sensitive terms leaked (${sensitiveHits.join(", ")})`);

  const expectedByRunId = new Map(expectedRuns().map((item) => [item.runId, item]));
  const actualRunIds = (template.outputs ?? []).map((item) => item.runId).sort();
  const expectedRunIds = [...expectedByRunId.keys()].sort();
  check(JSON.stringify(actualRunIds) === JSON.stringify(expectedRunIds), "run results: runId coverage mismatch");

  const seen = new Set();
  for (const item of template.outputs ?? []) {
    const expected = expectedByRunId.get(item.runId);
    check(!seen.has(item.runId), `${item.runId}: duplicate output`);
    seen.add(item.runId);
    check(Boolean(expected), `${item.runId}: runId not found in expected run pack`);
    check(item.caseId === expected?.caseId, `${item.runId}: caseId mismatch`);
    check(item.variant === expected?.variant, `${item.runId}: variant mismatch`);
    check(item.promptVersion === expected?.promptVersion, `${item.runId}: promptVersion mismatch`);
    check(item.promptSource === expected?.promptSource, `${item.runId}: promptSource mismatch`);
    check(Array.isArray(item.expectedStrongSections), `${item.runId}: expectedStrongSections must be an array`);
    check(Array.isArray(item.bannedClaims), `${item.runId}: bannedClaims must be an array`);
    check(Array.isArray(item.weakFailureModes), `${item.runId}: weakFailureModes must be an array`);
  }
}

function validateRunResults(results) {
  validateTemplateShape(results);

  for (const item of results.outputs ?? []) {
    check(typeof item.model === "string" && item.model.length > 0, `${item.runId}: missing model`);
    check(item.model !== "example-skeleton", `${item.runId}: model must be a real model identifier`);
    check(typeof item.ranAt === "string" && item.ranAt.length > 0, `${item.runId}: missing ranAt`);
    check(!Number.isNaN(Date.parse(item.ranAt)), `${item.runId}: ranAt must be a parseable timestamp`);
    check(typeof item.notes === "string", `${item.runId}: notes must be a string`);

    const text = outputText(item.output);
    check(text.length > 0, `${item.runId}: output must be a non-empty string or string array`);

    const sensitiveHits = includesSensitiveTerm(item);
    check(sensitiveHits.length === 0, `${item.runId}: sensitive terms leaked (${sensitiveHits.join(", ")})`);

    const missingSections = (item.expectedStrongSections ?? []).filter((section) => !text.includes(section));
    const prohibitedClaims = (item.bannedClaims ?? []).filter((claim) => text.includes(claim));

    if (item.variant === "basic") {
      for (const section of missingSections) {
        errors.push(`${item.runId}: basic output missing expected section "${section}"`);
      }
      for (const claim of prohibitedClaims) {
        errors.push(`${item.runId}: basic output contains prohibited claim "${claim}"`);
      }
    } else if (missingSections.length > 0 || prohibitedClaims.length > 0) {
      diagnostics.push({
        runId: item.runId,
        missingSections,
        prohibitedClaims
      });
    }
  }
}

if (args.init) {
  const template = createTemplate();
  validateTemplateShape(template);
  if (fs.existsSync(args.init) && !args.force) {
    errors.push(`${path.relative(root, args.init)} already exists; pass --force to overwrite`);
  }
  if (errors.length === 0) {
    fs.mkdirSync(path.dirname(args.init), { recursive: true });
    fs.writeFileSync(args.init, `${JSON.stringify(template, null, 2)}\n`, "utf8");
    console.log(`Prompt run results template written: ${path.relative(root, args.init)}`);
    process.exit(0);
  }
} else if (args.file) {
  const results = readJson(args.file);
  if (results) validateRunResults(results);
} else {
  validateTemplateShape(createTemplate());
  if (errors.length === 0) {
    console.log("Prompt run results template validation passed.");
    process.exit(0);
  }
}

if (errors.length > 0) {
  console.error(`Prompt run results validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Prompt run results validation passed.");
if (diagnostics.length > 0) {
  console.log(`Weak output diagnostics: ${diagnostics.length} run(s) need comparison review.`);
}
