# Agent Routing

普通使用者不需要记住 Agent 名字，也不需要在每次提问时手动指定 Agent。优先按“任务类型”描述问题，让当前 AI 工具读取本文件、`.ai/skills.md` 和 `.ai/workflows.md` 后自动选择合适的角色与工作流。

如果你是业务专家，可以直接说：

- “请按 BIM / IFC 语义帮我拆解这条规则。”
- “请检查这个施工视觉检测结果应该如何人工复核。”
- “请把这组规范条文整理成 RAG / GraphRAG 评估问题。”

下面的 Agent 名字只是内部路由标签，不代表当前项目属于 ArchSightLabs，也不要求项目使用 Hermes、飞书或建筑行业技术栈。

## 基本关系

| 类型 | 含义 |
| --- | --- |
| Agent | 谁来做 |
| Skill | 怎么做 |
| Workflow | 什么时候做、按什么顺序做 |
| Runtime | 在哪里运行 |
| Capability | 用什么确定性工具或结构化知识提供证据 |

## 泛化边界

- 当前项目事实优先于 AIOS 通用角色说明。
- Hermes、飞书、OpenClaw、Codex、Claude、Gemini 等都是可选运行入口；未启用时不得写入项目假设。
- 建筑、BIM、IFC、规范、审图和 RAG / GraphRAG 知识工程能力通过 `.ai/profile-detection.md`、profile 或明确任务触发；普通项目不默认启用这些语义。
- AIOS 是建筑行业增强层；普通非建筑任务优先使用宿主工具的通用能力，不因为安装了 AIOS 就强制套用 `aios-*` Skill。
- 冲突仲裁按证据等级处理：人类硬约束、确定性工具、项目事实、结构化知识优先于 Agent 自然语言判断。

## 默认任务路由

| 任务 | 内部路由 | 说明 |
| --- | --- | --- |
| 建筑行业软件 / 系统深度评价、项目立项、产品定位、商业目标、范围取舍 | Janus | 产品策略官 |
| 产品体检、用户问题、版本范围、PRD、验收指标和试点 / UAT | Janus | 产品策略官，使用 `aios-product` |
| 建筑行业平台 UI / UX 设计方案、工作台体验、前端实现交接 | Janus | 产品策略官 |
| 建筑行业项目架构评审、技术选型、服务边界 | Atlas | 总架构师 |
| 建筑行业项目任务拆解、交付顺序、CI/CD | Mason | 工程总工 |
| 建筑行业项目 Code Review、安全、性能、技术债 | Argus | 代码审查官 |
| BIM、IFC、建筑规范、审图逻辑 | Vitruvius | 建筑数字化专家 |
| 结构力学、荷载、FEM、结构计算工具链 | Euclid | 结构力学专家 |
| 建筑行业 RAG、GraphRAG、MCP、Memory、Tool Calling | Daedalus | AI 研发工程师 |
| Prompt / Skill 输出对比、weak/basic/runtime 三栏评测 | Daedalus | AI 研发工程师 |
| 建筑行业项目代码修改、脚本执行、测试、文档生成 | Hephaestus | 受控执行官 |
| 工程标书 / 技术标生成、改写和历史素材复用 | Mason | 工程总工，使用 `aios-tender-write`，生成后回到 `aios-commercial-tender` 复核 |
| 专项施工方案生成、改写和历史方案复用 | Vitruvius | 建筑数字化专家，使用 `aios-scheme-write`，生成后回到 `aios-construction-scheme` 复核 |

## 升级规则

- 涉及长期架构、服务边界、数据模型：升级给 Atlas。
- 涉及立项、定位、商业目标、范围取舍：升级给 Janus。
- 涉及产品体检、用户问题、版本范围、PRD、产品优先级、验收指标或试点 / UAT：升级给 Janus，并使用 `aios-product`。
- 涉及页面方案、工作台体验、交互状态和前端实现交接：升级给 Janus，并使用 `aios-design`。
- 涉及多模块交付、任务依赖、发布顺序：升级给 Mason。
- 涉及标书、技术标、投标响应章节生成或历史标书素材复用：升级给 Mason，并使用 `aios-tender-write`；生成后必须交给 `aios-commercial-tender` 审核门禁。
- 涉及权限、安全、生产发布、AI 生成代码：升级给 Argus。
- 涉及行业规范、BIM / IFC、审图语义：升级给 Vitruvius。
- 涉及专项施工方案、施工技术措施、交底材料生成或历史方案素材复用：升级给 Vitruvius，并使用 `aios-scheme-write`；生成后必须交给 `aios-construction-scheme` 审核门禁。
- 涉及结构力学、荷载、边界条件、FEM 或结构计算工具链：升级给 Euclid。
- 涉及 RAG、GraphRAG、MCP、Memory、Tool：升级给 Daedalus。
- 涉及提示词效果、weak/basic 对照、真实 Skill 输出比较或是否应沉淀为 Skill：升级给 Daedalus，并使用 `aios-prompt-compare`。
- 具体实现和验证：交给 Hephaestus。
- Capability 返回阻断结果、证据缺失或工具不可用：停止执行并输出 `Claim / Evidence / Tool Result / Decision`。
