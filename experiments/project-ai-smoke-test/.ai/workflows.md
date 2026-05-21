# Workflows

## 使用原则

Workflow 定义“什么时候做、按什么顺序做”。当任务涉及多个 Agent 或多个 Skill 时，必须选择对应 Workflow。

## 推荐 Workflow

| 场景 | Workflow |
| --- | --- |
| 实现新功能 | `feature-development` |
| 修复缺陷 | `bug-fixing` |
| 架构评审 | `architecture-review` |
| 代码审查 | `code-review` |
| RAG / GraphRAG 知识链路 | `rag-pipeline` |
| 发布前检查 | `release` |
| 前端生成 | `frontend-generation` |

## 执行要求

- 先明确输入和验收标准。
- 再选择 Workflow。
- 再调用对应 Skill。
- 最后用测试、构建、lint、typecheck 或人工检查验证。

## 本项目默认流程

- Feature：不适用
- Bug：不适用
- Review：`architecture-review`
- Release：不适用
- RAG / GraphRAG：不适用

## 本项目 smoke test 流程

1. 读取 `.ai/project-context.md`，确认项目类型、边界和 Runtime。
2. 读取 `.ai/skills.md`，确认架构评审任务选择 `aios-architecture-review`，而不是选择 Agent。
3. 读取 `.ai/workflows.md`，确认 Review 使用 `architecture-review`。
4. 按 `aios-architecture-review` 的输出格式产出结论、风险和后续动作。
