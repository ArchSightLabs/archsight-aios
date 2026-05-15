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
- 候选方案。
- 约束：成本、时间、团队、运行环境、权限、数据规模。
- 已知风险和历史决策。

## 执行顺序

1. Atlas 明确问题类型和评审边界。
2. Atlas 对候选方案做 tradeoff，识别复杂度和技术债。
3. Daedalus 评审 AI Runtime / RAG / Tool / Memory 相关设计。
4. Vitruvius 评审 BIM / IFC / 建筑规范相关语义。
5. Argus 评审安全、权限、Prompt 注入、依赖和发布风险。
6. Mason 将通过评审的方案拆成可执行任务。

## 输出

1. 结论
2. 架构判断
3. 风险与边界
4. 推荐方案
5. Rejected 方案
6. 后续执行任务

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

