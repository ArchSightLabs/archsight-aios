# Agent Routing

普通使用者不需要记住 Agent 名字，也不需要在每次提问时手动指定 Agent。优先按“任务类型”描述问题，让当前 AI 工具读取本文件、`.ai/skills.md` 和 `.ai/workflows.md` 后自动选择合适的角色与工作流。

如果你是业务专家，可以直接说：

- “请按 BIM / IFC 语义帮我拆解这条规则。”
- “请检查这个施工视觉检测结果应该如何人工复核。”
- “请把这组规范条文整理成 RAG / GraphRAG 评估问题。”

下面的 Agent 名字只是内部路由标签，不代表当前项目属于 ArchSightLabs，也不要求项目使用 Hermes、飞书或建筑行业技术栈。

## 基本关系

| 类型 | 含义 |
| --- | --- |
| Agent | 谁来做 |
| Skill | 怎么做 |
| Workflow | 什么时候做、按什么顺序做 |
| Runtime | 在哪里运行 |

## 泛化边界

- 当前项目事实优先于 AIOS 通用角色说明。
- Hermes、飞书、OpenClaw、Codex、Claude、Gemini 等都是可选运行入口；未启用时不得写入项目假设。
- 建筑、BIM、IFC、规范、审图和 RAG / GraphRAG 知识工程能力通过 profile 或明确任务触发；普通项目不默认启用这些语义。

## 默认任务路由

| 任务 | 内部路由 | 说明 |
| --- | --- | --- |
| 架构评审、技术选型、服务边界 | Atlas | 总架构师 |
| 任务拆解、交付顺序、CI/CD | Mason | 工程总工 |
| Code Review、安全、性能、技术债 | Argus | 代码审查官 |
| BIM、IFC、建筑规范、审图逻辑 | Vitruvius | 建筑数字化专家 |
| RAG、GraphRAG、MCP、Memory、Tool Calling | Daedalus | AI 研发工程师 |
| 代码修改、脚本执行、测试、文档生成 | Hephaestus | 受控执行官 |

## 升级规则

- 涉及长期架构、服务边界、数据模型：升级给 Atlas。
- 涉及多模块交付、任务依赖、发布顺序：升级给 Mason。
- 涉及权限、安全、生产发布、AI 生成代码：升级给 Argus。
- 涉及行业规范、BIM / IFC、审图语义：升级给 Vitruvius。
- 涉及 RAG、GraphRAG、MCP、Memory、Tool：升级给 Daedalus。
- 具体实现和验证：交给 Hephaestus。
