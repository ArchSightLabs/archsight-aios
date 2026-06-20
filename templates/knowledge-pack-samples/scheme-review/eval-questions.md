# 评估问题

| 评估 ID | 类型 | 问题 | 期望状态 | 期望适用性 | 期望引用 | 期望说明 |
| --- | --- | --- | --- | --- | --- | --- |
| EVAL-DEEP-EXCAVATION | need_context | 深基坑开挖前需要专项方案吗？ | found | need_context | CLAUSE-DEEP-EXCAVATION | 开挖深度 |
| EVAL-HIGH-FORMWORK | answerable | 高支模方案是否应检查计算书？ | found | applicable | CLAUSE-HIGH-FORMWORK | 计算书 |
| EVAL-NOT-FOUND | unanswerable | 这个知识包能判断消防喷淋系统联动验收吗？ | not_found | need_context | 无 | 未命中 |
| EVAL-CONFLICT | conflict | 专家意见和现场记录版本不一致时能否自动放行？ | conflict | need_context | CLAUSE-CONFLICT-REVIEW | 人工复核 |
| EVAL-INAPPLICABLE | version_mismatch | 高支模方案是否应检查计算书？ | inapplicable | not_applicable | 无 | 版本 |
