# Bug 修复 Workflow

## 定位

用于处理缺陷、测试失败、构建失败和生产风险修复。目标是先复现或定位，再做最小修复，最后用证据验证。

## 触发场景

- 用户报告 bug。
- 测试、构建、lint 或类型检查失败。
- AI 生成代码导致行为回归。
- 生产或预发布环境发现异常。

## 参与角色与 Skill

| 阶段 | 主 Agent | Skill |
| --- | --- | --- |
| 风险识别 | Argus | `archsight-code-review` |
| 架构影响判断 | Atlas | `archsight-architecture-review` |
| 修复计划 | Mason | `archsight-delivery-planning` |
| 受控修复 | Hephaestus | `archsight-controlled-execution` |
| Runtime 相关缺陷 | Daedalus | `archsight-ai-runtime-design` |
| 行业语义缺陷 | Vitruvius | `archsight-bim-domain-modeling` |

## 输入

- 错误现象、日志、截图或复现步骤。
- 失败命令和输出。
- 最近变更、diff 或 PR。
- 预期行为和实际行为。

## 执行顺序

1. Argus 判断缺陷风险级别和可能影响面。
2. Hephaestus 尝试复现或定位最小失败点。
3. Atlas 判断是否涉及架构边界或数据模型问题。
4. Mason 拆解修复步骤、验证路径和回滚策略。
5. Hephaestus 执行最小修复。
6. Argus 复核修复是否引入新风险。

## 修复原则

- 优先复现，再修改。
- 优先最小修复，不顺手重构。
- 优先补回归测试；没有测试条件时记录人工验证。
- 不通过删除测试、降低校验或吞错来制造“通过”。

## 输出

- 根因判断。
- 修复范围。
- 修改文件。
- 验证命令和结果。
- 剩余风险。

## 验收标准

- 原失败路径已通过验证。
- 相关回归路径已检查。
- 没有扩大改动范围。
- Argus 无阻断问题。

