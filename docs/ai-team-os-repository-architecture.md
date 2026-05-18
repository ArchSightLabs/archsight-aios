# AI Team OS 仓库架构

> ArchSightLabs AI 研发组织操作系统的仓库治理蓝图

状态：规划基线  
版本：0.1  
日期：2026-05-07  
维护方：ArchSightLabs

---

## 文档定位

本文件定义 `archsight-aios` 仓库本身如何组织和治理 AI 研发资产。

它回答的问题是：

- 目录应该怎么分层。
- Agent、Workflow、Prompt、Skill、Runtime、Knowledge 等资产分别放在哪里。
- 仓库如何支撑 Hermes / OpenClaw / 飞书机器人等运行实例。
- 如何避免 prompt、agent、workflow 和 runtime 配置碎片化。

本文件不负责详细定义每个 Agent 的角色分工。Agent 组织结构和角色职责以 [AI Engineering Squad 计划](ai-engineering-squad-plan.md) 为准。

---

## 一、定位升级

如果本仓库只是存放 prompt、agent 配置和一些技能包，长期价值会很有限。

这些资产如果缺少治理结构，会很快碎片化：

- prompt 没有版本和评估，容易腐化。
- agent 没有职责边界，容易互相污染。
- skill 没有工具约束和验收标准，容易变成不可复用脚本。
- runtime 没有路由和权限策略，成本与风险会失控。
- knowledge 没有结构化入口，无法演进为 GraphRAG 和知识图谱资产。

因此，本仓库应定位为：

> AI 研发组织操作系统（AI Team OS）

也就是 ArchSightLabs 的 AI 团队治理中心。

它管理的不是单个聊天机器人，而是建筑行业 AI 研发基础设施：

- 多模型协同
- 多 Agent 协同
- 行业知识工程
- AI Coding Workflow
- 企业平台研发
- 行业智能体
- GraphRAG
- 受控执行环境

---

## 二、管理范围

| 维度 | 内容 |
| --- | --- |
| Agent 定义 | 角色、职责、边界、输入输出、不该做什么 |
| Workflow | 协作流程、角色编排、验收路径 |
| Skills | 能力插件、工具清单、示例、约束 |
| Prompt 体系 | 系统 Prompt、规则、版本、评估、失效案例 |
| Knowledge | BIM、IFC、规范、招采、结构、审查规则 |
| Runtime | Hermes / OpenClaw 配置、权限、路由、模型策略 |
| Governance | 工程治理、安全治理、上下文治理、记忆治理 |
| Memory | 长期记忆、项目记忆、角色记忆、决策记录 |
| Experiments | 实验设计、对比验证、模型能力评估 |
| Standards | 行业标准、企业标准、审查条文、数据标准 |
| Delivery | AI 生成、Review、测试、发布、回滚、风险控制 |
| Infra | ECS、Docker、Nginx、OSS、数据库、向量库等基础设施 |

---

## 三、核心目录结构

```text
archsight-aios/
│
├── README.md
├── AI_CODING_RULES.md
├── vision/
├── agents/
├── workflows/
├── runtime/
├── prompts/
├── skills/
├── memory/
├── governance/
├── standards/
├── knowledge/
├── rag/
├── graph/
├── delivery/
├── experiments/
├── templates/
├── docs/
└── infra/
```

---

## 四、目录职责

### 1. `vision/`

保存项目的长期方向、阶段目标和路线图。

典型内容：

- AI Team OS 愿景
- ArchSight AI 研发基础设施路线
- 阶段性目标
- 战略取舍记录

### 2. `agents/`

Agent 组织定义层。

每个 Agent 不应只保存 prompt，而应保存完整职责契约：

```text
agents/
├── atlas/
│   ├── role.md
│   ├── system-prompt.md
│   ├── responsibilities.md
│   ├── workflow.md
│   └── constraints.md
├── mason/
├── argus/
├── vitruvius/
├── daedalus/
└── hephaestus/
```

每个 Agent 至少应定义：

- 职责
- 边界
- 输入
- 输出
- 禁止事项
- 参与哪些 workflow
- 使用哪些模型或工具

### 3. `workflows/`

多 Agent 协作流程层，是本仓库的核心资产之一。

典型内容：

- `feature-development.md`
- `bug-fixing.md`
- `architecture-review.md`
- `frontend-generation.md`
- `rag-pipeline.md`
- `spec-driven-development.md`

例如 bug fixing 流程可以定义为：

```text
Argus -> Atlas -> Mason -> Hephaestus -> Argus
```

并明确：

- 谁发现问题
- 谁分析根因
- 谁判断架构影响
- 谁拆解任务
- 谁执行修复
- 谁验收

### 4. `runtime/`

Hermes / OpenClaw 运行治理层。

典型结构：

```text
runtime/
├── hermes/
│   ├── feishu.md
│   ├── cron-jobs.md
│   ├── memory-strategy.md
│   ├── routing.md
│   ├── permissions.md
│   └── model-routing.md
├── openclaw/
└── gateway/
```

重点管理：

- 模型路由
- 权限边界
- 工具调用策略
- 记忆策略
- 飞书集成
- 定时任务
- 成本控制
- agent 调度策略

模型路由示例：

| Agent | 默认模型 | 说明 |
| --- | --- | --- |
| Atlas | GPT 系列 | 复杂架构、长期规划、tradeoff |
| Mason | Gemini / GPT 系列 | 任务组织、工程拆解、研发流程 |
| Argus | Claude / GPT 系列 | 代码审查、安全和质量分析 |
| Vitruvius | GPT / 行业知识模型 | BIM、IFC、规范、审图逻辑 |
| Daedalus | GPT / Codex 系列 | Agent Runtime、RAG、MCP、Tool Calling |
| Hephaestus | Codex / 执行型模型 | 代码修改、脚本执行、自动化交付 |
| Mercury | DeepSeek / 搜索增强模型 | 情报、趋势、开源项目分析 |

### 5. `prompts/`

Prompt 资产化目录。

建议结构：

```text
prompts/
├── architecture/
├── frontend/
├── review/
├── rag/
├── graph/
├── coding/
├── delivery/
└── standards/
```

每个 prompt 应记录：

- 适用范围
- 版本
- 输入格式
- 输出格式
- 评估方式
- 已知失效案例
- 禁止使用场景

### 6. `skills/`

可复用能力插件目录。

建议结构：

```text
skills/
├── frontend-design/
├── react-admin/
├── graph-rag/
├── bim-review/
├── code-review/
├── postgres/
└── spec-kit/
```

每个 skill 应包含：

```text
skill/
├── README.md
├── workflow.md
├── tools.md
├── prompts.md
├── examples/
└── constraints.md
```

重点不是写一句 prompt，而是把能力沉淀为可重复执行、可验证、可治理的工作单元。

### 7. `knowledge/`

建筑行业知识操作系统。

建议结构：

```text
knowledge/
├── bim/
├── ifc/
├── standards/
├── procurement/
├── engineering/
├── structure/
└── regulations/
```

未来应支持：

- 自动切 chunk
- 自动抽取实体和关系
- 自动构建 GraphRAG
- 自动构建知识图谱
- 规范条文结构化
- 审查规则生成

### 8. `governance/`

AI 工程治理目录。

建议内容：

```text
governance/
├── coding-rules.md
├── ai-review-policy.md
├── security-policy.md
├── agent-boundary.md
├── delivery-policy.md
├── context-policy.md
└── memory-policy.md
```

治理重点：

- 防止 agent 乱调用工具
- 防止 prompt 泄露
- 防止上下文爆炸
- 防止 AI 瞎改代码
- 防止权限失控
- 防止未经评审的自动交付

### 9. `delivery/`

受控交付目录。

建议结构：

```text
delivery/
├── frontend/
├── backend/
├── architecture/
├── review/
├── release/
└── checklists/
```

重点管理：

- 发布清单
- Review 流程
- AI 生成代码检查
- 自动测试
- 自动修复
- 人工确认
- 回滚策略
- 风险控制

### 10. `infra/`

AI 研发基础设施目录。

建议结构：

```text
infra/
├── ecs/
├── docker/
├── nginx/
├── proxy/
├── feishu/
├── oss/
├── postgres/
├── neo4j/
└── vector-db/
```

重点管理：

- 阿里云 ECS
- Hermes
- 飞书集成
- OpenClaw
- 多模型接入
- OSS
- PostgreSQL
- Neo4j
- 向量数据库
- GraphRAG 基础设施

---

## 五、当前最应该做的事情

### 第一优先级：明确 AIOS 核心治理结构

将仓库从 `archsight-ai-team` 升级为 `archsight-aios` 的内容结构，重点治理：

- runtime
- workflow
- governance
- delivery
- memory

这些是 AI 研发组织操作系统的骨架。

### 第二优先级：建立统一 Workflow

包括：

- feature 开发
- bug 修复
- review
- release
- frontend 生成

每个 workflow 都应明确角色路由、输入、输出、验收标准和回滚策略。

### 第三优先级：建立统一 Agent Routing

示例：

| Agent | 默认模型 |
| --- | --- |
| Atlas | GPT |
| Mason | Gemini |
| Argus | Claude |
| Mercury | DeepSeek |

如果没有统一路由，成本、上下文和执行权限会失控。

### 边界说明：业务项目 `.ai/`

`.ai/` 是具体业务项目的项目级 AI 治理目录，不属于 `archsight-aios` 根仓库自身的运行目录。

本仓库当前不创建 `.ai/`，只维护可被其他项目继承的统一规范、workflow、routing、governance、delivery 和 memory 规则。

---

## 六、长期方向

本仓库服务的长期方向不是：

- 再做一个聊天机器人
- 再接一个模型
- 再试一个 Agent

而是：

> 建筑行业 AI 研发基础设施

核心组成：

- 行业知识层
- Agent 组织层
- Workflow 层
- Runtime 层
- 受控交付层
- AI 治理层

这个方向比单纯做一个 SaaS 更底层，也更有长期战略价值。
