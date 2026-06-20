#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = fs.realpathSync(process.cwd());
const errors = [];

const defaultOutputPath = "prompts/evaluations/engineering-business-basic-model-output.example.json";
const args = parseArgs(process.argv.slice(2));
const outputPath = args.file ?? repoPath(defaultOutputPath);
const fixturePath = repoPath("prompts/evaluations/engineering-business-basic-fixtures.json");
const fixture = readJson(fixturePath);
const outputFile = args.init ? undefined : readJson(outputPath);

const sensitiveTerms = [
  "立信",
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
    force: false
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

function createOutputTemplate() {
  if (!fixture) return;

  if (fs.existsSync(args.init) && !args.force) {
    errors.push(`${path.relative(root, args.init)} already exists; pass --force to overwrite`);
    return;
  }

  const template = {
    schema: 1,
    name: "engineering-business-basic-model-output-run",
    version: fixture.version ?? "0.1",
    fixture: "prompts/evaluations/engineering-business-basic-fixtures.json",
    isExample: false,
    dataBoundary:
      "Fill this file with de-identified model outputs only. Do not include customer names, contacts, project names, exact amounts, or raw source documents.",
    outputs: (fixture.cases ?? []).map((item) => ({
      caseId: item.id,
      promptVersion: fixture.version ?? "0.1",
      model: "",
      ranAt: "",
      notes: "",
      promptPath: item.promptPath,
      scenario: item.scenario,
      expectedSections: item.expectedStrongSections,
      bannedClaims: item.bannedClaims,
      output: []
    }))
  };

  fs.mkdirSync(path.dirname(args.init), { recursive: true });
  fs.writeFileSync(args.init, `${JSON.stringify(template, null, 2)}\n`, "utf8");
  console.log(`Prompt model output template written: ${path.relative(root, args.init)}`);
}

if (args.init) {
  if (errors.length === 0) createOutputTemplate();
  if (errors.length > 0) {
    console.error(`Prompt model output validation failed with ${errors.length} error(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  process.exit(0);
}

if (fixture && outputFile) {
  check(outputFile.schema === 1, "model output file: schema must be 1");
  check(typeof outputFile.version === "string" && outputFile.version.length > 0, "model output file: version must be a string");
  check(Array.isArray(outputFile.outputs), "model output file: outputs must be an array");
  check(
    outputFile.fixture === "prompts/evaluations/engineering-business-basic-fixtures.json",
    "model output file: fixture path mismatch"
  );

  const casesById = new Map((fixture.cases ?? []).map((item) => [item.id, item]));
  const expectedIds = [...casesById.keys()].sort();
  const actualIds = (outputFile.outputs ?? []).map((item) => item.caseId).sort();

  check(JSON.stringify(actualIds) === JSON.stringify(expectedIds), "model output file: case coverage mismatch");

  const seenIds = new Set();
  for (const item of outputFile.outputs ?? []) {
    check(typeof item.caseId === "string" && item.caseId.length > 0, "model output item: missing caseId");
    check(!seenIds.has(item.caseId), `${item.caseId}: duplicate model output`);
    seenIds.add(item.caseId);

    const sourceCase = casesById.get(item.caseId);
    check(Boolean(sourceCase), `${item.caseId}: caseId not found in fixtures`);

    check(typeof item.promptVersion === "string" && item.promptVersion.length > 0, `${item.caseId}: missing promptVersion`);
    check(item.promptVersion === fixture.version, `${item.caseId}: promptVersion must match fixture version ${fixture.version}`);
    check(typeof item.model === "string" && item.model.length > 0, `${item.caseId}: missing model`);
    check(typeof item.ranAt === "string" && item.ranAt.length > 0, `${item.caseId}: missing ranAt`);
    check(!Number.isNaN(Date.parse(item.ranAt)), `${item.caseId}: ranAt must be a parseable timestamp`);
    check(typeof item.notes === "string", `${item.caseId}: notes must be a string`);
    if (outputFile.isExample !== true) {
      check(item.model !== "example-skeleton", `${item.caseId}: non-example output must use a real model identifier`);
    }

    const text = outputText(item.output);
    check(text.length > 0, `${item.caseId}: output must be a non-empty string or string array`);

    const sensitiveHits = includesSensitiveTerm(item);
    check(sensitiveHits.length === 0, `${item.caseId}: sensitive terms leaked (${sensitiveHits.join(", ")})`);

    for (const section of sourceCase?.expectedStrongSections ?? []) {
      check(text.includes(section), `${item.caseId}: output missing expected section "${section}"`);
    }
    for (const bannedClaim of sourceCase?.bannedClaims ?? []) {
      check(!text.includes(bannedClaim), `${item.caseId}: output contains prohibited claim "${bannedClaim}"`);
    }
  }
}

if (errors.length > 0) {
  console.error(`Prompt model output validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Prompt model output validation passed.");
