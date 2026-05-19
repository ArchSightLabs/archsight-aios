# Skills

## 使用原则

Skill 是“怎么做”，不是“谁来做”。本项目优先使用已启用的 ArchSight AIOS Skill，避免与通用技能包混淆。

ArchSight AIOS 的 Skill 是通用治理能力；`archsight-*` 前缀表示来源和命名空间，不表示当前项目属于 ArchSightLabs。

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

- [ ] `archsight-architecture-review`
- [ ] `archsight-delivery-planning`
- [ ] `archsight-code-review`
- [ ] `archsight-bim-domain-modeling`
- [ ] `archsight-ai-runtime-design`
- [ ] `archsight-controlled-execution`

## 启用规则

- 只勾选当前项目真实安装或可访问的 Skill。
- 只有启用建筑、BIM、IFC、规范知识库、GraphRAG 或智能审图 profile 时，才默认启用 `archsight-bim-domain-modeling`。
- 如 Skill 来源、安装位置或同步方式无法确认，应标注待核验，不要假设已经启用。
