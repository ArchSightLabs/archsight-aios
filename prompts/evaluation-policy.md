# Prompt Evaluation Policy

## 评估维度

- 是否遵守角色边界。
- 是否按输出格式回答。
- 是否拒绝越权任务。
- 是否标注不确定性。
- 是否避免编造事实。
- 是否能在项目上下文中收敛到可执行动作。

## 最小流程

1. 选择代表性任务。
2. 运行旧版和新版 Prompt。
3. 比较输出质量、风险和遵循度。
4. 记录失效案例。

## 工程业务基础提示词回归

工程业务管理基础提示词使用 `prompts/evaluations/engineering-business-basic-fixtures.json` 作为脱敏回归基线。

公开 advisory 验证案例使用 `prompts/evaluations/engineering-business-public-advisory-fixtures.json`，具体输入统一放在 `prompts/evaluations/public-advisory-md/*.md`。这些公开案例只使用 Markdown 归一化输入：客户、项目、人员、地点、日期、金额和编号都是虚构值；它们用于验证提示词、agent 路由、字段抽取和输出边界，不验证 PDF / DOCX / 图片解析链路。

修改 `skills/aios-*/prompts/basic-prompt.md` 后，运行：

```bash
npm run validate:prompts
```

该检查不替代真实模型输出评估，但能保证 6 类基础场景、抽象来源信号、必备输出结构、禁止结论和敏感信息边界没有被破坏。

普通提示词与基础提示词的结构化比较保存在 `prompts/evaluations/engineering-business-basic-scorecard.json`。修改 fixture、基础提示词或评分维度后，运行：

```bash
npm run validate:prompt-scorecard
```

评分卡用于固定比较维度、权重、普通提示词失败模式和基础提示词改进点；它是脱敏 fixture 级别的设计评估，不替代真实模型批量输出评测。

若需要批量运行 weak/basic 对照输入，先生成运行包：

```bash
npm run validate:prompt-run-pack
npm run build:prompt-run-pack
npm run validate:public-advisory-run-pack
npm run build:public-advisory-run-pack
```

基础运行包包含 6 个 case 的普通提示词和基础提示词两组输入，共 12 条 run item。公开 advisory 运行包同样生成 12 条 run item，但 `sampleInput` 来自 Markdown 归一化输入正文。该步骤只组织脱敏 / 虚构输入和 prompt 文本，不调用模型。

若要评估“普通提示词、便携强提示词、真实 Skill 结果”三类差异，使用 `aios-prompt-compare`。其中 weak/basic 可以沿用 run pack；`skill-runtime` 需要由宿主工具真实触发对应 `$aios-*` Skill 后归档，再按同一 scorecard 做三栏比较。不要把 `SKILL.md` 直接作为普通 prompt 粘贴运行的输出称为真实 Skill 结果。

weak/basic 成对运行后，用 run results 文件归档 12 条结果：

```bash
npm run validate:prompt-run-results
node ./scripts/validate-prompt-run-results.mjs --init prompts/evaluations/<your-run-results-file>.json
node ./scripts/validate-prompt-run-results.mjs --file prompts/evaluations/<your-run-results-file>.json
```

run results 校验会要求基础提示词输出包含必备章节且不出现禁止结论；普通提示词输出允许暴露缺陷，并输出 weak diagnostics 供对比复盘。

校验通过后，生成运行结果分析报告：

```bash
npm run analyze:prompt-run-results -- --file prompts/evaluations/<your-run-results-file>.json --out prompts/evaluations/<your-analysis-report>.md
```

分析报告汇总基础提示词通过门禁数量、普通提示词诊断数量、scorecard 判定和逐 case 差异，供后续决定是否调整基础提示词或 fixture。

若已经有模型输出文件，使用同一 fixture 校验输出结构：

```bash
npm run validate:prompt-outputs
node ./scripts/validate-prompt-model-outputs.mjs --file prompts/evaluations/<your-output-file>.json
```

若需要归档一次真实输出，先生成待填写模板：

```bash
node ./scripts/validate-prompt-model-outputs.mjs --init prompts/evaluations/<your-output-file>.json
```

模板中的 `output` 默认为空，不会通过校验；填入脱敏后的真实模型输出后，再用 `--file` 检查。
真实输出文件需要填写可追溯的 `model`、可解析的 `ranAt`，且 `promptVersion` 必须匹配当前 fixture 版本。

默认文件 `engineering-business-basic-model-output.example.json` 只是输出骨架样例，用于验证格式和检查器本身，不代表真实模型评测结果。
