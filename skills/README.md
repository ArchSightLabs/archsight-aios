# Skills

`skills/` 保存可复用能力插件。

每个 skill 应沉淀为可重复执行、可验证、可治理的工作单元，而不是一句 prompt。Skill 是项目工作目录中的实际作业方法，Agent 是角色身份和职责边界。

AIOS Skill 的差异化目标是让通用 AI Coding 工具在建筑行业平台研发中获得更专业的默认判断。所有 `aios-*` Skill 都继承这个行业取向；Skill 名称只表示任务分工，不表示只有某一个 Skill 才面向建筑行业。

当项目涉及 BIM / IFC、建筑规范、智能审图、图纸 / 模型处理、RAG / GraphRAG、任务编排、审计证据链或长期平台演进时，`aios-ceo`、`aios-design`、`aios-plan`、`aios-exec`、`aios-review`、`aios-arch`、`aios-knowledge` 和 `aios-runtime` 都应把这些行业约束纳入判断。区别只是：`aios-ceo` 判断立项和商业目标，`aios-design` 判断界面方案能否支撑审查、定位、复核、追溯和交付，`aios-arch` 判断边界，`aios-knowledge` 判断行业语义，`aios-runtime` 判断 AI / RAG 运行时，`aios-plan` 拆交付，`aios-review` 查风险，`aios-exec` 做受控实现。

当前采用兼容 Codex 和 Gemini 的最小标准结构：

```text
skills/
└── skill-name/
    ├── SKILL.md
    └── agents/
        └── openai.yaml
```

使用方式：

- Codex：通过 `SKILL.md` frontmatter 的 `name` 和 `description` 自动识别触发。
- Gemini：读取对应 `SKILL.md`，按其中的输入、工作流、输出格式和约束执行。
- Hermes / 飞书：这是可选企业适配器。启用时可使用 `agents/*/system-prompt.md` 作为运行时提示词；需要执行项目任务时，再映射到这里的 skill。

第一阶段核心技能包：

| Skill | 用途 |
| --- | --- |
| `aios-ceo` | 项目立项、产品定位、商业目标、范围取舍和阶段路线评审。 |
| `aios-design` | 建筑行业平台界面方案、工作台体验、证据定位、复核追溯和前端实现交接评审。 |
| `aios-plan` | 交付计划、任务拆解、依赖和验证顺序。 |
| `aios-exec` | 有边界地改代码、修 bug、更新文档、运行验证。 |
| `aios-review` | PR、diff、AI 生成代码、安全、证据链和测试缺口审查。 |
| `aios-arch` | 架构边界、技术选型、长期复杂度和方案评审。 |
| `aios-knowledge` | BIM、IFC、建筑规范、审图规则和知识结构化。 |
| `aios-runtime` | Prompt、Context、Memory、MCP/Tool、RAG/GraphRAG 和多 Agent Runtime 设计。 |
