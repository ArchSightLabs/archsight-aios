# ArchSight AI Team

ArchSight AI Team 是 ArchSightLabs 的 AI 研发组织操作系统（AI Team OS）仓库。

本仓库不是 prompt、agent 配置和技能包的简单集合，而是用于治理多模型协同、多 Agent 协同、行业知识工程、AI Coding Workflow、GraphRAG、受控执行环境和企业级 AI 研发平台的长期基础设施。

## 核心文档

- [AI Engineering Squad 计划](docs/ai-engineering-squad-plan.md)
- [AI Team OS 仓库架构](docs/ai-team-os-repository-architecture.md)

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
archsight-ai-team/
│
├── README.md
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

1. 建立 Agent 治理体系：边界、模型路由、workflow、review 机制。
2. 建立行业知识层：BIM、IFC、规范、结构知识、审查规则。
3. 建立受控交付体系：AI 生成、AI Review、自动测试、自动修复、人工确认和发布治理。
