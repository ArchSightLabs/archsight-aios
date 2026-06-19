import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "..");
const cli = path.join(repoRoot, "bin", "archsight-aios.mjs");

function run(args, options = {}) {
  return spawnSync(process.execPath, [cli, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
    ...options
  });
}

function runNodeScript(scriptPath, options = {}) {
  return spawnSync(process.execPath, [scriptPath], {
    cwd: repoRoot,
    encoding: "utf8",
    ...options
  });
}

function runNodeScriptWithArgs(scriptPath, args, options = {}) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
    ...options
  });
}

function runWithHome(args, homeDir) {
  return run(args, {
    env: {
      ...process.env,
      HOME: homeDir,
      USERPROFILE: homeDir
    }
  });
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function testHelp() {
  const result = run(["--help"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /ArchSight AIOS/);
  assert.match(result.stdout, /archsight-aios help/);
  assert.match(result.stdout, /codex\|agents\|gemini\|antigravity\|workbuddy\|opencode\|claude-code\|all/);
  assert.match(result.stdout, /archsight-aios doctor/);
  assert.match(result.stdout, /archsight-aios init /);
  assert.match(result.stdout, /archsight-aios writing:init/);
  assert.doesNotMatch(result.stdout, /init-project/);
  assert.doesNotMatch(result.stdout, /validate-project-template/);
  assert.doesNotMatch(result.stdout, new RegExp(["ai", "os"].join("-")));
}

async function testHelpCommand() {
  const result = run(["help"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Commands:/);
  assert.match(result.stdout, /archsight-aios validate/);
}

async function testUnknownCommand() {
  const result = run(["unknown-command"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Unknown command/);
}

async function testProductIdentity() {
  const manifest = await readJson(path.join(repoRoot, "runtime", "archsight-aios.manifest.json"));
  const pkg = await readJson(path.join(repoRoot, "package.json"));
  const legacyManifest = path.join(repoRoot, "runtime", ["archsight", "ai", "os.manifest.json"].join("-"));
  const topLevelSkillIds = new Set(["aios", "archsight-aios"]);

  assert.equal(manifest.name, "archsight-aios");
  assert.equal(pkg.name, "@archsight/aios");
  assert.equal(pkg.bin["archsight-aios"], "./bin/archsight-aios.mjs");
  assert.ok(manifest.skills.every((skill) => skill.id.startsWith("aios-") || topLevelSkillIds.has(skill.id)));
  assert.ok(manifest.skills.every((skill) => skill.path.startsWith("skills/aios-") || topLevelSkillIds.has(skill.id)));
  assert.ok(manifest.skills.every((skill) => skill.id.split("-").length <= 3));
  assert.ok(manifest.workflows.every((workflow) => workflow.id.split("-").length <= 3));
  assert.equal(manifest.installTargets.codexSkills, "~/.codex/skills");
  assert.equal(manifest.installTargets.codexWorkflows, "~/.codex/workflows/aios");
  assert.equal(manifest.installTargets.sharedAgentSkills, "~/.agents/skills");
  assert.equal(manifest.installTargets.sharedAgentWorkflows, "~/.agents/workflows/aios");
  assert.equal(manifest.installTargets.antigravityPlugin, "~/.gemini/config/plugins/archsight-aios");
  assert.equal(manifest.installTargets.antigravityLegacySkills, "~/.gemini/antigravity/skills");
  assert.equal(manifest.installTargets.geminiSupportAssets, "~/.gemini/archsight-aios");
  assert.equal(manifest.installTargets.workBuddySkills, "~/.workbuddy/skills");
  assert.equal(manifest.installTargets.openCodeSkills, "~/.opencode/skills");
  assert.equal(manifest.installTargets.claudeCodeSkills, "~/.claude/skills");

  await assert.rejects(fs.access(legacyManifest));
}

async function testManifestCoversRepositoryAssets() {
  const manifest = await readJson(path.join(repoRoot, "runtime", "archsight-aios.manifest.json"));
  const skillEntries = await fs.readdir(path.join(repoRoot, "skills"), { withFileTypes: true });
  const workflowEntries = await fs.readdir(path.join(repoRoot, "workflows"), { withFileTypes: true });
  const topLevelSkillIds = new Set(["aios", "archsight-aios"]);

  const skillDirs = skillEntries
    .filter((entry) => entry.isDirectory() && (entry.name.startsWith("aios-") || topLevelSkillIds.has(entry.name)))
    .map((entry) => entry.name)
    .sort();
  const workflowIds = workflowEntries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && entry.name !== "README.md")
    .map((entry) => entry.name.replace(/\.md$/, ""))
    .sort();
  const manifestSkillIds = manifest.skills.map((skill) => skill.id).sort();
  const manifestWorkflowIds = manifest.workflows.map((workflow) => workflow.id).sort();

  assert.deepEqual(manifestSkillIds, skillDirs);
  assert.deepEqual(manifestWorkflowIds, workflowIds);

  for (const requiredAsset of manifest.requiredAssets ?? []) {
    await fs.access(path.join(repoRoot, requiredAsset));
  }
}

async function testPublicDiscoveryMetadata() {
  const pkg = await readJson(path.join(repoRoot, "package.json"));
  const geminiExtension = await readJson(path.join(repoRoot, "gemini-extension.json"));
  const claudePlugin = await readJson(path.join(repoRoot, ".claude-plugin", "plugin.json"));
  const claudeMarketplace = await readJson(path.join(repoRoot, ".claude-plugin", "marketplace.json"));

  assert.equal(pkg.scripts["validate:skills"], "node ./scripts/validate-skills.mjs");
  assert.ok(pkg.files.includes("skills/"));
  assert.ok(pkg.files.includes("scripts/"));
  assert.ok(pkg.files.includes(".claude-plugin/"));
  assert.ok(pkg.files.includes("gemini-extension.json"));
  assert.ok(pkg.files.includes("adapters/"));
  assert.ok(pkg.files.includes("OPENCODE.md"));
  for (const keyword of ["agent-skills", "skills-sh", "gemini-cli", "claude-code", "workbuddy", "opencode", "construction-ai"]) {
    assert.ok(pkg.keywords.includes(keyword), keyword);
  }

  assert.equal(geminiExtension.name, "archsight-aios");
  assert.equal(geminiExtension.version, pkg.version);
  assert.equal(geminiExtension.contextFileName, "GEMINI.md");
  assert.equal(claudePlugin.name, "archsight-aios");
  assert.equal(claudePlugin.version, pkg.version);
  assert.equal(claudePlugin.skills, "./skills/");
  assert.equal(claudeMarketplace.plugins[0].name, "archsight-aios");
  assert.equal(claudeMarketplace.plugins[0].skills, "./skills/");
}

async function testValidateSkillsCommand() {
  const result = runNodeScript(path.join(repoRoot, "scripts", "validate-skills.mjs"));
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /Skill validation passed/);
}

async function testValidatePromptFixturesCommand() {
  const result = runNodeScript(path.join(repoRoot, "scripts", "validate-prompt-fixtures.mjs"));
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /Prompt fixture validation passed/);
}

async function testValidatePromptModelOutputsCommand() {
  const result = runNodeScript(path.join(repoRoot, "scripts", "validate-prompt-model-outputs.mjs"));
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /Prompt model output validation passed/);
}

async function testValidatePromptScorecardCommand() {
  const result = runNodeScript(path.join(repoRoot, "scripts", "validate-prompt-scorecard.mjs"));
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /Prompt scorecard validation passed/);
}

async function testBuildPromptRunPackCommand() {
  const scriptPath = path.join(repoRoot, "scripts", "build-prompt-run-pack.mjs");
  const runPackPath = path.join(repoRoot, "prompts", "evaluations", ".tmp-run-pack.json");
  const publicRunPackPath = path.join(repoRoot, "prompts", "evaluations", ".tmp-public-run-pack.json");
  const writingRunPackPath = path.join(repoRoot, "prompts", "evaluations", ".tmp-document-writing-run-pack.json");
  const relativeRunPackPath = path.relative(repoRoot, runPackPath);
  const relativePublicRunPackPath = path.relative(repoRoot, publicRunPackPath);
  const relativeWritingRunPackPath = path.relative(repoRoot, writingRunPackPath);
  const publicFixturePath = "prompts/evaluations/engineering-business-public-advisory-fixtures.json";
  const writingFixturePath = "prompts/evaluations/engineering-document-writing-fixtures.json";

  await fs.rm(runPackPath, { force: true });
  await fs.rm(publicRunPackPath, { force: true });
  await fs.rm(writingRunPackPath, { force: true });

  try {
    const validate = runNodeScriptWithArgs(scriptPath, ["--check"]);
    assert.equal(validate.status, 0, `${validate.stdout}\n${validate.stderr}`);
    assert.match(validate.stdout, /Prompt run pack validation passed/);

    const build = runNodeScriptWithArgs(scriptPath, ["--out", relativeRunPackPath]);
    assert.equal(build.status, 0, `${build.stdout}\n${build.stderr}`);
    assert.match(build.stdout, /Prompt run pack written/);

    const runPack = await readJson(runPackPath);
    assert.equal(runPack.schema, 1);
    assert.equal(runPack.runs.length, 12);

    const variantsByCase = new Map();
    for (const item of runPack.runs) {
      const variants = variantsByCase.get(item.caseId) ?? new Set();
      variants.add(item.variant);
      variantsByCase.set(item.caseId, variants);
      assert.ok(Array.isArray(item.sampleInput) && item.sampleInput.length > 0);
      assert.ok(typeof item.prompt === "string" && item.prompt.length > 0);
    }

    assert.equal(variantsByCase.size, 6);
    for (const variants of variantsByCase.values()) {
      assert.deepEqual([...variants].sort(), ["basic", "weak"]);
    }

    const validatePublic = runNodeScriptWithArgs(scriptPath, ["--fixture", publicFixturePath, "--check"]);
    assert.equal(validatePublic.status, 0, `${validatePublic.stdout}\n${validatePublic.stderr}`);
    assert.match(validatePublic.stdout, /Prompt run pack validation passed/);

    const buildPublic = runNodeScriptWithArgs(scriptPath, ["--fixture", publicFixturePath, "--out", relativePublicRunPackPath]);
    assert.equal(buildPublic.status, 0, `${buildPublic.stdout}\n${buildPublic.stderr}`);
    assert.match(buildPublic.stdout, /Prompt run pack written/);

    const publicRunPack = await readJson(publicRunPackPath);
    assert.equal(publicRunPack.fixture, publicFixturePath);
    assert.equal(publicRunPack.runs.length, 12);
    assert.ok(publicRunPack.runs.every((item) => item.inputFormat === "markdown"));
    assert.ok(publicRunPack.runs.every((item) => item.sampleInput[0].includes("数据说明：以下客户、项目、人员、地点、日期、金额、编号均为虚构。")));

    const validateWriting = runNodeScriptWithArgs(scriptPath, ["--fixture", writingFixturePath, "--check"]);
    assert.equal(validateWriting.status, 0, `${validateWriting.stdout}\n${validateWriting.stderr}`);
    assert.match(validateWriting.stdout, /Prompt run pack validation passed/);

    const buildWriting = runNodeScriptWithArgs(scriptPath, ["--fixture", writingFixturePath, "--out", relativeWritingRunPackPath]);
    assert.equal(buildWriting.status, 0, `${buildWriting.stdout}\n${buildWriting.stderr}`);
    assert.match(buildWriting.stdout, /Prompt run pack written/);

    const writingRunPack = await readJson(writingRunPackPath);
    assert.equal(writingRunPack.fixture, writingFixturePath);
    assert.equal(writingRunPack.runs.length, 4);
    assert.ok(writingRunPack.runs.some((item) => item.skillId === "aios-tender-write"));
    assert.ok(writingRunPack.runs.some((item) => item.skillId === "aios-scheme-write"));
    assert.ok(writingRunPack.runInstructions.some((item) => item.includes("material reuse judgment")));
  } finally {
    await fs.rm(runPackPath, { force: true });
    await fs.rm(publicRunPackPath, { force: true });
    await fs.rm(writingRunPackPath, { force: true });
  }
}

async function testValidatePromptRunResultsCommand() {
  const scriptPath = path.join(repoRoot, "scripts", "validate-prompt-run-results.mjs");
  const resultsPath = path.join(repoRoot, "prompts", "evaluations", ".tmp-run-results.json");
  const relativeResultsPath = path.relative(repoRoot, resultsPath);

  await fs.rm(resultsPath, { force: true });

  try {
    const templateCheck = runNodeScriptWithArgs(scriptPath, ["--check-template"]);
    assert.equal(templateCheck.status, 0, `${templateCheck.stdout}\n${templateCheck.stderr}`);
    assert.match(templateCheck.stdout, /Prompt run results template validation passed/);

    const init = runNodeScriptWithArgs(scriptPath, ["--init", relativeResultsPath]);
    assert.equal(init.status, 0, `${init.stdout}\n${init.stderr}`);
    assert.match(init.stdout, /Prompt run results template written/);

    const emptyTemplate = runNodeScriptWithArgs(scriptPath, ["--file", relativeResultsPath]);
    assert.notEqual(emptyTemplate.status, 0);
    assert.match(emptyTemplate.stderr, /output must be a non-empty string or string array/);

    const results = await readJson(resultsPath);
    for (const item of results.outputs) {
      item.model = "test-model";
      item.ranAt = "2026-06-16T00:00:00+08:00";
      item.notes = "Test fixture output.";
      if (item.variant === "basic") {
        item.output = item.expectedStrongSections.map((section) => `## ${section}\n- checked`);
      } else {
        item.output = ["普通回答摘要。", "仍需人工复核。"];
      }
    }
    await fs.writeFile(resultsPath, `${JSON.stringify(results, null, 2)}\n`, "utf8");

    const validResults = runNodeScriptWithArgs(scriptPath, ["--file", relativeResultsPath]);
    assert.equal(validResults.status, 0, `${validResults.stdout}\n${validResults.stderr}`);
    assert.match(validResults.stdout, /Prompt run results validation passed/);
    assert.match(validResults.stdout, /Weak output diagnostics/);
  } finally {
    await fs.rm(resultsPath, { force: true });
  }
}

async function testAnalyzePromptRunResultsCommand() {
  const validatorPath = path.join(repoRoot, "scripts", "validate-prompt-run-results.mjs");
  const analyzerPath = path.join(repoRoot, "scripts", "analyze-prompt-run-results.mjs");
  const resultsPath = path.join(repoRoot, "prompts", "evaluations", ".tmp-run-results-analysis.json");
  const reportPath = path.join(repoRoot, "prompts", "evaluations", ".tmp-run-results-analysis.md");
  const relativeResultsPath = path.relative(repoRoot, resultsPath);
  const relativeReportPath = path.relative(repoRoot, reportPath);

  await fs.rm(resultsPath, { force: true });
  await fs.rm(reportPath, { force: true });

  try {
    const init = runNodeScriptWithArgs(validatorPath, ["--init", relativeResultsPath]);
    assert.equal(init.status, 0, `${init.stdout}\n${init.stderr}`);

    const results = await readJson(resultsPath);
    for (const item of results.outputs) {
      item.model = "test-model";
      item.ranAt = "2026-06-16T00:00:00+08:00";
      item.notes = "Test fixture output.";
      if (item.variant === "basic") {
        item.output = item.expectedStrongSections.map((section) => `## ${section}\n- checked`);
      } else {
        item.output = ["普通回答摘要。", "仍需人工复核。"];
      }
    }
    await fs.writeFile(resultsPath, `${JSON.stringify(results, null, 2)}\n`, "utf8");

    const analyze = runNodeScriptWithArgs(analyzerPath, ["--file", relativeResultsPath, "--out", relativeReportPath]);
    assert.equal(analyze.status, 0, `${analyze.stdout}\n${analyze.stderr}`);
    assert.match(analyze.stdout, /Prompt run results analysis written/);

    const report = await fs.readFile(reportPath, "utf8");
    assert.match(report, /工程业务基础提示词运行结果分析/);
    assert.match(report, /覆盖 case：6/);
    assert.match(report, /基础提示词通过门禁：6\/6/);
    assert.match(report, /scorecard 判定基础提示词更优：6\/6/);
  } finally {
    await fs.rm(resultsPath, { force: true });
    await fs.rm(reportPath, { force: true });
  }
}

async function testInitPromptModelOutputTemplateCommand() {
  const scriptPath = path.join(repoRoot, "scripts", "validate-prompt-model-outputs.mjs");
  const templatePath = path.join(repoRoot, "prompts", "evaluations", ".tmp-model-output-run.json");
  const relativeTemplatePath = path.relative(repoRoot, templatePath);

  await fs.rm(templatePath, { force: true });

  try {
    const init = runNodeScriptWithArgs(scriptPath, ["--init", relativeTemplatePath]);
    assert.equal(init.status, 0, `${init.stdout}\n${init.stderr}`);
    assert.match(init.stdout, /Prompt model output template written/);

    const template = await readJson(templatePath);
    assert.equal(template.isExample, false);
    assert.equal(template.outputs.length, 6);
    assert.ok(template.outputs.every((item) => Array.isArray(item.output) && item.output.length === 0));
    assert.ok(template.outputs.every((item) => Array.isArray(item.expectedSections) && item.expectedSections.length > 0));

    const validateEmptyTemplate = runNodeScriptWithArgs(scriptPath, ["--file", relativeTemplatePath]);
    assert.notEqual(validateEmptyTemplate.status, 0);
    assert.match(validateEmptyTemplate.stderr, /output must be a non-empty string or string array/);
  } finally {
    await fs.rm(templatePath, { force: true });
  }
}

async function testSkillsAvoidPromptTemplateShape() {
  const manifest = await readJson(path.join(repoRoot, "runtime", "archsight-aios.manifest.json"));
  for (const skill of manifest.skills) {
    const content = await fs.readFile(path.join(repoRoot, skill.path), "utf8");
    assert.doesNotMatch(content, /## 提示词与执行逻辑/);
    assert.doesNotMatch(content, /## 执行指令/);
    assert.doesNotMatch(content, /当你被调用来执行/);
  }
}

async function testEngineeringBusinessSkillsRequireDetailedOutput() {
  const routerSkills = ["aios", "archsight-aios"];
  const businessSkills = [
    "aios-commercial-tender",
    "aios-commercial-contract",
    "aios-construction-daily",
    "aios-construction-meeting",
    "aios-commercial-variation",
    "aios-construction-scheme"
  ];
  const requiredSkillTerms = [
    "标准详版报告",
    "资料来源清单",
    "主分析表 / 清单 / 台账",
    "资料缺口",
    "人工复核岗位",
    "AI 不应下结论事项",
    "输出自检",
    "缺一项时先补齐"
  ];
  const requiredConfigTerms = ["默认输出标准详版报告", "不要压缩成摘要", "输出自检"];

  for (const skillName of routerSkills) {
    const skillContent = await fs.readFile(path.join(repoRoot, "skills", skillName, "SKILL.md"), "utf8");
    assert.match(skillContent, /不是短摘要/);
    for (const term of requiredSkillTerms) assert.ok(skillContent.includes(term), `${skillName}: missing ${term}`);

    const configContent = await fs.readFile(path.join(repoRoot, "skills", skillName, "agents", "openai.yaml"), "utf8");
    for (const term of requiredConfigTerms) assert.ok(configContent.includes(term), `${skillName} config: missing ${term}`);
  }

  for (const skillName of businessSkills) {
    const skillContent = await fs.readFile(path.join(repoRoot, "skills", skillName, "SKILL.md"), "utf8");
    assert.ok(skillContent.includes("## 标准详版报告与输出自检"), `${skillName}: missing detail contract section`);
    for (const term of requiredSkillTerms) assert.ok(skillContent.includes(term), `${skillName}: missing ${term}`);

    const configContent = await fs.readFile(path.join(repoRoot, "skills", skillName, "agents", "openai.yaml"), "utf8");
    for (const term of requiredConfigTerms) assert.ok(configContent.includes(term), `${skillName} config: missing ${term}`);
  }
}

async function testEngineeringWritingSkillsAreRoutedAndGuarded() {
  const writingSkills = [
    ["aios-tender-write", "aios-commercial-tender"],
    ["aios-scheme-write", "aios-construction-scheme"]
  ];
  const requiredTerms = [
    "Markdown 工作母版",
    "source-normalized.md",
    "material-index.md",
    "writing-brief.md",
    "draft.md",
    "review-notes.md",
    "final.md",
    "素材复用判断",
    "审核门禁",
    "不编造"
  ];

  for (const [skillName, gateSkill] of writingSkills) {
    const skillContent = await fs.readFile(path.join(repoRoot, "skills", skillName, "SKILL.md"), "utf8");
    const configContent = await fs.readFile(path.join(repoRoot, "skills", skillName, "agents", "openai.yaml"), "utf8");
    const promptContent = await fs.readFile(path.join(repoRoot, "skills", skillName, "prompts", "basic-prompt.md"), "utf8");

    for (const term of requiredTerms) assert.ok(skillContent.includes(term), `${skillName}: missing ${term}`);
    assert.ok(skillContent.includes(gateSkill), `${skillName}: missing gate ${gateSkill}`);
    assert.ok(configContent.includes("Markdown"), `${skillName} config: missing Markdown`);
    assert.ok(configContent.includes(gateSkill), `${skillName} config: missing gate ${gateSkill}`);
    assert.ok(promptContent.includes("复用级别"), `${skillName} prompt: missing reuse levels`);
    assert.ok(promptContent.includes(gateSkill), `${skillName} prompt: missing gate ${gateSkill}`);
  }

  const manifest = await readJson(path.join(repoRoot, "runtime", "archsight-aios.manifest.json"));
  const manifestSkillIds = new Set(manifest.skills.map((skill) => skill.id));
  assert.ok(manifestSkillIds.has("aios-tender-write"));
  assert.ok(manifestSkillIds.has("aios-scheme-write"));

  for (const fileName of [
    "source-normalized.md",
    "material-index.md",
    "writing-brief.md",
    "draft.md",
    "review-notes.md",
    "final.md"
  ]) {
    await fs.access(path.join(repoRoot, "templates", "document-writing", fileName));
  }
}

async function testWritingInitCreatesMarkdownWorkbench() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-writing-init-"));
  const result = run(["writing:init", "--cwd", tempRoot, "--type", "tender", "--name", "bid-workbench"]);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /WRITING tender/);

  const workspaceRoot = path.join(tempRoot, "bid-workbench");
  for (const fileName of [
    "source-normalized.md",
    "material-index.md",
    "writing-brief.md",
    "draft.md",
    "review-notes.md",
    "final.md",
    "README.md"
  ]) {
    await fs.access(path.join(workspaceRoot, fileName));
  }

  const readme = await fs.readFile(path.join(workspaceRoot, "README.md"), "utf8");
  assert.match(readme, /aios-tender-write/);
  assert.match(readme, /aios-commercial-tender/);
  assert.match(readme, /Markdown 工作母版/);

  const second = run(["writing:init", "--cwd", tempRoot, "--type", "tender", "--name", "bid-workbench"]);
  assert.equal(second.status, 0, `${second.stdout}\n${second.stderr}`);
  assert.match(second.stdout, /SKIP existing/);

  await fs.rm(tempRoot, { recursive: true, force: true });
}

async function testWritingIntentRoutesToWritingSkill() {
  const cases = [
    {
      name: "technical-bid",
      readme: "# 技术标生成\n\n本项目需要根据招标文件做技术标生成。",
      expected: "aios-tender-write",
      fallback: "aios-commercial-tender"
    },
    {
      name: "construction-scheme",
      readme: "# 施工方案生成\n\n本项目需要根据历史方案做施工方案生成。",
      expected: "aios-scheme-write",
      fallback: "aios-construction-scheme"
    }
  ];

  for (const item of cases) {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), `archsight-aios-writing-route-${item.name}-`));
    await fs.writeFile(path.join(tempRoot, "README.md"), item.readme, "utf8");

    const result = run(["init", "--cwd", tempRoot, "--mode", "ai-only"]);
    assert.equal(result.status, 0, `${item.name}\n${result.stdout}\n${result.stderr}`);

    const detection = await fs.readFile(path.join(tempRoot, ".ai", "profile-detection.md"), "utf8");
    assert.match(detection, new RegExp(item.expected));
    assert.ok(
      detection.indexOf(item.expected) < detection.indexOf(item.fallback),
      `${item.expected} should rank before ${item.fallback}`
    );

    await fs.rm(tempRoot, { recursive: true, force: true });
  }
}

async function testInstallAntigravityUsesPluginByDefault() {
  const tempHome = await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-antigravity-2-"));
  const manifest = await readJson(path.join(repoRoot, "runtime", "archsight-aios.manifest.json"));
  const skillName = manifest.skills[0].id;

  const result = runWithHome(["install", "--target", "antigravity", "--scope", "user"], tempHome);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /antigravity 2\.x plugin/);

  await assert.rejects(fs.access(path.join(tempHome, ".archsight-aios")));
  const pluginRoot = path.join(tempHome, ".gemini", "config", "plugins", "archsight-aios");
  const pluginJson = await readJson(path.join(pluginRoot, "plugin.json"));
  assert.equal(pluginJson.name, "archsight-aios");
  await fs.access(path.join(pluginRoot, "skills", skillName, "SKILL.md"));
  await fs.access(path.join(pluginRoot, "skills", "engineering-business-starter-kit.md"));
  await assert.rejects(fs.access(path.join(tempHome, ".gemini", "archsight-aios")));
  await assert.rejects(fs.access(path.join(tempHome, ".gemini", "antigravity", "skills")));

  await fs.rm(tempHome, { recursive: true, force: true });
}

async function testInstallGeminiWritesGeminiSupportAssets() {
  const tempHome = await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-gemini-"));

  const result = runWithHome(["install", "--target", "gemini", "--scope", "user"], tempHome);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /gemini support assets/);

  await fs.access(path.join(tempHome, ".gemini", "GEMINI.md"));
  await fs.access(path.join(tempHome, ".gemini", "archsight-aios", "runtime", "archsight-aios.manifest.json"));
  await assert.rejects(fs.access(path.join(tempHome, ".archsight-aios")));

  await fs.rm(tempHome, { recursive: true, force: true });
}

async function testInstallWorkBuddyWritesPersonalSkills() {
  const tempHome = await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-workbuddy-"));
  const manifest = await readJson(path.join(repoRoot, "runtime", "archsight-aios.manifest.json"));
  const skillName = manifest.skills[0].id;

  const result = runWithHome(["install", "--target", "workbuddy", "--scope", "user"], tempHome);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /workbuddy skills/);

  await fs.access(path.join(tempHome, ".workbuddy", "skills", skillName, "SKILL.md"));
  await fs.access(path.join(tempHome, ".workbuddy", "skills", "engineering-business-starter-kit.md"));
  await assert.rejects(fs.access(path.join(tempHome, ".gemini", "archsight-aios")));
  await assert.rejects(fs.access(path.join(tempHome, ".codex", "skills", skillName, "SKILL.md")));

  await fs.rm(tempHome, { recursive: true, force: true });
}

async function testInstallOpenCodeWritesPersonalSkills() {
  const tempHome = await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-opencode-"));
  const manifest = await readJson(path.join(repoRoot, "runtime", "archsight-aios.manifest.json"));
  const skillName = manifest.skills[0].id;

  const result = runWithHome(["install", "--target", "opencode", "--scope", "user"], tempHome);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /opencode skills/);

  await fs.access(path.join(tempHome, ".opencode", "skills", skillName, "SKILL.md"));
  await fs.access(path.join(tempHome, ".opencode", "skills", "engineering-business-starter-kit.md"));
  await assert.rejects(fs.access(path.join(tempHome, ".codex", "skills", skillName, "SKILL.md")));
  await assert.rejects(fs.access(path.join(tempHome, ".claude", "skills", skillName, "SKILL.md")));

  await fs.rm(tempHome, { recursive: true, force: true });
}

async function testInstallClaudeCodeWritesPersonalSkills() {
  const tempHome = await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-claude-code-"));
  const manifest = await readJson(path.join(repoRoot, "runtime", "archsight-aios.manifest.json"));
  const skillName = manifest.skills[0].id;

  const result = runWithHome(["install", "--target", "claudecode", "--scope", "user"], tempHome);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /claude-code skills/);

  await fs.access(path.join(tempHome, ".claude", "skills", skillName, "SKILL.md"));
  await fs.access(path.join(tempHome, ".claude", "skills", "engineering-business-starter-kit.md"));
  await assert.rejects(fs.access(path.join(tempHome, ".codex", "skills", skillName, "SKILL.md")));
  await assert.rejects(fs.access(path.join(tempHome, ".opencode", "skills", skillName, "SKILL.md")));

  await fs.rm(tempHome, { recursive: true, force: true });
}

async function testInstallAllIncludesWorkBuddy() {
  const tempHome = await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-all-workbuddy-"));
  const manifest = await readJson(path.join(repoRoot, "runtime", "archsight-aios.manifest.json"));
  const skillName = manifest.skills[0].id;

  const result = runWithHome(["install", "--target", "all", "--scope", "user"], tempHome);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /workbuddy skills/);

  await fs.access(path.join(tempHome, ".workbuddy", "skills", skillName, "SKILL.md"));
  await fs.access(path.join(tempHome, ".codex", "skills", skillName, "SKILL.md"));
  await fs.access(path.join(tempHome, ".opencode", "skills", skillName, "SKILL.md"));
  await fs.access(path.join(tempHome, ".claude", "skills", skillName, "SKILL.md"));
  await fs.access(path.join(tempHome, ".gemini", "archsight-aios", "skills", skillName, "SKILL.md"));
  await fs.access(path.join(tempHome, ".workbuddy", "skills", "engineering-business-starter-kit.md"));
  await fs.access(path.join(tempHome, ".codex", "skills", "engineering-business-starter-kit.md"));
  await fs.access(path.join(tempHome, ".opencode", "skills", "engineering-business-starter-kit.md"));
  await fs.access(path.join(tempHome, ".claude", "skills", "engineering-business-starter-kit.md"));
  await fs.access(path.join(tempHome, ".gemini", "archsight-aios", "skills", "engineering-business-starter-kit.md"));

  await fs.rm(tempHome, { recursive: true, force: true });
}

async function testInstallAntigravityUsesLegacyWhenDetected() {
  const tempHome = await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-antigravity-1-"));
  const manifest = await readJson(path.join(repoRoot, "runtime", "archsight-aios.manifest.json"));
  const skillName = manifest.skills[0].id;
  await fs.mkdir(path.join(tempHome, ".gemini", "antigravity"), { recursive: true });

  const result = runWithHome(["install", "--target", "antigravity", "--scope", "user"], tempHome);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /antigravity 1\.x legacy skills/);

  await fs.access(path.join(tempHome, ".gemini", "antigravity", "skills", skillName, "SKILL.md"));
  await fs.access(path.join(tempHome, ".gemini", "antigravity", "skills", "engineering-business-starter-kit.md"));
  await assert.rejects(fs.access(path.join(tempHome, ".gemini", "config", "plugins", "archsight-aios")));

  await fs.rm(tempHome, { recursive: true, force: true });
}

async function testInstallAntigravityInstallsPluginWhen2ConfigDetected() {
  const tempHome = await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-antigravity-both-"));
  const manifest = await readJson(path.join(repoRoot, "runtime", "archsight-aios.manifest.json"));
  const skillName = manifest.skills[0].id;
  await fs.mkdir(path.join(tempHome, ".gemini", "antigravity"), { recursive: true });
  await fs.mkdir(path.join(tempHome, ".gemini", "antigravity-ide"), { recursive: true });
  await fs.mkdir(path.join(tempHome, ".gemini", "config"), { recursive: true });

  const result = runWithHome(["install", "--target", "antigravity", "--scope", "user"], tempHome);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /antigravity 1\.x legacy skills/);
  assert.match(result.stdout, /antigravity 2\.x plugin/);

  await fs.access(path.join(tempHome, ".gemini", "antigravity", "skills", skillName, "SKILL.md"));
  await fs.access(path.join(tempHome, ".gemini", "config", "plugins", "archsight-aios", "skills", skillName, "SKILL.md"));
  await fs.access(path.join(tempHome, ".gemini", "antigravity", "skills", "engineering-business-starter-kit.md"));
  await fs.access(path.join(tempHome, ".gemini", "config", "plugins", "archsight-aios", "skills", "engineering-business-starter-kit.md"));

  await fs.rm(tempHome, { recursive: true, force: true });
}

async function testValidateProjectTemplate() {
  const result = run(["validate", "--temp"]);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /Project template validation passed/);
}

async function testInitProjectDefaultsToCurrentDirectory() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-init-cwd-default-"));

  const result = run(["init"], { cwd: tempRoot });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  await fs.access(path.join(tempRoot, "AGENTS.md"));
  await fs.access(path.join(tempRoot, "AI_CODING_RULES.md"));
  await fs.access(path.join(tempRoot, "CLAUDE.md"));
  await fs.access(path.join(tempRoot, "GEMINI.md"));
  await fs.access(path.join(tempRoot, "OPENCODE.md"));
  await fs.access(path.join(tempRoot, ".ai", "ARCHSIGHT_AIOS_RULES.md"));
  await fs.access(path.join(tempRoot, ".ai", "project-context.md"));
  await fs.access(path.join(tempRoot, ".ai", "profile-detection.md"));

  await fs.rm(tempRoot, { recursive: true, force: true });
}

async function testInitProjectAutoLinksExistingInstructionFiles() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-init-"));
  const agentsPath = path.join(tempRoot, "AGENTS.md");
  await fs.writeFile(agentsPath, "# Existing project instructions\n", "utf8");

  const first = run(["init", "--cwd", tempRoot]);
  assert.equal(first.status, 0, `${first.stdout}\n${first.stderr}`);
  assert.match(first.stdout, /LINK/);

  const second = run(["init", "--cwd", tempRoot]);
  assert.equal(second.status, 0, `${second.stdout}\n${second.stderr}`);
  assert.match(second.stdout, /LINK/);

  const agents = await fs.readFile(agentsPath, "utf8");
  assert.match(agents, /Existing project instructions/);
  assert.match(agents, /ARCHSIGHT-AIOS:START/);
  assert.equal((agents.match(/ARCHSIGHT-AIOS:START/g) ?? []).length, 1);
  await fs.rm(tempRoot, { recursive: true, force: true });
}

async function testInitProjectAiOnlyMode() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-init-ai-only-"));

  const result = run(["init", "--cwd", tempRoot, "--mode", "ai-only"]);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);

  await assert.rejects(fs.access(path.join(tempRoot, "AGENTS.md")));
  await assert.rejects(fs.access(path.join(tempRoot, "AI_CODING_RULES.md")));
  await assert.rejects(fs.access(path.join(tempRoot, "CLAUDE.md")));
  await assert.rejects(fs.access(path.join(tempRoot, "GEMINI.md")));
  await assert.rejects(fs.access(path.join(tempRoot, "OPENCODE.md")));
  await fs.access(path.join(tempRoot, ".ai", "ARCHSIGHT_AIOS_RULES.md"));
  await fs.access(path.join(tempRoot, ".ai", "project-context.md"));
  await fs.access(path.join(tempRoot, ".ai", "agent-routing.md"));
  await fs.access(path.join(tempRoot, ".ai", "skills.md"));
  await fs.access(path.join(tempRoot, ".ai", "workflows.md"));
  await fs.access(path.join(tempRoot, ".ai", "profile-detection.md"));

  await fs.rm(tempRoot, { recursive: true, force: true });
}

async function testInitProjectLinkedModeReferencesAiFiles() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-init-linked-"));
  const rootFiles = ["AGENTS.md", "CLAUDE.md", "GEMINI.md", "OPENCODE.md"];
  const codingRulesPath = path.join(tempRoot, "AI_CODING_RULES.md");

  for (const fileName of rootFiles) {
    await fs.writeFile(path.join(tempRoot, fileName), `# Existing ${fileName}\n`, "utf8");
  }
  await fs.writeFile(codingRulesPath, "# Existing coding rules\n", "utf8");

  const result = run(["init", "--cwd", tempRoot, "--mode", "linked"]);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);

  for (const fileName of rootFiles) {
    const content = await fs.readFile(path.join(tempRoot, fileName), "utf8");
    assert.match(content, /Existing/);
    assert.match(content, /ARCHSIGHT-AIOS:START/);
    assert.match(content, /\.ai\/ARCHSIGHT_AIOS_RULES\.md/);
    assert.match(content, /\.ai\/project-context\.md/);
    assert.match(content, /AI_CODING_RULES\.md/);
  }

  const codingRules = await fs.readFile(codingRulesPath, "utf8");
  assert.equal(codingRules, "# Existing coding rules\n");
  await fs.access(path.join(tempRoot, ".ai", "ARCHSIGHT_AIOS_RULES.md"));
  await fs.access(path.join(tempRoot, ".ai", "project-context.md"));
  await fs.access(path.join(tempRoot, ".ai", "profile-detection.md"));

  await fs.rm(tempRoot, { recursive: true, force: true });
}

async function testInitProjectLinkedModeCopiesMissingToolEntrypoints() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-init-linked-missing-"));

  const result = run(["init", "--cwd", tempRoot, "--mode", "linked"]);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);

  await assert.rejects(fs.access(path.join(tempRoot, "AI_CODING_RULES.md")));
  for (const fileName of ["AGENTS.md", "CLAUDE.md", "GEMINI.md", "OPENCODE.md"]) {
    const content = await fs.readFile(path.join(tempRoot, fileName), "utf8");
    assert.match(content, /\.ai\/ARCHSIGHT_AIOS_RULES\.md/);
    assert.doesNotMatch(content, /ARCHSIGHT-AIOS:START/);
  }

  await fs.access(path.join(tempRoot, ".ai", "ARCHSIGHT_AIOS_RULES.md"));
  await fs.access(path.join(tempRoot, ".ai", "project-context.md"));
  await fs.access(path.join(tempRoot, ".ai", "profile-detection.md"));

  await fs.rm(tempRoot, { recursive: true, force: true });
}

async function testInitProjectAutoDetectsProfilesAndContext() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-auto-profile-"));
  await fs.writeFile(
    path.join(tempRoot, "README.md"),
    "# 智能 BIM RAG 平台\n\n本项目涉及 Revit、IFC、建筑规范知识库、GraphRAG 和审图规则评估。\n",
    "utf8"
  );
  await fs.writeFile(
    path.join(tempRoot, "package.json"),
    JSON.stringify({
      name: "smart-bim-rag",
      description: "BIM 与规范知识库平台",
      scripts: {
        dev: "vite --host 0.0.0.0",
        test: "node --test",
        build: "vite build"
      },
      dependencies: {
        react: "^18.0.0",
        openai: "^4.0.0"
      }
    }, null, 2),
    "utf8"
  );

  const result = run(["init", "--cwd", tempRoot]);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /PROFILE auto/);

  const detection = await fs.readFile(path.join(tempRoot, ".ai", "profile-detection.md"), "utf8");
  assert.match(detection, /bim-platform/);
  assert.match(detection, /rag-knowledge/);
  await fs.access(path.join(tempRoot, ".ai", "profiles", "bim-platform.md"));
  await fs.access(path.join(tempRoot, ".ai", "profiles", "rag-knowledge.md"));

  const context = await fs.readFile(path.join(tempRoot, ".ai", "project-context.md"), "utf8");
  assert.match(context, /smart-bim-rag/);
  assert.match(context, /npm run dev/);
  assert.match(context, /npm run test/);
  assert.match(context, /aios-knowledge/);

  await fs.rm(tempRoot, { recursive: true, force: true });
}

async function testProjectProfiles() {
  const profiles = [
    ["bim-platform", path.join(".ai", "profiles", "bim-platform.md"), /Revit|IFC|CAD/],
    ["construction-vision", path.join(".ai", "profiles", "construction-vision.md"), /YOLO|Segment Anything|深度估计/],
    ["rag-knowledge", path.join(".ai", "profiles", "rag-knowledge.md"), /GraphRAG|知识图谱|评估问题/]
  ];

  for (const [profile, outputFile, pattern] of profiles) {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), `archsight-aios-profile-${profile}-`));
    const result = run(["init", "--cwd", tempRoot, "--mode", "linked", "--profile", profile]);
    assert.equal(result.status, 0, `${profile}\n${result.stdout}\n${result.stderr}`);
    const content = await fs.readFile(path.join(tempRoot, outputFile), "utf8");
    assert.match(content, pattern);
    await fs.access(path.join(tempRoot, ".ai", "ARCHSIGHT_AIOS_RULES.md"));
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
}

async function testGenericProjectBoundaryText() {
  const rules = await fs.readFile(
    path.join(repoRoot, "templates", "project-ai", ".ai", "ARCHSIGHT_AIOS_RULES.md"),
    "utf8"
  );
  assert.match(rules, /不代表当前项目属于 ArchSightLabs/);
  assert.match(rules, /不要求使用 Hermes、飞书/);
  assert.match(rules, /未启用时，不得把 BIM、IFC、GraphRAG 或审图场景当作项目默认事实/);

  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-generic-boundary-"));
  const agentsPath = path.join(tempRoot, "AGENTS.md");
  await fs.writeFile(agentsPath, "# Existing project instructions\n", "utf8");

  const result = run(["init", "--cwd", tempRoot]);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);

  const agents = await fs.readFile(agentsPath, "utf8");
  assert.match(agents, /不代表项目属于 ArchSightLabs/);
  assert.match(agents, /不要求使用 Hermes、飞书/);
  await fs.rm(tempRoot, { recursive: true, force: true });
}

async function testCapabilityCallUsesRegisteredMcpAdapter() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-capability-mcp-"));
  const serverPath = path.join(tempRoot, "fake-solver-mcp.mjs");
  const inputPath = path.join(tempRoot, "beam-input.json");

  await fs.writeFile(
    serverPath,
    [
      'import readline from "node:readline";',
      'const rl = readline.createInterface({ input: process.stdin });',
      'for await (const line of rl) {',
      '  const request = JSON.parse(line);',
      '  if (request.method === "initialize") {',
      '    console.log(JSON.stringify({ jsonrpc: "2.0", id: request.id, result: { serverInfo: { name: "fake-solver-mcp", version: "0.0.0" } } }));',
      '  } else if (request.method === "tools/call") {',
      '    console.log(JSON.stringify({',
      '      jsonrpc: "2.0",',
      '      id: request.id,',
      '      result: {',
      '        content: [{ type: "text", text: "ok" }],',
      '        isError: false,',
      '        structuredContent: {',
      '          capabilityId: "solver.beam_deflection",',
      '          status: "pass",',
      '          deflection: { value: 17.857143, unit: "mm" },',
      '          inputValidated: true,',
      '          formulaRef: "v_max = 5qL^4 / (384EI)",',
      '          warnings: []',
      '        }',
      '      }',
      '    }));',
      '  }',
      '}'
    ].join("\n"),
    "utf8"
  );
  await fs.writeFile(
    inputPath,
    JSON.stringify({
      span: { value: 6.0, unit: "m" },
      elasticModulus: { value: 210.0, unit: "GPa" },
      secondMomentOfArea: { value: 4500.0, unit: "cm4" },
      load: { value: 10.0, unit: "kN/m", case: "uniform" },
      boundaryCondition: "simply_supported"
    }),
    "utf8"
  );

  const result = run([
    "capability:call",
    "--capability",
    "solver.beam_deflection",
    "--agent",
    "euclid",
    "--skill",
    "aios-structural",
    "--input",
    inputPath,
    "--mcp-cwd",
    tempRoot,
    "--mcp-command",
    process.execPath,
    "--mcp-arg",
    serverPath
  ]);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);

  const envelope = JSON.parse(result.stdout);
  assert.equal(envelope.authorized, true);
  assert.equal(envelope.adapter.toolName, "beam_deflection");
  assert.equal(envelope.toolResult.capabilityId, "solver.beam_deflection");
  assert.equal(envelope.decision.action, "proceed");
  assert.equal(envelope.evidence.serverInfo.name, "fake-solver-mcp");

  await fs.rm(tempRoot, { recursive: true, force: true });
}

async function testCapabilityCallUsesCanonicalServiceabilityTool() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-serviceability-mcp-"));
  const serverPath = path.join(tempRoot, "fake-solver-serviceability-mcp.mjs");
  const inputPath = path.join(tempRoot, "beam-serviceability-input.json");

  await fs.writeFile(
    serverPath,
    [
      'import readline from "node:readline";',
      'const rl = readline.createInterface({ input: process.stdin });',
      'for await (const line of rl) {',
      '  const request = JSON.parse(line);',
      '  if (request.method === "initialize") {',
      '    console.log(JSON.stringify({ jsonrpc: "2.0", id: request.id, result: { serverInfo: { name: "fake-solver-mcp", version: "0.0.0" } } }));',
      '  } else if (request.method === "tools/call") {',
      '    const toolName = request.params.name;',
      '    console.log(JSON.stringify({',
      '      jsonrpc: "2.0",',
      '      id: request.id,',
      '      result: {',
      '        content: [{ type: "text", text: toolName }],',
      '        isError: false,',
      '        structuredContent: {',
      '          capabilityId: "solver.beam_deflection_serviceability_check",',
      '          status: "pass",',
      '          checkType: "serviceability_deflection_check",',
      '          deflection: { value: 17.857143, unit: "mm" },',
      '          allowable: { value: 24, unit: "mm", ratio: 250 },',
      '          inputValidated: true,',
      '          warnings: []',
      '        }',
      '      }',
      '    }));',
      '  }',
      '}'
    ].join("\n"),
    "utf8"
  );
  await fs.writeFile(
    inputPath,
    JSON.stringify({
      span: { value: 6.0, unit: "m" },
      elasticModulus: { value: 210.0, unit: "GPa" },
      secondMomentOfArea: { value: 4500.0, unit: "cm4" },
      load: { value: 10.0, unit: "kN/m", case: "uniform" },
      boundaryCondition: "simply_supported",
      deflectionLimitRatio: 250
    }),
    "utf8"
  );

  const result = run([
    "capability:call",
    "--capability",
    "solver.beam_deflection_serviceability_check",
    "--agent",
    "euclid",
    "--skill",
    "aios-structural",
    "--input",
    inputPath,
    "--mcp-cwd",
    tempRoot,
    "--mcp-command",
    process.execPath,
    "--mcp-arg",
    serverPath
  ]);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);

  const envelope = JSON.parse(result.stdout);
  assert.equal(envelope.adapter.toolName, "beam_deflection_serviceability_check");
  assert.equal(envelope.toolResult.capabilityId, "solver.beam_deflection_serviceability_check");
  assert.equal(envelope.decision.action, "proceed");

  await fs.rm(tempRoot, { recursive: true, force: true });
}

async function testCapabilityCallRejectsUnauthorizedAgent() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-capability-deny-"));
  const inputPath = path.join(tempRoot, "beam-input.json");
  await fs.writeFile(
    inputPath,
    JSON.stringify({
      span: { value: 6.0, unit: "m" },
      elasticModulus: { value: 210.0, unit: "GPa" },
      secondMomentOfArea: { value: 4500.0, unit: "cm4" },
      load: { value: 10.0, unit: "kN/m", case: "uniform" }
    }),
    "utf8"
  );

  const result = run([
    "capability:call",
    "--capability",
    "solver.beam_deflection",
    "--agent",
    "atlas",
    "--skill",
    "aios-structural",
    "--input",
    inputPath
  ]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Capability denied/);

  await fs.rm(tempRoot, { recursive: true, force: true });
}

async function testHermesCommands() {
  for (const command of ["hermes:validate", "hermes:sync-dry-run", "hermes:detect-drift"]) {
    const result = run([command]);
    assert.equal(result.status, 0, `${command}\n${result.stdout}\n${result.stderr}`);
  }
}

const tests = [
  testHelp,
  testHelpCommand,
  testUnknownCommand,
  testProductIdentity,
  testManifestCoversRepositoryAssets,
  testPublicDiscoveryMetadata,
  testValidateSkillsCommand,
  testValidatePromptFixturesCommand,
  testValidatePromptModelOutputsCommand,
  testValidatePromptScorecardCommand,
  testBuildPromptRunPackCommand,
  testValidatePromptRunResultsCommand,
  testAnalyzePromptRunResultsCommand,
  testInitPromptModelOutputTemplateCommand,
  testSkillsAvoidPromptTemplateShape,
  testEngineeringBusinessSkillsRequireDetailedOutput,
  testEngineeringWritingSkillsAreRoutedAndGuarded,
  testWritingInitCreatesMarkdownWorkbench,
  testWritingIntentRoutesToWritingSkill,
  testInstallAntigravityUsesPluginByDefault,
  testInstallGeminiWritesGeminiSupportAssets,
  testInstallWorkBuddyWritesPersonalSkills,
  testInstallOpenCodeWritesPersonalSkills,
  testInstallClaudeCodeWritesPersonalSkills,
  testInstallAllIncludesWorkBuddy,
  testInstallAntigravityUsesLegacyWhenDetected,
  testInstallAntigravityInstallsPluginWhen2ConfigDetected,
  testValidateProjectTemplate,
  testInitProjectDefaultsToCurrentDirectory,
  testInitProjectAutoLinksExistingInstructionFiles,
  testInitProjectAiOnlyMode,
  testInitProjectLinkedModeReferencesAiFiles,
  testInitProjectLinkedModeCopiesMissingToolEntrypoints,
  testInitProjectAutoDetectsProfilesAndContext,
  testProjectProfiles,
  testGenericProjectBoundaryText,
  testCapabilityCallUsesRegisteredMcpAdapter,
  testCapabilityCallUsesCanonicalServiceabilityTool,
  testCapabilityCallRejectsUnauthorizedAgent,
  testHermesCommands
];

for (const test of tests) {
  await test();
  console.log(`ok ${test.name}`);
}

console.log(`${tests.length} CLI test group(s) passed.`);
