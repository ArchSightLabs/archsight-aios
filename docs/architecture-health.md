# AIOS Architecture Health

`aios-arch-health` 为项目生成可复验的架构健康事实、基线差分、证据来源和棘轮门禁。它不输出单一“质量分”，也不替代 `aios-arch` 对业务边界和合理复杂度的判断。

## 三层分工

| 层级 | 责任 |
| --- | --- |
| 项目扫描器 | 运行项目语言和框架自有工具，输出复杂度、重复、依赖、覆盖率、性能及其他事实。 |
| `aios-arch-health` | 归一化事实，核验测试和扫描证据来源，保护规格、测试与质量配置，应用 profile、基线、临时预算和门禁。 |
| `aios-arch` | 阅读系统上下文，解释热点是深 Module、合理复杂度还是职责混杂，评估服务、数据、模型和 Runtime 边界，并给出治理优先级。 |

AIOS 只提供通用契约、执行器和合成样例。Compliance、Standards、Graphics 等项目应在各自仓库、各自 Goal 中维护 profile、扫描命令和基线。

两个命令不是替代关系。`aios-arch-health` 回答“当前提交是否通过了项目声明的可复验约束”，`aios-arch` 回答“这些事实放在业务和系统边界中意味着什么”。前者适合自动化反复运行，后者适合架构评估、重构判断和优先级取舍。

## 运行模式

| 模式 | 用途 | 默认治理方式 |
| --- | --- | --- |
| `commit` | 每次提交或 PR | 对比兼容基线，只阻断新增或恶化的 measured 债务。 |
| `weekly` | 每周或重构波次 | 完整扫描、趋势对比、热点排序。 |
| `milestone` | 里程碑复评 | 要求 profile 声明的性能、真实数据库、并发或失败注入证据；缺失时 HOLD。 |

## 快速运行

先复制通用 profile，再由项目维护阈值和 analyzer：

```powershell
Copy-Item templates/architecture-health/profile.json .ai/architecture-health/profile.json
```

使用已有归一化事实：

```powershell
npx @archsight/aios architecture:health `
  --cwd . `
  --mode commit `
  --health-profile .ai/architecture-health/profile.json `
  --health-input build/architecture-health-input.json `
  --baseline .ai/architecture-health/baseline.json `
  --out build/architecture-health
```

profile 也可以声明本地 analyzer command。命令必须直接输出 JSON，不经 shell 拼接；运行时可读取：

- `AIOS_ARCH_HEALTH_MODE`
- `AIOS_ARCH_HEALTH_CWD`

analyzer 输出可以包含 `repository`、`observedAt`、`observations`、`dependencies`、`evidence` 和 `constraints`。项目应使用稳定 observation ID；行号不参与 finding fingerprint。

## 产物

- `architecture-health.json`：机器可读事实、比较结果、预算、证据和门禁。
- `architecture-health.md`：热点、变化和门禁原因。
- `architecture-health.sarif`：仅包含可定位的 measured 发现。
- `dependency-graph.mmd`：Mermaid 依赖图。
- `dependency-cycles.json`：循环依赖组清单。

公开契约位于 `runtime/architecture-health/0.1/`。v0.1 同时使用无依赖的严格 domain validator；当前不声称内置完整 Draft 2020-12 JSON Schema 引擎。

## 证据分层

门禁不负责替项目运行所有测试框架。项目原生工具生成证据，`aios-arch-health` 负责归一化、核验和裁决。一个较完整的项目可以按风险逐步声明：

| 层级 | 代表证据 | 主要回答 |
| --- | --- | --- |
| 行为契约 | acceptance test、Gherkin、UI QA | 系统是否满足外部可观察行为。 |
| 实现正确性 | unit test、property test | 局部逻辑和不变量是否成立。 |
| 抗误判能力 | mutation test | 测试是否真的能发现错误实现。 |
| 工程质量 | coverage、code quality、dependency scan | 复杂度、重复、覆盖和依赖方向是否越界。 |
| 生产风险 | performance、real database、concurrency、failure injection | 非功能需求和真实运行条件是否经受验证。 |

profile 按 `commit / weekly / milestone` 分别声明必需证据。不是每个提交都运行最昂贵的验证，但高风险里程碑不能拿单元测试代替真实数据库、性能或失败注入证据。

## 证据来源完整性

- `measured`：确定性扫描器或可复验运行结果，可以参与门禁。
- `inferred`：基于事实的架构推断，只作 advisory。
- `unverified`：profile 要求但本次未取得的证据。

当 profile 启用 `evidencePolicy` 时，必需的 measured 证据还要提供：

- `provenance.tool / version / command`：证据由什么工具和命令产生。
- `provenance.actor / role`：由生产者、验证者、复核者还是 CI 产生。
- `provenance.repositoryCommit`：证据对应哪个提交；必须与本次扫描提交一致。
- `provenance.observedAt / environment`：何时、在哪个环境产生。
- `artifact.path / sha256`：需要时保存原始报告的位置和内容摘要，防止只留下“已通过”的口头结论。

证据缺失、提交不匹配或必需产物没有摘要时返回 HOLD，而不是把无法复验的“绿灯”当作通过。

## 约束完整性

只有测试门禁还不够：同一个 Agent 如果既能改实现，又能悄悄削弱测试或质量阈值，就可能制造虚假的通过结果。项目可以把以下内容登记为受保护约束：

- `specification`
- `acceptance-test`
- `unit-test`
- `quality-profile`
- `qa-procedure`

每条约束记录稳定 ID、内容 SHA-256、来源、位置、生产者及其引用关系。与兼容基线相比，只要约束新增、修改或删除，就必须提供 `constraint-approval` 证据。审批证据必须：

1. 对应当前提交；
2. 列出覆盖的全部变更约束；
3. 由 `reviewer` 角色产生；
4. 复核者不能是这些约束的生产者。

这不是宣称工具已经判断了规格本身是否正确，而是把“测试和约束也被改过”变成一个不能被静默忽略的工程事实。

## 门禁结果

门禁返回：

- `pass`：没有未预算的新增 measured 债务，必需证据齐全。
- `fail`：存在新增或恶化、未预算且可门禁的 measured 债务。
- `hold`：基线不兼容、必需证据缺失、证据来源不完整、受保护约束缺少独立审批或必需 analyzer 失败。

CLI 退出码为 `0=pass`、`2=fail/hold`、`1=参数、输入、执行或写入错误`。

## 临时预算

预算必须同时声明：

- `id`
- `ruleId`
- `scope`
- `owner`
- `reason`
- `ceiling`
- `expiresAt`

预算只豁免作用域内、未超过上限且尚未到期的 finding。`expiresAt` 等于扫描时间时视为已经到期。预算不改变历史基线身份，也不能把 inferred 或 unverified 结论升级成 measured。

## 边界

- 代码行数、扇入和扇出只作调查信号。
- 静态事务或并发信号不能冒充真实数据库、竞态或失败注入结果。
- 性能证据应由项目 analyzer 携带硬件、数据集、数据库版本、运行模式和样本条件。
- commit 模式仍必须纳入受影响依赖闭包；新增一条边形成的全局循环不能因“只看 diff”而漏检。
- 约束完整性只能证明变更被显式识别和独立复核，不能证明测试集合已经穷尽业务风险。
- `aios-arch-health` 不解释某个大文件是否合理，也不擅自决定微服务拆分；这些问题交给 `aios-arch` 和人类架构决策。
