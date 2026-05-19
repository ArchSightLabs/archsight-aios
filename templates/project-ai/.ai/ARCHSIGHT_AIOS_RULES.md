# ArchSight AIOS 补充规则

> 本文件是 ArchSight AIOS 在业务项目中的补充规则。  
> 业务项目自己的 `AI_CODING_RULES.md` 仍是通用 AI 编码规则主体。

## 适用范围

当任务涉及以下内容时，读取并遵守本文件：

- Agent 路由。
- Skill 选择。
- Workflow 编排。
- 交付验证。
- BIM / IFC / 建筑行业语义（仅在项目启用相关 profile 或任务明确涉及时）。
- AI Runtime / RAG / GraphRAG / MCP。
- AI 生成代码审查。

## 必读文件

处理 AIOS 相关任务时，先读取：

- `.ai/project-context.md`
- `.ai/agent-routing.md`
- `.ai/skills.md`
- `.ai/workflows.md`
- `.ai/profiles/*.md`（如当前项目启用了 profile）

## 边界

- AIOS 只补充项目级路由和工作流，不替代当前项目代码、测试、构建和发布事实。
- 当前项目事实优先于 AIOS 通用模板。
- 业务项目的 `AI_CODING_RULES.md` 优先于本文件中的通用工程要求。
- ArchSight AIOS 是通用治理底座；接入本模板不代表当前项目属于 ArchSightLabs，也不要求使用 Hermes、飞书或其他特定运行平台。
- 建筑行业能力通过 profile 和任务上下文启用；未启用时，不得把 BIM、IFC、GraphRAG 或审图场景当作项目默认事实。
- 未经验证不得声称代码、测试、构建、部署或审查已完成。
