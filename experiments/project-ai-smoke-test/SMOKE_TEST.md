# Project AI 接入 Smoke Test

## 测试任务

使用 `aios-architecture-review`，评审这个沙盒项目是否已正确接入 ArchSight AIOS。

## 输入文件

- `AGENTS.md`
- `GEMINI.md`
- `.ai/project-context.md`
- `.ai/agent-routing.md`
- `.ai/skills.md`
- `.ai/workflows.md`

## 结论

通过。

该沙盒项目已具备项目级 ArchSight AIOS 接入的最小闭环：入口文件会要求读取 `.ai/` 上下文，`.ai/project-context.md` 提供了项目定位和边界，`.ai/skills.md` 明确启用 `aios-architecture-review`，`.ai/workflows.md` 将 Review 路由到 `architecture-review`。

## 架构判断

- `.ai/` 是项目级 AI 治理目录，来源于复制 `templates/project-ai/`，不是运行时自动生成目录。
- 本 smoke test 是文档型项目，不需要前端、后端、数据库、构建系统或 Hermes Runtime。
- 架构评审任务应选择 `aios-architecture-review` Skill，由 Atlas 作为主 Agent 承担职责归属。
- Agent、Skill、Workflow、Runtime 的边界清晰：Agent 是“谁来做”，Skill 是“怎么做”，Workflow 是“什么时候做、按什么顺序做”，Runtime 是“在哪里运行”。

## 验收核对

| 验收项 | 结果 | 证据 |
| --- | --- | --- |
| 能读 `.ai/project-context.md` | 通过 | 文件中已填写项目名称、定位、技术栈、代码结构、常用命令、约束和接入能力。 |
| 能选择正确 Skill | 通过 | `.ai/skills.md` 已启用 `aios-architecture-review`，并说明来源路径。 |
| 能输出结论 / 风险 / 后续动作 | 通过 | 本文件包含结论、风险与边界、后续动作。 |
| 不会要求 Hermes 才能工作 | 通过 | `.ai/project-context.md` 将 Runtime 明确为本地项目工作区，且注明不要求 Hermes。 |
| 不会把 Agent 当 Skill | 通过 | `.ai/skills.md` 和本文件均区分 Atlas 与 `aios-architecture-review`。 |

## 风险与边界

- 部分文件列表命令默认不显示隐藏目录，验证 `.ai/` 时需要使用支持隐藏文件的方式。
- 当前 smoke test 是人工可读验证，还没有自动化脚本保证模板字段完整。
- 该沙盒只验证架构评审接入，不覆盖代码审查、受控执行、RAG 或发布流程。

## 推荐方案

保留 `experiments/project-ai-smoke-test/` 作为模板接入的最小样例。后续修改 `templates/project-ai/` 时，可用本目录验证业务项目是否仍能完成 `.ai` 上下文读取、Skill 路由和 Workflow 选择。

## 后续动作

1. 若需要更强回归能力，增加一个轻量脚本检查 `.ai/` 必要文件、启用 Skill 和 Workflow 路由。
2. 若模板字段继续扩展，同步更新本 smoke test，避免样例与模板漂移。
