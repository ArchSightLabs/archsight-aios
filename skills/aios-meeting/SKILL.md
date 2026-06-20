---
name: aios-meeting
description: 工程会议纪要通用入口。用于在未区分生成或复核时，按任务意图路由到 aios-meeting-write 或 aios-construction-meeting。
---

# AIOS Meeting

## 目标

本 Skill 是工程会议纪要场景的正式短名入口，用于处理用户只说“用 AIOS 整理会议 / 生成纪要 / 看会议待办”的情况。

它不直接替代写作或复核 Skill，而是先判断任务意图，再路由：

- 从录音转写、会议笔记、群聊摘要或口述生成会议纪要草稿：使用 `aios-meeting-write`。
- 审核已有纪要、抽取待办闭环、遗留争议、责任人和下次追踪：使用 `aios-construction-meeting`。
- 同时要求“先生成纪要再做闭环检查”：先用 `aios-meeting-write` 生成纪要草稿，再交回 `aios-construction-meeting` 做待办闭环和证据复核。

`aios-construction-meeting` 继续保留原有工程施工 / 会议闭环领域入口含义；面向新用户时，推荐优先记忆 `aios-meeting`、`aios-meeting-write` 和 `aios-construction-meeting` 这一组入口。

## 适用场景

- 工程例会、协调会、专题会、交底会、质量安全会、进度会和商务会。
- 会议录音转写、会议笔记、群聊会议摘要、手写纪要整理稿和已签发纪要。
- AI 生成纪要后的人工复核、责任人 / 期限缺口检查和下次会议追踪。

普通公司会议、销售会议、HR 面试纪要或不含工程管理语义的会议，不使用本 Skill。

## 路由规则

| 用户意图 | 路由到 | 输出方向 |
|---|---|---|
| 从录音转写、会议笔记、口述或群聊生成会议纪要草稿 | `aios-meeting-write` | 会议 brief、结论 / 待办抽取、Markdown 纪要草稿、待补资料 |
| 审核已有纪要、提取待办闭环、责任人、期限、遗留争议 | `aios-construction-meeting` | 会议结论、待办闭环表、争议清单、下次追踪 |
| 先生成纪要再检查闭环 | `aios-meeting-write` -> `aios-construction-meeting` | 先成稿，再做责任和证据闭环复核 |

## 输出要求

路由判断要简短，但必须说明：

1. 资料类型。
2. 当前任务属于写作、复核还是混合流程。
3. 推荐使用的 Skill。
4. 需要人工复核的岗位。
5. 不能由 AI 直接下结论的事项。

## 约束

- 不把未形成一致意见的讨论写成正式会议决议。
- 不补猜责任人、期限、承诺内容或审批状态。
- 不把发言人默认等同于最终责任人。
- 不替代正式纪要签发、监理指令、合同通知或业主审批。
- 不绕过 `aios-construction-meeting` 把 AI 生成纪要标成可直接归档定稿。
