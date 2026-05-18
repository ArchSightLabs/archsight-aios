# Prompts

`prompts/` 保存资产化 prompt。

每个 prompt 应记录适用范围、版本、输入格式、输出格式、评估方式、失效案例和禁止使用场景。

Prompt 会腐化，因此不能只保存文本本身，必须保存评估和维护规则。

当前入口：

- [Prompt Registry](prompt-registry.md)
- [Prompt Evaluation Policy](evaluation-policy.md)
- [Prompt Failure Cases](failure-cases.md)
