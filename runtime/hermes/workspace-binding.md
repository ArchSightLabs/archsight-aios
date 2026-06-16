# Workspace Binding

## 定位

Workspace Binding 定义启用 Hermes / 飞书 Adapter 时，任务如何绑定到具体项目工作区。

没有绑定工作区时，Hermes 只能做咨询、计划和摘要；不能执行代码修改、测试或部署。

## 绑定信息

每个项目至少需要：

```text
项目名称：
仓库路径：
默认分支：
项目入口文档：
常用命令：
可用 Skills：
可用 Workflows：
权限边界：
人工确认人：
```

## 推荐项目结构

业务项目应复制：

```text
templates/project-ai/
├── AGENTS.md
├── CLAUDE.md
├── GEMINI.md
├── OPENCODE.md
├── AI_CODING_RULES.md
└── .ai/
    ├── project-context.md
    ├── agent-routing.md
    ├── skills.md
    └── workflows.md
```

## 执行流程

1. 飞书或 Hermes 接收任务。
2. 判断是否需要项目工作区。
3. 读取项目 `.ai/project-context.md`。
4. 选择 Workflow 和 Skill。
5. 在项目工作区执行。
6. 运行验证。
7. 回传结果和证据。

## 禁止事项

- 不在未绑定项目时执行代码任务。
- 不把 AIOS 仓库误当成业务项目仓库。
- 不把飞书聊天记录当作完整项目上下文。
- 不跳过项目本地测试和构建。
