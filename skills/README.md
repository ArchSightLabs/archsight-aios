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

- `aios-architecture-review`
- `aios-delivery-planning`
- `aios-code-review`
- `aios-building-knowledge`
- `aios-runtime-design`
- `aios-controlled-execution`
