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

待填写：

- Feature：
- Bug：
- Review：
- Release：
- RAG / GraphRAG：

