# AIOS Architecture Health

`aios-arch-health` 为项目生成可复验的架构健康事实、基线差分和棘轮门禁。它不输出单一“质量分”，也不替代 `aios-arch` 对业务边界和合理复杂度的判断。

## 三层分工

| 层级 | 责任 |
| --- | --- |
| 项目扫描器 | 运行项目语言和框架自有工具，输出复杂度、重复、依赖、覆盖率、性能及其他事实。 |
| `aios-arch-health` | 归一化事实，应用 profile、基线、临时预算和门禁，生成机器与人工报告。 |
| `aios-arch` | 解释热点是深 Module、合理复杂度还是职责混杂，并给出治理优先级。 |

AIOS 只提供通用契约、执行器和合成样例。Compliance、Standards、Graphics 等项目应在各自仓库、各自 Goal 中维护 profile、扫描命令和基线。

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

analyzer 输出可以包含 `repository`、`observedAt`、`observations`、`dependencies` 和 `evidence`。项目应使用稳定 observation ID；行号不参与 finding fingerprint。

## 产物

- `architecture-health.json`：机器可读事实、比较结果、预算、证据和门禁。
- `architecture-health.md`：热点、变化和门禁原因。
- `architecture-health.sarif`：仅包含可定位的 measured 发现。
- `dependency-graph.mmd`：Mermaid 依赖图。
- `dependency-cycles.json`：循环依赖组清单。

公开契约位于 `runtime/architecture-health/0.1/`。v0.1 同时使用无依赖的严格 domain validator；当前不声称内置完整 Draft 2020-12 JSON Schema 引擎。

## 证据和门禁

- `measured`：确定性扫描器或可复验运行结果，可以参与门禁。
- `inferred`：基于事实的架构推断，只作 advisory。
- `unverified`：profile 要求但本次未取得的证据。

门禁返回：

- `pass`：没有未预算的新增 measured 债务，必需证据齐全。
- `fail`：存在新增或恶化、未预算且可门禁的 measured 债务。
- `hold`：基线不兼容、必需证据缺失或必需 analyzer 失败。

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
