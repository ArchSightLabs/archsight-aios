# Skills

## 使用原则

Skill 是“怎么做”，不是“谁来做”。本项目优先使用 ArchSight 专属 Skill，避免与通用技能包混淆。

## Skill 路由

| 任务 | Skill | 主 Agent |
| --- | --- | --- |
| 架构评审 | `aios-arch` | Atlas |
| 交付计划 | `aios-plan` | Mason |
| 代码审查 | `aios-review` | Argus |
| BIM / IFC / 建筑知识建模 | `aios-knowledge` | Vitruvius |
| AI Runtime / RAG / MCP / Memory | `aios-runtime` | Daedalus |
| 受控实现 / 测试 / 文档 / 脚本 | `aios-exec` | Hephaestus |

## 本项目启用的 Skills

- [x] `aios-arch`
- [ ] `aios-plan`
- [ ] `aios-review`
- [ ] `aios-knowledge`
- [ ] `aios-runtime`
- [ ] `aios-exec`

## 备注

本 smoke test 只启用架构评审 Skill，用于验证项目接入路径。Agent 只表示职责归属，不等同于 Skill。

Skill 来源：

- `aios-arch`：来自 ArchSight AI OS 仓库的 `skills/aios-arch/SKILL.md`。
