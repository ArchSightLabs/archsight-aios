# 规范知识库 / RAG / GraphRAG 项目规则

## 适用项目

用于建筑规范知识库、BIM / IFC 标准知识、条文结构化、GraphRAG、审图规则、问答评估集和知识图谱相关项目。

## 必读上下文

- `.ai/ARCHSIGHT_AIOS_RULES.md`
- `.ai/project-context.md`
- `.ai/agent-routing.md`
- `.ai/skills.md`
- `.ai/workflows.md`
- 知识源登记、标准版本、引用规范、评估集和不可回答问题清单。

## 默认关注点

- 知识源来源、版本、适用地区、适用专业和生效状态。
- 条文、要求、对象、条件、例外、证据和待核验项的结构化表达。
- RAG chunk、实体、关系、GraphRAG schema、引用证据和检索可复现性。
- 冲突条文、过期标准、无法回答场景和人工审核流程。
- 版本替代、来源元数据和复核状态是否从摄取入口贯通到图谱、向量索引、检索结果、报告和后台展示。

## 推荐路由

| 任务 | 首选 Agent / Skill |
| --- | --- |
| 规范语义、条文拆解、审查规则 | Vitruvius / `aios-knowledge` |
| RAG / GraphRAG pipeline、Tool、Memory | Daedalus / `aios-runtime` |
| 知识图谱边界和系统架构 | Atlas / `aios-arch` |
| 数据处理脚本和评估执行 | Hephaestus / `aios-exec` |
| 引用、幻觉、安全和发布审查 | Argus / `aios-review` |

## 验收要求

- 每个知识域至少维护 10 个代表性评估问题。
- 回答必须保留来源、版本、适用条件和不可回答判断。
- 不把模型推断伪装成规范原文或官方结论。
- GraphRAG 实体和关系必须保留来源、版本和置信度。
- 规范版本、替代关系、来源哈希、页码范围和人工复核状态不能只存在于领域模型或后台表单中，必须有端到端贯通验证。
