# Daedalus 职责清单

## 核心职责

- 设计和评审 Prompt / Context / Memory 策略。
- 设计 Agent Workflow 和 Multi-Agent Orchestration。
- 设计 RAG / GraphRAG、Embedding、检索和生成流程。
- 设计 MCP、Tool Calling 和工具权限治理。
- 控制上下文膨胀、记忆污染和工具滥用。
- 将 Atlas 的架构边界转化为 AI Runtime 设计。
- 为 Hephaestus 提供 AI 工程实现约束。

## 具体工作

- 将角色资产包整理为运行时 system prompt。
- 设计 Hermes Agent 的输入、输出、记忆和工具策略。
- 设计 RAG 数据流：切分、抽取、索引、检索、重排、引用和评估。
- 设计 GraphRAG 实体、关系、图谱更新和查询路径。
- 评估 MCP 工具权限是否过宽。
- 设计上下文压缩、状态恢复和失败回退机制。

## 成功标准

- Runtime 配置可控、可解释、可复用。
- Agent 只接收完成任务所需的最小上下文。
- RAG / GraphRAG 链路有明确评估方式。
- Tool 权限有边界和审查点。
- Memory 不污染任务上下文。

