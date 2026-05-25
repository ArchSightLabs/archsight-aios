# Skills

## 使用原则

Skill 是“怎么做”，不是“谁来做”。本项目优先使用已启用的 ArchSight AIOS Skill，避免与通用技能包混淆。

ArchSight AIOS 的 Skill 是面向建筑行业平台研发的治理能力；`aios-*` 前缀表示来源和命名空间，不表示当前项目属于 ArchSightLabs。

AIOS 是建筑行业增强层，不是通用任务替代器。只有当前项目 profile、项目上下文或用户任务明确涉及 BIM / IFC / Revit / CAD、建筑规范、智能审图、施工视觉、工程知识库、GraphRAG、图纸 / 模型处理、证据链、人工复核、审计留痕或建筑行业平台时，才启用行业增强。普通非建筑任务优先使用宿主工具的通用能力，不强行套用建筑行业假设。

## Skill 路由

| 任务 | Skill | 主 Agent |
| --- | --- | --- |
| 建筑行业软件 / 系统深度评价、项目立项 / 产品定位 / 商业目标 | `aios-ceo` | Janus |
| 建筑行业平台 UI / UX 设计方案 / 工作台体验 | `aios-design` | Janus |
| 建筑行业项目架构评审 | `aios-arch` | Atlas |
| 建筑行业项目交付计划 | `aios-plan` | Mason |
| 建筑行业项目代码审查 | `aios-review` | Argus |
| BIM / IFC / 建筑知识建模 | `aios-knowledge` | Vitruvius |
| 结构力学 / 荷载 / FEM / 确定性求解链路 | `aios-structural` | Euclid |
| 建筑行业 AI Runtime / RAG / MCP / Memory | `aios-runtime` | Daedalus |
| 建筑行业项目受控实现 / 测试 / 文档 / 脚本 | `aios-exec` | Hephaestus |

## 本项目启用的 Skills

- [ ] `aios-arch`
- [ ] `aios-ceo`
- [ ] `aios-design`
- [ ] `aios-plan`
- [ ] `aios-review`
- [ ] `aios-knowledge`
- [ ] `aios-structural`
- [ ] `aios-runtime`
- [ ] `aios-exec`

## 启用规则

- 只勾选当前项目真实安装或可访问的 Skill。
- 涉及建筑行业软件 / 系统评价、项目立项、产品定位、商业目标、范围取舍或阶段路线时，优先启用 `aios-ceo`。
- 涉及建筑行业平台 UI / UX 方案、工作台体验、交互状态、响应式或前端实现交接时，优先启用 `aios-design`。
- 只有启用建筑、BIM、IFC、规范知识库、GraphRAG 或智能审图 profile 时，才默认启用 `aios-knowledge`。
- 涉及结构力学、荷载、FEM、结构计算工具链或工程安全风险时，启用 `aios-structural`；关键数值必须来自确定性求解器或项目已有计算书。
- 当前任务不涉及建筑行业语义时，不要为了“已安装 AIOS”而强制使用 `aios-*` Skill。
- 如 Skill 来源、安装位置或同步方式无法确认，应标注待核验，不要假设已经启用。
