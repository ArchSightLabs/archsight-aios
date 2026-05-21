# Skills

## 使用原则

Skill 是“怎么做”，不是“谁来做”。本项目优先使用 ArchSight 专属 Skill，避免与通用技能包混淆。

## Skill 路由

| 任务 | Skill | 主 Agent |
| --- | --- | --- |
| 架构评审 | `aios-architecture-review` | Atlas |
| 交付计划 | `aios-delivery-planning` | Mason |
| 代码审查 | `aios-code-review` | Argus |
| BIM / IFC / 建筑知识建模 | `aios-bim-domain-modeling` | Vitruvius |
| AI Runtime / RAG / MCP / Memory | `aios-ai-runtime-design` | Daedalus |
| 受控实现 / 测试 / 文档 / 脚本 | `aios-controlled-execution` | Hephaestus |

## 本项目启用的 Skills

- [x] `aios-architecture-review`
- [ ] `aios-delivery-planning`
- [ ] `aios-code-review`
- [ ] `aios-bim-domain-modeling`
- [ ] `aios-ai-runtime-design`
- [ ] `aios-controlled-execution`

## 备注

本 smoke test 只启用架构评审 Skill，用于验证项目接入路径。Agent 只表示职责归属，不等同于 Skill。

Skill 来源：

- `aios-architecture-review`：来自 ArchSight AI OS 仓库的 `skills/aios-architecture-review/SKILL.md`。
