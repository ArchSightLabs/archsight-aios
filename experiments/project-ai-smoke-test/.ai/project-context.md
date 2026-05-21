# Project Context

## 项目名称

Project AI Smoke Test

## 项目定位

这是一个文档型沙盒项目，目标是验证 `templates/project-ai/` 能否作为具体业务项目的 ArchSight AI OS 接入模板使用。

核心场景：

- 验证项目级 `.ai/` 目录可以被 AI 助手读取。
- 验证架构评审任务可以选择 `aios-architecture-review` Skill。
- 验证接入不依赖 Hermes / 飞书 Runtime。
- 验证 Agent 与 Skill 的职责没有混用。

## 技术栈

- 前端：无
- 后端：无
- 数据库：无
- AI / RAG / Agent：仅验证 ArchSight AI OS 文档、Skill 路由和 Workflow 选择
- 部署环境：本地文件系统

## 代码结构

- `AGENTS.md`：Codex 项目入口。
- `GEMINI.md`：Gemini 项目入口。
- `.ai/project-context.md`：项目上下文。
- `.ai/agent-routing.md`：Agent 路由说明。
- `.ai/skills.md`：Skill 路由和启用状态。
- `.ai/workflows.md`：Workflow 选择规则。
- `SMOKE_TEST.md`：本地接入验证记录。

## 常用命令

```text
安装：无
开发：无
测试：人工读取 .ai/project-context.md、.ai/skills.md、.ai/workflows.md 并执行 SMOKE_TEST.md 中的评审任务
构建：无
Lint：无
类型检查：无
部署前检查：不适用
```

## 关键约束

- 不得修改：不得把 Hermes / 飞书入口当作本地工程验证的替代。
- 必须保持：Agent 是“谁来做”，Skill 是“怎么做”，Workflow 是“什么时候做、按什么顺序做”。
- 需要人工确认：模板接入规则变更、Runtime 权限扩大、业务项目实际执行权限放开。
- 已知风险：隐藏目录 `.ai/` 在部分文件列表命令中需要显式开启隐藏文件显示。

## 当前接入的 ArchSight AI OS 能力

- Agent：Atlas
- Skills：`aios-architecture-review`
- Workflows：`architecture-review`
- Runtime：本地项目工作区；不要求 Hermes 才能完成本 smoke test。
