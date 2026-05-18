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

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function testHelp() {
  const result = run(["--help"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /ArchSight AIOS/);
  assert.match(result.stdout, /archsight-aios doctor/);
  assert.doesNotMatch(result.stdout, new RegExp(["ai", "os"].join("-")));
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

  await assert.rejects(fs.access(legacyManifest));
}

async function testValidateProjectTemplate() {
  const result = run(["validate-project-template"]);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /Project template validation passed/);
}

async function testInitProjectIsIdempotent() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "archsight-aios-init-"));
  const agentsPath = path.join(tempRoot, "AGENTS.md");
  await fs.writeFile(agentsPath, "# Existing project instructions\n", "utf8");

  const first = run(["init-project", "--cwd", tempRoot]);
  assert.equal(first.status, 0, `${first.stdout}\n${first.stderr}`);
  assert.match(first.stdout, /SKIP existing/);

  const second = run(["init-project", "--cwd", tempRoot]);
  assert.equal(second.status, 0, `${second.stdout}\n${second.stderr}`);
  assert.match(second.stdout, /SKIP existing/);

  const agents = await fs.readFile(agentsPath, "utf8");
  assert.equal(agents, "# Existing project instructions\n");
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
  testUnknownCommand,
  testProductIdentity,
  testValidateProjectTemplate,
  testInitProjectIsIdempotent,
  testHermesCommands
];

for (const test of tests) {
  await test();
  console.log(`ok ${test.name}`);
}

console.log(`${tests.length} CLI test group(s) passed.`);
