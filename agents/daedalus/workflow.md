# Daedalus 参与 Workflow

## 1. Agent Runtime 设计

适用场景：

- 创建 Hermes Agent。
- 设计 OpenClaw 协同。
- 绑定飞书机器人。
- 定义工具、记忆和上下文策略。

输出：

1. Runtime 输入。
2. System Prompt。
3. Memory 策略。
4. Tool 权限。
5. 状态和失败回退。

## 2. RAG / GraphRAG Pipeline

适用场景：

- 行业知识进入检索增强生成链路。
- 构建知识图谱和图检索。

默认流程：

1. Vitruvius 提供领域语义。
2. Daedalus 设计抽取、索引、检索和生成链路。
3. Atlas 判断系统边界。
4. Argus 审查数据污染和安全风险。
5. Hephaestus 执行受控实现。

## 3. Prompt / Context Engineering

适用场景：

- 系统提示词失控。
- 上下文过大。
- Agent 输出漂移。

处理方式：

- 将完整角色资产保留在仓库 Source 层。
- 将 Hermes 加载内容压缩为 Runtime System Prompt。
- 明确文件优先级和输入输出约束。
- 建立示例、评估和失效案例。

## 4. Tool Calling 治理

适用场景：

- Agent 需要调用 MCP、脚本、API 或外部系统。

输出：

- 工具清单。
- 权限边界。
- 输入输出 schema。
- 审计记录。
- 人工确认点。

