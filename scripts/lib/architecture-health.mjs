import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const VERSION = "0.1";
const MODES = new Set(["commit", "weekly", "milestone"]);
const EVIDENCE_CLASSES = new Set(["measured", "inferred", "unverified"]);
const EVIDENCE_RANK = { unverified: 0, inferred: 1, measured: 2 };
const SEVERITY_RANK = { note: 0, P2: 1, P1: 2, P0: 3 };
const INVESTIGATION_ONLY_METRICS = new Set([
  "file.lines",
  "function.lines",
  "dependency.fan_in",
  "dependency.fan_out"
]);

function stableSort(value) {
  if (Array.isArray(value)) {
    return value.map(stableSort);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, stableSort(value[key])])
    );
  }
  return value;
}

function stableJson(value) {
  return `${JSON.stringify(stableSort(value), null, 2)}\n`;
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function normalizeRelativePath(value) {
  if (!value) return undefined;
  const normalized = path.posix.normalize(value.replaceAll("\\", "/")).replace(/^\.\/+/, "");
  if (
    path.posix.isAbsolute(normalized)
    || /^[A-Za-z]:\//.test(normalized)
    || normalized === ".."
    || normalized.startsWith("../")
  ) {
    throw new Error(`Architecture-health paths must be repository-relative: ${value}`);
  }
  return normalized;
}

function requireObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function rejectUnknown(value, allowed, label) {
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) {
      throw new Error(`${label}.${key} is not supported`);
    }
  }
}

function requireString(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function requireIsoDate(value, label) {
  requireString(value, label);
  if (!/^\d{4}-\d{2}-\d{2}T/.test(value) || !Number.isFinite(Date.parse(value))) {
    throw new Error(`${label} must be an ISO date-time`);
  }
}

function validateModes(modes, label) {
  if (!Array.isArray(modes) || modes.length === 0 || modes.some((mode) => !MODES.has(mode))) {
    throw new Error(`${label} must contain valid modes`);
  }
  if (new Set(modes).size !== modes.length) throw new Error(`${label} must not contain duplicates`);
}

function validateLocation(location, label) {
  requireObject(location, label);
  rejectUnknown(location, new Set(["path", "line", "symbol"]), label);
  location.path = normalizeRelativePath(location.path);
  requireString(location.path, `${label}.path`);
  if (location.line !== undefined && (!Number.isInteger(location.line) || location.line < 1)) {
    throw new Error(`${label}.line must be a positive integer`);
  }
  if (location.symbol !== undefined) requireString(location.symbol, `${label}.symbol`);
}

export function validateArchitectureHealthProfile(profile) {
  requireObject(profile, "profile");
  rejectUnknown(profile, new Set([
    "schemaVersion", "id", "version", "allowBootstrap", "rules", "dependencyPolicy",
    "requiredEvidence", "budgets", "analyzers"
  ]), "profile");
  if (profile.schemaVersion !== VERSION) throw new Error(`profile.schemaVersion must be ${VERSION}`);
  requireString(profile.id, "profile.id");
  requireString(profile.version, "profile.version");
  if (profile.allowBootstrap !== undefined && typeof profile.allowBootstrap !== "boolean") {
    throw new Error("profile.allowBootstrap must be boolean");
  }
  if (!Array.isArray(profile.rules)) throw new Error("profile.rules must be an array");
  const ruleIds = new Set();
  for (const [index, rule] of profile.rules.entries()) {
    const label = `profile.rules[${index}]`;
    requireObject(rule, label);
    rejectUnknown(rule, new Set([
      "id", "dimension", "metric", "operator", "threshold", "severity", "gate", "modes", "message"
    ]), label);
    requireString(rule.id, `${label}.id`);
    if (ruleIds.has(rule.id)) throw new Error(`Duplicate rule id: ${rule.id}`);
    ruleIds.add(rule.id);
    requireString(rule.dimension, `${label}.dimension`);
    requireString(rule.metric, `${label}.metric`);
    if (!["greaterThan", "greaterThanOrEqual", "lessThan", "lessThanOrEqual", "equals"].includes(rule.operator)) {
      throw new Error(`${label}.operator is not supported`);
    }
    if (!["number", "string", "boolean"].includes(typeof rule.threshold)) {
      throw new Error(`${label}.threshold must be scalar`);
    }
    if (!Object.hasOwn(SEVERITY_RANK, rule.severity)) throw new Error(`${label}.severity is invalid`);
    if (typeof rule.gate !== "boolean") throw new Error(`${label}.gate must be boolean`);
    if (rule.gate && INVESTIGATION_ONLY_METRICS.has(rule.metric)) {
      throw new Error(`${label}.metric ${rule.metric} is investigation-only and cannot be a hard gate`);
    }
    validateModes(rule.modes, `${label}.modes`);
    requireString(rule.message, `${label}.message`);
  }

  const dependencyPolicy = profile.dependencyPolicy ?? {};
  requireObject(dependencyPolicy, "profile.dependencyPolicy");
  rejectUnknown(dependencyPolicy, new Set(["cycles", "forbiddenDirections"]), "profile.dependencyPolicy");
  if (dependencyPolicy.cycles) {
    const label = "profile.dependencyPolicy.cycles";
    rejectUnknown(dependencyPolicy.cycles, new Set(["severity", "gate", "modes"]), label);
    if (!Object.hasOwn(SEVERITY_RANK, dependencyPolicy.cycles.severity)) {
      throw new Error(`${label}.severity is invalid`);
    }
    if (typeof dependencyPolicy.cycles.gate !== "boolean") {
      throw new Error(`${label}.gate must be boolean`);
    }
    validateModes(dependencyPolicy.cycles.modes, `${label}.modes`);
  }
  if (!Array.isArray(dependencyPolicy.forbiddenDirections ?? [])) {
    throw new Error("profile.dependencyPolicy.forbiddenDirections must be an array");
  }
  const directionIds = new Set();
  for (const [index, direction] of (dependencyPolicy.forbiddenDirections ?? []).entries()) {
    const label = `profile.dependencyPolicy.forbiddenDirections[${index}]`;
    requireObject(direction, label);
    rejectUnknown(direction, new Set(["id", "from", "to", "severity", "gate", "modes"]), label);
    for (const field of ["id", "from", "to", "severity"]) requireString(direction[field], `${label}.${field}`);
    if (directionIds.has(direction.id)) throw new Error(`Duplicate forbidden direction id: ${direction.id}`);
    directionIds.add(direction.id);
    if (!Object.hasOwn(SEVERITY_RANK, direction.severity)) throw new Error(`${label}.severity is invalid`);
    if (typeof direction.gate !== "boolean") throw new Error(`${label}.gate must be boolean`);
    validateModes(direction.modes, `${label}.modes`);
  }

  if (!Object.hasOwn(profile, "requiredEvidence")) throw new Error("profile.requiredEvidence is required");
  requireObject(profile.requiredEvidence, "profile.requiredEvidence");
  rejectUnknown(profile.requiredEvidence, MODES, "profile.requiredEvidence");
  for (const mode of MODES) {
    const required = profile.requiredEvidence?.[mode] ?? [];
    if (!Array.isArray(required) || required.some((item) => typeof item !== "string" || item.trim().length === 0)) {
      throw new Error(`profile.requiredEvidence.${mode} must be a string array`);
    }
    if (new Set(required).size !== required.length) {
      throw new Error(`profile.requiredEvidence.${mode} must not contain duplicates`);
    }
  }

  if (!Object.hasOwn(profile, "budgets") || !Array.isArray(profile.budgets)) {
    throw new Error("profile.budgets must be an array");
  }
  const budgetIds = new Set();
  for (const [index, budget] of (profile.budgets ?? []).entries()) {
    const label = `profile.budgets[${index}]`;
    requireObject(budget, label);
    rejectUnknown(budget, new Set(["id", "ruleId", "scope", "owner", "reason", "ceiling", "expiresAt"]), label);
    for (const field of ["id", "ruleId", "scope", "owner", "reason", "expiresAt"]) {
      requireString(budget[field], `${label}.${field}`);
    }
    if (budgetIds.has(budget.id)) throw new Error(`Duplicate budget id: ${budget.id}`);
    budgetIds.add(budget.id);
    if (!ruleIds.has(budget.ruleId) && !budget.ruleId.startsWith("dependency.")) {
      throw new Error(`${label}.ruleId does not reference a known rule`);
    }
    if (!Number.isInteger(budget.ceiling) || budget.ceiling < 1) {
      throw new Error(`${label}.ceiling must be a positive integer`);
    }
    requireIsoDate(budget.expiresAt, `${label}.expiresAt`);
  }

  if (!Array.isArray(profile.analyzers ?? [])) throw new Error("profile.analyzers must be an array");
  const analyzerIds = new Set();
  for (const [index, analyzer] of (profile.analyzers ?? []).entries()) {
    const label = `profile.analyzers[${index}]`;
    requireObject(analyzer, label);
    rejectUnknown(analyzer, new Set(["id", "command", "args", "cwd", "modes", "required", "timeoutMs"]), label);
    requireString(analyzer.id, `${label}.id`);
    if (analyzerIds.has(analyzer.id)) throw new Error(`Duplicate analyzer id: ${analyzer.id}`);
    analyzerIds.add(analyzer.id);
    requireString(analyzer.command, `${label}.command`);
    if (!Array.isArray(analyzer.args ?? []) || (analyzer.args ?? []).some((item) => typeof item !== "string")) {
      throw new Error(`${label}.args must be a string array`);
    }
    validateModes(analyzer.modes, `${label}.modes`);
    if (typeof analyzer.required !== "boolean") throw new Error(`${label}.required must be boolean`);
    if (analyzer.timeoutMs !== undefined && (!Number.isInteger(analyzer.timeoutMs) || analyzer.timeoutMs < 1)) {
      throw new Error(`${label}.timeoutMs must be a positive integer`);
    }
    if (analyzer.cwd !== undefined) normalizeRelativePath(analyzer.cwd);
  }
  return profile;
}

export function validateArchitectureHealthInput(input) {
  requireObject(input, "input");
  rejectUnknown(input, new Set([
    "schemaVersion", "repository", "observedAt", "observations", "dependencies", "evidence", "analyzers"
  ]), "input");
  if (input.schemaVersion !== VERSION) throw new Error(`input.schemaVersion must be ${VERSION}`);
  requireObject(input.repository, "input.repository");
  rejectUnknown(input.repository, new Set(["id", "commit"]), "input.repository");
  requireString(input.repository.id, "input.repository.id");
  requireString(input.repository.commit, "input.repository.commit");
  requireIsoDate(input.observedAt, "input.observedAt");
  if (!Array.isArray(input.observations)) throw new Error("input.observations must be an array");
  if (!Array.isArray(input.dependencies)) throw new Error("input.dependencies must be an array");
  if (!Array.isArray(input.evidence)) throw new Error("input.evidence must be an array");
  const observationIds = new Set();
  for (const [index, observation] of input.observations.entries()) {
    const label = `input.observations[${index}]`;
    requireObject(observation, label);
    rejectUnknown(observation, new Set([
      "id", "dimension", "metric", "value", "unit", "evidenceClass", "location", "message", "source", "context"
    ]), label);
    for (const field of ["id", "dimension", "metric", "evidenceClass", "message", "source"]) {
      requireString(observation[field], `${label}.${field}`);
    }
    if (observationIds.has(observation.id)) throw new Error(`Duplicate observation id: ${observation.id}`);
    observationIds.add(observation.id);
    if (!EVIDENCE_CLASSES.has(observation.evidenceClass)) throw new Error(`${label}.evidenceClass is invalid`);
    if (!["number", "string", "boolean"].includes(typeof observation.value)) {
      throw new Error(`${label}.value must be scalar`);
    }
    if (observation.unit !== undefined && typeof observation.unit !== "string") {
      throw new Error(`${label}.unit must be a string`);
    }
    if (observation.location) validateLocation(observation.location, `${label}.location`);
    if (observation.context !== undefined) {
      requireObject(observation.context, `${label}.context`);
      rejectUnknown(observation.context, new Set([
        "environment", "dataset", "conditions", "sampleSize", "databaseVersion", "hardware"
      ]), `${label}.context`);
      for (const field of ["environment", "dataset", "conditions", "databaseVersion", "hardware"]) {
        if (observation.context[field] !== undefined && typeof observation.context[field] !== "string") {
          throw new Error(`${label}.context.${field} must be a string`);
        }
      }
      if (
        observation.context.sampleSize !== undefined
        && (!Number.isInteger(observation.context.sampleSize) || observation.context.sampleSize < 1)
      ) {
        throw new Error(`${label}.context.sampleSize must be a positive integer`);
      }
    }
    if (observation.evidenceClass === "measured" && observation.metric.startsWith("performance.")) {
      for (const field of ["environment", "dataset", "conditions"]) {
        requireString(observation.context?.[field], `${label}.context.${field}`);
      }
    }
  }
  for (const [index, edge] of input.dependencies.entries()) {
    const label = `input.dependencies[${index}]`;
    requireObject(edge, label);
    rejectUnknown(edge, new Set(["from", "to", "fromLayer", "toLayer", "evidenceClass", "source"]), label);
    for (const field of ["from", "to", "fromLayer", "toLayer", "evidenceClass", "source"]) {
      requireString(edge[field], `${label}.${field}`);
    }
    edge.from = normalizeRelativePath(edge.from);
    edge.to = normalizeRelativePath(edge.to);
    if (!EVIDENCE_CLASSES.has(edge.evidenceClass)) throw new Error(`${label}.evidenceClass is invalid`);
  }
  const evidenceIds = new Set();
  for (const [index, evidence] of input.evidence.entries()) {
    const label = `input.evidence[${index}]`;
    requireObject(evidence, label);
    rejectUnknown(evidence, new Set(["id", "status", "evidenceClass", "details"]), label);
    requireString(evidence.id, `${label}.id`);
    if (evidenceIds.has(evidence.id)) throw new Error(`Duplicate evidence id: ${evidence.id}`);
    evidenceIds.add(evidence.id);
    if (!["available", "missing", "failed"].includes(evidence.status)) throw new Error(`${label}.status is invalid`);
    if (!EVIDENCE_CLASSES.has(evidence.evidenceClass)) throw new Error(`${label}.evidenceClass is invalid`);
    if (evidence.details !== undefined && typeof evidence.details !== "string") {
      throw new Error(`${label}.details must be a string`);
    }
  }
  for (const [index, analyzer] of (input.analyzers ?? []).entries()) {
    const label = `input.analyzers[${index}]`;
    requireObject(analyzer, label);
    rejectUnknown(analyzer, new Set(["id", "required", "status", "error"]), label);
    requireString(analyzer.id, `${label}.id`);
    if (typeof analyzer.required !== "boolean") throw new Error(`${label}.required must be boolean`);
    if (!["pass", "failed"].includes(analyzer.status)) throw new Error(`${label}.status is invalid`);
    if (analyzer.error !== undefined) requireString(analyzer.error, `${label}.error`);
  }
  return input;
}

function compare(operator, actual, threshold) {
  if (operator === "greaterThan") return actual > threshold;
  if (operator === "greaterThanOrEqual") return actual >= threshold;
  if (operator === "lessThan") return actual < threshold;
  if (operator === "lessThanOrEqual") return actual <= threshold;
  if (operator === "equals") return actual === threshold;
  return false;
}

function findingFingerprint({ ruleId, location, key }) {
  return sha256([ruleId, location?.path ?? "", location?.symbol ?? "", key ?? ""].join("\0"));
}

export function findDependencyCycles(edges) {
  const graph = new Map();
  for (const edge of edges) {
    if (!graph.has(edge.from)) graph.set(edge.from, []);
    graph.get(edge.from).push(edge.to);
    if (!graph.has(edge.to)) graph.set(edge.to, []);
  }
  for (const targets of graph.values()) targets.sort();
  let nextIndex = 0;
  const indices = new Map();
  const lowLinks = new Map();
  const stack = [];
  const onStack = new Set();
  const components = [];
  function connect(node) {
    indices.set(node, nextIndex);
    lowLinks.set(node, nextIndex);
    nextIndex += 1;
    stack.push(node);
    onStack.add(node);
    for (const target of graph.get(node) ?? []) {
      if (!indices.has(target)) {
        connect(target);
        lowLinks.set(node, Math.min(lowLinks.get(node), lowLinks.get(target)));
      } else if (onStack.has(target)) {
        lowLinks.set(node, Math.min(lowLinks.get(node), indices.get(target)));
      }
    }
    if (lowLinks.get(node) !== indices.get(node)) return;
    const component = [];
    let member;
    do {
      member = stack.pop();
      onStack.delete(member);
      component.push(member);
    } while (member !== node);
    const selfLoop = component.length === 1 && (graph.get(component[0]) ?? []).includes(component[0]);
    if (component.length > 1 || selfLoop) components.push(component.sort());
  }
  for (const node of [...graph.keys()].sort()) {
    if (!indices.has(node)) connect(node);
  }
  return components.sort((left, right) => left.join("\0").localeCompare(right.join("\0")));
}

function normalizeDependencies(edges) {
  const grouped = new Map();
  for (const edge of edges) {
    const key = [edge.from, edge.to, edge.fromLayer, edge.toLayer].join("\0");
    const existing = grouped.get(key);
    if (!existing) {
      grouped.set(key, { ...edge });
      continue;
    }
    if (EVIDENCE_RANK[edge.evidenceClass] > EVIDENCE_RANK[existing.evidenceClass]) {
      existing.evidenceClass = edge.evidenceClass;
    }
    existing.source = [...new Set([...existing.source.split(" | "), edge.source])].sort().join(" | ");
  }
  return [...grouped.values()].sort((left, right) => (
    [left.from, left.to, left.fromLayer, left.toLayer].join("\0")
      .localeCompare([right.from, right.to, right.fromLayer, right.toLayer].join("\0"))
  ));
}

function scopeMatches(scope, filePath) {
  if (scope === "*") return true;
  const escaped = scope
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replaceAll("**", "§§")
    .replaceAll("*", "[^/]*")
    .replaceAll("§§", ".*");
  return new RegExp(`^${escaped}$`).test(filePath ?? "");
}

function buildFindings(profile, input, mode) {
  const findings = [];
  for (const rule of profile.rules.filter((item) => item.modes.includes(mode))) {
    for (const observation of input.observations.filter((item) => item.metric === rule.metric)) {
      if (!compare(rule.operator, observation.value, rule.threshold)) continue;
      findings.push({
        fingerprint: findingFingerprint({
          ruleId: rule.id,
          location: observation.location,
          key: observation.id
        }),
        ruleId: rule.id,
        dimension: rule.dimension,
        severity: rule.severity,
        evidenceClass: observation.evidenceClass,
        gateEligible: rule.gate,
        status: "new",
        message: `${rule.message}: ${observation.message}`,
        location: observation.location,
        metric: {
          name: observation.metric,
          value: observation.value,
          unit: observation.unit,
          threshold: rule.threshold,
          operator: rule.operator
        },
        source: observation.source
      });
    }
  }

  const cyclePolicy = profile.dependencyPolicy?.cycles;
  const cycles = findDependencyCycles(input.dependencies);
  if (cyclePolicy?.modes?.includes(mode)) {
    for (const cycle of cycles) {
      const edgeEvidence = input.dependencies
        .filter((edge) => cycle.includes(edge.from) && cycle.includes(edge.to))
        .map((edge) => edge.evidenceClass);
      const evidenceClass = edgeEvidence.every((item) => item === "measured") ? "measured" : "inferred";
      findings.push({
        fingerprint: findingFingerprint({ ruleId: "dependency.cycle", key: cycle.join(" -> ") }),
        ruleId: "dependency.cycle",
        dimension: "dependencies",
        severity: cyclePolicy.severity,
        evidenceClass,
        gateEligible: cyclePolicy.gate,
        status: "new",
        message: `Dependency cycle group: ${cycle.join(", ")}`,
        location: { path: cycle[0] },
        metric: { name: "dependency.cycle", value: cycle.length, unit: "nodes" },
        source: "architecture-health.dependency-graph"
      });
    }
  }

  for (const direction of (profile.dependencyPolicy?.forbiddenDirections ?? [])
    .filter((item) => item.modes.includes(mode))) {
    for (const edge of input.dependencies.filter(
      (item) => item.fromLayer === direction.from && item.toLayer === direction.to
    )) {
      findings.push({
        fingerprint: findingFingerprint({
          ruleId: `dependency.direction.${direction.id}`,
          location: { path: edge.from },
          key: edge.to
        }),
        ruleId: `dependency.direction.${direction.id}`,
        dimension: "dependencies",
        severity: direction.severity,
        evidenceClass: edge.evidenceClass,
        gateEligible: direction.gate,
        status: "new",
        message: `Forbidden dependency direction ${direction.from} -> ${direction.to}: ${edge.from} -> ${edge.to}`,
        location: { path: edge.from },
        metric: { name: "dependency.direction", value: `${direction.from}->${direction.to}` },
        source: edge.source
      });
    }
  }
  findings.sort((left, right) => left.fingerprint.localeCompare(right.fingerprint));
  return { findings, cycles };
}

function violationMagnitude(metric) {
  if (typeof metric?.value !== "number" || typeof metric?.threshold !== "number") return undefined;
  if (metric.operator === "greaterThan" || metric.operator === "greaterThanOrEqual") {
    return metric.value - metric.threshold;
  }
  if (metric.operator === "lessThan" || metric.operator === "lessThanOrEqual") {
    return metric.threshold - metric.value;
  }
  return metric.value === metric.threshold ? 1 : 0;
}

function applyBaseline(findings, baseline, repository, profileDigest, mode, allowBootstrap) {
  if (!baseline) {
    const hold = mode === "commit" && !allowBootstrap;
    return {
      findings,
      resolved: [],
      compatibility: hold ? "missing" : "bootstrap",
      holdReason: hold ? "Commit mode requires a compatible baseline" : undefined
    };
  }
  if (baseline.schemaVersion !== VERSION || baseline.type !== "archsight-aios.architecture-health") {
    return { findings, resolved: [], compatibility: "mismatch", holdReason: "Baseline schema is incompatible" };
  }
  if (baseline.run?.repository?.id !== repository.id || baseline.run?.profileDigest !== profileDigest) {
    return { findings, resolved: [], compatibility: "mismatch", holdReason: "Baseline repository or profile does not match" };
  }
  const prior = new Map((baseline.findings ?? []).map((item) => [item.fingerprint, item]));
  for (const finding of findings) {
    const before = prior.get(finding.fingerprint);
    if (!before) continue;
    prior.delete(finding.fingerprint);
    const severityWorse = SEVERITY_RANK[finding.severity] > SEVERITY_RANK[before.severity];
    const currentValue = finding.metric?.value;
    const previousValue = before.metric?.value;
    const currentMagnitude = violationMagnitude(finding.metric);
    const previousMagnitude = violationMagnitude(before.metric);
    const numericWorse = currentMagnitude !== undefined
      && previousMagnitude !== undefined
      && currentMagnitude > previousMagnitude;
    const numericImproved = currentMagnitude !== undefined
      && previousMagnitude !== undefined
      && currentMagnitude < previousMagnitude;
    finding.status = severityWorse || numericWorse ? "worsened" : numericImproved ? "improved" : "retained";
    finding.baseline = {
      severity: before.severity,
      value: previousValue
    };
  }
  const resolved = [...prior.values()]
    .map((item) => ({
      fingerprint: item.fingerprint,
      ruleId: item.ruleId,
      severity: item.severity,
      status: "resolved",
      message: item.message,
      location: item.location
    }))
    .sort((left, right) => left.fingerprint.localeCompare(right.fingerprint));
  return { findings, resolved, compatibility: "compatible" };
}

function applyBudgets(findings, budgets, observedAt) {
  const usage = new Map();
  const budgetResults = budgets.map((budget) => ({
    ...budget,
    status: Date.parse(budget.expiresAt) <= Date.parse(observedAt) ? "expired" : "available",
    consumed: 0,
    remaining: budget.ceiling
  }));
  for (const finding of findings) {
    if (!["new", "worsened"].includes(finding.status) || finding.evidenceClass !== "measured" || !finding.gateEligible) {
      continue;
    }
    const match = budgetResults.find((budget) => {
      if (budget.status !== "available") return false;
      if (budget.ruleId !== finding.ruleId) return false;
      if (!scopeMatches(budget.scope, finding.location?.path)) return false;
      return (usage.get(budget.id) ?? 0) < budget.ceiling;
    });
    if (!match) continue;
    usage.set(match.id, (usage.get(match.id) ?? 0) + 1);
    match.consumed += 1;
    match.remaining -= 1;
    finding.status = "budgeted";
    finding.budgetId = match.id;
  }
  return budgetResults;
}

function requiredEvidenceState(profile, input, mode) {
  const evidence = new Map(input.evidence.map((item) => [item.id, item]));
  return (profile.requiredEvidence?.[mode] ?? []).map((id) => {
    const item = evidence.get(id);
    return item ?? {
      id,
      status: "missing",
      evidenceClass: "unverified",
      details: "Required by profile but not produced"
    };
  }).sort((left, right) => left.id.localeCompare(right.id));
}

function renderMarkdown(report) {
  const rows = report.findings.map((finding) => {
    const location = finding.location
      ? `${finding.location.path}${finding.location.line ? `:${finding.location.line}` : ""}`
      : "-";
    return `| ${finding.severity} | ${finding.status} | ${finding.evidenceClass} | ${finding.ruleId} | ${location} | ${finding.message.replaceAll("|", "\\|")} |`;
  });
  return [
    "# Architecture Health",
    "",
    `- Mode: \`${report.run.mode}\``,
    `- Repository: \`${report.run.repository.id}\``,
    `- Commit: \`${report.run.repository.commit}\``,
    `- Gate: **${report.gate.status.toUpperCase()}**`,
    `- Baseline: \`${report.comparison.baseline}\``,
    "",
    "## Changes",
    "",
    `- New: ${report.summary.new}`,
    `- Worsened: ${report.summary.worsened}`,
    `- Improved: ${report.summary.improved}`,
    `- Retained: ${report.summary.retained}`,
    `- Budgeted: ${report.summary.budgeted}`,
    `- Resolved: ${report.summary.resolved}`,
    "",
    "## Findings",
    "",
    "| Severity | Change | Evidence | Rule | Location | Finding |",
    "| --- | --- | --- | --- | --- | --- |",
    ...(rows.length > 0 ? rows : ["| - | - | - | - | - | No findings |"]),
    "",
    "## Gate reasons",
    "",
    ...(report.gate.reasons.length > 0 ? report.gate.reasons.map((reason) => `- ${reason}`) : ["- No blocking reasons."]),
    ""
  ].join("\n");
}

function renderSarif(report) {
  const measured = report.findings.filter((finding) => finding.evidenceClass === "measured" && finding.location);
  const ruleIds = [...new Set(measured.map((finding) => finding.ruleId))].sort();
  return {
    version: "2.1.0",
    $schema: "https://json.schemastore.org/sarif-2.1.0.json",
    runs: [{
      tool: {
        driver: {
          name: "ArchSight AIOS Architecture Health",
          version: VERSION,
          rules: ruleIds.map((id) => ({ id, name: id }))
        }
      },
      results: measured
        .sort((left, right) => `${left.ruleId}\0${left.location.path}\0${left.fingerprint}`
          .localeCompare(`${right.ruleId}\0${right.location.path}\0${right.fingerprint}`))
        .map((finding) => ({
          ruleId: finding.ruleId,
          level: finding.severity === "P0" ? "error" : finding.severity === "P1" ? "warning" : "note",
          message: { text: finding.message },
          locations: [{
            physicalLocation: {
              artifactLocation: { uri: finding.location.path },
              region: finding.location.line ? { startLine: finding.location.line } : undefined
            }
          }],
          partialFingerprints: { architectureHealthFingerprint: finding.fingerprint },
          properties: {
            changeStatus: finding.status,
            evidenceClass: finding.evidenceClass,
            gateEligible: finding.gateEligible
          }
        }))
    }]
  };
}

function renderDependencyGraph(edges, cycles) {
  const cycleEdges = new Set();
  for (const cycle of cycles) {
    const members = new Set(cycle);
    for (const edge of edges) {
      if (members.has(edge.from) && members.has(edge.to)) {
        cycleEdges.add(`${edge.from}\0${edge.to}`);
      }
    }
  }
  const nodes = [...new Set(edges.flatMap((edge) => [edge.from, edge.to]))].sort();
  const ids = new Map(nodes.map((node, index) => [node, `N${index + 1}`]));
  return [
    "flowchart LR",
    ...nodes.map((node) => `  ${ids.get(node)}["${node.replaceAll('"', '\\"')}"]`),
    ...edges
      .sort((left, right) => `${left.from}\0${left.to}`.localeCompare(`${right.from}\0${right.to}`))
      .map((edge) => {
        const arrow = cycleEdges.has(`${edge.from}\0${edge.to}`) ? "==>" : "-->";
        return `  ${ids.get(edge.from)} ${arrow} ${ids.get(edge.to)}`;
      }),
    ""
  ].join("\n");
}

function summarize(findings, resolved) {
  const counts = { new: 0, worsened: 0, improved: 0, retained: 0, budgeted: 0, resolved: resolved.length };
  for (const finding of findings) counts[finding.status] = (counts[finding.status] ?? 0) + 1;
  return counts;
}

export function evaluateArchitectureHealth({ profile, input, baseline, mode = "commit" }) {
  if (!MODES.has(mode)) throw new Error(`Unknown architecture-health mode: ${mode}`);
  validateArchitectureHealthProfile(profile);
  validateArchitectureHealthInput(input);
  const profileDigest = sha256(stableJson({
    ...profile,
    budgets: [],
    analyzers: []
  }));
  const dependencies = normalizeDependencies(input.dependencies);
  const normalizedInput = { ...input, dependencies };
  const built = buildFindings(profile, normalizedInput, mode);
  const comparison = applyBaseline(
    built.findings,
    baseline,
    input.repository,
    profileDigest,
    mode,
    profile.allowBootstrap === true
  );
  const budgets = applyBudgets(comparison.findings, profile.budgets ?? [], input.observedAt);
  const requiredEvidence = requiredEvidenceState(profile, input, mode);
  const gateReasons = [];
  if (comparison.holdReason) gateReasons.push(comparison.holdReason);
  const missingEvidence = requiredEvidence.filter(
    (item) => item.status !== "available" || item.evidenceClass !== "measured"
  );
  if (missingEvidence.length > 0) {
    gateReasons.push(`Required evidence unavailable: ${missingEvidence.map((item) => item.id).join(", ")}`);
  }
  const analyzerFailures = (input.analyzers ?? []).filter((item) => item.required && item.status !== "pass");
  if (analyzerFailures.length > 0) {
    gateReasons.push(`Required analyzers failed: ${analyzerFailures.map((item) => item.id).join(", ")}`);
  }
  const blocking = comparison.findings.filter(
    (finding) => ["new", "worsened"].includes(finding.status)
      && finding.evidenceClass === "measured"
      && finding.gateEligible
  );
  if (blocking.length > 0) gateReasons.push(`${blocking.length} unbudgeted measured architecture debt item(s)`);
  const hold = Boolean(comparison.holdReason) || missingEvidence.length > 0 || analyzerFailures.length > 0;
  const gateStatus = hold ? "hold" : blocking.length > 0 ? "fail" : "pass";
  const report = {
    schemaVersion: VERSION,
    type: "archsight-aios.architecture-health",
    run: {
      mode,
      repository: input.repository,
      observedAt: input.observedAt,
      profile: { id: profile.id, version: profile.version },
      profileDigest
    },
    summary: summarize(comparison.findings, comparison.resolved),
    findings: comparison.findings,
    resolved: comparison.resolved,
    comparison: { baseline: comparison.compatibility },
    budgets,
    evidence: {
      required: requiredEvidence,
      supplied: [...input.evidence].sort((left, right) => left.id.localeCompare(right.id))
    },
    dependencyGraph: {
      nodes: [...new Set(dependencies.flatMap((edge) => [edge.from, edge.to]))].sort(),
      edges: dependencies,
      cycles: built.cycles
    },
    gate: { status: gateStatus, reasons: gateReasons }
  };
  report.reportFingerprint = sha256(stableJson(report));
  return report;
}

function runAnalyzer(analyzer, repositoryRoot, mode) {
  return new Promise((resolve) => {
    const child = spawn(analyzer.command, analyzer.args ?? [], {
      cwd: path.resolve(repositoryRoot, analyzer.cwd ?? "."),
      env: {
        ...process.env,
        AIOS_ARCH_HEALTH_MODE: mode,
        AIOS_ARCH_HEALTH_CWD: repositoryRoot
      },
      shell: false,
      windowsHide: true
    });
    let stdout = "";
    let stderr = "";
    let settled = false;
    const timeout = setTimeout(() => {
      child.kill();
      if (!settled) {
        settled = true;
        resolve({ id: analyzer.id, required: analyzer.required, status: "failed", error: `Timed out after ${analyzer.timeoutMs ?? 30000}ms` });
      }
    }, analyzer.timeoutMs ?? 30000);
    child.stdout.on("data", (chunk) => { stdout += chunk.toString("utf8"); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString("utf8"); });
    child.on("error", (error) => {
      clearTimeout(timeout);
      if (!settled) {
        settled = true;
        resolve({ id: analyzer.id, required: analyzer.required, status: "failed", error: error.message });
      }
    });
    child.on("close", (code) => {
      clearTimeout(timeout);
      if (settled) return;
      settled = true;
      if (code !== 0) {
        resolve({ id: analyzer.id, required: analyzer.required, status: "failed", error: stderr.trim() || `Exited with ${code}` });
        return;
      }
      try {
        const output = JSON.parse(stdout);
        resolve({ id: analyzer.id, required: analyzer.required, status: "pass", output });
      } catch (error) {
        resolve({ id: analyzer.id, required: analyzer.required, status: "failed", error: `Invalid JSON: ${error.message}` });
      }
    });
  });
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

function mergeAnalyzerInputs(baseInput, analyzerRuns) {
  const merged = structuredClone(baseInput);
  merged.analyzers = analyzerRuns.map(({ id, required, status, error }) => ({ id, required, status, error }));
  for (const run of analyzerRuns.filter((item) => item.status === "pass")) {
    if (run.output.repository) merged.repository = run.output.repository;
    if (run.output.observedAt) merged.observedAt = run.output.observedAt;
    merged.observations.push(...(run.output.observations ?? []));
    merged.dependencies.push(...(run.output.dependencies ?? []));
    merged.evidence.push(...(run.output.evidence ?? []));
  }
  return merged;
}

async function atomicWrite(filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.tmp-${process.pid}`;
  await fs.writeFile(tempPath, content, "utf8");
  await fs.rename(tempPath, filePath);
}

function assertOutputInsideRepository(outputDir, repositoryRoot) {
  const relative = path.relative(repositoryRoot, outputDir);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Architecture-health output must stay inside repository: ${outputDir}`);
  }
}

function assertInputInsideRepository(filePath, repositoryRoot, label) {
  if (!filePath) return;
  const relative = path.relative(repositoryRoot, path.resolve(filePath));
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`${label} must stay inside repository: ${filePath}`);
  }
}

export async function writeArchitectureHealthArtifacts(report, input, outputDir) {
  const repositoryRoot = path.resolve(input.__repositoryRoot ?? ".");
  const resolvedOut = path.resolve(outputDir);
  assertOutputInsideRepository(resolvedOut, repositoryRoot);
  const files = {
    json: path.join(resolvedOut, "architecture-health.json"),
    markdown: path.join(resolvedOut, "architecture-health.md"),
    sarif: path.join(resolvedOut, "architecture-health.sarif"),
    dependencyGraph: path.join(resolvedOut, "dependency-graph.mmd"),
    cycles: path.join(resolvedOut, "dependency-cycles.json")
  };
  await atomicWrite(files.json, stableJson(report));
  await atomicWrite(files.markdown, renderMarkdown(report));
  await atomicWrite(files.sarif, stableJson(renderSarif(report)));
  await atomicWrite(
    files.dependencyGraph,
    renderDependencyGraph(report.dependencyGraph.edges, report.dependencyGraph.cycles)
  );
  await atomicWrite(files.cycles, stableJson({
    schemaVersion: VERSION,
    repository: report.run.repository,
    cycles: report.dependencyGraph.cycles
  }));
  return files;
}

export function parseArchitectureHealthArgs(argv, { defaultCwd = process.cwd() } = {}) {
  const options = {
    cwd: path.resolve(defaultCwd),
    mode: "commit",
    healthProfile: undefined,
    healthInput: undefined,
    baseline: undefined,
    out: undefined,
    help: false
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = () => {
      const next = argv[++index];
      if (!next) throw new Error(`${arg} requires a value`);
      return next;
    };
    if (arg === "--cwd") options.cwd = path.resolve(value());
    else if (arg === "--mode") options.mode = value();
    else if (arg === "--health-profile" || arg === "--profile") options.healthProfile = value();
    else if (arg === "--health-input" || arg === "--input") options.healthInput = value();
    else if (arg === "--baseline") options.baseline = value();
    else if (arg === "--out") options.out = value();
    else if (arg === "--help" || arg === "-h") options.help = true;
    else throw new Error(`Unknown architecture:health option: ${arg}`);
  }
  if (!MODES.has(options.mode)) throw new Error(`Unknown architecture-health mode: ${options.mode}`);
  for (const field of ["healthProfile", "healthInput", "baseline", "out"]) {
    if (options[field]) options[field] = path.resolve(options.cwd, options[field]);
  }
  options.out ??= path.resolve(options.cwd, ".ai", "architecture-health", "out");
  return options;
}

export async function runArchitectureHealth(options) {
  if (!options.healthProfile) throw new Error("--health-profile is required");
  for (const [label, filePath] of [
    ["--health-profile", options.healthProfile],
    ["--health-input", options.healthInput],
    ["--baseline", options.baseline]
  ]) {
    assertInputInsideRepository(filePath, options.cwd, label);
  }
  const profile = validateArchitectureHealthProfile(await readJson(options.healthProfile));
  let input = options.healthInput
    ? await readJson(options.healthInput)
    : {
      schemaVersion: VERSION,
      repository: { id: path.basename(options.cwd), commit: "unknown" },
      observedAt: new Date(0).toISOString(),
      observations: [],
      dependencies: [],
      evidence: []
    };
  const analyzers = (profile.analyzers ?? []).filter((analyzer) => analyzer.modes.includes(options.mode));
  if (!options.healthInput && analyzers.length === 0) {
    throw new Error("Provide --health-input or configure at least one analyzer for this mode");
  }
  const analyzerRuns = await Promise.all(analyzers.map((analyzer) => runAnalyzer(analyzer, options.cwd, options.mode)));
  input = mergeAnalyzerInputs(input, analyzerRuns);
  if (!options.healthInput
    && (input.repository.commit === "unknown" || input.observedAt === new Date(0).toISOString())) {
    throw new Error("Analyzers must supply repository and observedAt when --health-input is omitted");
  }
  validateArchitectureHealthInput(input);
  Object.defineProperty(input, "__repositoryRoot", { value: options.cwd, enumerable: false });
  const baseline = options.baseline ? await readJson(options.baseline) : undefined;
  const report = evaluateArchitectureHealth({ profile, input, baseline, mode: options.mode });
  const artifacts = await writeArchitectureHealthArtifacts(report, input, options.out);
  return {
    schemaVersion: VERSION,
    capabilityId: "repo.architecture_health_scan",
    status: report.gate.status,
    reportFingerprint: report.reportFingerprint,
    summary: report.summary,
    artifacts,
    gate: report.gate
  };
}

export async function runArchitectureHealthCapability(args) {
  requireObject(args, "input");
  const cwd = path.resolve(args.cwd ?? process.cwd());
  requireString(args.profilePath, "input.profilePath");
  const profilePath = normalizeRelativePath(args.profilePath);
  const inputPath = args.inputPath ? normalizeRelativePath(args.inputPath) : undefined;
  const baselinePath = args.baselinePath ? normalizeRelativePath(args.baselinePath) : undefined;
  const outDir = normalizeRelativePath(args.outDir ?? ".ai/architecture-health/out");
  return runArchitectureHealth({
    cwd,
    mode: args.mode ?? "commit",
    healthProfile: path.resolve(cwd, profilePath),
    healthInput: inputPath ? path.resolve(cwd, inputPath) : undefined,
    baseline: baselinePath ? path.resolve(cwd, baselinePath) : undefined,
    out: path.resolve(cwd, outDir)
  });
}
