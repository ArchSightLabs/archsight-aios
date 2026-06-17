# 工程业务管理基础提示词对比验证

> 日期：2026-06-16
> 范围：`aios-commercial-tender`、`aios-commercial-contract`、`aios-construction-daily`、`aios-construction-meeting`、`aios-commercial-variation`、`aios-construction-scheme`
> 目的：验证基础提示词相比普通提示词，是否能稳定输出工程业务可复核的矩阵、清单、台账和人工复核问题。
> 数据边界：验证参考了 `archsight-advisory` 中已整理的工程业务资料和本地对比记录；本文件只保留脱敏后的评估结论，不复制客户原始资料、联系人、项目名称、金额细节或完整输出。

advisory 来源信号、普通 / 优化提示词差异和当前 AIOS 沉淀判断见 `engineering-business-basic-advisory-validation-2026-06-16.md`。

## 总体结论

基础提示词有效，改进点不在“回答更长”，而在以下 5 个方面：

| 维度 | 普通提示词常见问题 | 基础提示词改进 |
|---|---|---|
| 资料状态 | 容易默认资料完整，直接给建议 | 先判断输入类型、资料缺口和可验证程度 |
| 输出形态 | 多为段落总结，难以复核和分工 | 输出矩阵、清单、台账、回查表 |
| 风险边界 | 容易把推断写成结论 | 明确“需补充确认”“人工复核岗位”“不替代专业结论” |
| 行业动作 | 泛泛谈 AI 能力 | 对准投标、合同、日报、会议、签证、方案的后续动作 |
| 可沉淀性 | 一次性聊天答案 | 可以升级为 workflow、agent 任务和部门模板 |

结论：6 个基础提示词可以作为 AIOS 工程业务管理基础技能包的 L0-L1 能力，但不能包装成系统接入、自动审批、专业签审或最终结论能力。

结构化评分卡见 `engineering-business-basic-scorecard.json`。该评分卡从资料状态处理、输出可操作性、边界安全、证据追溯、模板复用和岗位分流 6 个维度比较普通提示词与基础提示词；6 个场景均判定基础提示词更适合作为基础版能力。

## 验证方法

从 `archsight-advisory` 的工程业务样例中抽象 6 类输入，每类对比普通提示词和基础提示词。

批量运行前，可用脚本生成 weak/basic 对照运行包：

```bash
npm run validate:prompt-run-pack
npm run build:prompt-run-pack
```

运行包会从 fixture 生成 12 条 run item：每个 case 一条普通提示词输入、一条基础提示词输入。该步骤只准备脱敏输入，不调用模型。

成对运行后，用 run results 文件归档 12 条真实输出：

```bash
npm run validate:prompt-run-results
node ./scripts/validate-prompt-run-results.mjs --init prompts/evaluations/<your-run-results-file>.json
node ./scripts/validate-prompt-run-results.mjs --file prompts/evaluations/<your-run-results-file>.json
```

基础提示词输出必须满足必备章节和禁止结论约束；普通提示词输出的问题会作为 weak diagnostics 留给评分卡对比。

校验通过后，可生成 Markdown 分析报告：

```bash
npm run analyze:prompt-run-results -- --file prompts/evaluations/<your-run-results-file>.json --out prompts/evaluations/<your-analysis-report>.md
```

报告用于汇总基础提示词通过门禁数量、普通提示词诊断数量和 scorecard 判定，不替代人工复核。

| 场景 | 普通提示词形态 | 基础提示词路径 | 脱敏样例 |
|---|---|---|---|
| 技术标复核问题 | “请分析这些技术标问题，给出建议。” | `skills/aios-commercial-tender/prompts/basic-prompt.md` | AI 技术标工具试用后的人工检查问题和评分点结构 |
| 合同履约节点 | “请总结这份合同的重点和风险。” | `skills/aios-commercial-contract/prompts/basic-prompt.md` | 工程分包合同片段、节点条款和空白字段 |
| 项目日报跟踪 | “请总结这份项目日报并指出问题。” | `skills/aios-construction-daily/prompts/basic-prompt.md` | 单日施工日报、空白材料 / 机械 / 照片字段 |
| 会议纪要闭环 | “请整理这份会议纪要的重点和待办。” | `skills/aios-construction-meeting/prompts/basic-prompt.md` | 工程会议纪要、过程状态和责任线索 |
| 变更签证资料链 | “请分析这份变更签证资料是否完整。” | `skills/aios-commercial-variation/prompts/basic-prompt.md` | 公开样表字段、过程线索和缺失签认资料 |
| 施工方案复核 | “请分析施工方案应用难点并给建议。” | `skills/aios-construction-scheme/prompts/basic-prompt.md` | 专项施工方案、专家意见和 AI 生成失准反馈 |

## 分场景结果

### 1. 技术标复核问题

普通提示词容易把“AI 标书工具试用后的人工检查问题”带偏成工具建议或泛泛投标建议，甚至默认已经具备真实招标文件和评分办法。

基础提示词更稳：

- 先判断输入是招标原文、评分办法、人工检查问题清单、工具咨询还是混合资料。
- 缺少招标原文时，只输出问题回应矩阵和响应矩阵模板。
- 废标项、资格条件、评分分值缺证据时标为 `需补充确认`。
- 不输出中标概率、评标结论、采购承诺或串标规避建议。

沉淀判断：保留“输入类型判断”和“缺少可验证招标依据”作为硬规则。

### 2. 合同履约节点

普通提示词容易变成法律风险摘要，抓不到可执行节点，也容易忽略合同空白字段。

基础提示词更稳：

- 先输出合同基本信息和空白字段优先核对表。
- 把付款、验收、资料提交、工资发放、结算等内容拆成履约节点。
- 每个节点带触发条件、期限、责任方、原文依据和复核提示。
- 不输出法律意见、违约定性、索赔或结算金额结论。

沉淀判断：合同 skill 不应只做“风险总结”，必须固定输出“空白字段 -> 履约节点 -> 付款结算 -> 风险提示 -> 待补资料”。

### 3. 项目日报问题跟踪

普通提示词能总结日报，但容易把空白字段、未见照片、未填材料进场等内容误写成现场事实问题。

基础提示词更稳：

- 区分已明确事项、异常或风险提示、需补充确认。
- 把表格空白、照片缺失、滞后措施未填等归入模板质量诊断。
- 不把“未提及”写成“不合格”。
- 输出可进入项目台账的问题跟踪表。

沉淀判断：日报 skill 的核心保护点是区分“现场事实”和“资料质量问题”。

### 4. 会议纪要待办闭环

普通提示词容易把会议摘要写完就结束，或把发言人直接当成最终责任人。

基础提示词更稳：

- 只提取会议资料中明确出现的决定、问题、待办和分工。
- 责任人不明确时标为“需确认责任人”。
- 期限不明确时标为“需确认期限”。
- 发言人只作为责任线索，不自动等同最终责任人。

沉淀判断：会议 skill 的关键字段是“责任线索”和“最终责任人是否明确”，否则待办闭环会制造责任误判。

### 5. 变更签证资料链

普通提示词容易直接回答“资料是否完整、是否可以结算”，把过程资料误当正式依据。

基础提示词更稳：

- 先判断资料链完整度：完整、部分线索、仅方法演示。
- 区分事实记录、合同依据、过程线索和正式依据待确认。
- 公开样表只用于字段结构说明，不代表项目事实。
- 不判断签证成立、索赔成立、责任归属或最终金额。

沉淀判断：签证 skill 必须先输出资料链完整度，再谈复核路径；缺正式签认资料时不能输出金额和责任倾向。

### 6. 施工方案辅助复核

普通提示词能概括方案或 AI 生成问题，但容易使用“审查”口径，缺少技术负责人可用的回查清单。

基础提示词更稳：

- 全程使用“AI 辅助施工方案复核”口径。
- 如输入是 AI 方案编制反馈，先输出失准原因复盘。
- 如存在专家修改说明，拆成正文、附图、计算书和验收要求回查点。
- 对图纸、扫描件、计算书公式只列需复核点，不确认计算正确。
- 不输出方案合格、计算正确或专家论证通过结论。

沉淀判断：施工方案 skill 的核心输出不是审查结论，而是“失准复盘 + 回查清单 + 专业复核岗位”。

## 失效风险

| 风险 | 触发方式 | 当前控制 |
|---|---|---|
| 把资料缺失当事实结论 | 日报、会议、合同字段为空 | 基础提示词要求输出“需补充确认”或模板质量诊断 |
| 把过程资料当正式依据 | 签证、会议纪要、日报串联 | 变更签证提示词区分过程线索和正式依据 |
| 把工具问题变成采购建议 | 技术标、AI 标书工具反馈 | 招投标提示词禁止采购承诺和工具结论 |
| 把辅助复核写成专业审查 | 施工方案、合同、质量安全事项 | 明确不替代法务、造价、总工、专家或审批主体 |
| 把样例输出包装成系统能力 | 单次提示词表现较好 | 基础技能包限定为 L0-L1，不承诺 L2-L3 |

## 回归检查项

后续修改 6 个基础提示词时，至少用以下检查项回归：

- 是否先判断资料类型和可验证程度。
- 是否输出矩阵、清单、台账或回查表。
- 是否保留原文依据、资料来源或定位字段。
- 是否把缺失信息标为 `需补充确认` / `需核验`。
- 是否列出人工复核岗位。
- 是否明确不能下结论的事项。
- 是否避免系统接入、自动审批、专业签审或采购承诺。

结构化比较还需要运行：

```bash
npm run validate:prompt-scorecard
```

## 输出样例检查

`engineering-business-basic-model-output.example.json` 是输出结构样例，不是真实模型跑分。它用于证明后续真实输出文件需要包含：

- `caseId`、`promptVersion`、`model`、`ranAt`、`notes` 和 `output`。
- 与 fixture 对应的 6 个 case。
- 每个 case 的必备章节。
- 不包含禁止结论和敏感信息。

真实模型输出可另存为同结构 JSON，并运行：

```bash
node ./scripts/validate-prompt-model-outputs.mjs --init prompts/evaluations/<your-output-file>.json
node ./scripts/validate-prompt-model-outputs.mjs --file prompts/evaluations/<your-output-file>.json
```

`--init` 生成的是待填写模板，`output` 默认为空，不能作为通过结果使用。
真实输出必须填写具体模型标识、可解析运行时间，并保持 `promptVersion` 与 fixture 版本一致。

注意：`validate-prompt-model-outputs.mjs` 面向 6 条基础提示词单体输出；`validate-prompt-run-results.mjs` 面向 12 条 weak/basic 成对输出。两者用途不同。

## 后续优化方向

1. 脱敏 fixture 已沉淀到 `prompts/evaluations/engineering-business-basic-fixtures.json`，用于保存样例输入、期望输出结构、普通提示词失败模式和禁止输出项。
2. `scripts/validate-prompt-fixtures.mjs` 用于检查 fixture 覆盖、prompt 路径、必备结构、禁止结论和敏感信息残留。
3. `scripts/build-prompt-run-pack.mjs` 用于生成 weak/basic 对照运行包，减少人工拼接提示词的偏差。
4. `engineering-business-basic-scorecard.json` 和 `scripts/validate-prompt-scorecard.mjs` 用于固定“哪套更好”的评分维度、权重、失败模式和改进点。
5. `scripts/validate-prompt-run-results.mjs` 用于生成和校验 12 条 weak/basic 成对运行结果。
6. `scripts/analyze-prompt-run-results.mjs` 用于把 12 条成对结果汇总为 Markdown 分析报告。
7. `scripts/validate-prompt-model-outputs.mjs` 用于生成 6 条基础提示词单体输出归档模板，并检查样例或真实模型输出是否保留必备章节、禁止结论和脱敏边界。
8. 后续若进入 L2 本地智能体工作流，再补文件读取、结果保存、版本归档和人工复核状态字段。
