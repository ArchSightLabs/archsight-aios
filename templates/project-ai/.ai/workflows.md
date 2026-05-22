# Workflows

## 使用原则

Workflow 定义“什么时候做、按什么顺序做”。当任务涉及多个 Agent 或多个 Skill 时，必须选择对应 Workflow。

Workflow 是项目执行路径，不绑定某个运行平台。Hermes、飞书、Codex、Claude、Gemini 等只影响入口和执行方式，不改变项目事实、测试命令和验收标准。

## 推荐 Workflow

| 场景 | Workflow |
| --- | --- |
| 实现新功能 | `feature-development` |
| 修复缺陷 | `bug-fixing` |
| 架构评审 | `architecture-review` |
| 代码审查 | `code-review` |
| UI / UX 方案评审 | `design-review` |
| UAT / 试运行确认 / 演示前质量门禁 | `quality-readiness` |
| RAG / GraphRAG 知识链路 | `rag-pipeline` |
| 发布前检查 | `release` |
| 前端生成 | `frontend-generation` |

## 执行要求

- 先明确输入和验收标准。
- 再选择 Workflow。
- 再调用对应 Skill。
- 最后用测试、构建、lint、typecheck 或人工检查验证。
- 涉及建筑行业、BIM、IFC、规范、审图或 RAG / GraphRAG 时，先确认项目是否启用对应 profile。

## 本项目默认流程

待填写：

- Feature：
- Bug：
- Review：
- Quality readiness / UAT / 试运行确认：
- Release：
- RAG / GraphRAG：
