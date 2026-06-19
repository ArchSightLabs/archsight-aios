# Skills

## 使用原则

Skill 是“怎么做”，不是“谁来做”。本项目优先使用已启用的 ArchSight AIOS Skill，避免与通用技能包混淆。

ArchSight AIOS 的 Skill 是面向建筑行业平台研发的治理能力；`aios` / `archsight-aios` 是总路由入口，其他 `aios-*` 前缀表示来源和命名空间，不表示当前项目属于 ArchSightLabs。

AIOS 是建筑行业增强层，不是通用任务替代器。只有当前项目 profile、项目上下文或用户任务明确涉及 BIM / IFC / Revit / CAD、建筑规范、智能审图、施工视觉、工程知识库、GraphRAG、图纸 / 模型处理、证据链、人工复核、审计留痕或建筑行业平台时，才启用行业增强。普通非建筑任务优先使用宿主工具的通用能力，不强行套用建筑行业假设。

## Skill 路由

| 任务 | Skill | 主 Agent |
| --- | --- | --- |
| AIOS 总入口、资料类型识别和 Skill 自动路由 | `aios` | Daedalus |
| ArchSight AIOS 总入口别名和自然语言调用 | `archsight-aios` | Daedalus |
| 建筑行业软件 / 系统深度评价、项目立项 / 产品定位 / 商业目标 | `aios-ceo` | Janus |
| 建筑行业平台 UI / UX 设计方案 / 工作台体验 | `aios-design` | Janus |
| 建筑行业项目架构评审 | `aios-arch` | Atlas |
| 建筑行业项目交付计划 | `aios-plan` | Mason |
| 建筑行业项目代码审查 | `aios-review` | Argus |
| BIM / IFC / 建筑知识建模 | `aios-knowledge` | Vitruvius |
| 结构力学 / 荷载 / FEM / 确定性求解链路 | `aios-structural` | Euclid |
| 建筑行业 AI Runtime / RAG / MCP / Memory | `aios-runtime` | Daedalus |
| 两份文档、两个版本或两个 AI 输出专业度对比 | `aios-compare` | Daedalus |
| 内部 Prompt / Skill 测试、weak/basic/runtime 三栏评测 | `aios-prompt-compare` | Daedalus |
| 建筑行业项目受控实现 / 测试 / 文档 / 脚本 | `aios-exec` | Hephaestus |
| 工程招投标响应 / 评分点 / 废标风险 / 技术标资料矩阵 | `aios-commercial-tender` | Mason |
| 工程标书 / 技术标生成、改写和历史素材复用 | `aios-tender-write` | Mason |
| 工程合同履约节点 / 付款条件 / 责任边界 / 资料缺口 | `aios-commercial-contract` | Themis |
| 施工日报 / 现场异常 / 项目群记录 / 问题追踪台账 | `aios-construction-daily` | Mason |
| 工程会议纪要 / 待办闭环 / 遗留争议 / 下次追踪 | `aios-construction-meeting` | Mason |
| 工程变更签证资料链 / 联系单 / 图纸变更 / 索赔线索 | `aios-commercial-variation` | Plutus |
| 专项施工方案 / 危险源 / 交底要点 / 规范和计算书复核 | `aios-construction-scheme` | Vitruvius |
| 专项施工方案 / 施工技术措施生成、改写和历史方案复用 | `aios-scheme-write` | Vitruvius |

## 本项目可用的 Skills

默认不要求用户手动勾选 Skill。`archsight-aios init` 会生成 `.ai/profile-detection.md` 和 `.ai/project-context.md`，当前 AI 工具应结合项目事实、用户任务、资料类型和自动识别结果选择合适的 Skill。

- `aios`
- `archsight-aios`
- `aios-arch`
- `aios-ceo`
- `aios-design`
- `aios-plan`
- `aios-review`
- `aios-knowledge`
- `aios-structural`
- `aios-runtime`
- `aios-compare`
- `aios-prompt-compare`
- `aios-exec`
- `aios-commercial-tender`
- `aios-tender-write`
- `aios-commercial-contract`
- `aios-construction-daily`
- `aios-construction-meeting`
- `aios-commercial-variation`
- `aios-construction-scheme`
- `aios-scheme-write`

## 启用规则

- 优先读取 `.ai/profile-detection.md` 和 `.ai/project-context.md`，再按任务类型选择 Skill。
- 涉及建筑行业软件 / 系统评价、项目立项、产品定位、商业目标、范围取舍或阶段路线时，优先启用 `aios-ceo`。
- 涉及建筑行业平台 UI / UX 方案、工作台体验、交互状态、响应式或前端实现交接时，优先启用 `aios-design`。
- 只有启用建筑、BIM、IFC、规范知识库、GraphRAG 或智能审图 profile 时，才默认启用 `aios-knowledge`。
- 涉及结构力学、荷载、FEM、结构计算工具链或工程安全风险时，启用 `aios-structural`；关键数值必须来自确定性求解器或项目已有计算书。
- 涉及工程招投标、合同履约、施工日报、工程会议、变更签证或专项施工方案时，可按资料类型启用工程业务管理 Skill；这些 Skill 只做证据链整理、生成初稿和人工复核分流，不替代正式签审。
- 涉及标书、技术标或专项施工方案的生成、改写、历史素材复用时，优先启用 `aios-tender-write` 或 `aios-scheme-write`；生成后必须回到 `aios-commercial-tender` 或 `aios-construction-scheme` 做审核门禁。
- 涉及两份文档、两个版本或两个 AI 输出哪份更专业、更可复核、更适合交付时，启用 `aios-compare`。
- 涉及提示词效果、weak/basic 对照、真实 Skill 输出比较或是否应沉淀为 Skill 时，只有开发者明确调用 `aios-prompt-compare` 才启用；真实 Skill 结果必须来自宿主工具触发对应 `$aios-*` Skill 后的输出。
- 涉及规范、制度、结构计算、质量安全、金额、工期索赔或责任归属时，必须保留 `Claim / Evidence / Tool Result / Decision`；没有工具或人工证据时标注 `Need verify` 或 `Hold for human`。
- 当前任务不涉及建筑行业语义时，不要为了“已安装 AIOS”而强制使用 `aios-*` Skill。
- 如 Skill 来源、安装位置或同步方式无法确认，应标注待核验，不要假设已经启用。
