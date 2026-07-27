# Skill Routing

## 定位

本文件定义 ArchSight AIOS 中任务到 Skill、Agent 和 Workflow 的路由关系。

基本关系：

| 类型 | 含义 |
| --- | --- |
| Agent | 谁来做 |
| Skill | 怎么做 |
| Workflow | 什么时候做、按什么顺序做 |
| Runtime | 在哪里运行 |

## 默认路由表

| 任务类型 | 推荐 Skill | 主 Agent | 推荐 Workflow |
| --- | --- | --- | --- |
| AIOS 总入口、资料类型识别和 Skill 自动路由 | `aios` | Daedalus | `review` |
| ArchSight AIOS 总入口别名和自然语言调用 | `archsight-aios` | Daedalus | `review` |
| 建筑行业软件 / 系统深度评价、项目立项、产品定位、商业目标、范围取舍 | `aios-ceo` | Janus | `review` |
| 建筑行业平台界面方案、工作台体验、复核追溯和前端实现交接 | `aios-design` | Janus | `design-review` |
| 建筑行业项目中的架构评审、技术选型、服务边界 | `aios-arch` | Atlas | `architecture-review` |
| 架构健康扫描、基线差分、临时预算、棘轮门禁和 SARIF | `aios-arch-health` | Atlas | `architecture-review` |
| 建筑行业项目中的 Feature 拆解、交付计划、任务依赖 | `aios-plan` | Mason | `feature-development` |
| 建筑行业项目中的 PR / diff / AI 生成代码审查 | `aios-review` | Argus | `code-review` |
| 建筑行业项目中的 Bug 修复、测试失败、构建失败 | `aios-exec` | Hephaestus | `bug-fixing` |
| BIM / IFC / 建筑规范 / 审图规则 | `aios-knowledge` | Vitruvius | `rag-pipeline` |
| 结构力学 / 荷载 / FEM / 确定性求解链路 | `aios-structural` | Euclid | `architecture-review` |
| 建筑行业项目中的 Prompt / Context / Memory / MCP / Tool | `aios-runtime` | Daedalus | `architecture-review` |
| 建筑行业知识库 / 工程知识 RAG / GraphRAG Pipeline | `aios-runtime` | Daedalus | `rag-pipeline` |
| 开发者明确调用 `aios-prompt-compare` 时，做 weak/basic/runtime 内部评测 | `aios-prompt-compare` | Daedalus | `quality-readiness` |
| 用户明确调用 `aios-compare` 时，比较两份文档、两个版本或两个 AI 输出哪份更专业 | `aios-compare` | Daedalus | `review` |
| 建筑行业项目中的受控代码修改、文档、脚本、测试 | `aios-exec` | Hephaestus | `feature-development` |
| 工程招投标通用入口，按意图区分写作或审核 | `aios-tender` | Mason | `review` |
| 工程招投标审核、评分点、废标风险和技术标资料矩阵 | `aios-tender-audit` | Mason | `review` |
| 原工程商务招投标领域入口，保留既有培训和内部流程命令 | `aios-commercial-tender` | Mason | `review` |
| 工程标书、技术标和投标响应章节生成 / 改写 / 历史素材复用 | `aios-tender-write` | Mason | `feature-development` |
| 技术标历史 DOCX 母版保真改写、盘点母版、生成修改单、写入阶段版 Word、扫描旧项目残留 | `aios-tender-write` | Mason | `tender-docx-rewrite` |
| 工程合同审核 / 履约节点 / 付款条件 / 责任边界 / 资料缺口 | `aios-contract-audit` | Themis | `review` |
| 工程补充协议 / 合同条款 / 履约通知 / 函件草稿生成和改写 | `aios-contract-draft` | Themis | `feature-development` |
| 工程合同履约节点、付款条件、责任边界和资料缺口 | `aios-commercial-contract` | Themis | `review` |
| 工程现场日报通用入口 / 自动区分生成和复核 | `aios-daily` | Mason | `site-daily-loop` |
| 施工日报 / 项目日报 / 周报素材生成、改写和现场记录整理 | `aios-daily-write` | Mason | `site-daily-loop` |
| 施工日报、现场异常、项目群记录和问题追踪台账 | `aios-construction-daily` | Mason | `site-daily-loop` |
| 工程会议纪要通用入口 / 自动区分生成和复核 | `aios-meeting` | Mason | `site-daily-loop` |
| 工程会议纪要 / 待办清单 / 下次追踪生成和改写 | `aios-meeting-write` | Mason | `site-daily-loop` |
| 工程会议纪要、待办闭环、遗留争议和下次追踪 | `aios-construction-meeting` | Mason | `site-daily-loop` |
| 工程变更签证资料链、联系单、图纸变更和索赔线索 | `aios-commercial-variation` | Plutus | `site-daily-loop` |
| 专项施工方案通用入口，按意图区分写作或审核 | `aios-scheme` | Vitruvius | `review` |
| 专项施工方案审核、危险源、交底要点和规范 / 计算书复核清单 | `aios-scheme-audit` | Vitruvius | `review` |
| 原工程施工专项方案领域入口，保留既有培训和内部流程命令 | `aios-construction-scheme` | Vitruvius | `review` |
| 专项施工方案、施工技术措施和交底材料生成 / 改写 / 历史方案复用 | `aios-scheme-write` | Vitruvius | `feature-development` |

## 路由原则

- 优先按任务类型选择 Skill，而不是按 Agent 名称选择。
- 当用户只说“请用 AIOS 技能包分析该文档”或“请用 ArchSight AIOS 分析这份资料”时，先使用 `aios` / `archsight-aios` 总入口识别资料类型，再路由到具体 `aios-*` Skill。
- Skill 使用 `aios-*` 前缀，避免与通用技能包混淆。
- 所有 `aios-*` Skill 都服务建筑行业平台研发；差异在任务分工，而不是行业归属。
- AIOS 是建筑行业增强层，不是通用任务替代器；普通非建筑任务优先使用宿主工具的通用能力，不强行套用 BIM、IFC、规范、审图或工程证据链假设。
- 是否启用行业增强，先看 `.ai/profile-detection.md`、项目 profile、`.ai/project-context.md`、README 和当前任务；不确定时先核验上下文，不凭 Skill 名称硬套。
- `aios-ceo` 用于一把手视角的建筑行业软件 / 系统深度评价，把产品定位、行业专业性、工程可信度、证据链、商业验证和范围取舍放到同一决策框架里；它可以引用架构和行业语义事实作为 CEO 判断依据，但不替代 `aios-arch` 或 `aios-knowledge` 的专项设计与专业结论。
- `aios-design` 用于实现前判断界面方案是否支撑建筑行业审查、定位、复核、追溯和交付；不替代 `frontend-generation` 的 UI 实现、布局验证和交互验证，也不替代通用 `frontend-design` 的视觉风格和前端代码美化评审。
- `aios-arch` 应补足通用架构评审缺失的建筑行业平台视角，包括 BIM / IFC、规范知识链路、审图证据链、RAG / GraphRAG、任务编排、审计和后端运行可靠性。
- `aios-arch-health` 负责确定性架构事实、基线、预算和门禁；`aios-arch` 负责解释深 Module、合理复杂度和职责混杂。推断不得冒充 measured 事实。
- `aios-structural` 用于结构力学、荷载、边界条件、FEM 和求解器接口评审；它不能替代结构工程师签审，关键数值必须来自 Capability 或项目已有求解器证据。
- `aios-tender`、`aios-tender-audit`、`aios-tender-write`、`aios-contract-audit`、`aios-contract-draft`、`aios-daily`、`aios-daily-write`、`aios-meeting`、`aios-meeting-write`、`aios-scheme`、`aios-scheme-audit` 和 `aios-scheme-write` 是更短的任务型入口，适合新用户自助试用和正式技能包对外展示。
- `aios-commercial-tender`、`aios-commercial-contract`、`aios-commercial-variation`、`aios-construction-daily`、`aios-construction-meeting` 和 `aios-construction-scheme` 保留原有领域型入口含义，适合已经培训和内部流程沉淀过这些命令的团队。
- 工程业务管理 Skill 只处理建筑工程资料的抽取、生成初稿、证据链整理、风险提示和人工复核分流，不扩展为通用 HR、行政、财务 Skill。
- `aios-tender-write`、`aios-contract-draft`、`aios-daily-write`、`aios-meeting-write` 和 `aios-scheme-write` 是写作 / 草拟型 Skill，默认使用 Markdown 工作母版；生成后必须分别交回 `aios-tender-audit`、`aios-contract-audit`、`aios-construction-daily`、`aios-construction-meeting` 和 `aios-scheme-audit` 做审核门禁，旧流程也可以继续交回 `aios-commercial-tender`、`aios-commercial-contract`、`aios-construction-daily`、`aios-construction-meeting` 或 `aios-construction-scheme`。
- 工程业务 Agent 分工：技术标以 Mason 为主；合同法律边界以 Themis 为主；变更签证、工程款、结算和成本线索以 Plutus 为主；会议纪要中的行政、人事、证照和组织协同事项由 Hestia 辅助分流；施工方案以 Vitruvius 为主，涉及结构计算时升级给 Euclid，涉及现场组织和交付时由 Mason 协同。
- 工程业务管理基础场景可先参考 `skills/engineering-business-starter-kit.md` 和各 Skill 目录下的 `prompts/basic-prompt.md`，形成矩阵、清单、台账和复核问题；涉及金额、工期、责任、合规、质量安全、结构计算或法律意见时，再按对应 Skill 的证据链和人工复核规则升级。
- `aios-compare` 用于普通两份文档 / 两个版本 / 两个 AI 输出的专业度对比；不做 weak / portable / skill-runtime 提示词评测。
- `aios-prompt-compare` 是内部测试工具，只在开发者明确调用 `aios-prompt-compare` 时使用，用于评估 weak / portable / skill-runtime 三类输出差异；其中 `skill-runtime` 必须来自真实 Skill 触发结果，不把 `SKILL.md` 当普通 prompt 粘贴运行的结果冒充为 Skill 输出。
- Agent 可以调用多个 Skill；Skill 也可以被多个 Agent 复用。
- 项目工作目录中的事实优先于 AIOS 的通用模板。
- Hermes / 飞书只是可选入口和调度适配器，不替代本地验证，也不是 AIOS 的必要前提。
- 多 Agent 冲突时，按 `governance/arbitration-protocol.md` 仲裁；Capability 返回值、项目事实和结构化知识优先于 Agent 自然语言判断。

## 升级规则

- 涉及服务边界、数据模型、长期架构：升级给 Atlas。
- 涉及建筑行业软件 / 系统深度评价、立项、定位、商业目标和范围取舍：升级给 Janus，并优先使用 `aios-ceo`。
- 涉及页面方案、工作台体验、证据定位、复核追溯、交互状态和前端实现交接：升级给 Janus，并使用 `aios-design`。
- 涉及任务依赖、交付顺序、CI/CD：升级给 Mason。
- 涉及安全、权限、Prompt 注入、生产发布：升级给 Argus。
- 涉及 BIM、IFC、规范条文和审图语义：升级给 Vitruvius。
- 涉及结构力学、荷载、边界条件、FEM 或结构计算工具链：升级给 Euclid，并优先使用 `aios-structural`。
- 涉及 RAG、GraphRAG、MCP、Tool Calling、Memory：升级给 Daedalus。
- 涉及普通两份文档或两个 AI 输出差异对比：升级给 Daedalus，并使用 `aios-compare`。
- 涉及提示词效果、weak/basic 对照、Skill 运行结果对比或是否应沉淀为 Skill：只有用户明确调用 `aios-prompt-compare` 时升级给 Daedalus 并使用该 Skill。
- 涉及具体代码、脚本、测试、文档执行：交给 Hephaestus。
- 涉及工程现场日报或会议闭环：升级给 Mason 编排 `site-daily-loop`；未区分生成或复核时先调用 `aios-daily` 或 `aios-meeting`，生成日报 / 纪要草稿时调用 `aios-daily-write` 或 `aios-meeting-write`，审核台账和闭环时调用 `aios-construction-daily` 或 `aios-construction-meeting`；会议中出现证照、继续教育、实名制、工资或组织协同时由 Hestia 辅助分流。
- 涉及工程合同、招投标、变更签证或专项施工方案：按风险类型分别交给 Themis、Mason、Plutus、Vitruvius 或 Euclid；涉及法律、金额、工期、责任、规范、计算或签审结论时必须保留人工复核或 Capability 证据。

## 项目接入

业务项目接入时，应运行 `archsight-aios init`。CLI 默认创建通用 `.ai/` 底座、自动生成 `.ai/profile-detection.md` 和预填 `.ai/project-context.md`，再由当前任务和识别结果路由到对应 Skill；不要求用户先手动勾选 Skill。

## 维护规则

- 新增 Skill 时必须更新本文件。
- 新增 Workflow 时必须更新对应路由。
- 不允许将 Agent 定义直接改造成 Skill。
- 不允许让 Runtime 配置直接承载复杂角色资产。
