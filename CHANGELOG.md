# 变更记录

## 1.1.0

### 发布说明

本版本把 AIOS 从“规则 / Skill / Workflow 工具包”扩展到可调用本地确定性工具证据的治理闭环。重点新增 Capability Registry、Capability Adapter 和仲裁协议，并与 `archsight-solver` 的本地 stdio MCP tools 对齐，让 Euclid / `aios-structural` 在结构力学任务中能够要求或调用梁、平面框架、平面桁架求解结果，而不是由 LLM 直接口算工程结论。

本版本同时完成开源许可证和商业边界调整，为后续公开发布、商业使用和二次分发提供更清晰的法律与责任边界。

### 新增

- 新增 Capability Registry、Capability Registry Schema 和本地 Capability Adapter 配置，定义工具权限、输入 / 输出契约、证据字段和阻断规则。
- 新增 `governance/arbitration-protocol.md`，按人工硬约束、确定性工具、项目事实、结构化知识和 Agent 判断的证据等级仲裁交付结论。
- 新增 `aios-structural` Skill 和 Euclid 结构力学路由，用于梁、荷载、边界条件、FEM 输入输出、结构计算工具链和签审风险评审。
- 新增 `archsight-aios capability:call` 本地调用闭环：校验 Agent / Skill 权限、校验输入 schema、调用 stdio MCP tool、校验输出证据契约并返回仲裁 Decision。
- 新增对 `archsight-solver` 本地 MCP tools 的 AIOS Capability 对接：
  - `solver.beam_deflection`
  - `solver.beam_deflection_serviceability_check`
  - `solver.frame_displacement`
  - `solver.truss_member_force`
- 新增 CLI 测试覆盖 Capability 调用、MCP tool 映射、未授权 Agent 拒绝和项目模板校验。

### 调整

- 项目许可证从 MIT 升级为 Apache-2.0。
- README 增加商业边界说明，明确商业使用、二次分发、商标 / 品牌、托管服务、专有素材、支持和交付责任不随开源许可证自动授权。
- README 增加本地调用 `archsight-solver` 的 Capability 示例，并避免写死个人机器路径。
- `aios-arch`、`aios-review`、`aios-runtime`、`aios-exec` 等 Skill 增加 Capability / Tool Result / Evidence / Decision 的证据链要求。
- 架构评审、Feature 开发和 RAG Pipeline workflow 增加 Capability-backed arbitration 要求。
- 结构力学挠度限值校核使用 `solver.beam_deflection_serviceability_check` 作为正式 Capability 命名，明确它是正常使用挠度校核，不是强度、稳定或规范承载力设计。

### 兼容性说明

- `solver.beam_deflection_serviceability_check` 是本版本发布的正式挠度正常使用校核接口。
- `archsight-solver` 仍是本地可选 Adapter，不是 AIOS 安装的强依赖。没有相邻 solver 仓库或未设置 `ARCHSIGHT_SOLVER_HOME` 时，Capability 调用会报告本地 adapter cwd 不存在。
- 当前 MCP 对接仅声明本地 stdio 调用，不开放远程 HTTP / SSE / Gateway 鉴权模型。

### 验证

- `npm test`
- `npm run doctor`
- `npm run smoke:project`
- `npm pack --dry-run`
- 真实本地 MCP smoke：`solver.beam_deflection`、`solver.beam_deflection_serviceability_check`、`solver.frame_displacement`、`solver.truss_member_force`

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
