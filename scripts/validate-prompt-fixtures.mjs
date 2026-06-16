#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = fs.realpathSync(process.cwd());
const errors = [];

const fixturePaths = [
  "prompts/evaluations/engineering-business-basic-fixtures.json",
  "prompts/evaluations/engineering-business-public-advisory-fixtures.json"
];
const fixtures = fixturePaths.map((fixturePath) => ({
  path: fixturePath,
  data: readJson(repoPath(fixturePath))
}));

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

const requiredCaseFields = [
  "id",
  "skillId",
  "promptPath",
  "scenario",
  "sourceSignals",
  "advisoryComparison",
  "weakPrompt",
  "inputSummary",
  "sampleInput",
  "requiredPromptTerms",
  "expectedOutputShape",
  "expectedStrongSections",
  "weakFailureModes",
  "bannedClaims"
];

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

function validateMarkdownFixture(fixturePath, item) {
  const markdownPath = item.markdownFixturePath;
  check(typeof markdownPath === "string" && markdownPath.endsWith(".md"), `${fixturePath}/${item.id}: markdownFixturePath must point to a markdown file`);
  if (typeof markdownPath !== "string") {
    return;
  }

  const markdown = readText(markdownPath);
  check(markdown.length > 0, `${fixturePath}/${item.id}: markdown fixture is empty or missing`);
  check(markdown.includes(`caseId: ${item.id}`), `${fixturePath}/${item.id}: markdown fixture must include matching caseId`);
  check(markdown.includes(`skillId: ${item.skillId}`), `${fixturePath}/${item.id}: markdown fixture must include matching skillId`);
  check(markdown.includes("> 数据说明：以下客户、项目、人员、地点、日期、金额、编号均为虚构。"), `${fixturePath}/${item.id}: markdown fixture must state synthetic boundary`);

  const sensitiveHits = includesSensitiveTerm(markdown);
  check(sensitiveHits.length === 0, `${fixturePath}/${item.id}: markdown fixture leaked sensitive terms (${sensitiveHits.join(", ")})`);
}

function validateSyntheticFields(fixturePath, fixture, item) {
  if (!fixture.name?.includes("public-advisory")) {
    return;
  }

  check(fixture.syntheticDataPolicy?.entitiesAreFictional === true, `${fixturePath}: syntheticDataPolicy must mark entities as fictional`);
  check(item.syntheticFields && typeof item.syntheticFields === "object", `${item.id}: missing syntheticFields`);

  const requiredSyntheticFields = [
    "customer",
    "project",
    "location",
    "dates",
    "people",
    "numbers",
    "documentRefs"
  ];

  for (const field of requiredSyntheticFields) {
    check(Array.isArray(item.syntheticFields?.[field]) && item.syntheticFields[field].length > 0, `${item.id}: syntheticFields.${field} must be a non-empty array`);
  }

  const raw = JSON.stringify(item.syntheticFields ?? {});
  check(raw.includes("虚构") || raw.includes("示例"), `${item.id}: syntheticFields must clearly mark fictional data`);
  validateMarkdownFixture(fixturePath, item);
}

function validateFixture(fixturePath, fixture) {
  if (!fixture) {
    return;
  }

  check(fixture.schema === 1, `${fixturePath}: schema must be 1`);
  check(Array.isArray(fixture.cases), `${fixturePath}: cases must be an array`);
  check(fixture.cases?.length === 6, `${fixturePath}: must cover 6 engineering-business cases`);

  const seenIds = new Set();
  const seenSkills = new Set();

  for (const item of fixture.cases ?? []) {
    for (const field of requiredCaseFields) {
      check(Object.prototype.hasOwnProperty.call(item, field), `${fixturePath}/${item.id ?? "unknown"}: missing ${field}`);
    }

    check(!seenIds.has(item.id), `${fixturePath}/${item.id}: duplicate case id`);
    seenIds.add(item.id);
    check(!seenSkills.has(item.skillId), `${fixturePath}/${item.skillId}: duplicate skill fixture`);
    seenSkills.add(item.skillId);

    check(/^aios-[a-z0-9-]+$/.test(item.skillId), `${fixturePath}/${item.id}: invalid skillId`);
    check(item.promptPath === `skills/${item.skillId}/prompts/basic-prompt.md`, `${fixturePath}/${item.id}: promptPath must match skillId`);

    for (const field of [
      "inputSummary",
      "sourceSignals",
      "advisoryComparison",
      "sampleInput",
      "requiredPromptTerms",
      "expectedOutputShape",
      "expectedStrongSections",
      "weakFailureModes",
      "bannedClaims"
    ]) {
      check(Array.isArray(item[field]) && item[field].length > 0, `${fixturePath}/${item.id}: ${field} must be a non-empty array`);
    }

    for (const signal of item.sourceSignals ?? []) {
      check(
        /^(advisory|source-shape|boundary-shape):/.test(signal),
        `${fixturePath}/${item.id}: source signal must use an abstract prefix (${signal})`
      );
    }

    const sensitiveHits = includesSensitiveTerm(item);
    check(sensitiveHits.length === 0, `${fixturePath}/${item.id}: sensitive terms leaked (${sensitiveHits.join(", ")})`);
    validateSyntheticFields(fixturePath, fixture, item);

    const prompt = readText(item.promptPath);
    check(prompt.length > 0, `${fixturePath}/${item.id}: prompt file is empty or missing`);
    for (const term of item.requiredPromptTerms ?? []) {
      check(prompt.includes(term), `${fixturePath}/${item.id}: prompt missing required term "${term}"`);
    }
    for (const section of item.expectedStrongSections ?? []) {
      check(prompt.includes(section), `${fixturePath}/${item.id}: prompt missing expected strong section "${section}"`);
    }
    for (const bannedClaim of item.bannedClaims ?? []) {
      check(prompt.includes(bannedClaim), `${fixturePath}/${item.id}: prompt should explicitly list prohibited claim "${bannedClaim}"`);
    }
  }

  const expectedSkills = [
    "aios-commercial-tender",
    "aios-commercial-contract",
    "aios-construction-daily",
    "aios-construction-meeting",
    "aios-commercial-variation",
    "aios-construction-scheme"
  ].sort();
  check(JSON.stringify([...seenSkills].sort()) === JSON.stringify(expectedSkills), `${fixturePath}: skill coverage mismatch`);
}

for (const fixture of fixtures) {
  validateFixture(fixture.path, fixture.data);
}

if (errors.length > 0) {
  console.error(`Prompt fixture validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Prompt fixture validation passed.");
