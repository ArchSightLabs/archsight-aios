# RAG

`rag/` 保存 RAG / GraphRAG 管线设计和实验记录。

推荐内容：

- [chunk 策略](chunking-policy.md)
- embedding 策略
- rerank 策略
- [retrieval evaluation](evaluation-policy.md)
- GraphRAG pipeline
- 知识库更新流程

## 与 Knowledge Pack 的关系

v1.5.0 后，RAG / GraphRAG 的行业知识输入优先来自编译后的 Knowledge Pack。RAG 管线可以使用 `knowledge:eval` 和 `knowledge.norm_lookup` 检查引用准确性、版本适用性、不可回答问题和冲突口径。
