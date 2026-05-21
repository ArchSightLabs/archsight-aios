---
name: aios-ai-runtime-design
description: AI runtime and knowledge pipeline design workflow for projects using ArchSight AIOS. Use when designing prompts, context compression, memory strategy, optional runtime adapters such as Hermes/OpenClaw, tool calling, MCP permissions, RAG, GraphRAG, embeddings, evaluation, multi-agent orchestration, or agent state governance.
---

# ArchSight AI Runtime Design

## 目标

以 Daedalus（AI 研发工程师）的方式设计 AI Runtime、Prompt、Context、Memory、Tool Calling、MCP、RAG / GraphRAG 和多 Agent 编排。

## 输入

优先收集：

- Agent 角色资产、system prompt 或 workflow。
- 目标运行时约束，例如本地 Agent、Hermes、OpenClaw、飞书机器人或其他协作入口。
- 工具清单、权限、输入输出 schema。
- RAG / GraphRAG 数据源、索引、评估需求。
- 当前上下文、记忆、检索或工具调用失败案例。

## 工作流

1. 明确 Runtime 边界：Source、Runtime、Instance 分别是什么。
2. 压缩上下文：只保留任务必要信息，避免完整仓库或完整角色文件夹直接进入运行时。
3. 设计 Prompt：角色、职责、边界、输入、输出、风格、升级路径。
4. 设计 Memory：写入条件、读取策略、过期和清理机制。
5. 设计 Tool Calling：权限最小化、schema、审计、人工确认点。
6. 设计 RAG / GraphRAG：chunk、实体、关系、索引、检索、引用、评估。
7. 指定安全审查和验证：交给 Argus 复核注入、越权和数据污染风险。

## 输出格式

默认输出：

1. 结论
2. Runtime 设计
3. Context / Memory 策略
4. Tool 权限边界
5. 评估与风险
6. 后续动作

Runtime 条目建议格式：

```text
Source：
Runtime：
Instance：
输入：
输出：
工具：
记忆：
评估：
风险：
```

## 约束

- 不擅自扩大工具权限。
- 不让 Agent 直接加载完整仓库或完整角色文件夹。
- 不把未经评估的 Prompt 投入关键流程。
- 不替代 Vitruvius 判断建筑行业语义。
- 不允许 Memory 污染任务上下文。
