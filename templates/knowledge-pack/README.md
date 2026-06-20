# AIOS Knowledge Pack Workbench

> 类型：工程知识治理工作台

## 使用顺序

1. 在 `knowledge-pack.source.json` 中维护结构化知识源、标准、条文、实体、关系、查询规则和评估问题。
2. 在 `source-register.md` 和 `standard-register.md` 中保留业务人员可读的来源和版本登记。
3. 在 `clause-map.md` 中把条文拆成对象、条件、判定、例外和证据。
4. 在 `entity-relation-map.md` 中维护 GraphRAG 实体和关系。
5. 在 `eval-questions.md` 中维护可回答、不可回答、冲突和缺上下文问题。
6. 在 `review-notes.md` 中记录人工复核状态、阻断项和发布边界。
7. 执行 `archsight-aios knowledge:validate`、`knowledge:compile`、`knowledge:eval`，再把编译产物交给本地 Reference Runtime。

## 推荐命令

```bash
archsight-aios knowledge:validate --name knowledge-pack
archsight-aios knowledge:compile --name knowledge-pack
archsight-aios knowledge:inspect --name knowledge-pack
archsight-aios knowledge:lookup --pack knowledge-pack/compiled/knowledge-pack.json --query "示例问题"
archsight-aios knowledge:eval --name knowledge-pack
```

## 边界

- Knowledge Pack 是可追溯知识资产，不是官方规范数据库。
- 未授权规范全文不得直接进入仓库。
- `published` 只表示包内资料通过本项目复核，不代表合规终审或工程签审结论。
- 缺来源、缺版本、缺适用条件或缺人工复核时，查询结果必须返回 `need_context`、`not_found`、`conflict` 或 `inapplicable`。
