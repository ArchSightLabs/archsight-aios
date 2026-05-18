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
const assetFiles = ["README.md", "AI_CODING_RULES.md", "AGENTS.md", "GEMINI.md"];

function usage() {
  return [
    "ArchSight AIOS",
    "",
    "Usage:",
    "  archsight-aios install --target <codex|gemini|antigravity|all> --scope user",
    "  archsight-aios doctor",
    "  archsight-aios init-project [--cwd <path>]",
    "  archsight-aios validate-project-template [--cwd <path>]",
    "  archsight-aios hermes:validate",
    "  archsight-aios hermes:sync-dry-run",
    "  archsight-aios hermes:detect-drift",
    "",
    "Examples:",
    "  npx @archsight/aios install --target codex --scope user",
    "  npx @archsight/aios doctor"
  ].join("\n");
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = {
    command: command === "--help" || command === "-h" ? undefined : command,
    target: "all",
    scope: "user",
    cwd: process.cwd(),
    help: command === "--help" || command === "-h"
  };

  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    if (arg === "--target") {
      options.target = rest[++i];
    } else if (arg === "--scope") {
      options.scope = rest[++i];
    } else if (arg === "--cwd") {
      options.cwd = path.resolve(rest[++i]);
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

async function listArchSightSkills() {
  const manifest = await readManifest();
  if (manifest?.skills?.length > 0) {
    return manifest.skills.map((skill) => skill.id).sort();
  }

  const skillsRoot = path.join(repoRoot, "skills");
  const entries = await fs.readdir(skillsRoot, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("archsight-"))
    .map((entry) => entry.name)
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

function expectedSkillDir(skill) {
  return path.dirname(skill.path);
}

async function syncAssetStore() {
  const storeRoot = path.join(home, ".archsight-aios");
  await ensureDir(storeRoot);

  for (const dirName of assetDirs) {
    await copyDir(path.join(repoRoot, dirName), path.join(storeRoot, dirName));
  }

  for (const fileName of assetFiles) {
    await copyFileIfExists(path.join(repoRoot, fileName), path.join(storeRoot, fileName));
  }

  return storeRoot;
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

function userInstructionBlock(storeRoot) {
  const p = (value) => value.replaceAll("\\", "/");
  return [
    managedStart,
    "# ArchSight AIOS",
    "",
    "ArchSight AIOS is installed at:",
    "",
    `- ${p(storeRoot)}`,
    "",
    "When a task matches ArchSight AIOS, read the relevant installed assets before answering:",
    "",
    `- Skills: ${p(path.join(storeRoot, "skills"))}`,
    `- Workflows: ${p(path.join(storeRoot, "workflows"))}`,
    `- Runtime routing: ${p(path.join(storeRoot, "runtime"))}`,
    `- Project template: ${p(path.join(storeRoot, "templates", "project-ai"))}`,
    "",
    "Use `archsight-*` skills for architecture review, delivery planning, code review, BIM domain modeling, AI runtime design, and controlled execution.",
    "Keep Agent, Skill, Workflow, and Runtime boundaries separate.",
    "Do not claim code changes, tests, builds, or deployments were completed unless verified in the bound project workspace.",
    managedEnd,
    ""
  ].join("\n");
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

  const validTargets = new Set(["codex", "gemini", "antigravity", "all"]);
  if (!validTargets.has(options.target)) {
    throw new Error(`Unsupported target: ${options.target}`);
  }

  const storeRoot = await syncAssetStore();
  const skillNames = await listArchSightSkills();
  const targets = options.target === "all"
    ? ["codex", "gemini", "antigravity"]
    : [options.target];

  const installed = [];

  if (targets.includes("codex")) {
    await installSkillsTo(path.join(home, ".codex", "skills"), skillNames);
    await installSkillsTo(path.join(home, ".agents", "skills"), skillNames);
    installed.push("codex skills", "shared agent skills");
  }

  if (targets.includes("gemini")) {
    await upsertManagedBlock(path.join(home, ".gemini", "GEMINI.md"), userInstructionBlock(storeRoot));
    installed.push("gemini user instructions");
  }

  if (targets.includes("antigravity")) {
    await upsertManagedBlock(
      path.join(home, ".antigravity", "ARCHSIGHT_AIOS.md"),
      userInstructionBlock(storeRoot)
    );
    installed.push("antigravity user instructions");
  }

  console.log(`Installed ArchSight AIOS assets to ${storeRoot}`);
  console.log(`Installed: ${installed.join(", ")}`);
  console.log(`Skills: ${skillNames.join(", ")}`);
}

async function doctor() {
  const manifest = await readManifest();
  const storeRoot = path.join(home, ".archsight-aios");
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

  for (const fileName of manifest.requiredAssets ?? []) {
    await check(`required asset ${fileName}`, path.join(repoRoot, fileName));
  }

  if (manifest.hermes) {
    await check("hermes registry", path.join(repoRoot, manifest.hermes.registryPath));
    await check("hermes sync policy", path.join(repoRoot, manifest.hermes.syncPolicyPath));
    await check("hermes sync record template", path.join(repoRoot, manifest.hermes.syncRecordTemplatePath));
  }

  await check("asset store", storeRoot);
  await check("asset skills", path.join(storeRoot, "skills"));
  await check("asset workflows", path.join(storeRoot, "workflows"));
  await check("asset manifest", path.join(storeRoot, "runtime", "archsight-aios.manifest.json"));
  await check("asset governance", path.join(storeRoot, "governance"));
  await check("asset delivery", path.join(storeRoot, "delivery"));
  await check("asset memory", path.join(storeRoot, "memory"));
  await check("codex skills root", path.join(home, ".codex", "skills"));
  await check("shared skills root", path.join(home, ".agents", "skills"));
  await check("gemini instructions", path.join(home, ".gemini", "GEMINI.md"));
  await check("antigravity instructions", path.join(home, ".antigravity", "ARCHSIGHT_AIOS.md"));
  await checkContains("gemini managed block", path.join(home, ".gemini", "GEMINI.md"), managedStart);
  await checkContains("antigravity managed block", path.join(home, ".antigravity", "ARCHSIGHT_AIOS.md"), managedStart);

  for (const skill of manifest.skills) {
    const skillName = skill.id;
    const sourceDir = expectedSkillDir(skill);
    await check(`asset skill ${skillName}`, path.join(storeRoot, sourceDir, "SKILL.md"));
    await check(`codex skill ${skillName}`, path.join(home, ".codex", "skills", skillName, "SKILL.md"));
    await check(`shared skill ${skillName}`, path.join(home, ".agents", "skills", skillName, "SKILL.md"));
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
  const files = [
    "AGENTS.md",
    "GEMINI.md",
    path.join(".ai", "project-context.md"),
    path.join(".ai", "agent-routing.md"),
    path.join(".ai", "skills.md"),
    path.join(".ai", "workflows.md")
  ];

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
}

async function validateProjectTemplate(options) {
  const manifest = await readManifest();
  const createdTemp = !options.cwd || options.cwd === process.cwd();
  const targetRoot = createdTemp
    ? await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-project-"))
    : path.resolve(options.cwd);

  if (createdTemp) {
    await fs.writeFile(path.join(targetRoot, "README.md"), "# ArchSight AIOS local validation\n", "utf8");
  }

  await initProject({ cwd: targetRoot });

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
  } else if (options.command === "init-project") {
    await initProject(options);
  } else if (options.command === "validate-project-template") {
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
