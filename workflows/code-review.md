# Code Review Workflow

## 定位

用于 PR、diff、AI 生成代码、Runtime 配置、Prompt、Tool Calling 和发布前质量审查。

## 触发场景

- PR 合并前。
- AI 生成代码进入仓库。
- 涉及权限、安全、依赖、Runtime 或生产发布。
- 大范围重构或多模块变更。

## 参与角色与 Skill

| 阶段 | 主 Agent | Skill |
| --- | --- | --- |
| 质量审查 | Argus | `aios-review` |
| 架构边界复核 | Atlas | `aios-arch` |
| 修复执行 | Hephaestus | `aios-exec` |
| 交付协调 | Mason | `aios-plan` |
| Runtime 风险 | Daedalus | `aios-runtime` |

## 输入

- diff / PR / commit。
- 需求背景和验收标准。
- 测试、构建、lint、typecheck 输出。
- 权限、Runtime、Prompt 或 Tool 配置。

## 执行顺序

1. Argus 先看需求和预期行为，再审查 diff。
2. Argus 按 P0-P3 输出问题，先列阻断项。
3. Atlas 复核架构边界问题。
4. Daedalus 复核 Runtime / MCP / Memory / Prompt 风险。
5. Hephaestus 修复明确问题。
6. Argus 复审。

## 输出

- 阻断问题。
- 非阻断建议。
- 测试缺口。
- 剩余风险。
- 合并或发布建议。

## 验收标准

- 阻断问题已修复或明确不发布。
- 测试缺口被补齐或记录。
- 没有无关风格挑刺。
- 没有未经验证的完成声明。

