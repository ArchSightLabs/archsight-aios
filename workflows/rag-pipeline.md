# RAG / GraphRAG Pipeline Workflow

## 定位

用于建筑行业知识、BIM / IFC、规范条文、业务文档进入 RAG、GraphRAG 或知识图谱链路。

## 触发场景

- 新知识源入库。
- 设计 chunk、实体、关系、索引和检索策略。
- 评估 RAG / GraphRAG 答案质量。
- 构建规范审查、智能审图或行业知识问答能力。

## 参与角色与 Skill

| 阶段 | 主 Agent | Skill |
| --- | --- | --- |
| 领域语义建模 | Vitruvius | `aios-building-knowledge` |
| Runtime / Pipeline 设计 | Daedalus | `aios-runtime-design` |
| 架构边界 | Atlas | `aios-architecture-review` |
| 任务拆解 | Mason | `aios-delivery-planning` |
| 实现执行 | Hephaestus | `aios-controlled-execution` |
| 风险审查 | Argus | `aios-code-review` |

## 输入

- 知识源：规范、标准、BIM / IFC、招采、交付、业务文档。
- 目标问题和用户场景。
- 数据规模、更新频率、版本和来源。
- 期望引用、追溯和评估方式。

## 执行顺序

1. Vitruvius 拆解领域对象、术语、条文条件和待核验项。
2. Daedalus 设计 chunk、抽取、embedding、索引、检索、重排、引用和评估。
3. Atlas 判断知识层、平台层和 Runtime 层边界。
4. Mason 拆解实现任务和验证路径。
5. Hephaestus 执行受控实现或文档落地。
6. Argus 审查数据污染、Prompt 注入、工具权限和发布风险。

## 输出

- 领域模型。
- 数据处理流程。
- 检索和生成链路。
- 评估指标。
- 风险与待核验项。
- 后续任务。

## 验收标准

- 每个知识结论可追溯来源。
- chunk、实体、关系和索引策略有明确理由。
- RAG / GraphRAG 有评估方式。
- 不能自动判断的行业问题被标注。
- 权限、数据污染和 Prompt 注入风险已审查。

