# ArchSight AI OS

ArchSight AI OS 是 ArchSightLabs 的 AI 研发组织操作系统仓库。

本仓库不是 prompt、agent 配置和技能包的简单集合，而是用于治理多模型协同、多 Agent 协同、行业知识工程、AI Coding Workflow、GraphRAG、受控执行环境和企业级 AI 研发平台的长期基础设施。

## 核心文档

- [AI 编码规范（公共）](AI_CODING_RULES.md)
- [AI Engineering Squad 计划](docs/ai-engineering-squad-plan.md)
- [AI Team OS 仓库架构](docs/ai-team-os-repository-architecture.md)

## AI 工具入口

`AI_CODING_RULES.md` 是唯一公共规范正文。各工具入口文件只做适配，不复制规范内容：

- [AGENTS.md](AGENTS.md)：Codex 入口
- [CLAUDE.md](CLAUDE.md)：Claude 入口
- [GEMINI.md](GEMINI.md)：Gemini 入口
- [OPENCODE.md](OPENCODE.md)：opencode 入口

[governance/coding-rules.md](governance/coding-rules.md) 是治理目录中的登记入口，指向同一份公共规范。

## 初始定位

本项目不是构建“聊天机器人集合”，而是沉淀一个面向建筑行业数字化与 AI 工程研发的团队治理中心。

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

## 管理范围

| 维度 | 内容 |
| --- | --- |
| Agent 定义 | 角色、职责、边界、输入输出 |
| Workflow | 多 Agent 协作流程与验收路径 |
| Skills | 可复用能力插件与工具约束 |
| Prompt 体系 | 系统 Prompt、版本、评估与失效案例 |
| Knowledge | 建筑行业知识体系 |
| Runtime | Hermes / OpenClaw / Gateway 运行治理 |
| Governance | 工程治理、安全、上下文、记忆和交付策略 |
| Memory | 长期记忆体系 |
| Experiments | 实验、验证与对比记录 |
| Standards | BIM / IFC / 行业规范体系 |
| Delivery | AI 生成、评审、测试、发布和回滚 |

## 目录规划

```text
archsight-ai-os/
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

## 当前优先级

1. 将仓库治理对象明确为 `runtime`、`workflow`、`governance`、`delivery`、`memory`。
2. 建立统一 workflow：feature 开发、bug 修复、review、release、frontend 生成。
3. 建立统一 Agent Routing，控制模型成本、上下文和执行边界。

边界说明：`.ai/` 是具体业务项目的项目级 AI 治理目录，不属于本仓库根结构。本仓库只维护 AI OS 的统一规范、流程、路由和治理资产。
