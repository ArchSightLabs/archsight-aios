# Agent Boundary Policy

## 基本关系

| 层 | 说明 |
| --- | --- |
| Agent | 谁来做，定义职责和边界 |
| Skill | 怎么做，定义可复用作业方法 |
| Workflow | 什么时候做，定义顺序和验收 |
| Runtime | 在哪里运行，定义权限和调度 |

## 边界规则

- Agent 不承载复杂工具流程；复杂流程沉淀为 Skill 或 Workflow。
- Skill 不伪装成角色身份；Skill 只定义输入、步骤、输出和约束。
- Runtime 不保存长期角色资产；Runtime 只引用仓库内受版本控制的 Prompt。
- 具体业务项目事实优先于 AIOS 通用模板。

## 升级规则

- 架构边界升级给 Atlas。
- 交付顺序升级给 Mason。
- 安全质量升级给 Argus。
- 建筑语义升级给 Vitruvius。
- AI Runtime 升级给 Daedalus。
- 受控执行交给 Hephaestus。

