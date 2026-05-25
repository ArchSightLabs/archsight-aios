# ArchSight AIOS

ArchSight AIOS 是一套面向建筑 AI 研发的规则、Agent、Skill、Workflow 和项目接入工具包。它重点服务 BIM / IFC / Revit / CAD、施工视觉 AI、建筑规范知识库、GraphRAG、智能审图和 AI Coding 治理，让 Codex、Claude Code、Antigravity 2.0 等 AI Coding 工具在同一个项目里读取同一套规则、项目上下文和验收要求。

AIOS 不是全行业项目模板集合。它保留通用的 AI 编码规则、Agent 路由、Workflow、项目 `.ai/` 上下文和交付验证能力，但真正的差异化能力集中在建筑行业语义、工程证据链、规范知识工程、Capability 工具证据和可复核的 AI 研发流程。

## 设计目标

AIOS 的目标不是替代 Codex、Claude Code 或 Gemini 自带的通用工程能力，而是让它们在建筑行业平台研发中做出更专业的判断。它面向建筑行业架构师、博士 / 研究型团队和后端开发，把通用架构评审补足为面向 BIM / IFC、建筑规范、审图链路、知识库、RAG / GraphRAG、任务编排、审计证据和长期平台演进的工作方法。

没有 `.ai/` 目录时，AIOS Skill 仍应可直接使用：优先读取代码、接口、schema、配置、测试和部署入口；只有项目明确启用 profile 或任务本身涉及建筑行业语义时，才加载 BIM、IFC、规范知识或智能审图假设。

AIOS 是建筑行业增强层，不是通用任务替代器。装了 AIOS 后，建筑行业相关任务应得到更专业的证据、边界、验证和行业判断；普通非建筑任务不应被强行套用 BIM、IFC、规范、审图或工程证据链假设，必要时直接使用宿主工具的通用能力。

## 适合谁

| 角色 | 可以用它做什么 |
| --- | --- |
| 建筑行业架构师 | 评估平台边界、BIM / IFC 数据链路、规范知识工程、审图流程和长期演进风险。 |
| 博士 / 研究型团队 | 把算法、RAG / GraphRAG、评估集、实验假设和工程验收连接到可复核的研发流程。 |
| 后端开发 | 拆清服务边界、任务队列、文件处理、审计日志、索引版本、缓存和多实例运行风险。 |
| 业务专家 | 沉淀规范条文、审查口径、工程术语、样例和人工复核点。 |
| 产品 / 项目 / 设计负责人 | 把业务目标、页面任务、工作台体验、验收标准和 AI 协作流程写进项目规则。 |
| 企业负责人 / 业务一把手 | 用 `aios-ceo` 深度评价建筑行业软件 / 系统的产品定位、行业专业性、工程可信度、证据链、商业验证、阶段路线和停损信号。 |
| AI / 软件工程师 | 给建筑 AI 项目接入统一 AI 编码规则、Skills、Workflows 和行业 profile。 |
| 团队负责人 | 统一多工具、多模型、多 Agent 的工作边界和交付检查方式。 |

## 解决什么问题

- 不同 AI 工具各读各的规则，导致输出风格和边界不一致。
- 项目里缺少明确的 `.ai/` 上下文目录，AI 不知道行业知识、验收标准和人工复核点。
- 建筑行业项目涉及规范、BIM、图纸、模型、施工现场、知识库和 AI 检测，容易把模型推断误当成工程结论；AIOS 通过 profile 叠加这些行业规则，而不是把它们写成所有项目的默认事实。
- AI 生成代码、文档或规则后，缺少统一的 review、验证和发布检查路径。

## 三步开始

```bash
npx @archsight/aios install --target all --scope user
npx @archsight/aios doctor

cd /path/to/your-project
npx @archsight/aios init
```

执行后，当前业务项目会获得统一的 AI 入口文件和 `.ai/` 项目治理目录。已有 `AGENTS.md`、`CLAUDE.md`、`GEMINI.md` 或 `AI_CODING_RULES.md` 的项目不会被覆盖；CLI 会补充缺失文件，并在合适的位置追加 ArchSight AIOS 引用。

如果你不写代码，只参与业务判断，可以先看 [业务专家指南](docs/business-expert-guide.md)。如果你需要一步一步安装和验证，可以看 [快速上手](docs/quickstart.md)。

## 行业能力 Profile

可以按建筑 AI 能力方向叠加行业规则：

```bash
npx @archsight/aios init --profile bim-platform
npx @archsight/aios init --profile construction-vision
npx @archsight/aios init --profile rag-knowledge
```

| Profile | 适用项目 |
| --- | --- |
| `bim-platform` | 工程模型轴：BIM / IFC / Revit / CAD / 建模平台 / 模型质检。 |
| `construction-vision` | 现场感知轴：YOLO、图像分割、Segment Anything、深度估计、焊缝 / 裂缝检测、施工巡检。 |
| `rag-knowledge` | 知识规则轴：建筑规范知识库、RAG、GraphRAG、知识图谱、审图规则。 |

## 项目会生成什么

| 文件 / 目录 | 作用 |
| --- | --- |
| `AGENTS.md` | Codex 等 Agent 工具读取的项目入口。 |
| `CLAUDE.md` | Claude Code 读取的项目入口。 |
| `GEMINI.md` | Gemini 读取的项目入口。 |
| `AI_CODING_RULES.md` | 项目通用 AI 编码规则。 |
| `.ai/ARCHSIGHT_AIOS_RULES.md` | ArchSight AIOS 补充规则。 |
| `.ai/project-context.md` | 项目事实、业务背景和边界。 |
| `.ai/agent-routing.md` | 不同任务该交给哪个 Agent / Skill。 |
| `.ai/skills.md` | 当前项目可用的 ArchSight Skills。 |
| `.ai/workflows.md` | 当前项目可用的 Workflow 和验收路径。 |

## Capability 与冲突仲裁

AIOS 的多 Agent 协作不应停留在 Prompt 角色扮演。Agent 提出架构、交付、规范、结构计算或安全判断时，必须尽量回到项目事实、结构化知识和确定性工具证据。

- `governance/arbitration-protocol.md` 定义证据优先级、Claim 契约、阻断规则和人工升级条件。
- `runtime/capability-registry.json` 定义最小 Capability 接口，例如测试 runner、规范查询、梁挠度、梁挠度限值校核、框架位移和桁架杆力求解器接口。
- `runtime/capability-adapters.json` 定义本地 stdio MCP Adapter 映射；AIOS 先按 Agent / Skill 权限校验，再调用 `archsight-solver` MCP Tool，并把结构化结果交给仲裁规则。
- `aios-structural` 提供 Euclid 结构力学评审入口，要求关键数值来自求解器、项目计算书或可复验脚本，而不是 LLM 口算。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `help` | 查看 CLI 帮助、可用命令和示例。 |
| `install` | 安装 ArchSight AIOS 用户级资产到 Codex、Antigravity 2.0、Gemini 和共享目录。 |
| `doctor` | 检查仓库资产、manifest、用户级安装、Skill 和 Workflow 是否一致。 |
| `init` | 给具体业务项目接入 AI 规则、`.ai/` 治理目录和可选行业 profile。 |
| `validate` | 验证项目接入模板能否生成并引用当前登记的 Skills / Workflows。 |
| `capability:call` | 按 Capability Registry 权限边界调用本地 MCP Adapter，并输出 Tool Result 与仲裁 Decision。 |

本地调用 `archsight-solver` 示例：

```powershell
$env:ARCHSIGHT_SOLVER_HOME = "C:\Work\ArchSightLabs\archsight-solver"
npx @archsight/aios capability:call --capability solver.beam_deflection --agent euclid --skill aios-structural --input beam-input.json
```

## 安装位置

`install --target all --scope user` 会写入当前用户目录：

- Codex：`~/.codex/skills/`、`~/.codex/workflows/aios/`
- Gemini：`~/.gemini/GEMINI.md`、`~/.gemini/archsight-aios/`
- Antigravity 2.0：`~/.gemini/config/plugins/archsight-aios/`
- Antigravity 1.x legacy：仅当已存在 `~/.gemini/antigravity/` 时，写入 `~/.gemini/antigravity/skills/`；如果同时检测到 Antigravity 2.0 配置，也会额外写入 2.0 plugin 目录。

`~/.agents/skills/` 和 `~/.agents/workflows/aios/` 是可选的通用 Agent 共享目录，不是所有 AI Agent 都会自动读取。需要这类兼容目录时，单独执行：

```bash
npx @archsight/aios install --target agents --scope user
```

## init 默认行为

`init` 默认使用 `--mode auto`：

- 新项目或没有 AI 工具入口文件时，创建 `AGENTS.md`、`AI_CODING_RULES.md`、`CLAUDE.md`、`GEMINI.md` 和 `.ai/` 模板文件。
- 已存在 `AGENTS.md`、`AI_CODING_RULES.md`、`CLAUDE.md` 或 `GEMINI.md` 时，创建缺失的 `.ai/` 文件，并在 `AGENTS.md`、`CLAUDE.md`、`GEMINI.md` 中追加或刷新 ArchSight AIOS 托管引用块。
- 重复执行不会重复追加托管块，也不会覆盖已有项目规则。
- 自动模式不修改已有 `AI_CODING_RULES.md` 正文。

## 行业边界

建筑行业能力通过 `--profile` 或明确任务触发。未启用相关 profile 的项目，不应默认加载 BIM、IFC、GraphRAG、审图或建筑规范假设。

前端应用、后端服务、CLI 工具、数据管道等工程形态优先由 Workflow / Skill / Agent 路由处理，不默认扩展为 profile。只有当某类项目存在稳定的行业语义、证据链、评估集或人工复核差异时，才应考虑新增 profile。

如需强制指定模式：

```bash
npx @archsight/aios init --mode full
npx @archsight/aios init --mode linked
npx @archsight/aios init --mode ai-only
```

## 本地开发验证

如果是从源码仓库运行，而不是通过 npm 包运行：

```bash
npm run install:user
npm run doctor
npm run smoke:project
npm test
```

## 核心材料

- [快速上手](docs/quickstart.md)
- [业务专家指南](docs/business-expert-guide.md)
- [术语表](docs/glossary.md)
- [AI 编码规范](AI_CODING_RULES.md)
- [Agents](agents/README.md)
- [Skills](skills/README.md)
- [Workflows](workflows/README.md)
- [Templates](templates/README.md)
- [Runtime 路由](runtime/agent-routing.md)

## 开源协作

- 许可证：[Apache-2.0](LICENSE)
- 贡献说明：[CONTRIBUTING.md](CONTRIBUTING.md)
- 安全问题：[SECURITY.md](SECURITY.md)
- 行为准则：[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- 变更记录：[CHANGELOG.md](CHANGELOG.md)

### 商业边界

- Apache-2.0 允许商业使用、修改、分发和私有部署；分发时需保留版权声明、许可证文本和必要 NOTICE，并遵守 Apache-2.0 的专利与免责声明条款。
- 许可证只覆盖本仓库开源内容，不授权 ArchSightLabs / ArchSight 商标、品牌资产、托管服务、专有数据集、客户案例、商业支持、SLA 或任何第三方受限素材。
- 基于 AIOS 提供商业产品、咨询或二次分发时，不得暗示官方认证、代理、合作或背书；工程结论、合规责任和客户交付责任由使用方自行承担。
