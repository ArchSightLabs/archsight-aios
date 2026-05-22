# Review 流程

状态：治理基线  
适用场景：代码审查、架构审查、安全审查、AI 生成内容审查

---

## 目标

在合并或交付前发现真实风险，优先阻止缺陷、越界修改、过度设计和安全问题。

## 与 `code-review` 的关系

`review.md` 是综合评审入口，适用于代码、架构、安全、AI 生成内容和交付完整性的总览审查。

如果任务对象是 PR、diff、commit 或 AI 生成代码，应进入 [Code Review Workflow](code-review.md)，并使用 `aios-review`。

## 角色与 Skill 路由

| 审查对象 | 主 Agent | Skill | 后续 Workflow |
| --- | --- | --- | --- |
| PR / diff / AI 生成代码 | Argus | `aios-review` | `code-review` |
| 架构边界 / 技术选型 | Atlas | `aios-arch` | `architecture-review` |
| 交付计划 / 测试完整性 | Mason | `aios-plan` | `feature-development` |
| RAG / MCP / Memory / Tool | Daedalus | `aios-runtime` | `rag-pipeline` |
| BIM / IFC / 规范语义 | Vitruvius | `aios-knowledge` | `rag-pipeline` |

## 输入

- diff 或 PR。
- 需求背景。
- 测试结果。
- 影响范围说明。

## 输出

- 按严重程度排序的 review finding。
- 必须修复项。
- 可选改进项。
- 测试缺口。
- 推荐进入的后续 workflow。

## 审查重点

- 是否满足明确需求。
- 是否存在无关改动。
- 是否过度设计。
- 是否引入安全、权限、数据泄露风险。
- 是否缺少关键测试。
- 是否破坏既有行为。

## 验收标准

- P0 / P1 问题必须修复后才能继续。
- P2 问题必须有修复或明确接受风险。
- P3 建议不得阻塞交付。
- 每个发现都应能路由到明确 Agent、Skill 或 Workflow。

## 回滚与恢复

- 如果评审发现阻断问题，停止当前交付，回到对应 workflow 的修复阶段。
- 如果评审对象不清，先回到 Mason 做任务拆解。
- 如果问题属于架构边界，回到 Atlas 做架构评审。
- 如果已进入代码修改，回滚策略以具体项目的 Git 分支、PR 和发布策略为准。

## 禁止事项

- 不用风格偏好阻塞交付。
- 不把可选重构伪装成必须修复。
- 不忽略 AI 生成代码的越界风险。
