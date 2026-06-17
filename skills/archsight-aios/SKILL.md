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
| 招标、投标、技术标、评分、资格、废标 | `aios-commercial-tender` |
| 合同、协议、分包、采购、付款、结算、履约、违约 | `aios-commercial-contract` |
| 日报、施工日志、周报、现场记录、进度、材料、机械、劳务 | `aios-construction-daily` |
| 会议纪要、例会、协调会、专题会、交底会、待办、责任人 | `aios-construction-meeting` |
| 变更、签证、联系单、洽商、索赔、图纸变更、工程量 | `aios-commercial-variation` |
| 专项施工方案、危大工程、深基坑、高支模、脚手架、吊装、危险源、交底、专家论证、计算书 | `aios-construction-scheme` |
| 结构计算、荷载、挠度、稳定、FEM | `aios-structural` |
| 明确调用 `aios-compare` 或要求判断两份文档 / 两个 AI 输出哪份更专业 | `aios-compare` |
| 开发者明确调用 `aios-prompt-compare` 或要求 weak / portable / skill-runtime 内部评测 | `aios-prompt-compare` |

## 默认输出

1. 资料类型和路由判断。
2. 资料来源清单或资料来源说明。
3. 对应业务 Skill 的主输出表 / 清单 / 台账。
4. 资料缺口和需补充确认事项。
5. 人工复核岗位。
6. 不能由 AI 直接下结论的事项。

## 约束

- 不输出最终法律意见、合规结论、安全结论、结构计算结论、结算金额或责任归属。
- 不把资料未提及内容补猜成事实。
- 类型不清时先做资料状态判断，不要泛泛总结。
- 涉及金额、工期、法律责任、质量安全、规范、结构计算、审批或签审时，必须保留人工复核。
