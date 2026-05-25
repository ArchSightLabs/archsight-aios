# Governance

`governance/` 保存 AI 工程治理规则。

推荐优先建立：

- [AI 编码规范（公共）](coding-rules.md)
- [AI Review Policy](ai-review-policy.md)
- [Security Policy](security-policy.md)
- [Agent Boundary Policy](agent-boundary.md)
- [Capability-Backed Arbitration Protocol](arbitration-protocol.md)
- [Delivery Policy](delivery-policy.md)
- [Context Policy](context-policy.md)
- [Memory Policy](memory-policy.md)

治理目标是防止 agent 乱调用、prompt 泄露、上下文爆炸、AI 瞎改代码、权限失控和未经评审的自动交付。

多 Agent 产生逻辑冲突时，优先按 `arbitration-protocol.md` 的证据等级处理：确定性工具、项目事实和结构化知识优先于 Agent 自然语言判断；涉及生产授权、法规合规最终结论、结构安全结论和商业范围取舍时升级给人类负责人。
