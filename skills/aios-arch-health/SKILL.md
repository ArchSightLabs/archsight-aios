---
name: aios-arch-health
description: Deterministic architecture-health governance for repositories. Use when a project needs complexity, duplication, dependency, test, coverage, mutation, QA, performance, database, concurrency, or failure-injection evidence; evidence provenance and artifact digests; protected specification, test, quality-profile, or QA constraints; independent constraint-change approval; commit/weekly/milestone health runs; baseline ratchets and temporary debt budgets; JSON, Markdown, SARIF, or dependency-graph artifacts; or measured facts that must be handed to aios-arch for architectural interpretation. Also route legacy natural-language mentions of aios-architecture-health or archsight-architecture-health here.
---

# AIOS Arch Health

建立可复验的架构健康事实和棘轮门禁。不要用本 Skill 替代 `aios-arch` 的业务边界判断，也不要让自然语言推断伪装成扫描事实。

`aios-arch-health` 是唯一 canonical Skill ID。`aios-architecture-health` 和 `archsight-architecture-health` 只作为自然语言兼容触发，不建立重复 Skill。

## 分工

- 使用本 Skill 执行扫描、证据来源核验、受保护约束差分、基线差分、临时预算和门禁。
- 使用 `aios-arch` 阅读业务与系统上下文，解释热点是深 Module、合理复杂度还是职责混杂，并评估服务、数据、模型和 Runtime 边界。
- 使用 `aios-review` 消费 PR 中的 SARIF 和门禁结果。
- 使用 `aios-plan` 把确认后的治理项拆成交付任务。

## 工作流

1. 读取项目规则、`.ai/architecture-health/profile.json` 或用户指定的 profile。
2. 选择运行模式：
   - `commit`：关注相对基线的新增债务，目标为数十秒级。
   - `weekly`：运行完整扫描、趋势对比和热点排序。
   - `milestone`：增加性能、真实数据库、并发或失败注入等 profile 要求的证据。
3. 运行项目自有扫描器，或读取符合输入契约的归一化事实文件。
4. 按 profile 收集 unit、acceptance、property、mutation、coverage、code quality、dependency、UI QA、performance、real database、concurrency 和 failure injection 等分层证据；不要让低成本证据冒充高风险验证。
5. 当 profile 要求时，核验必需证据的 tool、command、actor、role、repository commit、observedAt、environment 和 artifact SHA-256。
6. 对照基线识别受保护的 specification、acceptance test、unit test、quality profile 和 QA procedure 是否新增、修改或删除；变化必须有覆盖全部变更、对应当前提交且非生产者自审的 `constraint-approval`。
7. 生成 `architecture-health.json`、Markdown、SARIF、依赖图和循环依赖清单。
8. 只让 `measured` 的确定性违规触发 fail；`inferred` 只进入建议；证据或约束不可验证时 HOLD。
9. 对照基线区分 `new / worsened / improved / retained / resolved / budgeted`。
10. 校验临时预算的作用域、负责人、原因、上限和到期时间；过期预算不得放行。
11. 把需要业务解释的热点交给 `aios-arch`，同时保留原始事实和证据定位。

## CLI

优先使用仓库提供的命令：

```text
archsight-aios architecture:health \
  --cwd <project> \
  --mode <commit|weekly|milestone> \
  --health-profile <profile.json> \
  --health-input <facts.json> \
  --baseline <previous-architecture-health.json> \
  --out <artifact-directory>
```

项目可以在 profile 中声明本地 analyzer command。不要把 Compliance、Standards、Graphics 的阈值或扫描命令写入 AIOS 核心；由各项目在独立 Goal 中维护自己的 profile、适配器和基线。

## 证据规则

- `measured`：确定性工具或可复验运行结果。
- `inferred`：由事实推导的架构风险，不能直接阻断。
- `unverified`：profile 要求但本次没有取得的证据。
- 必需证据开启 provenance 后，必须绑定当前 repository commit；需要 artifact 时必须提供仓库相对路径和小写 SHA-256。
- 受保护约束有变化时，必须由 `reviewer` 提供 measured 的 `constraint-approval`，覆盖所有变更约束；约束生产者不得自审。
- 代码行数、扇入和扇出只作调查信号，不单独作为删功能或拆模块的硬门禁。
- 性能结果必须携带环境、数据集和运行条件。
- 静态事务或并发信号不能冒充真实数据库、竞态或失败注入结论。
- SARIF 承载可定位的确定性发现；AI 解释保持 advisory。

## 输出判断

输出 `pass / fail / hold`：

- `pass`：没有未预算的新增或恶化 measured 违规，并且本模式必需证据齐全。
- `fail`：存在未预算的新增或恶化 measured 违规。
- `hold`：基线不兼容、必需证据缺失、证据来源不完整、受保护约束缺少独立审批、必需扫描器失败或输入不可验证。

报告不得输出单一“质量分”。按维度、变化状态、证据等级、严重度和优先级呈现结果。
