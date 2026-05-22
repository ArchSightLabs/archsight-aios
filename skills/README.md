# Skills

`skills/` 保存可复用能力插件。

每个 skill 应沉淀为可重复执行、可验证、可治理的工作单元，而不是一句 prompt。Skill 是项目工作目录中的实际作业方法，Agent 是角色身份和职责边界。

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
| `aios-plan` | 交付计划、任务拆解、依赖和验证顺序。 |
| `aios-exec` | 有边界地改代码、修 bug、更新文档、运行验证。 |
| `aios-review` | PR、diff、AI 生成代码、安全和测试缺口审查。 |
| `aios-arch` | 架构边界、技术选型、长期复杂度和方案评审。 |
| `aios-knowledge` | BIM、IFC、建筑规范、审图规则和知识结构化。 |
| `aios-runtime` | Prompt、Context、Memory、MCP/Tool、RAG/GraphRAG 和多 Agent Runtime 设计。 |
