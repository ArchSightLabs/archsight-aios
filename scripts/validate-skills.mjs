#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = fs.realpathSync(process.cwd());
const errors = [];

function repoPath(...parts) {
  const target = path.join(root, ...parts);
  const relative = path.relative(root, target);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Path traversal detected: ${target}`);
  }
  return target;
}

function readJson(relativePath) {
  const filePath = repoPath(relativePath);
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    errors.push(`${relativePath}: invalid JSON (${error.message})`);
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

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function parseFrontmatter(raw, file) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    errors.push(`${file}: missing frontmatter`);
    return {};
  }

  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (field) fields[field[1]] = field[2].trim();
  }
  return fields;
}

function check(condition, message) {
  if (!condition) errors.push(message);
}

const manifest = readJson("runtime/archsight-aios.manifest.json");
const packageJson = readJson("package.json");
const geminiExtension = readJson("gemini-extension.json");
const claudePlugin = readJson(".claude-plugin/plugin.json");
const claudeMarketplace = readJson(".claude-plugin/marketplace.json");

if (manifest) {
  const manifestSkillIds = new Set(manifest.skills.map((skill) => skill.id));
  const skillDirs = fs
    .readdirSync(repoPath("skills"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("aios-"))
    .map((entry) => entry.name)
    .sort();

  check(
    JSON.stringify([...manifestSkillIds].sort()) === JSON.stringify(skillDirs),
    "runtime/archsight-aios.manifest.json: skills must cover repository skill directories"
  );

  for (const skill of manifest.skills) {
    const skillFile = skill.path;
    const configFile = skill.openaiConfigPath;
    check(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(skill.id), `${skillFile}: skill id must be kebab-case`);
    check(exists(skillFile), `${skillFile}: missing`);
    check(exists(configFile), `${configFile}: missing`);

    const raw = readText(skillFile);
    const frontmatter = parseFrontmatter(raw, skillFile);
    check(frontmatter.name === skill.id, `${skillFile}: frontmatter name must be ${skill.id}`);
    check(Boolean(frontmatter.description), `${skillFile}: missing frontmatter description`);
  }

  for (const requiredAsset of manifest.requiredAssets ?? []) {
    check(exists(requiredAsset), `runtime/archsight-aios.manifest.json: required asset missing ${requiredAsset}`);
  }
}

if (packageJson) {
  const requiredFiles = ["skills/", "scripts/", ".claude-plugin/", "gemini-extension.json", "OPENCODE.md"];
  for (const requiredFile of requiredFiles) {
    check(packageJson.files?.includes(requiredFile), `package.json: files must include ${requiredFile}`);
  }

  const requiredKeywords = ["agent-skills", "skills-sh", "gemini-cli", "claude-code", "workbuddy", "opencode", "construction-ai"];
  for (const keyword of requiredKeywords) {
    check(packageJson.keywords?.includes(keyword), `package.json: keywords must include ${keyword}`);
  }

  check(
    packageJson.scripts?.["validate:skills"] === "node ./scripts/validate-skills.mjs",
    "package.json: missing validate:skills script"
  );
}

if (geminiExtension && packageJson) {
  check(geminiExtension.name === "archsight-aios", "gemini-extension.json: name must be archsight-aios");
  check(geminiExtension.version === packageJson.version, "gemini-extension.json: version must match package.json");
  check(geminiExtension.contextFileName === "GEMINI.md", "gemini-extension.json: contextFileName must be GEMINI.md");
}

if (claudePlugin && packageJson) {
  check(claudePlugin.name === "archsight-aios", ".claude-plugin/plugin.json: name must be archsight-aios");
  check(claudePlugin.version === packageJson.version, ".claude-plugin/plugin.json: version must match package.json");
  check(claudePlugin.skills === "./skills/", ".claude-plugin/plugin.json: skills must point to ./skills/");
}

if (claudeMarketplace) {
  const plugin = claudeMarketplace.plugins?.find((item) => item.name === "archsight-aios");
  check(Boolean(plugin), ".claude-plugin/marketplace.json: must include archsight-aios plugin");
  check(plugin?.skills === "./skills/", ".claude-plugin/marketplace.json: skills must point to ./skills/");
}

if (errors.length > 0) {
  console.error(`Skill validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Skill validation passed.");
