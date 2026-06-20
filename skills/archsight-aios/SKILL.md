---
name: archsight-aios
description: ArchSight AIOS 总路由入口别名。用于“请用 ArchSight AIOS / AIOS 技能包分析该文档”的自然调用，规则等同于 aios。
---

# ArchSight AIOS Router

本 Skill 是 `aios` 总路由入口的品牌别名。用户使用 “ArchSight AIOS” 或 “AIOS 技能包” 这类自然叫法时，按本入口处理。

## 执行方式

优先读取并遵守相邻的 `../aios/SKILL.md`。如果宿主工具不能自动读取相邻 Skill，则按以下最小路由规则执行：

| 资料 / 任务线索 | 路由到 |
|---|---|
| 招投标、技术标、评分点，且未区分写作或审核 | `aios-tender` |
| 招标、投标、技术标、评分、资格、废标 | `aios-tender-audit` |
| 已使用原工程商务招投标入口 | `aios-commercial-tender` |
| 标书编写、技术标生成、投标响应章节改写、历史标书素材复用 | `aios-tender-write` |
| 合同审核、合同复核、履约节点、付款条件、责任边界、资料缺口 | `aios-contract-audit` |
| 补充协议草拟、条款改写、履约通知、催款函、回函、合同交底 | `aios-contract-draft` |
| 已使用原工程商务合同入口 | `aios-commercial-contract` |
| 日报、施工日志、周报、现场记录，且未区分生成或复核 | `aios-daily` |
| 日报生成、日报编写、现场口述、项目群记录、照片说明 | `aios-daily-write` |
| 已有施工日报、进度、材料、机械、劳务、问题台账 | `aios-construction-daily` |
| 会议纪要、例会、协调会、专题会、交底会，且未区分生成或复核 | `aios-meeting` |
| 会议纪要生成、录音转写、会议笔记、群聊摘要、待办清单草稿 | `aios-meeting-write` |
| 已有会议纪要、待办、责任人、截止时间、遗留争议 | `aios-construction-meeting` |
| 变更、签证、联系单、洽商、索赔、图纸变更、工程量 | `aios-commercial-variation` |
| 专项施工方案、危大工程，且未区分写作或审核 | `aios-scheme` |
| 专项施工方案、危大工程、深基坑、高支模、脚手架、吊装、危险源、交底、专家论证、计算书 | `aios-scheme-audit` |
| 已使用原工程施工专项方案入口 | `aios-construction-scheme` |
| 方案编写、方案生成、方案改写、历史方案素材复用、专家意见回写 | `aios-scheme-write` |
| 结构计算、荷载、挠度、稳定、FEM | `aios-structural` |
| 明确调用 `aios-compare` 或要求判断两份文档 / 两个 AI 输出哪份更专业 | `aios-compare` |
| 开发者明确调用 `aios-prompt-compare` 或要求 weak / portable / skill-runtime 内部评测 | `aios-prompt-compare` |

## 默认输出

当用户只说“用 ArchSight AIOS / AIOS 技能包分析该文档”且没有明确要求摘要时，默认输出“标准详版报告”，不是短摘要。

标准详版报告必须包括：

1. 资料类型和路由判断。
2. 资料来源清单或资料来源说明。
3. 对应业务 Skill 的主输出表 / 清单 / 台账。
4. 资料缺口和需补充确认事项。
5. 人工复核岗位。
6. 不能由 AI 直接下结论的事项。
7. 输出自检。

最小详度要求：

- 资料足够时，主输出表 / 清单 / 台账不应少于 3 条可定位事项；资料不足时，列出全部可定位事项，并说明不足原因。
- 不得只输出几段概括性文字；必须把关键事项拆成表格、清单或台账字段。
- 输出自检必须逐项确认是否包含资料来源、主分析表 / 清单 / 台账、资料缺口、人工复核岗位、AI 不应下结论事项；缺一项时先补齐再结束。

## 约束

- 不输出最终法律意见、合规结论、安全结论、结构计算结论、结算金额或责任归属。
- 不把资料未提及内容补猜成事实。
- 类型不清时先做资料状态判断，不要泛泛总结。
- 涉及金额、工期、法律责任、质量安全、规范、结构计算、审批或签审时，必须保留人工复核。
