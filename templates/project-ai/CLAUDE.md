# CLAUDE.md

> 本文件供 Claude 在当前业务项目中读取项目 AI 规则。  
> 通用编码规则只维护在 `AI_CODING_RULES.md`，本文件不复制规则正文。

## 必读入口

开始任何工作前，先阅读：

- `AI_CODING_RULES.md`
- `.ai/ARCHSIGHT_AIOS_RULES.md`
- `.ai/project-context.md`
- `.ai/agent-routing.md`
- `.ai/skills.md`
- `.ai/workflows.md`
- `.ai/profiles/*.md`（如当前项目启用了 profile）
- 项目自身的 `README.md`、`Makefile`、`scripts/` 或其他工程入口。

## Claude 入口适配

- 本文件只负责让 Claude 发现当前项目的公共规则和 `.ai/` 目录。
- ArchSight AIOS 只在 Agent 路由、Skill 选择、Workflow、交付验证、BIM / IFC、AI Runtime 或 Code Review 等相关任务中作为补充治理层生效。
- 任务适合 ArchSight 技能包时，按 `.ai/skills.md` 选择对应 `archsight-*` Skill；涉及流程协作时，按 `.ai/workflows.md` 选择 Workflow。
- 无法确认的行业知识、规范条文或运行时配置，应标注待核验。
