# 架构评审 Workflow

## 定位

用于在实现前评估系统架构、服务边界、技术选型、数据模型、Runtime、RAG / GraphRAG 和长期复杂度。

## 触发场景

- 新系统、新模块或核心服务设计。
- 服务拆分、数据模型、存储组件或技术栈调整。
- Hermes / OpenClaw / Agent Runtime 重大变化。
- RAG / GraphRAG、知识图谱或 BIM / IFC 模块边界设计。

## 参与角色与 Skill

| 阶段 | 主 Agent | Skill |
| --- | --- | --- |
| 架构判断 | Atlas | `archsight-architecture-review` |
| 工程拆解 | Mason | `archsight-delivery-planning` |
| Runtime 设计 | Daedalus | `archsight-ai-runtime-design` |
| 行业语义 | Vitruvius | `archsight-bim-domain-modeling` |
| 风险审查 | Argus | `archsight-code-review` |

## 输入

- 背景和目标。
- 当前架构、目录、模块和数据结构。
- 现有代码、配置、接口契约、测试、脚本、部署入口和运行方式。
- 候选方案。
- 约束：成本、时间、团队、运行环境、权限、数据规模。
- 已知风险和历史决策。

## 执行顺序

1. Atlas 明确问题类型和评审边界。
2. Atlas 基于现有代码、配置、契约、测试、脚本和部署入口核验事实；文档结论必须能回到项目事实。
3. Atlas 做范围挑战，明确当前评审接受的范围和不在范围内的扩展项。
4. Atlas 盘点已有能力，确认应复用的模块、契约、测试和脚本。
5. Atlas 对候选方案做 tradeoff，识别复杂度、技术债、生产失效方式和长期迁移成本。
6. Atlas 用 P0/P1/P2 或等效等级标注风险优先级，形成架构依据。
7. Daedalus 评审 AI Runtime / RAG / Tool / Memory 相关设计。
8. Vitruvius 评审 BIM / IFC / 建筑规范相关语义。
9. Argus 评审安全、权限、Prompt 注入、依赖和发布风险。
10. Mason 将通过评审的方案拆成可执行任务，并纳入 Failure Modes、测试缺口、并行 workstream 和冲突点。

## 输出

1. 结论
2. 架构判断
3. 风险与边界
4. 推荐方案
5. Rejected 方案
6. Assumption / Need verify
7. Failure Modes
8. 后续执行任务

## 文档与补充检查

当架构评审需要审阅设计文档、对比多份评审或整合补充检查项时：

- 先回到现有代码、配置、接口契约、测试、脚本和部署入口核验事实。
- 再判断各检查项的定位：架构依据、工程计划、代码审查、测试计划或风险清单。
- 架构依据优先采纳边界判断、风险分级、长期演进和被拒绝方案。
- 工程计划优先采纳 Failure Modes、测试缺口、并行 workstream、冲突标记和回归命令。
- 纠正文档中的细节错误，例如 Assumption 与 Need verify 数量混淆。
- 对“未覆盖”的判断要谨慎：如果已有评审已触及某风险但未形成完整策略，应写成“已触及但未系统展开”。

## 升级与人工确认

以下情况必须人工确认：

- 核心技术栈替换。
- 生产数据模型迁移。
- Runtime 权限扩大。
- 自动执行权限放开。
- 影响长期平台路线的服务边界调整。

## 验收标准

- 推荐方案有明确边界和取舍。
- 被拒绝方案有原因。
- 后续任务可被 Mason 拆解。
- 不确定项和待验证项被显式记录。
