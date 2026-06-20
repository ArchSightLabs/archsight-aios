# 专项施工方案审查 Knowledge Pack 样板

> 数据说明：本样板全部为虚构 / 合成资料，只用于验证 Knowledge Pack、Reference Runtime 和 eval gate，不包含真实客户、真实项目、真实规范全文或未授权资料。

## 样板目标

- 证明知识源登记、标准登记、条文结构化、GraphRAG 映射、查询规则和评估问题可以编译成一个 `knowledge-pack.json`。
- 证明本地 `knowledge.norm_lookup` Reference Runtime 可以返回 `found`、`not_found`、`conflict`、`inapplicable` 和 `need_context`。
- 证明 `knowledge:eval` 能检查引用、版本、适用性和拒答边界。

## 推荐命令

```bash
archsight-aios knowledge:validate --name scheme-review
archsight-aios knowledge:compile --name scheme-review
archsight-aios knowledge:lookup --pack scheme-review/compiled/knowledge-pack.json --query "深基坑开挖前需要专项方案吗" --project-condition "开挖深度 4.2m"
archsight-aios knowledge:eval --name scheme-review
```
