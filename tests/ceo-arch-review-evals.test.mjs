import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { validateArtifacts } from "../scripts/validate-ceo-arch-review-evals.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(repoRoot, relativePath), "utf8"));
}

async function loadValidArtifacts() {
  return {
    fixtures: await readJson("prompts/evaluations/ceo-arch-review-fixtures.json"),
    scorecard: await readJson("prompts/evaluations/ceo-arch-review-scorecard.json"),
    skillTexts: {
      protocol: await fs.readFile(path.join(repoRoot, "governance/arbitration-protocol.md"), "utf8"),
      ceo: await fs.readFile(path.join(repoRoot, "skills/aios-ceo/SKILL.md"), "utf8"),
      arch: await fs.readFile(path.join(repoRoot, "skills/aios-arch/SKILL.md"), "utf8")
    }
  };
}

test("accepts the eight synthetic CEO/Arch review cases", async () => {
  const { fixtures, scorecard, skillTexts } = await loadValidArtifacts();
  assert.deepEqual(validateArtifacts(fixtures, scorecard, skillTexts), []);
});

test("rejects missing evidence applicability", async () => {
  const { fixtures, scorecard } = await loadValidArtifacts();
  delete fixtures.cases[0].factPack[0].applicability.environment;
  assert.ok(validateArtifacts(fixtures, scorecard).some((error) => error.includes("applicability.environment")));
});

test("rejects private-looking absolute paths", async () => {
  const { fixtures, scorecard } = await loadValidArtifacts();
  fixtures.cases[0].factPack[0].source = "C:\\Users\\example\\private-record.md";
  assert.ok(validateArtifacts(fixtures, scorecard).some((error) => error.includes("private-looking path")));
});

test("rejects cases without counterfactuals", async () => {
  const { fixtures, scorecard } = await loadValidArtifacts();
  fixtures.cases[2].counterfactuals = [];
  assert.ok(validateArtifacts(fixtures, scorecard).some((error) => error.includes("counterfactual")));
});

test("rejects scorecards that omit a case", async () => {
  const { fixtures, scorecard } = await loadValidArtifacts();
  scorecard.caseReviews.pop();
  assert.ok(validateArtifacts(fixtures, scorecard).some((error) => error.includes("caseReviews")));
});

test("rejects removal of the shared contract reference", async () => {
  const { fixtures, scorecard, skillTexts } = await loadValidArtifacts();
  skillTexts.ceo = skillTexts.ceo.replace("../../governance/arbitration-protocol.md", "missing-protocol.md");
  assert.ok(validateArtifacts(fixtures, scorecard, skillTexts).some((error) => error.includes("shared protocol reference")));
});
