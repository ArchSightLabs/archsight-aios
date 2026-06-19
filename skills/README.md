# Skills

`skills/` 保存可复用能力插件。

每个 skill 应沉淀为可重复执行、可验证、可治理的工作单元，而不是一句 prompt。Skill 是项目工作目录中的实际作业方法，Agent 是角色身份和职责边界。

AIOS Skill 的差异化目标是让通用 AI Coding 工具在建筑行业平台研发中获得更专业的默认判断。`aios` 和 `archsight-aios` 是总路由入口；其他 `aios-*` Skill 负责具体任务分工。Skill 名称只表示任务分工，不表示只有某一个 Skill 才面向建筑行业。

当项目涉及 BIM / IFC、建筑规范、智能审图、图纸 / 模型处理、RAG / GraphRAG、任务编排、审计证据链、结构力学或长期平台演进时，`aios-ceo`、`aios-design`、`aios-plan`、`aios-exec`、`aios-review`、`aios-arch`、`aios-knowledge`、`aios-structural` 和 `aios-runtime` 都应把这些行业约束纳入判断。区别只是：`aios-ceo` 做建筑行业软件 / 系统的一把手深度评价，把产品定位、行业专业性、工程可信度、证据链和商业验证放到同一决策框架里；`aios-design` 判断界面方案能否支撑审查、定位、复核、追溯和交付，`aios-arch` 判断边界，`aios-knowledge` 判断行业语义，`aios-structural` 判断结构力学输入、求解链路和人工签审边界，`aios-runtime` 判断 AI / RAG 运行时，`aios-plan` 拆交付，`aios-review` 查风险，`aios-exec` 做受控实现。

## 适用性门槛

AIOS 是建筑行业增强层，不是通用任务替代器。装了 AIOS 后，默认策略不是“所有任务都套 AIOS”，而是“建筑行业相关任务显著增强，非建筑任务不强行介入”。

启用 AIOS 行业增强的条件：

- 项目明确启用了 `bim-platform`、`construction-vision`、`rag-knowledge` 或其他建筑行业 profile。
- 项目上下文、README、`.ai/project-context.md` 或用户任务明确涉及 BIM / IFC / Revit / CAD、建筑规范、智能审图、施工视觉、工程知识库、GraphRAG、图纸 / 模型处理、证据链、人工复核、审计留痕或建筑行业平台。
- 用户明确要求使用 ArchSight AIOS、`aios`、`archsight-aios`、`aios-*` Skill 或建筑行业评审方法。

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
| `aios` | AIOS 总路由入口：当用户只说“请用 AIOS 技能包分析该文档”时，先识别资料类型，再路由到合适的具体 Skill。 |
| `archsight-aios` | `aios` 的品牌别名入口，用于 “ArchSight AIOS” 或 “AIOS 技能包” 这类自然调用。 |
| `aios-ceo` | 建筑行业软件 / 系统深度评价：产品定位、行业专业性、工程可信度、证据链、商业验证、范围取舍和阶段路线。 |
| `aios-design` | 建筑行业平台界面方案、工作台体验、证据定位、复核追溯和前端实现交接评审。 |
| `aios-plan` | 交付计划、任务拆解、依赖和验证顺序。 |
| `aios-exec` | 有边界地改代码、修 bug、更新文档、运行验证。 |
| `aios-review` | PR、diff、AI 生成代码、安全、证据链和测试缺口审查。 |
| `aios-arch` | 架构边界、技术选型、长期复杂度和方案评审。 |
| `aios-knowledge` | BIM、IFC、建筑规范、审图规则和知识结构化。 |
| `aios-structural` | 结构力学、荷载、边界条件、FEM 和确定性求解链路评审。 |
| `aios-runtime` | Prompt、Context、Memory、MCP/Tool、RAG/GraphRAG 和多 Agent Runtime 设计。 |
| `aios-compare` | 文档专业度对比：比较两份文档、两个版本或两个 AI 输出哪份更专业、更可复核、更适合交付。 |
| `aios-prompt-compare` | 内部 Prompt / Skill 测试工具：仅开发者明确调用时，对同一输入分别评估弱提示词、便携强提示词和真实 Skill 触发结果，判断是否应沉淀为 Skill。 |
| `aios-tender-write` | 工程标书 / 技术标生成与改写：基于招标要求、历史标书素材和用户初稿生成 Markdown 工作母版，并交回 `aios-commercial-tender` 复核。 |
| `aios-scheme-write` | 专项施工方案生成与改写：基于方案初稿、历史方案素材、工程概况和专家意见生成 Markdown 工作母版，并交回 `aios-construction-scheme` 复核。 |

工程业务管理技能包 (Engineering Project Management)：

工程业务管理场景可直接参考 [工程业务管理基础技能包](engineering-business-starter-kit.md)。该基础包提供 L0-L1 级通用提示词 / Skill 模板能力：把工程资料整理成矩阵、清单、台账和人工复核问题；不承诺系统建设、自动审批、专业结论或替代签审。

| Skill | 用途 |
| --- | --- |
| `aios-commercial-tender` | 工程招投标响应证据链，用于提取评分点、资格条件、废标风险、资料缺口和人工复核事项。 |
| `aios-tender-write` | 工程标书 / 技术标生成与改写，用于生成目录、章节初稿、评分点响应内容和历史素材复用表。 |
| `aios-commercial-contract` | 工程分包、采购和补充协议履约证据链，用于提取节点、责任边界、付款条件和合同资料缺口。 |
| `aios-construction-daily` | 现场施工日报证据链，用于提取管理摘要、异常、问题台账、计划偏差和需补充确认事项。 |
| `aios-construction-meeting` | 工程现场会议待办闭环，用于将会议讨论转化为责任人、期限、争议点和下次追踪清单。 |
| `aios-commercial-variation` | 工程变更签证资料链审查，用于梳理联系单、纪要、图纸变更、合同流程和资料断点。 |
| `aios-construction-scheme` | 专项施工方案证据链辅审，用于提取危险源、交底要点、规范核验点、计算书缺口和专家复核事项。 |
| `aios-scheme-write` | 专项施工方案生成与改写，用于生成方案章节、工艺流程、危险源控制措施和交底材料初稿。 |

工程业务管理 Skill 只处理建筑工程资料抽取、生成初稿、证据链整理、风险提示和人工复核分流，不替代法务、造价、监理、安全、项目经理、总工或专家签审。涉及规范、制度、结构计算、质量安全、金额、工期索赔或责任归属时，必须输出中文化的 `判断事项 / 证据 / 工具结果 / 处理建议`；没有工具或人工证据时只能标注 `需核验` 或 `转人工复核`。写作型 Skill 必须使用 Markdown 工作母版，保留素材来源、复用判断、待补占位和审核门禁，不得把历史项目事实直接套入当前项目。
