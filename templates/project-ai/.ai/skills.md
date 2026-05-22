# Skills

## 使用原则

Skill 是“怎么做”，不是“谁来做”。本项目优先使用已启用的 ArchSight AIOS Skill，避免与通用技能包混淆。

ArchSight AIOS 的 Skill 是面向建筑行业平台研发的治理能力；`aios-*` 前缀表示来源和命名空间，不表示当前项目属于 ArchSightLabs。

## Skill 路由

| 任务 | Skill | 主 Agent |
| --- | --- | --- |
| 项目立项 / 产品定位 / 商业目标 | `aios-ceo` | Janus |
| UI / UX 设计方案 / 工作台体验 | `aios-design` | Janus |
| 架构评审 | `aios-arch` | Atlas |
| 交付计划 | `aios-plan` | Mason |
| 代码审查 | `aios-review` | Argus |
| BIM / IFC / 建筑知识建模 | `aios-knowledge` | Vitruvius |
| AI Runtime / RAG / MCP / Memory | `aios-runtime` | Daedalus |
| 受控实现 / 测试 / 文档 / 脚本 | `aios-exec` | Hephaestus |

## 本项目启用的 Skills

- [ ] `aios-arch`
- [ ] `aios-ceo`
- [ ] `aios-design`
- [ ] `aios-plan`
- [ ] `aios-review`
- [ ] `aios-knowledge`
- [ ] `aios-runtime`
- [ ] `aios-exec`

## 启用规则

- 只勾选当前项目真实安装或可访问的 Skill。
- 涉及项目立项、产品定位、商业目标、范围取舍或阶段路线时，优先启用 `aios-ceo`。
- 涉及 UI / UX 方案、工作台体验、交互状态、响应式或前端实现交接时，优先启用 `aios-design`。
- 只有启用建筑、BIM、IFC、规范知识库、GraphRAG 或智能审图 profile 时，才默认启用 `aios-knowledge`。
- 如 Skill 来源、安装位置或同步方式无法确认，应标注待核验，不要假设已经启用。
