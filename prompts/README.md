# Prompts

`prompts/` 保存资产化 prompt。

每个 prompt 应记录适用范围、版本、输入格式、输出格式、评估方式、失效案例和禁止使用场景。

Prompt 会腐化，因此不能只保存文本本身，必须保存评估和维护规则。

当前入口：

- [Prompt Registry](prompt-registry.md)
- [Prompt Evaluation Policy](evaluation-policy.md)
- [Prompt Failure Cases](failure-cases.md)

工程业务管理基础提示词随对应 `aios-*` Skill 分发，入口见 [Prompt Registry](prompt-registry.md) 和 [工程业务管理基础技能包](../skills/engineering-business-starter-kit.md)。
对比验证记录见 [工程业务管理基础提示词对比验证](evaluations/engineering-business-basic-prompts-2026-06-16.md)。
advisory 来源信号复核见 [工程业务基础提示词 advisory 复核说明](evaluations/engineering-business-basic-advisory-validation-2026-06-16.md)。
结构化评分卡见 [工程业务管理基础提示词评分卡](evaluations/engineering-business-basic-scorecard.json)，可用 `npm run validate:prompt-scorecard` 校验。
weak/basic 运行包可用 `npm run build:prompt-run-pack` 生成，生成前可用 `npm run validate:prompt-run-pack` 校验。
写作型 Skill 运行包使用 `npm run build:document-writing-run-pack` 生成，生成前可用 `npm run validate:document-writing-run-pack` 校验。
weak/basic 运行结果模板可用 `node ./scripts/validate-prompt-run-results.mjs --init <file>` 生成，模板和真实结果可用 `npm run validate:prompt-run-results` 或 `--file` 校验。
weak/basic 运行结果报告可用 `npm run analyze:prompt-run-results -- --file <results> --out <report>` 生成。
输出结构样例见 [工程业务管理基础模型输出样例](evaluations/engineering-business-basic-model-output.example.json)，可用 `npm run validate:prompt-outputs` 校验。
公开 advisory 验证案例见 [公开 advisory fixture](evaluations/engineering-business-public-advisory-fixtures.json) 和 [Markdown 归一化输入](evaluations/public-advisory-md/)。这些 Markdown 文件保留虚构客户、项目、人员、地点、日期、金额和编号，用于验证抽取效果；原始 PDF / DOCX / 图片解析另行测试。

需要比较弱提示词、便携强提示词和真实 Skill 触发结果时，使用 `aios-prompt-compare`。其中真实 Skill 结果必须来自宿主工具实际触发对应 `$aios-*` Skill 后的输出，不把 `SKILL.md` 当普通 prompt 粘贴运行的结果视为正式 Skill 结果。
