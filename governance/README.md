# 治理规则

`governance/` 保存 AI 工程治理规则。

## 文件索引

| 中文名称 | 文件 | 作用 |
| --- | --- | --- |
| AI 编码规范 | [coding-rules.md](coding-rules.md) | 统一代码生成、修改、验证和交付边界。 |
| AI 评审策略 | [ai-review-policy.md](ai-review-policy.md) | 约束 AI 生成内容、代码审查和风险评审。 |
| 安全策略 | [security-policy.md](security-policy.md) | 管理权限、密钥、外发、注入和安全敏感操作。 |
| Agent 边界策略 | [agent-boundary.md](agent-boundary.md) | 区分 Agent、Skill、Workflow 和 Runtime 的职责边界。 |
| Capability 证据仲裁协议 | [arbitration-protocol.md](arbitration-protocol.md) | 用证据等级、工具结果和人工升级处理多 Agent 冲突。 |
| 交付策略 | [delivery-policy.md](delivery-policy.md) | 约束发布、回滚、验收和交付声明。 |
| 上下文策略 | [context-policy.md](context-policy.md) | 控制上下文读取范围、成本、污染和泄露风险。 |
| 记忆策略 | [memory-policy.md](memory-policy.md) | 管理长期记忆、项目事实和可复用经验的边界。 |

治理目标是防止 agent 乱调用、prompt 泄露、上下文爆炸、AI 瞎改代码、权限失控和未经评审的自动交付。

## 统一输出口径

面向用户、客户或业务人员的输出默认使用中文字段，不直接输出英文模板标签。

推荐字段：

```text
判断事项：
证据：
工具结果：
处理建议：可继续 / 需核验 / 转人工复核
```

资料整理类输出使用：

```text
资料来源清单
证据仲裁
需核验
转人工复核
```

内部 runtime、schema、Capability ID、命令、文件名和代码标识符可以保留英文；但最终说明应优先给出中文解释。

## 仲裁原则

多 Agent 产生逻辑冲突时，优先按 [Capability 证据仲裁协议](arbitration-protocol.md) 的证据等级处理：确定性工具、项目事实和结构化知识优先于 Agent 自然语言判断；涉及生产授权、法规合规最终结论、结构安全结论和商业范围取舍时升级给人类负责人。

证据不足时，不把推断写成结论；应标为 `需核验`，或在责任、金额、质量安全、结构安全、法律合规、审批签审等高风险事项上标为 `转人工复核`。
