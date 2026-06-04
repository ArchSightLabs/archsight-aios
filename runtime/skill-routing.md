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
| 建筑行业软件 / 系统深度评价、项目立项、产品定位、商业目标、范围取舍 | `aios-ceo` | Janus | `review` |
| 建筑行业平台界面方案、工作台体验、复核追溯和前端实现交接 | `aios-design` | Janus | `design-review` |
| 建筑行业项目中的架构评审、技术选型、服务边界 | `aios-arch` | Atlas | `architecture-review` |
| 建筑行业项目中的 Feature 拆解、交付计划、任务依赖 | `aios-plan` | Mason | `feature-development` |
| 建筑行业项目中的 PR / diff / AI 生成代码审查 | `aios-review` | Argus | `code-review` |
| 建筑行业项目中的 Bug 修复、测试失败、构建失败 | `aios-exec` | Hephaestus | `bug-fixing` |
| BIM / IFC / 建筑规范 / 审图规则 | `aios-knowledge` | Vitruvius | `rag-pipeline` |
| 结构力学 / 荷载 / FEM / 确定性求解链路 | `aios-structural` | Euclid | `architecture-review` |
| 建筑行业项目中的 Prompt / Context / Memory / MCP / Tool | `aios-runtime` | Daedalus | `architecture-review` |
| 建筑行业知识库 / 工程知识 RAG / GraphRAG Pipeline | `aios-runtime` | Daedalus | `rag-pipeline` |
| 建筑行业项目中的受控代码修改、文档、脚本、测试 | `aios-exec` | Hephaestus | `feature-development` |
| 工程招投标响应、评分点、废标风险和技术标资料矩阵 | `aios-commercial-tender` | Mason | `review` |
| 工程合同履约节点、付款条件、责任边界和资料缺口 | `aios-commercial-contract` | Argus | `review` |
| 施工日报、现场异常、项目群记录和问题追踪台账 | `aios-construction-daily` | Mason | `site-daily-loop` |
| 工程会议纪要、待办闭环、遗留争议和下次追踪 | `aios-construction-meeting` | Mason | `site-daily-loop` |
| 工程变更签证资料链、联系单、图纸变更和索赔线索 | `aios-commercial-variation` | Argus | `site-daily-loop` |
| 专项施工方案、危险源、交底要点和规范 / 计算书复核清单 | `aios-construction-scheme` | Vitruvius | `review` |

## 路由原则

- 优先按任务类型选择 Skill，而不是按 Agent 名称选择。
- Skill 使用 `aios-*` 前缀，避免与通用技能包混淆。
- 所有 `aios-*` Skill 都服务建筑行业平台研发；差异在任务分工，而不是行业归属。
- AIOS 是建筑行业增强层，不是通用任务替代器；普通非建筑任务优先使用宿主工具的通用能力，不强行套用 BIM、IFC、规范、审图或工程证据链假设。
- 是否启用行业增强，先看项目 profile、`.ai/project-context.md`、README 和当前任务；不确定时先核验上下文，不凭 Skill 名称硬套。
- `aios-ceo` 用于一把手视角的建筑行业软件 / 系统深度评价，把产品定位、行业专业性、工程可信度、证据链、商业验证和范围取舍放到同一决策框架里；它可以引用架构和行业语义事实作为 CEO 判断依据，但不替代 `aios-arch` 或 `aios-knowledge` 的专项设计与专业结论。
- `aios-design` 用于实现前判断界面方案是否支撑建筑行业审查、定位、复核、追溯和交付；不替代 `frontend-generation` 的 UI 实现、布局验证和交互验证，也不替代通用 `frontend-design` 的视觉风格和前端代码美化评审。
- `aios-arch` 应补足通用架构评审缺失的建筑行业平台视角，包括 BIM / IFC、规范知识链路、审图证据链、RAG / GraphRAG、任务编排、审计和后端运行可靠性。
- `aios-structural` 用于结构力学、荷载、边界条件、FEM 和求解器接口评审；它不能替代结构工程师签审，关键数值必须来自 Capability 或项目已有求解器证据。
- `aios-commercial-tender`、`aios-commercial-contract`、`aios-construction-daily`、`aios-construction-meeting`、`aios-commercial-variation` 和 `aios-construction-scheme` 属于工程业务管理增强；它们只处理建筑工程资料的抽取、证据链整理、风险提示和人工复核分流，不扩展为 HR、行政、财务等通用职能 Skill。
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
- 涉及具体代码、脚本、测试、文档执行：交给 Hephaestus。
- 涉及工程现场日报、会议闭环或变更签证线索：升级给 Mason 编排 `site-daily-loop`，并按资料类型调用 `aios-construction-daily`、`aios-construction-meeting` 或 `aios-commercial-variation`。
- 涉及工程合同、招投标或专项施工方案：按风险类型分别交给 Argus、Mason 或 Vitruvius；涉及规范、计算或签审结论时必须保留人工复核或 Capability 证据。

## 项目接入

业务项目接入时，应复制 `templates/project-ai/`，并在 `.ai/skills.md` 中按项目实际情况启用 Skills。

## 维护规则

- 新增 Skill 时必须更新本文件。
- 新增 Workflow 时必须更新对应路由。
- 不允许将 Agent 定义直接改造成 Skill。
- 不允许让 Runtime 配置直接承载复杂角色资产。
