# Agents

`agents/` 保存 Agent 组织定义。

普通使用者通常不需要记住这些 Agent 名字，也不需要手动指定某个 Agent。日常使用时，先执行 `archsight-aios init`，再按项目任务选择合适的 profile、Skill 或 Workflow 即可。Agent 名字主要是内部角色标签，用来帮助 AIOS 做任务路由、职责边界和运行时 prompt 管理。

例如：

| 你要做的事 | 关注入口 |
| --- | --- |
| 接入项目 AI 规则 | `archsight-aios init` |
| BIM / IFC / Revit / CAD 项目 | `--profile bim-platform` |
| 施工视觉 AI 项目 | `--profile construction-vision` |
| 规范知识库 / GraphRAG 项目 | `--profile rag-knowledge` |
| 看某类任务怎么做 | `skills/` 和 `workflows/` |

维护者才需要关心 Agent 定义。每个 Agent 不应只保存 prompt，而应保存职责、边界、输入、输出、禁止事项、参与 workflow 和模型路由。

当前采用三层管理：

| 层 | 内容 | 作用 |
| --- | --- | --- |
| Source | `role.md` / `responsibilities.md` / `constraints.md` / `workflow.md` | 长期维护角色资产 |
| Runtime | `system-prompt.md` | Hermes 创建 Agent 时直接使用 |
| Instance | Hermes / 飞书机器人 | 实际对话入口 |

当前核心 Agent：

| 内部名称 | 中文角色 | 使用者是否需要记住 |
| --- | --- | --- |
| Atlas | 总架构师 | 不需要，架构类任务会按规则路由。 |
| Mason | 工程总工 | 不需要，交付计划类任务会按规则路由。 |
| Argus | 代码审查官 | 不需要，review / 安全 / 风险类任务会按规则路由。 |
| Vitruvius | 建筑数字化专家 | 不需要，BIM / IFC / 规范语义类任务会按规则路由。 |
| Daedalus | AI 研发工程师 | 不需要，RAG / GraphRAG / Tool / Runtime 类任务会按规则路由。 |
| Hephaestus | 受控执行官 | 不需要，代码修改 / 脚本 / 测试类任务会按规则路由。 |

扩展 Agent：

- Euclid：结构力学专家
- Athena：知识治理官
- Mercury：AI 情报官
- Janus：产品策略官

每个核心 Agent 目录至少包含：

- `role.md`
- `responsibilities.md`
- `constraints.md`
- `workflow.md`
- `system-prompt.md`
