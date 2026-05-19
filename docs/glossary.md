# 术语表

## AIOS

ArchSight AIOS 是一套 AI 规则、Agent、Skill、Workflow 和运行治理工具包。它由 ArchSightLabs 提供，当前重点覆盖建筑行业和工程软件场景，但通用底座可用于其他项目。

## Agent

Agent 是一个内部角色标签，例如建筑数字化专家、代码审查官、AI 研发工程师。Agent 定义职责、边界、输入和输出。普通使用者通常不需要记住 Agent 名字，也不需要手动指定 Agent；AIOS 会根据任务类型、profile、Skill 和 Workflow 做路由。

## Skill

Skill 是可重复执行的能力单元，例如架构评审、交付计划、代码审查、BIM 领域建模。Skill 更接近“怎么做事”。

## Workflow

Workflow 是多步骤工作流，说明一个任务从输入、执行、检查到交付应该怎么流转。

## Profile

Profile 是某类业务项目的补充规则。当前包括：

- `bim-platform`
- `construction-vision`
- `rag-knowledge`

## `.ai/`

业务项目中的 AI 规则目录。它保存项目事实、AIOS 补充规则、Agent 路由、Skills、Workflows 和行业 profile。

## `AGENTS.md`

Codex 等 Agent 工具读取的项目入口文件。它告诉 AI 在当前项目中应该先看哪些规则。

## `CLAUDE.md`

Claude 读取的项目入口文件。

## `GEMINI.md`

Gemini 读取的项目入口文件。

## `AI_CODING_RULES.md`

项目通用 AI 编码规则。它是项目自己的规则主体，AIOS 不应该随意覆盖它。

## RAG

Retrieval-Augmented Generation，检索增强生成。模型回答前先检索知识源，再基于证据回答。

## GraphRAG

结合知识图谱的 RAG。它不仅检索文本片段，也利用实体、关系、来源和版本信息帮助回答。

## Hermes

可选运行时 Adapter，用于登记和同步运行时 Agent prompt。当前 CLI 只提供校验和 dry-run，不直接执行外部 API 同步；未启用 Hermes 的项目不需要依赖它。

## 业务专家

负责规范、工程语义、样例、判断口径、复核点和验收标准的人，不要求会写代码。

## 人工复核点

AI 不能直接给最终结论、必须由专家或责任人确认的事项。
