import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  evaluateArchitectureHealth,
  runArchitectureHealth,
  runArchitectureHealthCapability,
  validateArchitectureHealthInput,
  validateArchitectureHealthProfile
} from "../scripts/lib/architecture-health.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(repoRoot, "bin", "archsight-aios.mjs");
const DIGEST_A = "a".repeat(64);
const DIGEST_B = "b".repeat(64);

function provenance(repositoryCommit, overrides = {}) {
  return {
    tool: "fixture-runner",
    version: "1.0.0",
    command: "npm test",
    actor: "ci",
    role: "ci",
    repositoryCommit,
    observedAt: "2026-07-26T00:00:00.000Z",
    environment: "test",
    ...overrides
  };
}

function measuredEvidence(id, repositoryCommit, overrides = {}) {
  return {
    id,
    kind: "unit-test",
    status: "available",
    evidenceClass: "measured",
    source: "fixture",
    provenance: provenance(repositoryCommit),
    artifact: {
      path: `artifacts/${id}.json`,
      sha256: DIGEST_A
    },
    ...overrides
  };
}

function protectedConstraint(overrides = {}) {
  return {
    id: "acceptance.login",
    kind: "acceptance-test",
    digest: DIGEST_A,
    source: "fixture-constraint-scanner",
    location: "tests/login.feature",
    producer: "implementation-agent",
    ...overrides
  };
}

function profile(overrides = {}) {
  return {
    schemaVersion: "0.1",
    id: "test-profile",
    version: "1",
    allowBootstrap: true,
    rules: [{
      id: "complexity.high",
      dimension: "complexity",
      metric: "function.complexity",
      operator: "greaterThan",
      threshold: 10,
      severity: "P1",
      gate: true,
      modes: ["commit", "weekly", "milestone"],
      message: "Complexity is too high"
    }],
    dependencyPolicy: {
      cycles: {
        severity: "P1",
        gate: true,
        modes: ["commit", "weekly", "milestone"]
      },
      forbiddenDirections: [{
        id: "domain-to-ui",
        from: "domain",
        to: "ui",
        severity: "P1",
        gate: true,
        modes: ["commit", "weekly", "milestone"]
      }]
    },
    requiredEvidence: {
      commit: [],
      weekly: [],
      milestone: ["performance", "real-database", "failure-injection"]
    },
    budgets: [],
    analyzers: [],
    ...overrides
  };
}

function input(overrides = {}) {
  return {
    schemaVersion: "0.1",
    repository: { id: "fixture-repo", commit: "abc123" },
    observedAt: "2026-07-26T00:00:00.000Z",
    observations: [{
      id: "src-hotspot",
      dimension: "complexity",
      metric: "function.complexity",
      value: 12,
      unit: "score",
      evidenceClass: "measured",
      location: { path: "src/hotspot.ts", line: 10, symbol: "hotspot" },
      message: "hotspot complexity is 12",
      source: "fixture-analyzer"
    }],
    dependencies: [],
    evidence: [],
    ...overrides
  };
}

async function testMeasuredRatchetAndBaseline() {
  const currentProfile = profile();
  const first = evaluateArchitectureHealth({ profile: currentProfile, input: input(), mode: "commit" });
  assert.equal(first.gate.status, "fail");
  assert.equal(first.summary.new, 1);

  const retained = evaluateArchitectureHealth({
    profile: currentProfile,
    input: input({ repository: { id: "fixture-repo", commit: "def456" } }),
    baseline: first,
    mode: "commit"
  });
  assert.equal(retained.gate.status, "pass");
  assert.equal(retained.summary.retained, 1);

  const improved = evaluateArchitectureHealth({
    profile: currentProfile,
    input: input({
      repository: { id: "fixture-repo", commit: "def457" },
      observations: [{
        ...input().observations[0],
        value: 11,
        message: "hotspot complexity is 11"
      }]
    }),
    baseline: first,
    mode: "commit"
  });
  assert.equal(improved.gate.status, "pass");
  assert.equal(improved.summary.improved, 1);

  const resolved = evaluateArchitectureHealth({
    profile: currentProfile,
    input: input({
      repository: { id: "fixture-repo", commit: "def458" },
      observations: []
    }),
    baseline: first,
    mode: "commit"
  });
  assert.equal(resolved.summary.resolved, 1);
}

async function testEvidenceClassesAndMilestoneHold() {
  const inferred = evaluateArchitectureHealth({
    profile: profile(),
    input: input({
      observations: [{
        ...input().observations[0],
        evidenceClass: "inferred"
      }]
    }),
    mode: "commit"
  });
  assert.equal(inferred.gate.status, "pass");
  assert.equal(inferred.findings[0].evidenceClass, "inferred");

  const milestone = evaluateArchitectureHealth({
    profile: profile(),
    input: input({ observations: [] }),
    mode: "milestone"
  });
  assert.equal(milestone.gate.status, "hold");
  assert.match(milestone.gate.reasons.join("\n"), /performance/);

  const inferredRequiredEvidence = evaluateArchitectureHealth({
    profile: profile(),
    input: input({
      observations: [],
      evidence: [
        { id: "performance", status: "available", evidenceClass: "inferred" },
        { id: "real-database", status: "available", evidenceClass: "measured" },
        { id: "failure-injection", status: "available", evidenceClass: "measured" }
      ]
    }),
    mode: "milestone"
  });
  assert.equal(inferredRequiredEvidence.gate.status, "hold");
  assert.match(inferredRequiredEvidence.gate.reasons.join("\n"), /performance/);
}

async function testEvidenceProvenanceAndArtifactPolicy() {
  const currentProfile = profile({
    requiredEvidence: {
      commit: ["unit-tests"],
      weekly: [],
      milestone: []
    },
    evidencePolicy: {
      requireProvenance: ["commit"],
      requireArtifactDigest: ["commit"]
    }
  });
  const baseInput = input({ observations: [] });

  const missingProvenance = evaluateArchitectureHealth({
    profile: currentProfile,
    input: input({
      observations: [],
      evidence: [{
        id: "unit-tests",
        kind: "unit-test",
        status: "available",
        evidenceClass: "measured"
      }]
    }),
    mode: "commit"
  });
  assert.equal(missingProvenance.gate.status, "hold");
  assert.match(missingProvenance.gate.reasons.join("\n"), /lacks provenance/);
  assert.match(missingProvenance.gate.reasons.join("\n"), /artifact digest is missing/);

  const mismatchedCommit = evaluateArchitectureHealth({
    profile: currentProfile,
    input: input({
      observations: [],
      evidence: [measuredEvidence("unit-tests", "different-commit")]
    }),
    mode: "commit"
  });
  assert.equal(mismatchedCommit.gate.status, "hold");
  assert.match(mismatchedCommit.gate.reasons.join("\n"), /does not match/);

  const valid = evaluateArchitectureHealth({
    profile: currentProfile,
    input: {
      ...baseInput,
      evidence: [measuredEvidence("unit-tests", baseInput.repository.commit)]
    },
    mode: "commit"
  });
  assert.equal(valid.gate.status, "pass");
  assert.equal(valid.evidence.integrity.status, "pass");
}

async function testProtectedConstraintApproval() {
  const currentProfile = profile({
    constraintIntegrity: {
      modes: ["commit"],
      approvalEvidenceId: "constraint-change-approval"
    }
  });
  const initialInput = input({
    observations: [],
    constraints: [protectedConstraint()]
  });
  const baseline = evaluateArchitectureHealth({
    profile: currentProfile,
    input: initialInput,
    mode: "commit"
  });
  assert.equal(baseline.gate.status, "pass");
  assert.equal(baseline.constraintIntegrity.status, "bootstrap");

  const unchanged = evaluateArchitectureHealth({
    profile: currentProfile,
    input: input({
      repository: { id: "fixture-repo", commit: "def456" },
      observations: [],
      constraints: [protectedConstraint()]
    }),
    baseline,
    mode: "commit"
  });
  assert.equal(unchanged.gate.status, "pass");
  assert.equal(unchanged.constraintIntegrity.status, "unchanged");

  const changedInput = input({
    repository: { id: "fixture-repo", commit: "def457" },
    observations: [],
    constraints: [protectedConstraint({ digest: DIGEST_B })]
  });
  const unapproved = evaluateArchitectureHealth({
    profile: currentProfile,
    input: changedInput,
    baseline,
    mode: "commit"
  });
  assert.equal(unapproved.gate.status, "hold");
  assert.equal(unapproved.constraintIntegrity.status, "hold");

  const selfApproved = evaluateArchitectureHealth({
    profile: currentProfile,
    input: {
      ...changedInput,
      evidence: [measuredEvidence("constraint-change-approval", "def457", {
        kind: "constraint-approval",
        covers: ["acceptance.login"],
        provenance: provenance("def457", {
          actor: "implementation-agent",
          role: "reviewer",
          command: "review protected constraints"
        })
      })]
    },
    baseline,
    mode: "commit"
  });
  assert.equal(selfApproved.gate.status, "hold");
  assert.match(selfApproved.gate.reasons.join("\n"), /cannot approve its own/);

  const independentlyApproved = evaluateArchitectureHealth({
    profile: currentProfile,
    input: {
      ...changedInput,
      evidence: [measuredEvidence("constraint-change-approval", "def457", {
        kind: "constraint-approval",
        covers: ["acceptance.login"],
        provenance: provenance("def457", {
          actor: "architecture-reviewer",
          role: "reviewer",
          command: "review protected constraints"
        })
      })]
    },
    baseline,
    mode: "commit"
  });
  assert.equal(independentlyApproved.gate.status, "pass");
  assert.equal(independentlyApproved.constraintIntegrity.status, "approved");
}

async function testBudgetsAndExpiry() {
  const validBudget = {
    id: "legacy-budget",
    ruleId: "complexity.high",
    scope: "src/**",
    owner: "architecture-owner",
    reason: "Migration closes in the next wave",
    ceiling: 1,
    expiresAt: "2026-08-01T00:00:00.000Z"
  };
  const budgeted = evaluateArchitectureHealth({
    profile: profile({ budgets: [validBudget] }),
    input: input(),
    mode: "commit"
  });
  assert.equal(budgeted.gate.status, "pass");
  assert.equal(budgeted.summary.budgeted, 1);
  assert.equal(budgeted.budgets[0].remaining, 0);

  const expired = evaluateArchitectureHealth({
    profile: profile({
      budgets: [{ ...validBudget, expiresAt: "2026-07-26T00:00:00.000Z" }]
    }),
    input: input(),
    mode: "commit"
  });
  assert.equal(expired.gate.status, "fail");
  assert.equal(expired.budgets[0].status, "expired");
}

async function testDependencyPolicies() {
  const result = evaluateArchitectureHealth({
    profile: profile(),
    input: input({
      observations: [],
      dependencies: [
        {
          from: "src/domain/a.ts",
          to: "src/ui/b.ts",
          fromLayer: "domain",
          toLayer: "ui",
          evidenceClass: "measured",
          source: "fixture-dependency-scan"
        },
        {
          from: "src/ui/b.ts",
          to: "src/domain/a.ts",
          fromLayer: "ui",
          toLayer: "domain",
          evidenceClass: "measured",
          source: "fixture-dependency-scan"
        },
        {
          from: "src/domain/a.ts",
          to: "src/ui/b.ts",
          fromLayer: "domain",
          toLayer: "ui",
          evidenceClass: "measured",
          source: "second-fixture-dependency-scan"
        }
      ]
    }),
    mode: "commit"
  });
  assert.equal(result.gate.status, "fail");
  assert.equal(result.dependencyGraph.cycles.length, 1);
  assert.equal(result.dependencyGraph.edges.length, 2);
  assert.ok(result.findings.some((item) => item.ruleId === "dependency.cycle"));
  assert.equal(
    result.findings.filter((item) => item.ruleId === "dependency.direction.domain-to-ui").length,
    1
  );
}

async function testStrictDomainValidation() {
  assert.throws(
    () => validateArchitectureHealthProfile({ ...profile(), extra: true }),
    /not supported/
  );
  assert.throws(
    () => validateArchitectureHealthProfile({
      ...profile(),
      budgets: [{
        id: "bad",
        ruleId: "complexity.high",
        scope: "*",
        owner: "",
        reason: "",
        ceiling: 0,
        expiresAt: "not-a-date"
      }]
    }),
    /non-empty string|positive integer|ISO date-time/
  );
  assert.throws(
    () => validateArchitectureHealthProfile({
      ...profile(),
      rules: [{
        ...profile().rules[0],
        metric: "file.lines",
        gate: true
      }]
    }),
    /investigation-only/
  );
  assert.throws(
    () => validateArchitectureHealthProfile({
      ...profile(),
      analyzers: [{
        id: "escape",
        command: "node",
        cwd: "fixtures/../../outside",
        modes: ["commit"],
        required: true
      }]
    }),
    /repository-relative/
  );
  assert.throws(
    () => validateArchitectureHealthInput(input({
      observations: [{
        ...input().observations[0],
        metric: "performance.p95",
        context: { environment: "ci" }
      }]
    })),
    /context.dataset/
  );
  assert.throws(
    () => validateArchitectureHealthInput(input({
      constraints: [protectedConstraint({ digest: "not-a-digest" })]
    })),
    /lowercase SHA-256/
  );
  assert.throws(
    () => validateArchitectureHealthInput(input({
      constraints: [protectedConstraint({ references: ["missing.constraint"] })]
    })),
    /unknown constraint id/
  );
  assert.throws(
    () => validateArchitectureHealthInput(input({
      evidence: [measuredEvidence("unit-tests", "abc123", {
        provenance: provenance("abc123", { role: "owner" })
      })]
    })),
    /provenance.role is invalid/
  );
  await assert.rejects(
    () => runArchitectureHealthCapability({
      cwd: repoRoot,
      profilePath: "../outside/profile.json"
    }),
    /repository-relative/
  );
}

async function testCliArtifactsAndCapability() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "aios-arch-health-"));
  try {
    const profilePath = path.join(tempRoot, "profile.json");
    const inputPath = path.join(tempRoot, "input.json");
    await fs.writeFile(profilePath, `${JSON.stringify(profile(), null, 2)}\n`, "utf8");
    await fs.writeFile(inputPath, `${JSON.stringify(input(), null, 2)}\n`, "utf8");
    const outputDir = path.join(tempRoot, "artifacts");

    const direct = await runArchitectureHealth({
      cwd: tempRoot,
      mode: "commit",
      healthProfile: profilePath,
      healthInput: inputPath,
      out: outputDir
    });
    assert.equal(direct.status, "fail");
    for (const fileName of [
      "architecture-health.json",
      "architecture-health.md",
      "architecture-health.sarif",
      "dependency-graph.mmd",
      "dependency-cycles.json"
    ]) {
      await fs.access(path.join(outputDir, fileName));
    }
    const sarif = JSON.parse(await fs.readFile(path.join(outputDir, "architecture-health.sarif"), "utf8"));
    assert.equal(sarif.version, "2.1.0");
    assert.equal(sarif.runs[0].results.length, 1);
    const firstArtifacts = await Promise.all([
      "architecture-health.json",
      "architecture-health.md",
      "architecture-health.sarif",
      "dependency-graph.mmd",
      "dependency-cycles.json"
    ].map((fileName) => fs.readFile(path.join(outputDir, fileName), "utf8")));
    await runArchitectureHealth({
      cwd: tempRoot,
      mode: "commit",
      healthProfile: profilePath,
      healthInput: inputPath,
      out: outputDir
    });
    const secondArtifacts = await Promise.all([
      "architecture-health.json",
      "architecture-health.md",
      "architecture-health.sarif",
      "dependency-graph.mmd",
      "dependency-cycles.json"
    ].map((fileName) => fs.readFile(path.join(outputDir, fileName), "utf8")));
    assert.deepEqual(secondArtifacts, firstArtifacts);

    const cliResult = spawnSync(process.execPath, [
      cli,
      "architecture:health",
      "--cwd", tempRoot,
      "--mode", "commit",
      "--health-profile", "profile.json",
      "--health-input", "input.json",
      "--out", "cli-artifacts"
    ], { cwd: repoRoot, encoding: "utf8" });
    assert.equal(cliResult.status, 2, `${cliResult.stdout}\n${cliResult.stderr}`);
    const cliSummary = JSON.parse(cliResult.stdout);
    assert.equal(cliSummary.capabilityId, "repo.architecture_health_scan");
    assert.equal(cliSummary.status, "fail");

    const cycleDependencies = [
      {
        from: "src/domain/a.ts",
        to: "src/ui/b.ts",
        fromLayer: "domain",
        toLayer: "ui",
        evidenceClass: "measured",
        source: "fixture-dependency-scan"
      },
      {
        from: "src/ui/b.ts",
        to: "src/domain/a.ts",
        fromLayer: "ui",
        toLayer: "domain",
        evidenceClass: "measured",
        source: "fixture-dependency-scan"
      }
    ];
    await fs.writeFile(inputPath, `${JSON.stringify(input({
      observations: [],
      dependencies: cycleDependencies
    }), null, 2)}\n`, "utf8");
    const cycleOutputDir = path.join(tempRoot, "cycle-artifacts");
    await runArchitectureHealth({
      cwd: tempRoot,
      mode: "commit",
      healthProfile: profilePath,
      healthInput: inputPath,
      out: cycleOutputDir
    });
    const cycleSarif = JSON.parse(
      await fs.readFile(path.join(cycleOutputDir, "architecture-health.sarif"), "utf8")
    );
    assert.ok(cycleSarif.runs[0].results.some((item) => item.ruleId === "dependency.cycle"));

    const advisoryInput = input({
      observations: [{
        ...input().observations[0],
        evidenceClass: "inferred"
      }]
    });
    await fs.writeFile(inputPath, `${JSON.stringify(advisoryInput, null, 2)}\n`, "utf8");
    const capabilityInputPath = path.join(tempRoot, "capability-input.json");
    await fs.writeFile(capabilityInputPath, `${JSON.stringify({
      cwd: tempRoot,
      profilePath: "profile.json",
      inputPath: "input.json",
      outDir: "capability-artifacts",
      mode: "commit"
    }, null, 2)}\n`, "utf8");
    const capability = spawnSync(process.execPath, [
      cli,
      "capability:call",
      "--capability", "repo.architecture_health_scan",
      "--agent", "atlas",
      "--skill", "aios-arch-health",
      "--input", capabilityInputPath
    ], { cwd: repoRoot, encoding: "utf8" });
    assert.equal(capability.status, 0, `${capability.stdout}\n${capability.stderr}`);
    const envelope = JSON.parse(capability.stdout);
    assert.equal(envelope.toolResult.status, "pass");
    assert.equal(envelope.decision.action, "proceed");
    assert.equal(envelope.evidence.serverInfo.name, "archsight-aios-arch-health");
  } finally {
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
}

async function testProjectOwnedAnalyzer() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "aios-arch-health-analyzer-"));
  try {
    const analyzerPath = path.join(tempRoot, "analyzer.mjs");
    const profilePath = path.join(tempRoot, "profile.json");
    await fs.writeFile(
      analyzerPath,
      [
        "console.log(JSON.stringify({",
        '  repository: { id: "analyzer-repo", commit: "feedface" },',
        '  observedAt: "2026-07-26T00:00:00.000Z",',
        "  observations: [],",
        "  dependencies: [],",
        "  evidence: []",
        "}));"
      ].join("\n"),
      "utf8"
    );
    await fs.writeFile(profilePath, `${JSON.stringify(profile({
      analyzers: [{
        id: "project-native",
        command: process.execPath,
        args: [analyzerPath],
        modes: ["commit"],
        required: true,
        timeoutMs: 10000
      }]
    }), null, 2)}\n`, "utf8");
    const result = await runArchitectureHealth({
      cwd: tempRoot,
      mode: "commit",
      healthProfile: profilePath,
      out: path.join(tempRoot, "artifacts")
    });
    assert.equal(result.status, "pass");
    const report = JSON.parse(await fs.readFile(path.join(tempRoot, "artifacts", "architecture-health.json"), "utf8"));
    assert.equal(report.run.repository.commit, "feedface");
  } finally {
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
}

const tests = [
  testMeasuredRatchetAndBaseline,
  testEvidenceClassesAndMilestoneHold,
  testEvidenceProvenanceAndArtifactPolicy,
  testProtectedConstraintApproval,
  testBudgetsAndExpiry,
  testDependencyPolicies,
  testStrictDomainValidation,
  testCliArtifactsAndCapability,
  testProjectOwnedAnalyzer
];

for (const test of tests) {
  await test();
  console.log(`ok ${test.name}`);
}

console.log(`${tests.length} architecture-health test group(s) passed.`);
