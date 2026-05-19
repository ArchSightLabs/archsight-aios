# Agents

`agents/` 保存 Agent 组织定义。

普通使用者通常不需要记住这些 Agent 名字，也不需要手动指定某个 Agent。日常使用时，先执行 `archsight-aios init`，再按项目任务选择合适的 profile、Skill 或 Workflow 即可。Agent 名字是角色契约标签，用来帮助 AIOS 做任务路由、职责边界和运行时 prompt 管理。

这些角色不代表接入项目属于 ArchSightLabs，也不要求项目使用 Hermes、飞书或任何特定运行平台。建筑行业是当前重点覆盖方向，但只有项目启用相关 profile 或任务明确涉及 BIM / IFC / 规范 / 审图 / RAG 知识工程时，才应引入对应行业假设。

例如：

| 你要做的事 | 关注入口 |
| --- | --- |
| 接入项目 AI 规则 | `archsight-aios init` |
| BIM / IFC / Revit / CAD 项目 | `--profile bim-platform` |
| 施工视觉 AI 项目 | `--profile construction-vision` |
| 规范知识库 / GraphRAG 项目 | `--profile rag-knowledge` |
| 看某类任务怎么做 | `skills/` 和 `workflows/` |

维护者才需要关心 Agent 定义。每个 Agent 不应只保存 prompt，而应保存职责、边界、输入、输出、禁止事项、参与 workflow 和模型路由。

当前采用三层管理：

| 层 | 内容 | 作用 |
| --- | --- | --- |
| Source | `role.md` / `responsibilities.md` / `constraints.md` / `workflow.md` | 长期维护角色资产 |
| Runtime | `system-prompt.md` | 运行时可加载的最小提示词 |
| Instance / Adapter | Codex、Claude、Gemini、Hermes、飞书等 | 实际对话或协作入口 |

当前与规划 Agent：

| 内部名称 | 中文角色 | 定位 | 适用任务 |
| --- | --- | --- | --- |
| Atlas | 总架构师 | 核心 | 架构评审、技术路线、服务边界、复杂度治理。 |
| Mason | 工程总工 | 核心 | 交付计划、任务拆解、依赖排序、CI/CD 和发布路径。 |
| Argus | 代码审查官 | 核心 | Code Review、安全、性能、技术债、Prompt 注入和风险审查。 |
| Vitruvius | 建筑数字化专家 | 核心 | BIM / IFC、建筑规范、审图语义、工程数据建模。 |
| Daedalus | AI 研发工程师 | 核心 | RAG / GraphRAG、MCP、Tool Calling、Memory 和 Agent Runtime。 |
| Hephaestus | 受控执行官 | 核心 | 代码修改、脚本执行、测试、文档生成和受控交付。 |
| Euclid | 结构力学专家 | 按需 | 结构力学、荷载、FEM、计算流程和专业核验。 |
| Athena | 知识治理官 | 按需 | 知识源、版本、授权、Memory / RAG 入库和清理治理。 |
| Mercury | AI 情报官 | 按需 | AI 生态、模型能力、开源项目和工具链情报分析。 |
| Janus | 产品策略官 | 按需 | 产品目标、MVP 边界、用户场景、商业化和路线判断。 |
| Themis | QA 负责人 | 按需（规划） | UAT、试运行确认、测试策略、验收矩阵、回归覆盖、质量门禁和验证证据。 |
| Aegis | 运行可靠性官 | 按需（规划） | 部署、监控、事故响应、回滚演练、SRE 和运行风险治理。 |

## 治理责任面

这些角色不是单纯增加 Agent 名字，而是把研发工程治理拆成几个稳定责任面：

| 责任面 | 角色 | 关注点 |
| --- | --- | --- |
| 方向与边界 | Janus / Atlas | 产品目标、MVP、路线、架构边界、技术路线和复杂度。 |
| 计划与执行 | Mason / Hephaestus | 交付拆解、任务排序、发布路径、受控改代码、脚本执行、测试和交付。 |
| 质量与风险 | Argus / Themis | Code Review、安全、性能、技术债、Prompt 注入、UAT、试运行确认、测试策略、验收矩阵和验证证据。 |
| AI 工程专项 | Daedalus | RAG、GraphRAG、MCP、Tool Calling、Memory 和 Agent Runtime。 |
| 行业知识专项 | Vitruvius / Euclid / Athena | BIM / IFC、建筑规范、审图语义、工程数据、结构力学、知识源、版本、授权和 RAG / Memory 入库治理。 |
| 运行可靠性 | Aegis | 部署、监控、事故响应、回滚演练、SRE 和运行风险治理。 |
| 外部情报 | Mercury | 模型能力、AI 生态、开源项目和工具链趋势。 |

Themis 和 Aegis 当前只作为规划角色记录，不进入默认路由，也不要求项目立即创建运行时实例。Themis 对应 QA 责任面，重点覆盖 UAT、试运行确认、验收矩阵、回归覆盖和质量门禁；Aegis 对应运行可靠性责任面。等真实项目对 QA、生产运行和事故治理提出稳定需求后，再补齐角色 Source、Runtime Prompt、Skill 和 Workflow。

每个核心 Agent 目录至少包含：

- `role.md`
- `responsibilities.md`
- `constraints.md`
- `workflow.md`
- `system-prompt.md`
