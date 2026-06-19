# 变更记录

## 1.3.2

### 发布说明

本版本修复 v1.3.1 后在不同宿主中出现的 Skill 遵从度不一致问题。重点强化“短指令触发 AIOS”时的默认输出契约：用户只说“用 AIOS 分析该文档”且没有要求摘要时，默认输出标准详版报告，而不是几段概括性摘要。

### 调整

- 版本升级到 `1.3.2`，同步更新 npm package、Gemini extension、Claude plugin、runtime manifest 和 CLI MCP clientInfo。
- `aios` / `archsight-aios` 总入口明确短指令默认走“标准详版报告”，路由后仍要展开专项 Skill 的主表、清单或台账。
- 工程业务管理 Skill 增加“标准详版报告与输出自检”约束，覆盖招投标、合同、施工日报、会议纪要、变更签证和专项施工方案。
- 各工程业务 Skill 的 `openai.yaml` 默认提示补充“不要压缩成摘要”“资料来源”“主分析表或台账”“资料缺口”“人工复核”“AI 不应下结论事项”和“输出自检”。
- Prompt 评估策略新增“宿主遵从度受控评测”，用于区分 WorkBuddy、Codex、Gemini、Antigravity 等宿主差异和模型能力差异。

### 验证

- `npm run validate:skills`
- `npm test`
- `git diff --check`
- `npm pack --dry-run`

## 1.3.1

### 发布说明

本版本聚焦使用者体验：用户只需要记住 `aios` / `archsight-aios` 总入口，AIOS 自动按资料类型分流到合适 Skill；同时把工程业务管理 Skill 的用户可见输出模板改为中文字段，减少 `Source Map`、`Arbitration`、`Evidence`、`Decision`、`Need verify` 等英文标签对业务用户的干扰。

### 新增

- 新增 `aios` 和 `archsight-aios` 顶层路由 Skill，支持“请用 aios skill 分析该文档”这类短指令触发资料类型识别和自动分流。
- 新增 `aios-compare` 用户侧对比 Skill，用于比较两份文档、两个版本或两个 AI 输出哪份更专业、更适合交付。

### 调整

- 版本升级到 `1.3.1`，同步更新 npm package、Gemini extension、Claude plugin、runtime manifest 和 CLI MCP clientInfo。
- 将 `aios-prompt-compare` 收紧为内部 Prompt 测试工具，仅在明确调用 `aios-prompt-compare` 时触发，避免普通“对比”任务误路由。
- 工程业务管理 Skill 输出模板统一中文化：`资料来源清单`、`证据仲裁`、`证据`、`工具结果`、`处理建议：可继续 / 需核验 / 转人工复核`。
- README、WorkBuddy 适配说明、Skill 总览、运行时路由和项目模板补充总入口、对比 Skill 与内部测试 Skill 的边界说明。

### 验证

- `npm run validate:skills`
- `npm test`
- `git diff --check`

## 1.3.0

### 发布说明

本版本把 AIOS 从通用建筑行业技能包进一步扩展为可评测、可对比、可初始化到项目上下文的工程业务管理与 Prompt 治理工具包。重点补齐工程商务、合同、施工日报、会议、变更签证和专项方案场景的基础提示词资产，并新增 prompt 对比与评测脚本，让团队可以用同一套 fixture、run pack、结果校验和 scorecard 判断提示词是否值得沉淀为正式 Skill。

### 新增

- 新增 `aios-prompt-compare` Skill，用于对比弱提示词、便携强提示词和真实 Skill runtime 输出，并把结果纳入质量准入判断。
- 新增工程业务管理基础提示词资产，覆盖招投标、合同履约、施工日报、工程会议、变更签证和专项施工方案。
- 新增 Hestia、Plutus、Themis 等工程业务协同角色入口，强化行政人事协同、商务造价财务内控、法务合规的边界说明。
- 新增 prompt 评测 fixtures、公开咨询样例、run pack 构建、结果校验、模型输出校验、scorecard 校验和分析脚本。

### 调整

- 版本升级到 `1.3.0`，同步更新 npm package、Gemini extension、Claude plugin、runtime manifest 和 CLI MCP clientInfo。
- `init` 相关模板和 CLI 能力增强，可更好地根据项目线索推断 AIOS 项目上下文、profile 和入口文件。
- README、quickstart、glossary、公共发现文档和 runtime 路由补充工程业务管理与 prompt 治理说明。
- `validate:skills` 扩展校验范围，覆盖新增 skill、manifest、npm metadata 和工程业务管理资产。

### 验证

- `npm run validate:skills`
- `npm run validate:prompts`
- `npm run validate:prompt-run-pack`
- `npm run validate:public-advisory-run-pack`
- `npm run validate:prompt-run-results`
- `npm run validate:prompt-outputs`
- `npm run validate:prompt-scorecard`
- `npm run doctor`
- `npm run smoke:project`
- `npm test`
- `npx skills add . --list`
- `npm pack --dry-run`

## 1.2.0

### 发布说明

本版本把 AIOS 的定位从单纯“建筑 AI 研发工具包”扩展为面向建筑行业知识工作从业者与 AI 研发团队的技能包。除了 BIM / IFC、RAG / GraphRAG、智能审图、Runtime 和代码治理，也覆盖招投标、合同履约、施工日报、工程会议、变更签证和专项施工方案等工程资料证据链工作。

### 新增

- 新增 WorkBuddy 支持：`npx @archsight/aios install --target workbuddy --scope user` 会把 `aios-*` skills 安装到 `~/.workbuddy/skills/`。
- `install --target all --scope user` 现在会同时安装 WorkBuddy skills。
- 新增 `adapters/workbuddy/README.md`，说明 WorkBuddy 安装位置、调用示例和维护边界。
- 新增公共 skill 发现支撑：`gemini-extension.json`、`.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json`、`docs/PUBLIC_DISCOVERY.md` 和 `scripts/validate-skills.mjs`。
- `package.json` 增加 `agent-skills`、`skills-sh`、`gemini-cli`、`workbuddy`、`building-ai`、`project-evidence-work` 等检索关键词。

### 调整

- 版本升级到 `1.2.0`，同步更新 npm package、Gemini extension、Claude plugin 和 runtime manifest。
- About / marketplace / manifest 描述改为默认中文、附带英文检索短语：面向建筑行业知识工作从业者与 AI 研发团队。
- README 增加 WorkBuddy 安装位置、公共发现说明和发布前验证命令。

### 验证

- `npm run validate:skills`
- `npm test`
- `npx skills add . --list`
- `node --check scripts\validate-skills.mjs`
- `npm pack --dry-run`

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
- 结构力学挠度限值校核统一使用 `solver.beam_deflection_serviceability_check`，不再暴露容易误读为强度或稳定承载力校核的 `solver.beam_capacity_check` 命名，明确它是正常使用挠度校核。

### 兼容性说明

- `solver.beam_capacity_check` 未进入正式发布接口；新接入必须使用 `solver.beam_deflection_serviceability_check`。
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
