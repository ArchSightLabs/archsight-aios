---
name: aios-prompt-compare
description: 内部 Prompt 测试工具。仅供开发者明确调用，用于 weak/basic/runtime 三栏评测、prompt 回归、Skill 沉淀价值判断和 AIOS 技能包验收。
---

# AIOS Prompt Compare

## 目标

以 Daedalus（AI 研发工程师）的方式组织 Prompt / Skill 效果对比，把同一输入下的弱提示词、便携强提示词和真实 Skill 触发结果拆成三栏评估，判断哪一类输出更稳定、更可复核、更值得沉淀为 Skill。

本 Skill 是内部评估和治理入口，不替代具体业务 Skill 执行，也不直接把评测结论当作生产可用性承诺。普通用户比较两份文档、两个版本或两个 AI 输出哪份更专业时，应使用 `aios-compare`，不要触发本 Skill。

## 适用场景

- 开发者明确写出 `aios-prompt-compare`，并要做 Prompt / Skill 测试。
- 对比 `weakPrompt`、`prompts/basic-prompt.md` 和 `$aios-*` Skill 真实运行结果。
- 判断一段提示词是否应升级为正式 Skill。
- 复盘同一 fixture 在不同提示词、不同 Skill 或不同模型下的输出差异。
- 检查输出是否遵守证据链、禁止结论、人工复核和脱敏边界。
- 维护 `prompts/evaluations/*fixtures.json`、run pack、run results 和 scorecard。

不适用：

- 普通用户比较两份文档、两个版本或两个 AI 输出哪份更专业；这类任务使用 `aios-compare`。
- 只想直接处理工程资料时，先使用对应业务 Skill。
- 没有同一输入或可对齐输出时，不做横向优劣判断，只记录待补材料。
- 不能把一次模型输出胜负当作长期质量结论。

## 输入

优先收集：

- 对比目标：弱提示词、便携强提示词、真实 Skill、旧版 Skill、新版 Skill 或不同模型。
- 同一份输入材料：脱敏文本、Markdown fixture、公开样例或用户提供资料。
- 对应 fixture：例如 `prompts/evaluations/engineering-business-basic-fixtures.json`。
- 已生成的 run pack、run results、模型输出文件或三类原始输出。
- scorecard 或评估维度：结构完整度、证据定位、边界安全、可执行性、复用性、人工复核分流。

## 原始输出保全

对比报告必须保留三类输出的原始正文，不能只写摘要。

最低要求：

- 在分析前先建立 `Raw Output Map`，列出 weak、portable、skill-runtime 三类输出是否已提供、来源文件或运行记录、是否经过脱敏。
- 在报告末尾增加 `原始输出附录`，分别放入 `weak 原始输出`、`portable 原始输出`、`skill-runtime 原始输出`。
- 每类原始输出必须用 fenced code block 包住，保持模型原始章节、表格、结论和措辞；只允许做必要脱敏，不允许改写成摘要。
- 如果某一类输出缺失，必须在对应附录写 `未提供原始输出`，并在结论中说明本次对比证据不足。
- 如果原始输出包含真实客户、联系人、项目名、地点、金额、日期、文件路径或源文件名，先脱敏为 `[客户A]`、`[项目A]`、`[地点A]`、`[金额A]`、`[日期A]`、`[源文件A]`，再放入附录。

摘要、scorecard 和沉淀判断只能基于这些原始输出得出；不能凭记忆、推测或二次转述补写原始输出。

## 三栏比较模式

默认使用三类输出，不要混在一个结论里：

1. `weak`：弱提示词结果。通常来自 fixture 中的 `weakPrompt`，用于暴露随口问的失败模式。
2. `portable`：便携强提示词结果。通常来自 `skills/*/prompts/basic-prompt.md`，用于验证无 Skill runtime 时的最低可用版本。
3. `skill-runtime`：真实 Skill 结果。必须来自宿主工具按 `$aios-*` 或自动 Skill 触发机制执行后的输出，而不是简单把 `SKILL.md` 当普通 prompt 粘贴。

如果当前只有 weak/basic 两类结果，明确标注 `skill-runtime: 未提供`，不要假装完成了 Skill 运行对比。

## 工作流

1. 明确对比对象和输入是否一致；输入不一致时先停止横向比较。
2. 建立 Run Map：记录 caseId、skillId、输入来源、promptSource、模型、运行时间和输出文件。
3. 建立 Raw Output Map：确认 weak、portable、skill-runtime 三类原始输出是否存在、是否脱敏、是否同源。
4. 分别读取 weak、portable、skill-runtime 三类原始输出；缺失时停止声称完整三栏对比。
5. 按统一 scorecard 逐项评分：结构完整度、证据追溯、边界安全、可执行动作、模板复用、人工复核分流。
6. 标出失败模式：编造事实、跳过资料状态判断、越权下结论、缺少 Evidence、无法落地到责任人或台账。
7. 判断沉淀方向：保留普通提示词、强化 portable prompt、升级 / 修订 Skill，或补 fixture / scorecard。
8. 输出原始输出附录和下一步验证命令或待补材料。

## 可用工具链

已有工程业务管理评测链路：

```bash
npm run validate:prompts
npm run validate:prompt-run-pack
npm run build:prompt-run-pack
npm run validate:public-advisory-run-pack
npm run build:public-advisory-run-pack
npm run validate:prompt-run-results
npm run analyze:prompt-run-results -- --file prompts/evaluations/<results>.json --out prompts/evaluations/<report>.md
```

这些脚本默认组织 weak / portable 对照。真实 `skill-runtime` 输出需要由宿主 Agent 实际触发对应 `$aios-*` Skill 后归档，再进入本 Skill 的三栏人工或半自动分析。

## 输出格式

默认输出：

1. 结论
2. Run Map
3. Raw Output Map
4. 三栏输出摘要
5. Scorecard
6. 失败模式
7. Skill 沉淀判断
8. 后续动作
9. 原始输出附录

三栏摘要格式：

```text
caseId：
输入：
weak：
portable：
skill-runtime：
关键差异：
```

Raw Output Map 格式：

```text
caseId：
weak 原始输出：已提供 / 未提供
portable 原始输出：已提供 / 未提供
skill-runtime 原始输出：已提供 / 未提供
脱敏状态：
证据缺口：
```

Scorecard 条目格式：

```text
维度：
weak：
portable：
skill-runtime：
证据：
判定：
```

沉淀判断格式：

```text
是否应升级为 Skill：
原因：
需要进入 SKILL.md 的规则：
仍保留为 portable prompt 的内容：
需要补的 fixture / scorecard：
```

原始输出附录格式：

````markdown
## 原始输出附录

### weak 原始输出

```text
粘贴 weak 模型原始输出；如缺失，写“未提供原始输出”。
```

### portable 原始输出

```text
粘贴 portable 模型原始输出；如缺失，写“未提供原始输出”。
```

### skill-runtime 原始输出

```text
粘贴真实 Skill 触发后的原始输出；如缺失，写“未提供原始输出”。
```
````

## 约束

- 不用不同输入比较输出优劣。
- 不把 `SKILL.md` 文本粘贴运行的结果称为真实 Skill 结果。
- 不把一次输出胜负当作模型或 Skill 的长期结论。
- 不在报告中写入真实客户、联系人、项目名、金额、地点、日期或原始源文件内容。
- 不在报告中写入本机真实源文件路径；使用 `[源文件A]` 或公开 fixture 相对路径替代。
- 不只输出摘要和 scorecard；缺少原始输出附录时，本次对比不能标为完成。
- 不用评测替代业务专家、法务、造价、总工、监理或安全负责人签审。
