# ArchSight AIOS

ArchSight AIOS 是一套面向建筑 AI 研发的规则、Agent、Skill、Workflow 和项目接入工具包。它重点服务 BIM / IFC / Revit / CAD、施工视觉 AI、建筑规范知识库、GraphRAG、智能审图和 AI Coding 治理，让 Codex、Claude Code、Antigravity 2.0 等 AI Coding 工具在同一个项目里读取同一套规则、项目上下文和验收要求。

AIOS 不是全行业项目模板集合。它保留通用的 AI 编码规则、Agent 路由、Workflow、项目 `.ai/` 上下文和交付验证能力，但真正的差异化能力集中在建筑行业语义、工程证据链、规范知识工程和可复核的 AI 研发流程。

## 适合谁

| 角色 | 可以用它做什么 |
| --- | --- |
| 业务专家 | 沉淀规范条文、审查口径、工程术语、样例和人工复核点。 |
| 产品 / 项目负责人 | 把业务目标、验收标准和 AI 协作流程写进项目规则。 |
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

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `help` | 查看 CLI 帮助、可用命令和示例。 |
| `install` | 安装 ArchSight AIOS 用户级资产到 Codex、Antigravity 2.0、Gemini 和共享目录。 |
| `doctor` | 检查仓库资产、manifest、用户级安装、Skill 和 Workflow 是否一致。 |
| `init` | 给具体业务项目接入 AI 规则、`.ai/` 治理目录和可选行业 profile。 |
| `validate` | 验证项目接入模板能否生成并引用当前登记的 Skills / Workflows。 |

## 安装位置

`install --target all --scope user` 会写入当前用户目录：

- Codex：`~/.codex/skills/`、`~/.codex/workflows/aios/`
- Gemini：`~/.gemini/GEMINI.md`
- Antigravity 2.0：`~/.gemini/config/plugins/archsight-aios/`
- Antigravity 1.x legacy：仅当已存在 `~/.gemini/antigravity/` 时，写入 `~/.gemini/antigravity/skills/`
- 共享资产：`~/.archsight-aios/`

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

- 许可证：[MIT](LICENSE)
- 贡献说明：[CONTRIBUTING.md](CONTRIBUTING.md)
- 安全问题：[SECURITY.md](SECURITY.md)
- 行为准则：[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- 变更记录：[CHANGELOG.md](CHANGELOG.md)
