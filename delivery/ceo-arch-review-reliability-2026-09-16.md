# CEO / Arch 事实可靠性交付记录

日期：2026-09-16

基线 commit：`5f7cd7cd4112844186a4854f1884f969a1415622`

结果 commit：包含本记录的本地提交；交付时用 `git log -1 --format=%H -- delivery/ceo-arch-review-reliability-2026-09-16.md` 解析，避免在提交内记录自引用哈希。
工作区边界：开始时仅有任务外未跟踪的 `scripts/__pycache__/`；未删除、覆盖或暂存该目录。未修改 Science 或其他样例项目，未 push、tag、Release、npm publish、全局安装、生产访问或策略变更。

## 失败模式与修复

| 原失败模式 | 本次最小修复 |
| --- | --- |
| 历史生产事实与候选回归互相覆盖 | 公共协议要求记录 commit / 版本 / 环境 / 时间适用性，R01 同时保留两类事实。 |
| 旧文档、`diff --stat`、字段或图示被当成链路完成 | 公共协议和 Arch 明确这些只是定位线索；静态追踪必须标注，不能宣称运行正确。 |
| quick / 局部门禁被写成完整工程门禁 | 要求核对实际命令和覆盖范围；R04 区分 quick、full、未启动 CI 与根因未知。 |
| 未测、正常 WIP 或基础设施阻塞被升级为事故 | 新增事实状态，再与严重度、发布影响分开；R03、R04、R08覆盖反例。 |
| 建议被写成已批准支付 / 发布政策 | 公共协议和两个 Skill 区分推荐、备选、探索假设、现行策略和授权决策。 |
| 无量表精确评分替代成熟度证明 | CEO 固定“成熟度评分”改为量表有据才评分的“成熟度状态”；Arch 删除 `置信度 1-10`。 |
| 历史闭环复述多、机会和决策增量少 | CEO 增加用户、替代、首次使用、返回、付费、价值缺口、下一笔投入和证伪信号，并要求少量互斥选项。 |
| 文件 / 服务数量直接触发架构否定 | Arch 改按状态、依赖、耦合、部署、失败恢复和所有权判断；数量仅触发调查。 |

## 合并与删除

- 任务、权限、证据适用性、反证和决策边界合并进现有 `governance/arbitration-protocol.md`，未新建第二套公共协议。
- 删除 CEO 无条件成熟度评分模板、Arch 固定 `1-10` 置信度和“8 文件 / 2 服务即挑战”的硬阈值。
- 保留 Product 职责与路由，不因 CEO + Arch 联审自动加入 Product；非建筑显式调用继续走通用评审。

## 回归资产与检查器边界

- `ceo-arch-review-fixtures.json`：R01-R08，全部合成 / 脱敏；R02、R05、R08 标为修改后保留用例。
- `ceo-arch-review-scorecard.json`：8 个 Hard Failure、8 个正向决策价值标准和逐 case 人工问题。
- `validate-ceo-arch-review-evals.mjs`：仅检查 schema、case 覆盖、适用性字段、反事实、相对路径、共享契约锚点和 scorecard 引用。
- 检查器不对模型语义判分、不证明宿主加载 Skill、不把同模型双角色视角当独立复核。

## 已执行验证

```text
npm run validate:ceo-arch-evals                 PASS
npm run test:ceo-arch-evals                     PASS（1 个正例 + 5 个负例）
npm run validate:skills                         PASS
PYTHONUTF8=1 quick_validate.py skills/aios-ceo PASS
PYTHONUTF8=1 quick_validate.py skills/aios-arch PASS
npm test                                        PASS（50 CLI + 9 架构健康 + 5 Git 治理 + 6 本次回归测试）
npm pack --dry-run --json                       PASS（新资产已包含；Python cache 已排除）
临时 HOME 下 Gemini support install + SHA-256  PASS（CEO、Arch、公共协议与源码一致）
git diff --check                                PASS
```

`quick_validate.py` 首次在 Windows 默认 GBK 下读取中文 UTF-8 文件失败；设置 `PYTHONUTF8=1` 后两项均通过。该失败是校验器读取编码限制，不是 Skill schema 或内容失败。

## 真实行为状态

- 当前提交的 Gemini / Codex `skill-runtime` 语义回归：`未执行`。
- 原因：本任务未获准调用新付费 API，也不覆盖全局安装；当前会话不能在不中断的情况下证明重新加载了修改后的 Skill。
- 原始模型输出：无；不得把 fixture 预期或本次作者判断冒充真实运行结果。
- 隔离加载准备：临时 HOME 安装已验证；直接运行步骤、保留用例顺序和 Gemini 指令见 `prompts/evaluations/ceo-arch-review-regression-guide.md`。

## 维护者后续决策

1. 是否按指南先运行 R01、R03、R04、R06、R07，并归档宿主、模型、commit、Skill 哈希和完整输出。
2. 修改冻结后是否运行保留用例 R02、R05、R08，并由维护者手工使用 scorecard 判读。
3. 是否把真实输出交给 ChatGPT 做最终独立复核；在此之前不能声称事实可靠性行为回归已最终通过。
4. 后续发布时再决定版本号、tag、GitHub Release 和 npm publish；本提交不改变 `1.7.0` 发布事实。
