# 工程业务基础提示词 advisory 复核说明

> 日期：2026-06-16
> 范围：6 个工程业务基础提示词与 advisory 工作区中的旧提示词包、普通 / 优化输出对比记录。
> 边界：本文件只记录脱敏后的案例形态、输出差异和沉淀判断；不复制原始业务资料、联系人、项目名称、金额细节或完整模型输出。

## 复核结论

当前 AIOS 基础提示词比 advisory 旧提示词更适合沉淀为通用 Skill，原因不是“答案更长”，而是把旧提示词中的经验规则收口成了稳定规程：

| 维度 | advisory 旧提示词包 | AIOS 基础提示词 |
|---|---|---|
| 使用场景 | 为 PPT 准备和现场分享服务，文件之间相对独立 | 作为 `aios-*` Skill 的可复用基础模式 |
| 输入判断 | 每个提示词有边界提示，但分散在单文件内 | 每个 Skill 固定先判断资料类型、缺口和可验证程度 |
| 输出形态 | 已能生成矩阵、清单、台账和回查表 | 进一步统一资料来源清单、主表、需确认项、复核岗位和不能下结论事项 |
| 风险边界 | 依赖提示词文本和人工使用习惯 | 固化禁止结论、人工复核岗位、L0-L1 能力边界和验证脚本 |
| 资产化程度 | 更像一次项目素材包 | 已进入 registry、manifest、安装分发、fixtures、scorecard 和 CLI 校验 |

因此，“更好”的选择不是直接搬 advisory 旧提示词，而是使用 AIOS 基础提示词作为通用技能包版本；advisory 旧提示词继续作为来源验证和案例启发。

## 只读复核来源

本次只读查看了 advisory 中的以下类型资产：

- `source/prompts/README.md`：旧提示词包的使用方式、输出验证和文件清单。
- `source/prompts/01-...` 到 `source/prompts/06-...`：6 个工程业务场景提示词。
- `source/prompts/07-...`：终稿阶段的案例分工、提示词优化方向和边界记录。
- `source/prompt-runs/2026-06-14-普通与优化提示词输出对比.md`：普通提示词与优化提示词的逐场景对比。

未读取或复制到 AIOS 的内容：

- 原始 docx / pdf 全文。
- 真实项目名称、联系人、公司内部称呼。
- 完整模型输出、金额细节、合同完整条款或正式资料编号。

## 场景信号映射

| AIOS caseId | advisory 抽象信号 | AIOS 固化结果 |
|---|---|---|
| `commercial-tender-response-matrix` | 技术标工具试用后的人工检查问题 + 评分点结构；不是完整招标原文读标 | 固化为输入类型判断、缺少可验证招标依据、问题回应矩阵、评分点响应矩阵 |
| `commercial-contract-obligation-nodes` | 工程合同片段有履约节点，也有空白字段和专业复核边界 | 固化为空白字段核对表、关键履约节点、付款结算条件和不能下结论事项 |
| `construction-daily-issue-tracking` | 日报有施工内容，也有资源、材料、照片等空白字段 | 固化为管理摘要、问题跟踪表、模板质量诊断；空白不等于现场事实 |
| `construction-meeting-action-closure` | 会议记录有发言人、状态和待办，但责任人 / 期限常不完整 | 固化为待办闭环、责任线索、需确认责任人和需确认期限 |
| `commercial-variation-evidence-chain` | 公开样表字段可讲资料链方法，但不证明具体项目事实 | 固化为资料链完整度、样表字段结构、过程线索和正式依据缺口 |
| `construction-scheme-assistive-review` | 施工方案 AI 生成 / 复核反馈涉及参数、图纸、地方标准和计算书边界 | 固化为辅助复核口径、失准复盘、专家修改说明回查和人工复核问题清单 |

## 普通提示词失败模式

advisory 对比记录显示，普通提示词在 6 个场景中有共性问题：

- 容易默认资料完整，跳过输入状态判断。
- 容易输出段落摘要，而不是可分工的矩阵、台账或回查表。
- 容易把未提供、未填、未见的内容写成事实判断。
- 容易把业务风险提示写成法律、造价、质量安全或审批结论。
- 容易把一次性回答当成工具能力、系统能力或正式交付能力。

AIOS 基础提示词针对这些问题加了统一约束：

- `资料来源清单` 和资料状态判断。
- 主输出表格或清单。
- `需补充确认` / `需核验`。
- 人工复核岗位。
- `不能下结论的事项`。
- `Claim / Evidence / Tool Result / Decision`。

## 对当前 AIOS 资产的影响

本次复核后，AIOS 保留以下沉淀方式：

- 6 个基础提示词继续放在各自 Skill 的 `prompts/basic-prompt.md`。
- `engineering-business-basic-fixtures.json` 增加 `sourceSignals` 和 `advisoryComparison`，记录脱敏来源信号。
- `engineering-business-basic-scorecard.json` 继续作为“哪套更好”的结构化判断。
- `validate-prompt-fixtures.mjs` 校验来源信号必须是抽象前缀，避免真实资料名回流。

## 仍未完成的验证

当前验证可以证明提示词设计、案例覆盖、边界规则和资产分发链路已经成形，但不能声称已经完成真实外部模型批量评测。

真实批跑需要：

1. 生成 weak/basic run pack。
2. 用同一模型分别跑 12 条输入。
3. 把输出填入 run results JSON。
4. 执行 `validate-prompt-run-results.mjs --file`。
5. 执行 `analyze-prompt-run-results.mjs --file ... --out ...`。

没有真实模型输出时，scorecard 只能作为设计评审和静态回归门禁，不能当作模型效果保证。
