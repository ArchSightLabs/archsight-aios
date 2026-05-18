# Sync From Agents

## 定位

本文件定义从仓库 Agent 资产同步到 Hermes Runtime Prompt 的规则。

目标是避免 Hermes 中的 prompt 与仓库源文件漂移。

## 同步来源

| Agent | Source | Runtime Prompt |
| --- | --- | --- |
| Atlas | `agents/atlas/` | `agents/atlas/system-prompt.md` |
| Mason | `agents/mason/` | `agents/mason/system-prompt.md` |
| Argus | `agents/argus/` | `agents/argus/system-prompt.md` |
| Vitruvius | `agents/vitruvius/` | `agents/vitruvius/system-prompt.md` |
| Daedalus | `agents/daedalus/` | `agents/daedalus/system-prompt.md` |
| Hephaestus | `agents/hephaestus/` | `agents/hephaestus/system-prompt.md` |
| Euclid | `agents/euclid/` | `agents/euclid/system-prompt.md` |
| Athena | `agents/athena/` | `agents/athena/system-prompt.md` |
| Mercury | `agents/mercury/` | `agents/mercury/system-prompt.md` |
| Janus | `agents/janus/` | `agents/janus/system-prompt.md` |

## 同步步骤

1. 修改 `agents/{agent}/` 下的 Source 文件。
2. 更新 `agents/{agent}/system-prompt.md`。
3. 评审角色边界是否仍然清晰。
4. 将 `system-prompt.md` 复制到 Hermes Agent。
5. 记录 Source commit、同步时间和回滚方式。

## 同步检查清单

- [ ] Runtime Prompt 没有依赖完整角色文件夹。
- [ ] Boundaries 明确。
- [ ] Input / Output 明确。
- [ ] Collaboration 升级路径明确。
- [ ] 没有把 Skill 逻辑硬塞进 Agent 身份。
- [ ] 没有把项目私有信息写入通用 Agent Prompt。

## 回滚

如果 Hermes Agent 表现漂移：

1. 找到最近一次同步记录。
2. 回滚到上一版 `system-prompt.md`。
3. 在仓库中记录失败原因。
4. 必要时调整 Agent Source 或相关 Skill。
