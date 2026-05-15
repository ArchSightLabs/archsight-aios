# Skills

## 使用原则

Skill 是“怎么做”，不是“谁来做”。本项目优先使用 ArchSight 专属 Skill，避免与通用技能包混淆。

## Skill 路由

| 任务 | Skill | 主 Agent |
| --- | --- | --- |
| 架构评审 | `archsight-architecture-review` | Atlas |
| 交付计划 | `archsight-delivery-planning` | Mason |
| 代码审查 | `archsight-code-review` | Argus |
| BIM / IFC / 建筑知识建模 | `archsight-bim-domain-modeling` | Vitruvius |
| AI Runtime / RAG / MCP / Memory | `archsight-ai-runtime-design` | Daedalus |
| 受控实现 / 测试 / 文档 / 脚本 | `archsight-controlled-execution` | Hephaestus |

## 本项目启用的 Skills

- [x] `archsight-architecture-review`
- [ ] `archsight-delivery-planning`
- [ ] `archsight-code-review`
- [ ] `archsight-bim-domain-modeling`
- [ ] `archsight-ai-runtime-design`
- [ ] `archsight-controlled-execution`

## 备注

本 smoke test 只启用架构评审 Skill，用于验证项目接入路径。Agent 只表示职责归属，不等同于 Skill。

Skill 来源：

- `archsight-architecture-review`：来自 ArchSight AI OS 仓库的 `skills/archsight-architecture-review/SKILL.md`。
