#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = fs.realpathSync(process.cwd());
const errors = [];

const fixturePath = repoPath("prompts/evaluations/engineering-business-basic-fixtures.json");
const scorecardPath = repoPath("prompts/evaluations/engineering-business-basic-scorecard.json");
const fixture = readJson(fixturePath);
const scorecard = readJson(scorecardPath);
const args = parseArgs(process.argv.slice(2));

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
    out: undefined
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
    } else if (arg === "--out") {
      const value = argv[index + 1];
      if (!value) {
        errors.push("--out requires a path");
      } else {
        parsed.out = repoPath(value);
        index += 1;
      }
    } else {
      errors.push(`Unknown argument: ${arg}`);
    }
  }

  if (!parsed.file) {
    errors.push("--file is required");
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

function outputText(value) {
  if (Array.isArray(value)) return value.join("\n");
  if (typeof value === "string") return value;
  return "";
}

function weightedScore(scores, criteria) {
  const totalWeight = criteria.reduce((sum, item) => sum + item.weight, 0);
  return (
    criteria.reduce((sum, item) => {
      return sum + scores[item.id] * item.weight;
    }, 0) / totalWeight
  );
}

function analyzeResults(results) {
  const outputsByRunId = new Map((results.outputs ?? []).map((item) => [item.runId, item]));
  const scorecardByCase = new Map((scorecard.cases ?? []).map((item) => [item.caseId, item]));
  const criteria = scorecard.criteria ?? [];

  const caseResults = (fixture.cases ?? []).map((item) => {
    const weak = outputsByRunId.get(`${item.id}::weak`);
    const basic = outputsByRunId.get(`${item.id}::basic`);
    const weakText = outputText(weak?.output);
    const basicText = outputText(basic?.output);
    const score = scorecardByCase.get(item.id);

    const weakMissingSections = item.expectedStrongSections.filter((section) => !weakText.includes(section));
    const basicMissingSections = item.expectedStrongSections.filter((section) => !basicText.includes(section));
    const weakProhibitedClaims = item.bannedClaims.filter((claim) => weakText.includes(claim));
    const basicProhibitedClaims = item.bannedClaims.filter((claim) => basicText.includes(claim));
    const basicPass = basicMissingSections.length === 0 && basicProhibitedClaims.length === 0;
    const weakDiagnostics = weakMissingSections.length + weakProhibitedClaims.length;

    const weakScore = score ? weightedScore(score.weakScores, criteria) : 0;
    const basicScore = score ? weightedScore(score.basicScores, criteria) : 0;

    return {
      caseId: item.id,
      scenario: item.scenario,
      basicPass,
      weakDiagnostics,
      weakMissingSections,
      basicMissingSections,
      weakProhibitedClaims,
      basicProhibitedClaims,
      scorecardWinner: score?.winner ?? "unknown",
      scoreDelta: Number((basicScore - weakScore).toFixed(2)),
      decisionBasis: score?.decisionBasis ?? ""
    };
  });

  return {
    schema: 1,
    name: "engineering-business-basic-run-results-analysis",
    version: fixture.version,
    sourceFile: path.relative(root, args.file),
    totalCases: caseResults.length,
    basicPassCount: caseResults.filter((item) => item.basicPass).length,
    weakDiagnosticCaseCount: caseResults.filter((item) => item.weakDiagnostics > 0).length,
    scorecardBasicWinnerCount: caseResults.filter((item) => item.scorecardWinner === "basic").length,
    caseResults
  };
}

function renderMarkdown(analysis) {
  const lines = [
    "# 工程业务基础提示词运行结果分析",
    "",
    `- 来源文件：\`${analysis.sourceFile}\``,
    `- 覆盖 case：${analysis.totalCases}`,
    `- 基础提示词通过门禁：${analysis.basicPassCount}/${analysis.totalCases}`,
    `- 普通提示词存在结构或边界诊断：${analysis.weakDiagnosticCaseCount}/${analysis.totalCases}`,
    `- scorecard 判定基础提示词更优：${analysis.scorecardBasicWinnerCount}/${analysis.totalCases}`,
    "",
    "> 本报告只分析已归档的脱敏 run results，不代表未运行模型时的真实效果。",
    "",
    "| Case | Basic Gate | Weak Diagnostics | Score Delta | Decision |",
    "|---|---:|---:|---:|---|"
  ];

  for (const item of analysis.caseResults) {
    lines.push(
      `| ${item.caseId} | ${item.basicPass ? "pass" : "fail"} | ${item.weakDiagnostics} | ${item.scoreDelta} | ${item.scorecardWinner} |`
    );
  }

  lines.push("", "## 分场景说明", "");
  for (const item of analysis.caseResults) {
    lines.push(`### ${item.caseId}`, "");
    lines.push(`- 场景：${item.scenario}`);
    lines.push(`- 评分卡依据：${item.decisionBasis}`);
    lines.push(`- Basic 缺失章节：${item.basicMissingSections.length === 0 ? "无" : item.basicMissingSections.join("；")}`);
    lines.push(`- Basic 禁止结论：${item.basicProhibitedClaims.length === 0 ? "无" : item.basicProhibitedClaims.join("；")}`);
    lines.push(`- Weak 缺失章节：${item.weakMissingSections.length === 0 ? "无" : item.weakMissingSections.join("；")}`);
    lines.push(`- Weak 禁止结论：${item.weakProhibitedClaims.length === 0 ? "无" : item.weakProhibitedClaims.join("；")}`);
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

const results = args.file ? readJson(args.file) : undefined;
const analysis = results && fixture && scorecard ? analyzeResults(results) : undefined;
const report = analysis ? renderMarkdown(analysis) : "";

if (errors.length > 0) {
  console.error(`Prompt run results analysis failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

if (args.out) {
  fs.mkdirSync(path.dirname(args.out), { recursive: true });
  fs.writeFileSync(args.out, report, "utf8");
  console.log(`Prompt run results analysis written: ${path.relative(root, args.out)}`);
} else {
  process.stdout.write(report);
}
