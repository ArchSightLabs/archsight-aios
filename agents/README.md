# Agents

`agents/` 保存 Agent 组织定义。

每个 Agent 不应只保存 prompt，而应保存职责、边界、输入、输出、禁止事项、参与 workflow 和模型路由。

当前采用三层管理：

| 层 | 内容 | 作用 |
| --- | --- | --- |
| Source | `role.md` / `responsibilities.md` / `constraints.md` / `workflow.md` | 长期维护角色资产 |
| Runtime | `system-prompt.md` | Hermes 创建 Agent 时直接使用 |
| Instance | Hermes / 飞书机器人 | 实际对话入口 |

第一阶段核心 Agent：

- Atlas：总架构师
- Mason：工程总工
- Argus：代码审查官
- Vitruvius：建筑数字化专家
- Daedalus：AI 研发工程师
- Hephaestus：受控执行官

每个核心 Agent 目录至少包含：

- `role.md`
- `responsibilities.md`
- `constraints.md`
- `workflow.md`
- `system-prompt.md`
