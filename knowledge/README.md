# Knowledge

`knowledge/` 保存建筑行业知识体系和治理政策。v1.5.0 后，真正可运行的知识资产以 `Knowledge Pack` 为核心对象，模板和样板位于 `templates/knowledge-pack/` 与 `templates/knowledge-pack-samples/`。

推荐方向：

- BIM
- IFC
- 规范
- 招采
- 工程数据
- 结构知识
- 审查规则

当前入口：

- [领域分类](domain-taxonomy.md)
- [知识来源登记](source-register.md)
- [v1.5.0 Knowledge Pack 与本地 Reference Runtime](../docs/v1.5.0-knowledge-pack-runtime.md)

## Knowledge Pack 关系

Knowledge Pack 把来源、版本、条文、实体、关系、查询规则、评估问题和人工复核状态编译成 `archsight-aios.knowledge-pack`，再交给 `knowledge.norm_lookup`、RAG / GraphRAG 管线和专项 Skill 使用。
