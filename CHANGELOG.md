# 变更记录

## 1.1.0

### 调整

- 项目许可证从 MIT 升级为 Apache-2.0。
- README 增加商业边界说明，明确商业使用、二次分发、商标 / 品牌、托管服务、专有素材、支持和交付责任不随开源许可证自动授权。

### 验证

- `npm test`
- `npm run doctor`
- `npm run smoke:project`

## 1.0.1

### 发布说明

本版本优化 AIOS 的适用性边界：AIOS 明确作为建筑行业增强层，而不是通用任务替代器。安装 AIOS 后，建筑行业相关任务应获得更专业的证据链、工程边界、验证路径和行业判断；普通非建筑任务不再被强制套用 BIM、IFC、规范、审图或工程证据链假设。

### 调整

- 为所有 `aios-*` Skill 增加统一的适用性门槛：只有项目 profile、项目上下文或任务事实明确涉及建筑行业语义时，才启用行业增强。
- 强化 `aios-ceo` 的深度评审能力：默认要求先取证再判断，区分工程进展、生产可信度和商业验证。
- 更新 Skill、Workflow、Agent 路由和项目模板，避免泛用工程任务被错误路由到 AIOS 行业增强流程。
- 同步 Codex、Gemini 和 Antigravity 用户级安装资产，使本地工具读取新版边界规则。

### 验证

- `npm test`
- `npm run doctor`
- `npm run install:user`

## 1.0.0

首个面向开源准备的版本。

### 发布说明

本版本发布 ArchSight AIOS 的首批规则、Skill、Workflow、Runtime 路由和项目接入模板，重点服务 BIM / IFC / Revit / CAD、施工视觉 AI、建筑规范知识库、GraphRAG、智能审图和 AI Coding 治理。它让 Codex、Claude Code、Gemini 和 Antigravity 2.0 等工具在建筑行业 AI 研发项目中读取同一套规则、上下文和验收要求。

本版本同时明确 `aios-design` 的行业边界：它不是通用视觉美化或前端设计技能，而是建筑行业平台界面方案评审技能，用于判断审图工作台、BIM Viewer、规范检索、报告复核、构件问题列表和数据看板是否能支撑审查、定位、复核、追溯和交付。

### 新增

- `archsight-aios` CLI，包含 `install`、`doctor`、`init`、`validate` 和 Hermes 校验命令。
- 项目接入模板，覆盖 `AGENTS.md`、`CLAUDE.md`、`GEMINI.md`、`AI_CODING_RULES.md` 和 `.ai/`。
- 三类项目 profile：BIM / CAD / Revit 平台、施工视觉 AI、RAG / GraphRAG 规范知识库。
- 面向业务专家的参与指南、快速上手、术语表、贡献说明、安全策略、行为准则和 MIT 许可证。
- `aios-design` 和 `design-review` workflow，支持实现前评审建筑行业平台界面方案、证据定位、复核追溯和前端实现交接。

### 调整

- README 改为外部读者优先，先说明用途、适用人群、三步开始、项目生成内容和常用命令。
- `package.json` 补充 repository、keywords、homepage、issue tracker 和 MIT license。
- `aios-design` 将原先偏通用的视觉细节检查，调整为面向建筑行业工作台的“界面决策清晰度”，强调任务入口、证据定位、复核动作、状态反馈、长任务进度、失败恢复和实现验收。
- `design-review` workflow 补强图纸定位、模型定位、审查结论、长任务和专家复核检查项，并明确不替代通用 `frontend-design` 或 `frontend-generation`。
