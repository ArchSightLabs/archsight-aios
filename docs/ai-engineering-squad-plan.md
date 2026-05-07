# AI Engineering Squad 计划

> 面向建筑行业数字化、AI 研发平台与行业知识工程的多智能体协同体系设计

状态：规划基线  
版本：0.1  
日期：2026-05-07  
维护方：ArchSightLabs

相关文档：

- [AI Team OS 仓库架构](ai-team-os-repository-architecture.md)

---

## 文档定位

本文件定义 ArchSightLabs 的 AI Engineering Squad 角色体系。

它回答的问题是：

- 应该有哪些核心 Agent。
- 每个 Agent 负责什么、不负责什么。
- Agent 之间如何分层协作。
- 哪些角色属于第一阶段核心马队，哪些属于第二阶段扩展角色。

本文件不负责规定仓库目录、runtime 配置、prompt 存放方式和治理目录结构。这些内容以 [AI Team OS 仓库架构](ai-team-os-repository-architecture.md) 为准。

---

## 一、总体定位

当前目标并不是构建“聊天机器人集合”。

而是：

> 一个面向建筑行业数字化与 AI 工程研发的多智能体协同组织（AI Engineering Squad）。

核心方向包括：

- 建筑行业平台研发
- BIM / IFC 标准体系
- ArchSight 行业知识平台
- GraphRAG / 行业知识图谱
- AI Coding 工作流
- 多模型协同研发
- Agent 工程体系
- 规范审查与智能审图
- 结构力学求解器
- 企业级 AI 研发平台

---

## 二、整体组织结构

建议将 Hermes / OpenClaw Agent 体系划分为四层：

| 层级 | 职责定位 | 是否核心 |
| --- | --- | --- |
| 战略层 | 架构、路线、治理、评审 | 核心 |
| 产品层 | 行业知识、业务抽象、规范体系 | 核心 |
| 工程层 | 开发、测试、交付、自动化 | 核心 |
| 知识层 | BIM / IFC / GraphRAG / 标准体系 | 极核心 |

---

## 三、核心马队（第一阶段）

这是建议优先长期保留的六个核心 Agent。

它们共同构成：

> 一个最小可运行的 AI 软件研发组织。

### 1. Atlas（总架构师）

中文定位：总架构师 / 技术战略官

核心职责：

- 系统架构设计
- 服务边界划分
- 技术选型
- 平台演进路线
- 多 Agent 协同治理
- 技术债控制
- 长期复杂度治理

角色特征：

> CTO 型 Agent

重点不是写代码，而是审方案、做 tradeoff、控复杂度、规划长期演进。

适用场景：

- ArchSight 服务拆分
- GraphRAG 架构设计
- Neo4j 是否合理
- pgvector + FTS 协同方案
- React / Vue 技术路线
- Agent Workflow 治理
- BIM 标准模块边界

### 2. Mason（工程总工）

中文定位：工程总工 / 研发负责人

核心职责：

- 研发任务拆解
- Sprint 管理
- 模块依赖治理
- Monorepo 管理
- 工程目录结构
- CI/CD 设计
- 开发规范
- PR Review 流程

角色特征：

> 工程组织型 Agent

Atlas 决定是否应该做，Mason 决定如何组织团队做完。

重点能力：

- Monorepo
- Workspace
- Docker
- API Boundary
- Gateway
- DevContainer
- Frontend / Backend Split
- AI Coding Workflow

### 3. Argus（代码审查官）

中文定位：代码审查官 / 质量卫士

核心职责：

- Code Review
- 安全审计
- 性能问题识别
- 架构反模式分析
- Prompt 注入风险
- 依赖风险
- Agent 失控风险
- 重复代码识别

角色特征：

> AI 时代的质量守门员

重点不是生产代码，而是阻止 AI 制造大型技术债。

适用场景：

- Codex
- Gemini
- Claude Code
- OpenCode
- Kimi
- DeepSeek
- 其他多模型协同研发环境

### 4. Vitruvius（建筑数字化专家）

中文定位：建筑数字化专家

来源：Vitruvius

核心职责：

- BIM
- IFC
- 建筑规范
- 行业术语
- 工程数据体系
- 招采业务
- 交付标准
- 审图逻辑

角色特征：

> 行业知识编译器（Knowledge Compiler）

重点能力：

- 规范结构化
- 条文抽取
- 规则约束
- 知识关联
- 冲突检测
- 审查逻辑构建

长期方向：

- BIM 审查 Agent
- 规范合规审查 Agent
- 招投标审查 Agent
- IFC 数据校验 Agent

### 5. Daedalus（AI 研发工程师）

中文定位：AI 研发工程师

核心职责：

- Prompt Engineering
- Context Engineering
- Agent Workflow
- RAG / GraphRAG
- Embedding
- MCP
- Tool Calling
- Multi-Agent Orchestration

角色特征：

> AI Runtime 工程专家

Atlas 负责系统整体架构，Daedalus 负责 AI Runtime 体系。

重点方向：

- Hermes / OpenClaw 协同
- Context 裁剪
- Memory 管理
- Skill 编排
- Tool 治理
- 上下文防爆炸
- Agent 状态治理

### 6. Hephaestus（受控执行官）

中文定位：受控执行官 / 自动化工匠

核心职责：

- 自动生成代码
- 自动修复问题
- 自动改 UI
- 自动生成文档
- 自动执行脚本
- 自动部署
- 自动测试

角色特征：

> 真正干活的执行型 Agent

类似 Codex、Claude Code、OpenHands、Devin 这一类执行型 AI。

---

## 四、核心体系覆盖能力

| 能力方向 | Agent |
| --- | --- |
| 架构治理 | Atlas |
| 工程管理 | Mason |
| 质量控制 | Argus |
| 行业知识 | Vitruvius |
| AI 系统工程 | Daedalus |
| 自动执行 | Hephaestus |

---

## 五、第二阶段扩展 Agent

在核心马队稳定后，再逐步扩展专业兵种。

### 1. Euclid（结构力学专家）

中文定位：结构分析专家

方向：

- 梁系分析
- 桁架分析
- FEM
- 刚度矩阵
- 荷载分析
- 数值求解

长期目标：

- ArchSight Solver
- 结构力学求解器
- Web FEM 平台

### 2. Athena（知识治理官）

中文定位：知识治理官

方向：

- 标准体系治理
- 文档结构
- 版本管理
- 知识图谱治理
- 数据血缘
- 条文差异分析

适用方向：

- BIM 标准体系
- IFC 标准治理
- 规范修订管理

### 3. Mercury（AI 情报官）

中文定位：AI 情报官

方向：

- AI 行业资讯
- GitHub 趋势
- MCP 生态
- Agent 工程生态
- 开源项目分析
- 模型能力跟踪

适用方向：

- 每日 AI 情报推送
- 技术趋势分析
- 新工具评估

### 4. Janus（产品策略官）

中文定位：产品策略官

方向：

- SaaS 架构
- 商业模式
- MVP 边界
- 用户分层
- 平台路线
- 行业化路径

适用方向：

- 工程猿平台
- ArchSight 商业化
- AI 平台产品化

---

## 六、建议避免的问题

### 1. 避免人格秀

不要构建：

- 苏格拉底
- 爱因斯坦
- 马斯克
- 孙悟空

这类人格化聊天机器人。

原因：

> 缺乏工程生产力。

### 2. 避免角色重叠

不要同时存在：

- CTO
- 技术总监
- 架构专家 A
- 架构专家 B

这会导致：

- 上下文冲突
- 职责模糊
- Agent 内耗

### 3. 避免所有 Agent 都写代码

否则：

- 无治理
- 无评审
- 无边界
- 无质量控制

最终会让 AI 生成大型技术债。

---

## 七、长期方向

当前探索的并不是：

> “AI 辅助写代码”

而是：

> “AI 工程组织系统”

即：

> AI Team Operating System

---

## 八、长期核心能力

当前已经具备的方向包括：

- Skills
- OMX / OMCC
- Spec Kit
- gstack
- 多模型协同
- Hermes / OpenClaw
- GraphRAG
- 受控交付
- Agent Workflow
- Context Engineering

这些共同指向：

> AI 时代的软件研发组织形态。

---

## 九、当前仓库落地结构

当前已采用 `archsight-ai-os` 作为 AI Team OS 仓库，不再建议为第一阶段核心马队另建一个只保存 prompt 的独立仓库。

Agent 角色资产采用三层管理：

| 层 | 内容 | 作用 |
| --- | --- | --- |
| Source | `role.md` / `responsibilities.md` / `constraints.md` / `workflow.md` | 长期维护、沉淀角色资产 |
| Runtime | `system-prompt.md` | Hermes 创建 Agent 时直接使用 |
| Instance | Hermes / 飞书机器人 | 实际对话入口 |

第一阶段核心 Agent 在仓库中的结构为：

```text
archsight-ai-os/
├── agents/
│   ├── atlas/
│   │   ├── role.md
│   │   ├── responsibilities.md
│   │   ├── constraints.md
│   │   ├── workflow.md
│   │   └── system-prompt.md
│   ├── mason/
│   ├── argus/
│   ├── vitruvius/
│   ├── daedalus/
│   └── hephaestus/
├── workflows/
├── runtime/
├── governance/
├── knowledge/
└── docs/
```

---

## 十、推荐仓库名称

建议优先考虑：

- `ai-engineering-squad`
- `archsight-agents`
- `archsight-ai-team`
- `archsight-agent-system`
- `ai-team-os`
- `archsight-runtime`
- `archsight-labs-agents`

其中最推荐：

> `archsight-ai-team`

原因：

- 兼顾品牌
- 兼顾行业
- 兼顾 Agent
- 兼顾未来组织化方向
- 不局限于单一工具链

---

## 十一、维护原则

这份文档作为 AI 马队建设的初始规划基线。后续修改应遵循：

- 先更新职责边界，再扩展 Agent 数量。
- 先沉淀工作流，再固化 Prompt 或 Skill。
- 先验证核心六人组，再引入第二阶段扩展角色。
- 每个 Agent 都应有清晰职责、输入输出、适用场景和禁止事项。
- 避免以人格魅力替代工程生产力。
