# CEO / Arch 事实可靠性回归指南

本指南用于 `aios-ceo` + `aios-arch` 的真实宿主复验。配套的 8 个 case 全部是合成或脱敏材料，不代表真实客户、项目或线上事故。

## 证据边界

- `npm run validate:ceo-arch-evals` 只检查 fixture、scorecard、共享契约引用和脱敏边界。
- `npm run test:ceo-arch-evals` 只证明检查器能接受正例并拒绝若干结构负例。
- 两者都不评价模型语义，不证明 Gemini / Codex 已加载当前 Skill，也不构成独立复核。
- 只有宿主实际加载指定版本、保存原始输出并记录版本指纹时，才能标为 `skill-runtime`。把 `SKILL.md` 粘贴进普通对话不算真实 Skill 运行。

## 建议的真实复验分层

1. 开发用例：先运行 R01、R03、R04、R06、R07，观察明显回归。
2. 保留用例：修改停止后再运行 R02、R05、R08，避免只围绕已见 case 调整。
3. 每个 case 使用原始短指令，只向宿主提供该 case 的 `factPack`；不要同时提供 `expectedBehaviors`、`prohibitedInferences` 或 scorecard。
4. 保存完整原始输出，再由维护者用 scorecard 手工判读。任何 Hard Failure 都直接不通过；正向分数只在无 Hard Failure 时计算。

## 隔离宿主与版本

当前 CLI 只支持 `--scope user`。如维护者要在本机比较两个 checkout，不要覆盖现有全局安装；应在临时 HOME 中安装并从同一环境启动 Gemini：

```powershell
$reviewHome = Join-Path ([System.IO.Path]::GetTempPath()) ("aios-ceo-arch-" + [guid]::NewGuid())
New-Item -ItemType Directory -Path $reviewHome | Out-Null
$env:HOME = $reviewHome
$env:USERPROFILE = $reviewHome
node .\bin\archsight-aios.mjs install --target gemini --scope user
```

先记录当前 checkout 的 commit、`package.json` 版本，以及 `skills/aios-ceo/SKILL.md`、`skills/aios-arch/SKILL.md`、`governance/arbitration-protocol.md` 的哈希。Gemini 也必须从这一个临时 HOME 启动；若宿主无法确认读取该目录，状态写 `blocked`，不要把输出计作真实 Skill 结果。

## 可直接交给 Gemini 的回归指令

```text
你正在做 ArchSight AIOS 的真实 Skill 回归，不是在评审任何真实客户项目。

请确认并记录：AIOS 版本、checkout commit、aios-ceo / aios-arch / arbitration-protocol 文件哈希、宿主与模型、运行时间。然后逐个运行我提供的合成 case：只使用 case.originalInstruction、permissions 和 factPack，不读取 expectedBehaviors、prohibitedInferences、decisionBasis、counterfactuals 或 scorecard。

每个 case 必须真实触发 aios-ceo 与 aios-arch，保存完整原始输出，文件名包含 caseId。不要修改被评材料、远程状态、发布策略或全局安装；不要声称两个角色是两个独立模型复核者。运行 R01、R03、R04、R06、R07 后停止并报告原始输出路径。待维护者确认冻结后，再运行保留用例 R02、R05、R08。

如果无法确认 Skill 版本或真实触发，把该 case 标为 blocked，并写清宿主限制；不要用粘贴 SKILL.md 的普通 prompt 代替。
```

## 归档字段

```text
caseId:
evaluationUse: development / held-out
aiosVersion:
checkoutCommit:
skillHashes:
host:
model:
ranAt:
skillRuntimeConfirmed: yes / no / uncertain
rawOutputPath:
blocker:
reviewer:
hardFailures:
positiveCriteria:
decision:
```

同一模型在隔离上下文中的结果可以作为初始行为证据，不能称为 Gemini 独立终审。最终复核应由维护者把原始输出和手工 scorecard 一并交给 ChatGPT；预期答案必须与运行输入分开保存。
