# Skills

`skills/` 保存可复用能力插件。

每个 skill 应沉淀为可重复执行、可验证、可治理的工作单元，而不是一句 prompt。Skill 是项目工作目录中的实际作业方法，Agent 是角色身份和职责边界。

AIOS Skill 的差异化目标是让通用 AI Coding 工具在建筑行业平台研发中获得更专业的默认判断。所有 `aios-*` Skill 都继承这个行业取向；Skill 名称只表示任务分工，不表示只有某一个 Skill 才面向建筑行业。

当项目涉及 BIM / IFC、建筑规范、智能审图、图纸 / 模型处理、RAG / GraphRAG、任务编排、审计证据链、结构力学或长期平台演进时，`aios-ceo`、`aios-design`、`aios-plan`、`aios-exec`、`aios-review`、`aios-arch`、`aios-knowledge`、`aios-structural` 和 `aios-runtime` 都应把这些行业约束纳入判断。区别只是：`aios-ceo` 做建筑行业软件 / 系统的一把手深度评价，把产品定位、行业专业性、工程可信度、证据链和商业验证放到同一决策框架里；`aios-design` 判断界面方案能否支撑审查、定位、复核、追溯和交付，`aios-arch` 判断边界，`aios-knowledge` 判断行业语义，`aios-structural` 判断结构力学输入、求解链路和人工签审边界，`aios-runtime` 判断 AI / RAG 运行时，`aios-plan` 拆交付，`aios-review` 查风险，`aios-exec` 做受控实现。

## 适用性门槛

AIOS 是建筑行业增强层，不是通用任务替代器。装了 AIOS 后，默认策略不是“所有任务都套 AIOS”，而是“建筑行业相关任务显著增强，非建筑任务不强行介入”。

启用 AIOS 行业增强的条件：

- 项目明确启用了 `bim-platform`、`construction-vision`、`rag-knowledge` 或其他建筑行业 profile。
- 项目上下文、README、`.ai/project-context.md` 或用户任务明确涉及 BIM / IFC / Revit / CAD、建筑规范、智能审图、施工视觉、工程知识库、GraphRAG、图纸 / 模型处理、证据链、人工复核、审计留痕或建筑行业平台。
- 用户明确要求使用 ArchSight AIOS、`aios-*` Skill 或建筑行业评审方法。

不启用行业增强的情况：

- 任务只是普通 Web、后端、脚本、文档、测试或通用 AI Coding 问题，且没有建筑行业语义。
- 仓库虽然安装了 AIOS，但当前任务不涉及建筑行业数据、流程、责任边界或证据链。

处理原则：

- 非建筑任务优先使用宿主工具的通用能力；不要强行套 BIM、IFC、审图、规范、工程证据链等假设。
- 如果不确定，先读 README、`.ai/project-context.md`、AGENTS / CLAUDE / GEMINI 入口和用户任务，再决定是否启用行业增强。
- AIOS 的价值来自更准确的证据、边界、验证和行业判断，不来自更长的模板化输出。

当前采用兼容 Codex 和 Gemini 的最小标准结构：

```text
skills/
└── skill-name/
    ├── SKILL.md
    └── agents/
        └── openai.yaml
```

Skill 可以继续用 `SKILL.md` 表达操作方法，但涉及确定性工具、规范查询、结构求解、安全扫描或测试门禁时，必须同时引用 `runtime/capability-registry.json` 中的 Capability，并按 `governance/arbitration-protocol.md` 输出证据。

使用方式：

- Codex：通过 `SKILL.md` frontmatter 的 `name` 和 `description` 自动识别触发。
- Gemini：读取对应 `SKILL.md`，按其中的输入、工作流、输出格式和约束执行。
- Hermes / 飞书：这是可选企业适配器。启用时可使用 `agents/*/system-prompt.md` 作为运行时提示词；需要执行项目任务时，再映射到这里的 skill。

第一阶段核心技能包：

| Skill | 用途 |
| --- | --- |
| `aios-ceo` | 建筑行业软件 / 系统深度评价：产品定位、行业专业性、工程可信度、证据链、商业验证、范围取舍和阶段路线。 |
| `aios-design` | 建筑行业平台界面方案、工作台体验、证据定位、复核追溯和前端实现交接评审。 |
| `aios-plan` | 交付计划、任务拆解、依赖和验证顺序。 |
| `aios-exec` | 有边界地改代码、修 bug、更新文档、运行验证。 |
| `aios-review` | PR、diff、AI 生成代码、安全、证据链和测试缺口审查。 |
| `aios-arch` | 架构边界、技术选型、长期复杂度和方案评审。 |
| `aios-knowledge` | BIM、IFC、建筑规范、审图规则和知识结构化。 |
| `aios-structural` | 结构力学、荷载、边界条件、FEM 和确定性求解链路评审。 |
| `aios-runtime` | Prompt、Context、Memory、MCP/Tool、RAG/GraphRAG 和多 Agent Runtime 设计。 |
