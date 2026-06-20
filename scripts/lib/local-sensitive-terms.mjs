import fs from "node:fs";
import path from "node:path";

const LOCAL_TERM_FILES = [
  ".env",
  ".aios-sensitive-terms.local",
  ".env.local",
  ".env.sensitive.local"
];

function parseTermList(value) {
  if (typeof value !== "string") return [];
  return value
    .split(/[\n,;]+/)
    .map((term) => term.trim())
    .filter((term) => term.length > 0 && !term.startsWith("#"));
}

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return [];
  const separatorIndex = trimmed.indexOf("=");
  if (separatorIndex === -1) return parseTermList(trimmed);

  const key = trimmed.slice(0, separatorIndex).trim();
  const rawValue = trimmed.slice(separatorIndex + 1).trim();
  if (key !== "AIOS_SENSITIVE_TERMS") return [];

  const unquoted = rawValue.replace(/^['"]|['"]$/g, "");
  return parseTermList(unquoted);
}

function readLocalTermFile(filePath) {
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, "utf8");
  return parseLocalTermContent(content);
}

function parseLocalTermContent(content) {
  return content
    .split(/\r?\n/)
    .flatMap((line) => parseEnvLine(line));
}

export function loadLocalSensitiveTerms(root = process.cwd(), env = process.env) {
  const terms = new Set(parseTermList(env.AIOS_SENSITIVE_TERMS));

  for (const fileName of LOCAL_TERM_FILES) {
    for (const term of readLocalTermFile(path.join(root, fileName))) {
      terms.add(term);
    }
  }

  return [...terms];
}

export function findSensitiveTerms(value, terms) {
  if (!Array.isArray(terms) || terms.length === 0) return [];
  const raw = typeof value === "string" ? value : JSON.stringify(value);
  return terms.filter((term) => raw.includes(term));
}
