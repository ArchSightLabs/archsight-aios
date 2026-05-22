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

function runWithHome(args, homeDir) {
  return run(args, {
    env: {
      ...process.env,
      HOME: homeDir,
      USERPROFILE: homeDir,
      APPDATA: path.join(homeDir, "AppData", "Roaming"),
      XDG_CONFIG_HOME: path.join(homeDir, ".config")
    }
  });
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

function expectedAssetStore(homeDir) {
  if (process.platform === "win32") {
    return path.join(homeDir, "AppData", "Roaming", "archsight-aios");
  }

  if (process.platform === "darwin") {
    return path.join(homeDir, "Library", "Application Support", "archsight-aios");
  }

  return path.join(homeDir, ".config", "archsight-aios");
}

async function testHelp() {
  const result = run(["--help"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /ArchSight AIOS/);
  assert.match(result.stdout, /archsight-aios help/);
  assert.match(result.stdout, /codex\|agents\|gemini\|antigravity\|all/);
  assert.match(result.stdout, /archsight-aios doctor/);
  assert.match(result.stdout, /archsight-aios init /);
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

  assert.equal(manifest.name, "archsight-aios");
  assert.equal(pkg.name, "@archsight/aios");
  assert.equal(pkg.bin["archsight-aios"], "./bin/archsight-aios.mjs");
  assert.ok(manifest.skills.every((skill) => skill.id.startsWith("aios-")));
  assert.ok(manifest.skills.every((skill) => skill.path.startsWith("skills/aios-")));
  assert.ok(manifest.skills.every((skill) => skill.id.split("-").length <= 3));
  assert.ok(manifest.workflows.every((workflow) => workflow.id.split("-").length <= 3));
  assert.equal(manifest.installTargets.codexSkills, "~/.codex/skills");
  assert.equal(manifest.installTargets.codexWorkflows, "~/.codex/workflows/aios");
  assert.equal(manifest.installTargets.sharedAgentSkills, "~/.agents/skills");
  assert.equal(manifest.installTargets.sharedAgentWorkflows, "~/.agents/workflows/aios");
  assert.equal(manifest.installTargets.antigravityPlugin, "~/.gemini/config/plugins/archsight-aios");
  assert.equal(manifest.installTargets.antigravityLegacySkills, "~/.gemini/antigravity/skills");
  assert.equal(manifest.installTargets.assetStore, "platform user config directory: archsight-aios");

  await assert.rejects(fs.access(legacyManifest));
}

async function testInstallAntigravityUsesPluginByDefault() {
  const tempHome = await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-antigravity-2-"));
  const manifest = await readJson(path.join(repoRoot, "runtime", "archsight-aios.manifest.json"));
  const skillName = manifest.skills[0].id;

  const result = runWithHome(["install", "--target", "antigravity", "--scope", "user"], tempHome);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /antigravity 2\.x plugin/);

  await fs.access(path.join(expectedAssetStore(tempHome), "runtime", "archsight-aios.manifest.json"));
  await assert.rejects(fs.access(path.join(tempHome, ".archsight-aios")));
  const pluginRoot = path.join(tempHome, ".gemini", "config", "plugins", "archsight-aios");
  const pluginJson = await readJson(path.join(pluginRoot, "plugin.json"));
  assert.equal(pluginJson.name, "archsight-aios");
  await fs.access(path.join(pluginRoot, "skills", skillName, "SKILL.md"));
  await assert.rejects(fs.access(path.join(tempHome, ".gemini", "antigravity", "skills")));

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
  await assert.rejects(fs.access(path.join(tempHome, ".gemini", "config", "plugins", "archsight-aios")));

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
  await fs.access(path.join(tempRoot, ".ai", "ARCHSIGHT_AIOS_RULES.md"));
  await fs.access(path.join(tempRoot, ".ai", "project-context.md"));

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
  await fs.access(path.join(tempRoot, ".ai", "ARCHSIGHT_AIOS_RULES.md"));
  await fs.access(path.join(tempRoot, ".ai", "project-context.md"));
  await fs.access(path.join(tempRoot, ".ai", "agent-routing.md"));
  await fs.access(path.join(tempRoot, ".ai", "skills.md"));
  await fs.access(path.join(tempRoot, ".ai", "workflows.md"));

  await fs.rm(tempRoot, { recursive: true, force: true });
}

async function testInitProjectLinkedModeReferencesAiFiles() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-init-linked-"));
  const rootFiles = ["AGENTS.md", "CLAUDE.md", "GEMINI.md"];
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

  await fs.rm(tempRoot, { recursive: true, force: true });
}

async function testInitProjectLinkedModeCopiesMissingToolEntrypoints() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-init-linked-missing-"));

  const result = run(["init", "--cwd", tempRoot, "--mode", "linked"]);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);

  await assert.rejects(fs.access(path.join(tempRoot, "AI_CODING_RULES.md")));
  for (const fileName of ["AGENTS.md", "CLAUDE.md", "GEMINI.md"]) {
    const content = await fs.readFile(path.join(tempRoot, fileName), "utf8");
    assert.match(content, /\.ai\/ARCHSIGHT_AIOS_RULES\.md/);
    assert.doesNotMatch(content, /ARCHSIGHT-AIOS:START/);
  }

  await fs.access(path.join(tempRoot, ".ai", "ARCHSIGHT_AIOS_RULES.md"));
  await fs.access(path.join(tempRoot, ".ai", "project-context.md"));

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
  testInstallAntigravityUsesPluginByDefault,
  testInstallAntigravityUsesLegacyWhenDetected,
  testValidateProjectTemplate,
  testInitProjectDefaultsToCurrentDirectory,
  testInitProjectAutoLinksExistingInstructionFiles,
  testInitProjectAiOnlyMode,
  testInitProjectLinkedModeReferencesAiFiles,
  testInitProjectLinkedModeCopiesMissingToolEntrypoints,
  testProjectProfiles,
  testGenericProjectBoundaryText,
  testHermesCommands
];

for (const test of tests) {
  await test();
  console.log(`ok ${test.name}`);
}

console.log(`${tests.length} CLI test group(s) passed.`);
