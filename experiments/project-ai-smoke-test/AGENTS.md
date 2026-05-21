# AGENTS.md

> 本文件供 Codex 在具体业务项目中接入 ArchSight AIOS 时使用。

## 必读入口

开始任何工作前，先阅读：

- `.ai/project-context.md`
- `.ai/agent-routing.md`
- `.ai/skills.md`
- `.ai/workflows.md`
- 项目自身的 `README.md`、`Makefile`、`scripts/` 或其他工程入口。

## 工作原则

- 本项目工作目录是主战场，所有代码、测试、构建和文档修改都应基于当前项目上下文。
- ArchSight AIOS 提供 Agent、Skill、Workflow 和 Runtime 规范，不替代当前项目的真实代码和测试。
- 任务适合 ArchSight 技能包时，按 `.ai/skills.md` 选择对应 `aios-*` Skill。
- 涉及多角色协作时，按 `.ai/workflows.md` 选择 Workflow。

## 边界

- 不把 ArchSight AIOS 仓库内容无差别复制进当前项目。
- 不把 Hermes / 飞书入口当作本地工程验证的替代。
- 不在未经验证的状态下声称完成。

