# Workflows

`workflows/` 保存多 Agent 协作流程，是本仓库的核心资产之一。

推荐优先沉淀：

- [架构评审](architecture-review.md)
- [feature 开发](feature-development.md)
- [bug 修复](bug-fixing.md)
- [code review](code-review.md)
- [综合 review 入口](review.md)
- [design review](design-review.md)
- [质量准入 / UAT / 试运行确认](quality-readiness.md)
- [release](release.md)
- [frontend 生成](frontend-generation.md)
- [RAG / GraphRAG pipeline](rag-pipeline.md)
- spec driven development

每个 workflow 应明确参与角色、输入、输出、执行顺序、验收标准和回滚策略。

涉及多 Agent 冲突、规范证据、结构计算、安全扫描、测试门禁或 Runtime 权限时，Workflow 还应输出 `Claim / Evidence / Tool Result / Decision`，并按 [Capability-Backed Arbitration Protocol](../governance/arbitration-protocol.md) 仲裁。
