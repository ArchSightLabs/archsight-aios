# RAG / GraphRAG Pipeline Workflow

## 定位

用于建筑行业知识、BIM / IFC、规范条文和业务文档进入 RAG、GraphRAG 或知识图谱链路。v1.5.0 后，行业知识输入优先治理为 Knowledge Pack，再进入检索、图谱或 Runtime。

## 触发场景

- 新知识源入库。
- 创建、编译、查询或评估 Knowledge Pack。
- 设计 chunk、实体、关系、索引和检索策略。
- 评估 RAG / GraphRAG 答案质量。
- 构建规范审查、智能审图或行业知识问答能力。

## 参与角色与 Skill

| 阶段 | 主 Agent | Skill |
| --- | --- | --- |
| 领域语义建模 | Vitruvius | `aios-knowledge` |
| Runtime / Pipeline 设计 | Daedalus | `aios-runtime` |
| 架构边界 | Atlas | `aios-arch` |
| 任务拆解 | Mason | `aios-plan` |
| 实现执行 | Hephaestus | `aios-exec` |
| 风险审查 | Argus | `aios-review` |

## 输入

- 知识源：规范、标准、BIM / IFC、招采、交付、业务文档。
- Knowledge Pack 工作台或编译产物，如存在。
- 目标问题和用户场景。
- 数据规模、更新频率、版本和来源。
- 期望引用、追溯和评估方式。
- 可用 Capability，例如 `knowledge.norm_lookup`、测试 / eval runner、GraphRAG 构建检查。

## 执行顺序

1. Vitruvius 拆解领域对象、术语、条文条件和待核验项，并优先整理为 Knowledge Pack。
2. 使用 `knowledge:validate`、`knowledge:compile` 和 `knowledge:eval` 固化来源、版本、条文、图谱、查询规则和评估问题。
3. Daedalus 设计 chunk、抽取、embedding、索引、检索、重排、引用和评估。
4. 使用或要求 `knowledge.norm_lookup` 等 Capability 证据校验规范版本、适用条件、来源页码和冲突关系。
5. Atlas 判断知识层、平台层和 Runtime 层边界。
6. Mason 拆解实现任务和验证路径。
7. Hephaestus 执行受控实现或文档落地。
8. Argus 审查数据污染、Prompt 注入、工具权限和发布风险。
9. 对冲突条文、适用性不明或工具失败输出 `Claim / Evidence / Tool Result / Decision`。

## 输出

- 领域模型。
- 数据处理流程。
- 检索和生成链路。
- 评估指标。
- 风险与待核验项。
- Capability 证据和仲裁结论。
- 后续任务。
- Knowledge Pack 编译产物、查询样例和 eval 报告，如本次任务涉及知识治理。

## 验收标准

- 每个知识结论可追溯来源。
- chunk、实体、关系和索引策略有明确理由。
- RAG / GraphRAG 有评估方式。
- Knowledge Pack 通过 `knowledge:validate`、`knowledge:compile` 和 `knowledge:eval`。
- 不能自动判断的行业问题被标注。
- 权限、数据污染和 Prompt 注入风险已审查。
- 规范或知识结论缺少版本、来源、适用条件时不得标记为已验证。
