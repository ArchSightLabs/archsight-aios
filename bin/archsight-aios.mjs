#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const home = os.homedir();

const managedStart = "<!-- ARCHSIGHT-AIOS:START -->";
const managedEnd = "<!-- ARCHSIGHT-AIOS:END -->";
const antigravityPluginName = "archsight-aios";

const assetDirs = [
  "skills",
  "workflows",
  "templates",
  "runtime",
  "agents",
  "governance",
  "delivery",
  "memory",
  "knowledge",
  "rag",
  "graph",
  "standards",
  "infra",
  "prompts",
  "vision",
  "docs"
];
const assetFiles = ["README.md", "AI_CODING_RULES.md", "AGENTS.md", "CLAUDE.md", "GEMINI.md"];
const skillAliases = {
  "aios-arch": ["aios-architecture-review", "archsight-architecture-review"],
  "aios-plan": ["aios-delivery-planning", "archsight-delivery-planning"],
  "aios-review": ["aios-code-review", "archsight-code-review"],
  "aios-knowledge": [
    "aios-building-knowledge",
    "archsight-building-knowledge",
    "aios-bim-domain-modeling",
    "archsight-bim-domain-modeling"
  ],
  "aios-runtime": [
    "aios-runtime-design",
    "archsight-runtime-design",
    "aios-ai-runtime-design",
    "archsight-ai-runtime-design"
  ],
  "aios-exec": ["aios-controlled-execution", "archsight-controlled-execution"]
};

function usage() {
  return [
    "ArchSight AIOS",
    "",
    "Usage:",
    "  archsight-aios help",
    "  archsight-aios install --target <codex|agents|gemini|antigravity|all> --scope user",
    "  archsight-aios doctor",
    "  archsight-aios init [--cwd <path>] [--mode <auto|full|linked|ai-only>] [--profile <name>]",
    "  archsight-aios validate [--cwd <path>] [--profile <name>] [--temp]",
    "  archsight-aios hermes:validate",
    "  archsight-aios hermes:sync-dry-run",
    "  archsight-aios hermes:detect-drift",
    "",
    "Commands:",
    "  help                  Show this help.",
    "  install               Install AIOS assets into user-level assistant locations.",
    "  doctor                Check repository assets and user-level installation.",
    "  init                  Add AI rules and .ai governance files to a project.",
    "  validate              Validate the project AI template output.",
    "  hermes:*              Validate or dry-run Hermes runtime prompt sync.",
    "",
    "Examples:",
    "  npx @archsight/aios install --target codex --scope user",
    "  npx @archsight/aios install --target agents --scope user",
    "  npx @archsight/aios init",
    "  npx @archsight/aios validate --temp",
    "  npx @archsight/aios doctor"
  ].join("\n");
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const help = command === "--help" || command === "-h" || command === "help";
  const options = {
    command: help ? undefined : command,
    target: "all",
    scope: "user",
    mode: "auto",
    profile: undefined,
    cwd: process.cwd(),
    help,
    temp: false
  };

  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    if (arg === "--target") {
      options.target = rest[++i];
    } else if (arg === "--scope") {
      options.scope = rest[++i];
    } else if (arg === "--cwd") {
      options.cwd = path.resolve(rest[++i]);
    } else if (arg === "--mode") {
      options.mode = rest[++i];
    } else if (arg === "--profile") {
      options.profile = rest[++i];
    } else if (arg === "--temp") {
      options.temp = true;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

async function exists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(targetPath) {
  await fs.mkdir(targetPath, { recursive: true });
}

function assertInside(child, parent) {
  const relative = path.relative(path.resolve(parent), path.resolve(child));
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to write outside ${parent}: ${child}`);
  }
}

async function copyDir(src, dest) {
  if (!(await exists(src))) {
    throw new Error(`Missing source directory: ${src}`);
  }
  assertInside(dest, path.dirname(dest));
  await fs.rm(dest, { recursive: true, force: true });
  await fs.cp(src, dest, { recursive: true });
}

async function copyFileIfExists(src, dest) {
  if (await exists(src)) {
    await ensureDir(path.dirname(dest));
    await fs.copyFile(src, dest);
  }
}

async function copyTreeMissing(srcRoot, destRoot) {
  if (!(await exists(srcRoot))) {
    throw new Error(`Missing source directory: ${srcRoot}`);
  }

  const entries = await fs.readdir(srcRoot, { withFileTypes: true });
  for (const entry of entries) {
    const src = path.join(srcRoot, entry.name);
    const dest = path.join(destRoot, entry.name);
    assertInside(dest, destRoot);
    if (entry.isDirectory()) {
      await copyTreeMissing(src, dest);
      continue;
    }
    if (await exists(dest)) {
      console.log(`SKIP existing ${dest}`);
      continue;
    }
    await ensureDir(path.dirname(dest));
    await fs.copyFile(src, dest);
    console.log(`CREATE ${dest}`);
  }
}

async function listAiosSkills() {
  const manifest = await readManifest();
  if (manifest?.skills?.length > 0) {
    return manifest.skills.map((skill) => skill.id).sort();
  }

  const skillsRoot = path.join(repoRoot, "skills");
  const entries = await fs.readdir(skillsRoot, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("aios-"))
    .map((entry) => entry.name)
    .sort();
}

async function listAiosWorkflowPaths() {
  const manifest = await readManifest();
  return (manifest.workflows ?? [])
    .map((workflow) => workflow.path)
    .sort();
}

async function readManifest() {
  const manifestPath = path.join(repoRoot, "runtime", "archsight-aios.manifest.json");
  const raw = await fs.readFile(manifestPath, "utf8");
  return JSON.parse(raw);
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

function routeAgentName(manifest, agentId) {
  return manifest.agents.find((agent) => agent.id === agentId)?.displayName ?? agentId;
}

async function fileContains(filePath, needle) {
  if (!(await exists(filePath))) {
    return false;
  }
  const content = await fs.readFile(filePath, "utf8");
  return content.includes(needle);
}

async function readTextIfExists(filePath) {
  if (!(await exists(filePath))) {
    return "";
  }
  return fs.readFile(filePath, "utf8");
}

function expectedSkillDir(skill) {
  return path.dirname(skill.path);
}

function geminiContentRoot() {
  return path.join(home, ".gemini", "archsight-aios");
}

async function syncGeminiContent() {
  const contentRoot = geminiContentRoot();
  await ensureDir(contentRoot);

  for (const dirName of assetDirs) {
    await copyDir(path.join(repoRoot, dirName), path.join(contentRoot, dirName));
  }

  for (const fileName of assetFiles) {
    await copyFileIfExists(path.join(repoRoot, fileName), path.join(contentRoot, fileName));
  }

  return contentRoot;
}

async function installSkillsTo(targetRoot, skillNames) {
  await ensureDir(targetRoot);
  for (const skillName of skillNames) {
    await copyDir(
      path.join(repoRoot, "skills", skillName),
      path.join(targetRoot, skillName)
    );
  }
}

async function writeJson(filePath, value) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function antigravityLegacyRoot() {
  return path.join(home, ".gemini", "antigravity");
}

function antigravityLegacySkillsRoot() {
  return path.join(antigravityLegacyRoot(), "skills");
}

function antigravityPluginsRoot() {
  return path.join(home, ".gemini", "config", "plugins");
}

function antigravityPluginRoot() {
  return path.join(antigravityPluginsRoot(), antigravityPluginName);
}

async function hasAntigravity2Config() {
  if (!(await exists(path.join(home, ".gemini", "config")))) {
    return false;
  }

  const installMarkers = [
    path.join(home, ".gemini", "antigravity-ide"),
    path.join(home, ".gemini", "antigravity-cli"),
    path.join(home, ".antigravity-ide"),
    path.join(home, ".antigravity-cli"),
    path.join(home, ".antigravitycli")
  ];

  for (const marker of installMarkers) {
    if (await exists(marker)) {
      return true;
    }
  }

  return false;
}

async function installAntigravityPlugin(skillNames) {
  const pluginRoot = antigravityPluginRoot();
  assertInside(pluginRoot, antigravityPluginsRoot());
  await fs.rm(pluginRoot, { recursive: true, force: true });
  await ensureDir(pluginRoot);
  await writeJson(path.join(pluginRoot, "plugin.json"), { name: antigravityPluginName });
  await installSkillsTo(path.join(pluginRoot, "skills"), skillNames);
  return pluginRoot;
}

async function installAntigravityLegacy(skillNames) {
  const skillsRoot = antigravityLegacySkillsRoot();
  await removeLegacySkillDirs(skillsRoot, skillNames);
  await installSkillsTo(skillsRoot, skillNames);
  return skillsRoot;
}

async function removeLegacySkillDirs(targetRoot, skillNames) {
  for (const skillName of skillNames) {
    if (!skillName.startsWith("aios-")) {
      continue;
    }

    const legacyNames = [
      { name: `archsight-${skillName.slice("aios-".length)}`, requireMatchingFrontmatter: true },
      ...(skillAliases[skillName] ?? []).map((name) => ({ name, requireMatchingFrontmatter: false }))
    ];

    for (const { name: legacyName, requireMatchingFrontmatter } of legacyNames) {
      const legacyDir = path.join(targetRoot, legacyName);
      const legacySkillFile = path.join(legacyDir, "SKILL.md");
      if (!(await exists(legacySkillFile))) {
        continue;
      }

      const legacySkill = await fs.readFile(legacySkillFile, "utf8");
      if (requireMatchingFrontmatter && !legacySkill.includes(`name: ${legacyName}`)) {
        continue;
      }

      await fs.rm(legacyDir, { recursive: true, force: true });
    }
  }
}

async function installWorkflowsTo(targetRoot, workflowPaths) {
  await ensureDir(targetRoot);

  await copyFileIfExists(
    path.join(repoRoot, "workflows", "README.md"),
    path.join(targetRoot, "README.md")
  );

  for (const workflowPath of workflowPaths) {
    await copyFileIfExists(
      path.join(repoRoot, workflowPath),
      path.join(targetRoot, path.basename(workflowPath))
    );
  }
}

function userInstructionBlock(contentRoot) {
  const p = (value) => value.replaceAll("\\", "/");
  return [
    managedStart,
    "# ArchSight AIOS",
    "",
    "ArchSight AIOS Gemini support assets are installed at:",
    "",
    `- ${p(contentRoot)}`,
    "",
    "When a task matches ArchSight AIOS, read the relevant installed assets before answering:",
    "",
    `- Skills: ${p(path.join(contentRoot, "skills"))}`,
    `- Workflows: ${p(path.join(contentRoot, "workflows"))}`,
    `- Runtime routing: ${p(path.join(contentRoot, "runtime"))}`,
    `- Project template: ${p(path.join(contentRoot, "templates", "project-ai"))}`,
    "",
    "Use enabled `aios-*` skills for architecture review, design review, delivery planning, code review, runtime design, controlled execution, and building knowledge when the project profile or task requires it.",
    "Keep Agent, Skill, Workflow, and Runtime boundaries separate.",
    "Hermes, Feishu, and other runtime adapters are optional; do not assume they are enabled unless the project says so.",
    "Do not claim code changes, tests, builds, or deployments were completed unless verified in the bound project workspace.",
    managedEnd,
    ""
  ].join("\n");
}

function projectInstructionBlock() {
  return [
    managedStart,
    "## ArchSight AIOS",
    "",
    "本项目接入 ArchSight AIOS 作为补充治理层，不替代本项目已有通用 AI 编码规则。",
    "",
    "当任务涉及 Agent 路由、Skill 选择、Workflow、交付验证、AI Runtime、Code Review，或项目明确启用的 BIM / IFC / 建筑行业 profile 时，先阅读：",
    "",
    "- `.ai/ARCHSIGHT_AIOS_RULES.md`",
    "- `.ai/project-context.md`",
    "- `.ai/agent-routing.md`",
    "- `.ai/skills.md`",
    "- `.ai/workflows.md`",
    "- `.ai/profiles/*.md`（如当前项目启用了 profile）",
    "",
    "当前项目事实、根目录工具入口文件和 `AI_CODING_RULES.md` 优先；`.ai/ARCHSIGHT_AIOS_RULES.md` 只补充 AIOS 专属规则。接入 AIOS 不代表项目属于 ArchSightLabs，也不要求使用 Hermes、飞书或其他特定运行平台。",
    managedEnd,
    ""
  ].join("\n");
}

function containsAiosReference(content) {
  return [
    managedStart,
    "ArchSight AIOS",
    "archsight-aios",
    "ARCHSIGHT_AIOS_RULES.md",
    ".ai/ARCHSIGHT_AIOS_RULES.md"
  ].some((needle) => content.includes(needle));
}

async function resolveInitProjectMode(requestedMode, targetRoot, rootInstructionFiles, aiFiles) {
  if (requestedMode !== "auto") {
    return requestedMode;
  }

  const existingRootFiles = [];
  let hasAiosReference = false;

  for (const fileName of rootInstructionFiles) {
    const filePath = path.join(targetRoot, fileName);
    if (await exists(filePath)) {
      existingRootFiles.push(fileName);
      hasAiosReference ||= containsAiosReference(await readTextIfExists(filePath));
    }
  }

  for (const fileName of aiFiles) {
    const filePath = path.join(targetRoot, fileName);
    if (await exists(filePath)) {
      hasAiosReference = true;
      break;
    }
  }

  if (existingRootFiles.length > 0 || hasAiosReference) {
    return "linked";
  }

  return "full";
}

async function upsertManagedBlock(filePath, block) {
  await ensureDir(path.dirname(filePath));
  const current = (await exists(filePath)) ? await fs.readFile(filePath, "utf8") : "";
  const startIndex = current.indexOf(managedStart);
  const endIndex = current.indexOf(managedEnd);

  let next;
  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    const before = current.slice(0, startIndex).trimEnd();
    const after = current.slice(endIndex + managedEnd.length).trimStart();
    next = [before, block.trimEnd(), after].filter(Boolean).join("\n\n") + "\n";
  } else {
    next = `${current.trimEnd()}${current.trimEnd() ? "\n\n" : ""}${block}`;
  }

  await fs.writeFile(filePath, next, "utf8");
}

async function install(options) {
  if (options.scope !== "user") {
    throw new Error("Only --scope user is supported in this release.");
  }

  const validTargets = new Set(["codex", "agents", "gemini", "antigravity", "all"]);
  if (!validTargets.has(options.target)) {
    throw new Error(`Unsupported target: ${options.target}`);
  }

  const skillNames = await listAiosSkills();
  const workflowPaths = await listAiosWorkflowPaths();
  const targets = options.target === "all"
    ? ["codex", "gemini", "antigravity"]
    : [options.target];

  const installed = [];

  if (targets.includes("codex")) {
    const codexSkillsRoot = path.join(home, ".codex", "skills");
    await removeLegacySkillDirs(codexSkillsRoot, skillNames);
    await installSkillsTo(codexSkillsRoot, skillNames);
    await installWorkflowsTo(path.join(home, ".codex", "workflows", "aios"), workflowPaths);
    installed.push("codex skills", "codex workflows");
  }

  if (targets.includes("agents")) {
    const sharedSkillsRoot = path.join(home, ".agents", "skills");
    await removeLegacySkillDirs(sharedSkillsRoot, skillNames);
    await installSkillsTo(sharedSkillsRoot, skillNames);
    await installWorkflowsTo(path.join(home, ".agents", "workflows", "aios"), workflowPaths);
    installed.push("shared agent skills", "shared agent workflows");
  }

  if (targets.includes("gemini")) {
    const contentRoot = await syncGeminiContent();
    await upsertManagedBlock(path.join(home, ".gemini", "GEMINI.md"), userInstructionBlock(contentRoot));
    installed.push("gemini user instructions", "gemini support assets");
  }

  if (targets.includes("antigravity")) {
    const installLegacy = await exists(antigravityLegacyRoot());
    const installPlugin = !installLegacy || await hasAntigravity2Config();

    if (installLegacy) {
      await installAntigravityLegacy(skillNames);
      installed.push("antigravity 1.x legacy skills");
    }

    if (installPlugin) {
      await installAntigravityPlugin(skillNames);
      installed.push("antigravity 2.x plugin");
    }
  }

  console.log(`Installed: ${installed.join(", ")}`);
  console.log(`Skills: ${skillNames.join(", ")}`);
  console.log(`Workflows: ${workflowPaths.map((workflowPath) => path.basename(workflowPath)).join(", ")}`);
}

async function doctor() {
  const manifest = await readManifest();
  const geminiRoot = geminiContentRoot();
  const agentIds = new Set(manifest.agents.map((agent) => agent.id));
  const skillIds = new Set(manifest.skills.map((skill) => skill.id));
  const workflowIds = new Set(manifest.workflows.map((workflow) => workflow.id));
  const checks = [];

  async function check(label, targetPath) {
    const ok = await exists(targetPath);
    checks.push({ label, targetPath, ok });
  }

  async function checkContains(label, filePath, needle) {
    const ok = await fileContains(filePath, needle);
    checks.push({ label, targetPath: `${filePath} contains ${needle}`, ok });
  }

  function checkCondition(label, ok, detail) {
    checks.push({ label, targetPath: detail, ok });
  }

  const manifestPath = path.join(repoRoot, "runtime", "archsight-aios.manifest.json");
  const skillRoutingPath = path.join(repoRoot, "runtime", "skill-routing.md");
  const packageJson = await readJson(path.join(repoRoot, "package.json"));

  await check("manifest", manifestPath);
  checkCondition("manifest schema", manifest.schema === 1, "schema === 1");
  checkCondition("manifest name", manifest.name === "archsight-aios", "name === archsight-aios");
  checkCondition("package name", packageJson.name === "@archsight/aios", "name === @archsight/aios");
  checkCondition("package bin", packageJson.bin?.["archsight-aios"] === "./bin/archsight-aios.mjs", "bin.archsight-aios");
  checkCondition("codex workflows target", manifest.installTargets?.codexWorkflows === "~/.codex/workflows/aios", "codexWorkflows");
  checkCondition("antigravity plugin target", manifest.installTargets?.antigravityPlugin === "~/.gemini/config/plugins/archsight-aios", "antigravityPlugin");
  checkCondition("antigravity legacy skills target", manifest.installTargets?.antigravityLegacySkills === "~/.gemini/antigravity/skills", "antigravityLegacySkills");

  for (const agent of manifest.agents) {
    await check(`agent source ${agent.id}`, path.join(repoRoot, agent.sourcePath));
    await check(`agent runtime prompt ${agent.id}`, path.join(repoRoot, agent.runtimePromptPath));
    for (const fileName of ["role.md", "responsibilities.md", "constraints.md", "workflow.md", "system-prompt.md"]) {
      await check(`agent file ${agent.id}/${fileName}`, path.join(repoRoot, agent.sourcePath, fileName));
    }
    await checkContains(`agent routing mentions ${agent.displayName}`, path.join(repoRoot, "runtime", "agent-routing.md"), agent.displayName);
  }

  for (const skill of manifest.skills) {
    await check(`skill ${skill.id}`, path.join(repoRoot, skill.path));
    await check(`skill openai config ${skill.id}`, path.join(repoRoot, skill.openaiConfigPath));
    await checkContains(`skill frontmatter ${skill.id}`, path.join(repoRoot, skill.path), `name: ${skill.id}`);
    await checkContains(`skill routing mentions ${skill.id}`, skillRoutingPath, skill.id);
    checkCondition(`skill agent exists ${skill.id}`, agentIds.has(skill.primaryAgent), skill.primaryAgent);
    checkCondition(`skill workflow exists ${skill.id}`, workflowIds.has(skill.defaultWorkflow), skill.defaultWorkflow);
  }

  for (const workflow of manifest.workflows) {
    await check(`workflow ${workflow.id}`, path.join(repoRoot, workflow.path));
    await checkContains(`workflow index mentions ${workflow.id}`, path.join(repoRoot, "workflows", "README.md"), workflow.path.replace("workflows/", ""));
  }

  for (const route of manifest.routes) {
    checkCondition(`route skill exists ${route.taskType}`, skillIds.has(route.skill), route.skill);
    checkCondition(`route agent exists ${route.taskType}`, agentIds.has(route.agent), route.agent);
    checkCondition(`route workflow exists ${route.taskType}`, workflowIds.has(route.workflow), route.workflow);
    await checkContains(`routing table skill ${route.skill}`, skillRoutingPath, route.skill);
    await checkContains(`routing table agent ${route.agent}`, skillRoutingPath, routeAgentName(manifest, route.agent));
    await checkContains(`routing table workflow ${route.workflow}`, skillRoutingPath, route.workflow);
  }

  for (const fileName of manifest.projectTemplate.requiredFiles) {
    await check(`project template ${fileName}`, path.join(repoRoot, manifest.projectTemplate.path, fileName));
  }

  for (const profile of manifest.projectProfiles ?? []) {
    await check(`project profile ${profile.id}`, path.join(repoRoot, profile.path));
    for (const fileName of profile.requiredFiles ?? []) {
      await check(`project profile ${profile.id}/${fileName}`, path.join(repoRoot, profile.path, fileName));
    }
  }

  for (const fileName of manifest.requiredAssets ?? []) {
    await check(`required asset ${fileName}`, path.join(repoRoot, fileName));
  }

  if (manifest.hermes) {
    await check("hermes registry", path.join(repoRoot, manifest.hermes.registryPath));
    await check("hermes sync policy", path.join(repoRoot, manifest.hermes.syncPolicyPath));
    await check("hermes sync record template", path.join(repoRoot, manifest.hermes.syncRecordTemplatePath));
  }

  await check("gemini support assets", geminiRoot);
  await check("gemini support skills", path.join(geminiRoot, "skills"));
  await check("gemini support workflows", path.join(geminiRoot, "workflows"));
  await check("gemini support manifest", path.join(geminiRoot, "runtime", "archsight-aios.manifest.json"));
  await check("gemini support governance", path.join(geminiRoot, "governance"));
  await check("gemini support delivery", path.join(geminiRoot, "delivery"));
  await check("gemini support memory", path.join(geminiRoot, "memory"));
  await check("codex skills root", path.join(home, ".codex", "skills"));
  await check("codex workflows root", path.join(home, ".codex", "workflows", "aios"));
  await check("gemini instructions", path.join(home, ".gemini", "GEMINI.md"));
  await checkContains("gemini managed block", path.join(home, ".gemini", "GEMINI.md"), managedStart);

  const useAntigravityLegacy = await exists(antigravityLegacyRoot());
  const useAntigravityPlugin = !useAntigravityLegacy || await hasAntigravity2Config();
  if (useAntigravityLegacy) {
    await check("antigravity 1.x legacy skills root", antigravityLegacySkillsRoot());
  }
  if (useAntigravityPlugin) {
    await check("antigravity 2.x plugin root", antigravityPluginRoot());
    await checkContains("antigravity 2.x plugin manifest", path.join(antigravityPluginRoot(), "plugin.json"), antigravityPluginName);
  }

  for (const skill of manifest.skills) {
    const skillName = skill.id;
    const sourceDir = expectedSkillDir(skill);
    await check(`gemini support skill ${skillName}`, path.join(geminiRoot, sourceDir, "SKILL.md"));
    await check(`codex skill ${skillName}`, path.join(home, ".codex", "skills", skillName, "SKILL.md"));
    if (useAntigravityLegacy) {
      await check(`antigravity 1.x legacy skill ${skillName}`, path.join(antigravityLegacySkillsRoot(), skillName, "SKILL.md"));
    }
    if (useAntigravityPlugin) {
      await check(`antigravity 2.x plugin skill ${skillName}`, path.join(antigravityPluginRoot(), "skills", skillName, "SKILL.md"));
    }
  }

  for (const workflow of manifest.workflows) {
    const workflowFileName = path.basename(workflow.path);
    await check(`codex workflow ${workflow.id}`, path.join(home, ".codex", "workflows", "aios", workflowFileName));
  }

  const failed = checks.filter((item) => !item.ok);
  for (const item of checks) {
    console.log(`${item.ok ? "OK " : "MISS"} ${item.label}: ${item.targetPath}`);
  }

  if (failed.length > 0) {
    process.exitCode = 1;
    console.error(`Doctor failed: ${failed.length} missing check(s).`);
    return;
  }

  console.log("Doctor passed.");
}

async function initProject(options) {
  const templateRoot = path.join(repoRoot, "templates", "project-ai");
  const targetRoot = path.resolve(options.cwd);
  const manifest = await readManifest();
  const rootInstructionFiles = [
    "AGENTS.md",
    "AI_CODING_RULES.md",
    "CLAUDE.md",
    "GEMINI.md"
  ];
  const linkedInstructionFiles = [
    "AGENTS.md",
    "CLAUDE.md",
    "GEMINI.md"
  ];
  const aiFiles = [
    path.join(".ai", "ARCHSIGHT_AIOS_RULES.md"),
    path.join(".ai", "project-context.md"),
    path.join(".ai", "agent-routing.md"),
    path.join(".ai", "skills.md"),
    path.join(".ai", "workflows.md")
  ];
  const mode = await resolveInitProjectMode(options.mode ?? "auto", targetRoot, rootInstructionFiles, aiFiles);
  const files = mode === "ai-only"
    ? aiFiles
    : mode === "linked"
      ? aiFiles
    : mode === "full"
      ? [...rootInstructionFiles, ...aiFiles]
      : undefined;

  if (!files) {
    throw new Error(`Unsupported init mode: ${mode}`);
  }

  await ensureDir(targetRoot);

  for (const fileName of files) {
    const src = path.join(templateRoot, fileName);
    const dest = path.join(targetRoot, fileName);
    assertInside(dest, targetRoot);
    if (await exists(dest)) {
      console.log(`SKIP existing ${dest}`);
      continue;
    }
    await ensureDir(path.dirname(dest));
    await fs.copyFile(src, dest);
    console.log(`CREATE ${dest}`);
  }

  if (mode === "linked") {
    const block = projectInstructionBlock();
    for (const fileName of linkedInstructionFiles) {
      const src = path.join(templateRoot, fileName);
      const dest = path.join(targetRoot, fileName);
      assertInside(dest, targetRoot);
      if (!(await exists(dest))) {
        await ensureDir(path.dirname(dest));
        await fs.copyFile(src, dest);
        console.log(`CREATE ${dest}`);
        continue;
      }
      await upsertManagedBlock(dest, block);
      console.log(`LINK ${dest}`);
    }
  }

  if (options.profile) {
    const profile = manifest.projectProfiles?.find((item) => item.id === options.profile);
    if (!profile) {
      throw new Error(`Unsupported project profile: ${options.profile}`);
    }
    await copyTreeMissing(path.join(repoRoot, profile.path), targetRoot);
  }
}

async function validateProjectTemplate(options) {
  const manifest = await readManifest();
  const createdTemp = options.temp;
  const targetRoot = createdTemp
    ? await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-project-"))
    : path.resolve(options.cwd);

  if (createdTemp) {
    await fs.writeFile(path.join(targetRoot, "README.md"), "# ArchSight AIOS local validation\n", "utf8");
  }

  await initProject({ cwd: targetRoot, profile: options.profile });

  const checks = [];
  async function check(label, targetPath) {
    const ok = await exists(targetPath);
    checks.push({ label, targetPath, ok });
  }

  for (const fileName of manifest.projectTemplate.requiredFiles) {
    await check(`template output ${fileName}`, path.join(targetRoot, fileName));
  }

  await check("project skills doc", path.join(targetRoot, ".ai", "skills.md"));
  await check("project workflows doc", path.join(targetRoot, ".ai", "workflows.md"));

  const skillsDoc = await fs.readFile(path.join(targetRoot, ".ai", "skills.md"), "utf8");
  const workflowsDoc = await fs.readFile(path.join(targetRoot, ".ai", "workflows.md"), "utf8");

  for (const skill of manifest.skills) {
    checks.push({
      label: `project mentions skill ${skill.id}`,
      targetPath: ".ai/skills.md",
      ok: skillsDoc.includes(skill.id)
    });
  }

  for (const workflow of manifest.workflows) {
    checks.push({
      label: `project mentions workflow ${workflow.id}`,
      targetPath: ".ai/workflows.md",
      ok: workflowsDoc.includes(workflow.id)
    });
  }

  for (const [label, fileName] of [
    ["project AGENTS uses AIOS", "AGENTS.md"],
    ["project coding rules uses AIOS", "AI_CODING_RULES.md"],
    ["project AIOS rules uses AIOS", path.join(".ai", "ARCHSIGHT_AIOS_RULES.md")],
    ["project CLAUDE uses AIOS", "CLAUDE.md"],
    ["project GEMINI uses AIOS", "GEMINI.md"],
    ["project context uses AIOS", path.join(".ai", "project-context.md")]
  ]) {
    const content = await fs.readFile(path.join(targetRoot, fileName), "utf8");
    const legacyAiOsText = ["AI", "OS"].join(" ");
    checks.push({
      label,
      targetPath: fileName,
      ok: content.includes("AIOS") && !content.includes(legacyAiOsText)
    });
  }

  if (options.profile) {
    const profile = manifest.projectProfiles?.find((item) => item.id === options.profile);
    if (!profile) {
      throw new Error(`Unsupported project profile: ${options.profile}`);
    }
    for (const fileName of profile.requiredFiles ?? []) {
      await check(`profile output ${options.profile}/${fileName}`, path.join(targetRoot, fileName));
    }
  }

  const failed = checks.filter((item) => !item.ok);
  for (const item of checks) {
    console.log(`${item.ok ? "OK " : "MISS"} ${item.label}: ${item.targetPath}`);
  }

  if (createdTemp) {
    await fs.rm(targetRoot, { recursive: true, force: true });
  }

  if (failed.length > 0) {
    process.exitCode = 1;
    console.error(`Project template validation failed: ${failed.length} missing check(s).`);
    return;
  }

  console.log(`Project template validation passed${createdTemp ? " in a local temporary workspace" : ` for ${targetRoot}`}.`);
}

async function validateHermesRegistry() {
  const manifest = await readManifest();
  const registryPath = path.join(repoRoot, manifest.hermes?.registryPath ?? "runtime/hermes/agent-registry.md");
  const registry = await fs.readFile(registryPath, "utf8");
  const checks = [];

  for (const agent of manifest.agents) {
    checks.push({
      label: `registry mentions ${agent.displayName}`,
      ok: registry.includes(agent.displayName)
    });
    checks.push({
      label: `registry prompt ${agent.runtimePromptPath}`,
      ok: registry.includes(agent.runtimePromptPath)
    });
  }

  const failed = checks.filter((item) => !item.ok);
  for (const item of checks) {
    console.log(`${item.ok ? "OK " : "MISS"} ${item.label}`);
  }

  if (failed.length > 0) {
    process.exitCode = 1;
    console.error(`Hermes registry validation failed: ${failed.length} issue(s).`);
    return;
  }

  console.log("Hermes registry validation passed.");
}

async function hermesSyncDryRun() {
  const manifest = await readManifest();
  await validateHermesRegistry();
  if (process.exitCode) {
    return;
  }

  console.log("Hermes sync dry-run plan:");
  for (const agent of manifest.agents) {
    const promptPath = path.join(repoRoot, agent.runtimePromptPath);
    const prompt = await fs.readFile(promptPath, "utf8");
    console.log(`SYNC ${agent.displayName}: ${agent.runtimePromptPath} (${prompt.length} bytes)`);
  }
  console.log("Dry-run only: no Hermes API calls were made.");
}

async function hermesDetectDrift() {
  const manifest = await readManifest();
  const checks = [];

  for (const agent of manifest.agents) {
    const promptPath = path.join(repoRoot, agent.runtimePromptPath);
    const sourcePath = path.join(repoRoot, agent.sourcePath);
    const promptExists = await exists(promptPath);
    const sourceExists = await exists(sourcePath);
    checks.push({
      label: `${agent.displayName} source/runtime present`,
      ok: promptExists && sourceExists
    });
    if (promptExists) {
      const prompt = await fs.readFile(promptPath, "utf8");
      checks.push({
        label: `${agent.displayName} runtime prompt is non-empty and named`,
        ok: prompt.trim().length > 100 && prompt.includes(agent.displayName)
      });
    }
  }

  const failed = checks.filter((item) => !item.ok);
  for (const item of checks) {
    console.log(`${item.ok ? "OK " : "MISS"} ${item.label}`);
  }

  if (failed.length > 0) {
    process.exitCode = 1;
    console.error(`Hermes drift detection failed: ${failed.length} issue(s).`);
    return;
  }

  console.log("Hermes drift detection passed for repository-managed runtime prompts.");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options.command || options.help) {
    console.log(usage());
    return;
  }

  if (options.command === "install") {
    await install(options);
  } else if (options.command === "doctor") {
    await doctor();
  } else if (options.command === "init") {
    await initProject(options);
  } else if (options.command === "validate") {
    await validateProjectTemplate(options);
  } else if (options.command === "hermes:validate") {
    await validateHermesRegistry();
  } else if (options.command === "hermes:sync-dry-run") {
    await hermesSyncDryRun();
  } else if (options.command === "hermes:detect-drift") {
    await hermesDetectDrift();
  } else {
    throw new Error(`Unknown command: ${options.command}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
