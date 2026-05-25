# Runtime

`runtime/` 保存运行治理配置与说明。AIOS 的核心能力不依赖某个具体运行平台；Hermes、OpenClaw、飞书、Gateway、Codex、Claude Code、Gemini 等都只是可选 Runtime / Adapter。

推荐内容：

- [Agent Routing](agent-routing.md)
- [Skill Routing](skill-routing.md)
- [Capability Registry](capability-registry.json)
- [Capability Registry Schema](capability-registry.schema.json)
- [Capability Adapters](capability-adapters.json)
- [Hermes 运行线](hermes/)（可选企业适配器）
- 权限边界
- 工具调用策略
- 飞书或其他协作入口集成
- 定时任务
- 记忆策略
- 成本控制

## 适配原则

- 通用角色、Skill、Workflow 保持平台无关。
- 运行时 Adapter 只负责入口、调度、权限和回传证据。
- 项目工作区中的代码、测试、构建和 `.ai/` 上下文始终是工程事实来源。
- 不得因为启用了某个 Adapter，就把 Hermes、飞书或建筑行业背景写成所有项目的默认事实。
- Capability 是 Agent 可调用或要求的外部证据接口；Adapter 可以实现 Capability，但不得把未执行的工具结果伪装成已验证事实。
- 本地 stdio MCP 阶段先使用 Capability Registry 的 `ownerAgents` 和 `allowedSkills` 做权限边界；传统 API Key、mTLS、租户隔离等远程鉴权留给 HTTP / SSE / Gateway Adapter 阶段。
- `archsight-aios capability:call` 是最小本地调用闭环：校验 Agent / Skill 权限，校验输入 schema，调用 MCP Tool，校验输出证据契约，再给出仲裁 Decision。
- 多 Agent 冲突时，Runtime 应回传 `Claim / Evidence / Tool Result / Decision`，供治理层按 `governance/arbitration-protocol.md` 仲裁。
