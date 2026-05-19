# CLAUDE.md

> 本文件供 Claude 在具体业务项目中接入 ArchSight AIOS 时使用。

## 必读入口

开始任何工作前，先阅读：

- `AI_CODING_RULES.md`
- `.ai/ARCHSIGHT_AIOS_RULES.md`
- `.ai/project-context.md`
- `.ai/agent-routing.md`
- `.ai/skills.md`
- `.ai/workflows.md`
- 项目自身的 `README.md`、`Makefile`、`scripts/` 或其他工程入口。

## Claude 特别说明

- `AI_CODING_RULES.md` 是业务项目通用 AI 编码规则主体，本文件只做 Claude 入口适配。
- `.ai/ARCHSIGHT_AIOS_RULES.md` 是 AIOS 补充规则，只在 AIOS 相关任务中生效。
- 任务适合 ArchSight 技能包时，读取 `.ai/skills.md` 中对应 `archsight-*` Skill 的说明，按输入、工作流、输出格式和约束执行。
- 当前代码库事实优先于记忆、模板和通用知识。
- 无法确认的行业知识、规范条文或运行时配置必须标注待核验。
