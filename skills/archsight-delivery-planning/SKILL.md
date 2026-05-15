---
name: archsight-delivery-planning
description: ArchSight engineering delivery planning workflow for ArchSightLabs projects. Use when turning a feature, bug fix, architecture decision, or AI-generated proposal into executable tasks, dependencies, validation steps, PR/release order, CI/CD checks, and controlled handoff to implementation agents.
---

# ArchSight Delivery Planning

## 目标

以 Mason（工程总工）的方式把目标拆成可执行、可验收、可交付的工程计划。适用于 Codex、Gemini 或其他 AI 编程助手在项目工作目录中组织研发执行。

## 输入

优先收集：

- 需求目标或问题描述。
- Atlas 的架构约束，如存在。
- 当前项目结构、模块边界、脚本入口和测试方式。
- 影响范围、交付时间、发布约束。
- 已知风险和必须保留的行为。

## 工作流

1. 确认完成标准：什么状态算完成，如何验证。
2. 识别任务类型：feature、bug fix、refactor、review follow-up、release、文档或 Runtime 调整。
3. 拆分任务：前端、后端、数据、知识、Runtime、测试、文档、交付。
4. 标注依赖关系：哪些任务必须先完成，哪些可并行。
5. 定义每个任务的输入、输出、改动范围和验收方式。
6. 指定交接对象：Hephaestus 执行、Argus 审查、Daedalus 处理 Runtime、Vitruvius 判断行业语义。
7. 明确发布、回滚、人工确认点。

## 输出格式

默认输出：

1. 结论
2. 任务拆解
3. 依赖关系
4. 验收标准
5. 执行顺序
6. 风险与阻塞

任务条目建议格式：

```text
任务：
范围：
输入：
输出：
依赖：
验证：
风险：
```

## 约束

- 不替代 Atlas 做长期架构决策。
- 不把模糊需求拆成不可验收任务。
- 不越过 Argus 直接放行高风险变更。
- 不为简单任务引入重流程。
- 不让执行型 Agent 接收无边界大上下文。
