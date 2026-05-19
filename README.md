# ArchSight AIOS

ArchSight AIOS（AI Operating System）是 ArchSightLabs 的 AI 研发组织操作系统仓库。首次出现时展开为 AI Operating System；后续统一使用 `AIOS`，不再写作 `AIOS`。

本仓库不是 prompt、agent 配置和技能包的简单集合，而是用于治理多模型协同、多 Agent 协同、行业知识工程、AI Coding Workflow、GraphRAG、受控执行环境和企业级 AI 研发平台的长期基础设施。

## 命名与入口

本仓库统一命名为 `archsight-aios`，新的仓库地址为 [ArchSightLabs/archsight-aios](https://github.com/ArchSightLabs/archsight-aios)。

ArchSight 产品与基础设施命名分层如下：

| 名称 | 定位 |
| --- | --- |
| `archsight-cognition` | 认知资产层 |
| `archsight-aios` | AI 研发组织操作系统 / 治理与运行层 |

对外入口保持同一组产品词：

- 域名：`aios.archsight.cn`
- npm 包名：`@archsight/aios`
- CLI 入口：`npx @archsight/aios ...`
- 用户级共享资产目录：`~/.archsight-aios/`

本仓库尚未对外推广历史 CLI，因此不保留旧命名兼容层；新增文档、发布说明和安装指引统一使用 `AIOS` / `archsight-aios` / `@archsight/aios`。

## 核心文档

- [AI 编码规范（公共）](AI_CODING_RULES.md)
- [AI Engineering Squad 计划](docs/ai-engineering-squad-plan.md)
- [AI Team OS 仓库架构](docs/ai-team-os-repository-architecture.md)

## AI 工具入口

`AI_CODING_RULES.md` 是唯一公共规范正文。各工具入口文件只做适配，不复制规范内容：

- [AGENTS.md](AGENTS.md)：Codex 入口
- [CLAUDE.md](CLAUDE.md)：Claude 入口
- [GEMINI.md](GEMINI.md)：Gemini 入口
- [OPENCODE.md](OPENCODE.md)：opencode 入口

[governance/coding-rules.md](governance/coding-rules.md) 是治理目录中的登记入口，指向同一份公共规范。

## 初始定位

本项目不是构建“聊天机器人集合”，而是沉淀一个面向建筑行业数字化与 AI 工程研发的团队治理中心。

核心方向包括：

- 建筑行业平台研发
- BIM / IFC 标准体系
- ArchSight 行业知识平台
- GraphRAG / 行业知识图谱
- AI Coding 工作流
- 多模型协同研发
- Agent 工程体系
- 规范审查与智能审图
- 结构力学求解器
- 企业级 AI 研发平台

## 管理范围

| 维度 | 内容 |
| --- | --- |
| Agent 定义 | 角色、职责、边界、输入输出 |
| Workflow | 多 Agent 协作流程与验收路径 |
| Skills | 可复用能力插件与工具约束 |
| Prompt 体系 | 系统 Prompt、版本、评估与失效案例 |
| Knowledge | 建筑行业知识体系 |
| Runtime | Hermes / OpenClaw / Gateway 运行治理 |
| Governance | 工程治理、安全、上下文、记忆和交付策略 |
| Memory | 长期记忆体系 |
| Experiments | 实验、验证与对比记录 |
| Standards | BIM / IFC / 行业规范体系 |
| Delivery | AI 生成、评审、测试、发布和回滚 |

## 目录规划

```text
archsight-aios/
│
├── README.md
├── AI_CODING_RULES.md
├── vision/
├── agents/
├── workflows/
├── runtime/
├── prompts/
├── skills/
├── memory/
├── governance/
├── standards/
├── knowledge/
├── rag/
├── graph/
├── delivery/
├── experiments/
├── templates/
├── docs/
└── infra/
```

## 当前优先级

1. 将仓库治理对象明确为 `runtime`、`workflow`、`governance`、`delivery`、`memory`。
2. 建立统一 workflow：feature 开发、bug 修复、review、release、frontend 生成。
3. 建立统一 Agent Routing，控制模型成本、上下文和执行边界。

边界说明：`.ai/` 是具体业务项目的项目级 AI 治理目录，不属于本仓库根结构。本仓库只维护 AIOS 的统一规范、流程、路由和治理资产。

## 用户级安装

本仓库提供最小 npm CLI，用于把 ArchSight 专属 Skills、Workflows、Runtime 路由和项目模板安装到用户级 AI 助手环境。

本地仓库内执行：

```bash
npm run install:user
npm run doctor
npm run smoke:project
```

等发布为 npm 包后，可使用：

```bash
npx @archsight/aios install --target all --scope user
npx @archsight/aios doctor
npx @archsight/aios validate
```

当前有价值的 CLI 命令：

| 命令 | 用途 |
| --- | --- |
| `help` | 查看 CLI 帮助、可用命令和示例。 |
| `install` | 安装 ArchSight AIOS 用户级资产到 Codex、Gemini、Antigravity 和共享目录。 |
| `doctor` | 检查仓库资产、manifest、用户级安装、Skill 和 Workflow 是否一致。 |
| `init` | 给具体业务项目接入 AI 规则、`.ai/` 治理目录和可选行业 profile。 |
| `validate` | 验证项目接入模板能否生成并引用当前登记的 Skills / Workflows。 |
| `hermes:validate` | 校验 Hermes agent registry 与本仓库 runtime prompt 是否一致。 |
| `hermes:sync-dry-run` | 输出 Hermes 同步计划，不调用外部 API。 |
| `hermes:detect-drift` | 检查本地 runtime prompt 与 agent 源定义是否存在漂移。 |

当前安装目标：

- Codex：复制 `archsight-*` skills 到 `~/.codex/skills/`。
- 通用 Agent：复制 `archsight-*` skills 到 `~/.agents/skills/`。
- Gemini：写入 `~/.gemini/GEMINI.md` 的 ArchSight AIOS 托管说明块。
- Antigravity：写入 `~/.antigravity/ARCHSIGHT_AIOS.md` 的 ArchSight AIOS 托管说明块。
- 共享资产：同步到 `~/.archsight-aios/`，包含 Agent、Skill、Workflow、Runtime、模板、治理、交付、记忆、知识、RAG、Graph、标准、Infra、Prompt 和 Vision 资产。

业务项目接入可执行：

```bash
npx @archsight/aios init --cwd /path/to/project
```

`--cwd` 不指定时，默认使用当前目录。默认 `--mode auto`，CLI 会按目标项目状态智能判断：

- 新项目或没有 AI 工具入口文件时，创建 `AGENTS.md`、`AI_CODING_RULES.md`、`CLAUDE.md`、`GEMINI.md` 和 `.ai/` 模板文件。
- 已存在 `AGENTS.md`、`AI_CODING_RULES.md`、`CLAUDE.md` 或 `GEMINI.md` 时，自动按 linked 方式处理：创建缺失的 `.ai/` 文件，并在 `AGENTS.md`、`CLAUDE.md`、`GEMINI.md` 中追加或刷新 ArchSight AIOS 托管引用块。
- 已存在 ArchSight AIOS 关键字、托管标记或 `.ai/ARCHSIGHT_AIOS_RULES.md` 时，重复执行会补缺失文件并替换既有托管块，不会重复追加。
- 自动 linked 不修改已有 `AI_CODING_RULES.md` 正文。

如需强制指定模式，可使用：

```bash
npx @archsight/aios init --cwd /path/to/project --mode full
npx @archsight/aios init --cwd /path/to/project --mode linked
npx @archsight/aios init --cwd /path/to/project --mode ai-only
```

`full` 强制补齐根目录入口和 `.ai/` 文件但不覆盖已有文件；`linked` 强制让工具入口能发现 `.ai/`；`ai-only` 只初始化 `.ai/` 治理目录。

可按项目类型叠加行业 profile：

```bash
npx @archsight/aios init --cwd /path/to/project --profile bim-platform
npx @archsight/aios init --cwd /path/to/project --profile construction-vision
npx @archsight/aios init --cwd /path/to/project --profile rag-knowledge
```

当前 profile：

- `bim-platform`：BIM / IFC / Revit / CAD / 建模平台项目。
- `construction-vision`：施工视觉 AI、检测、分割、深度估计项目。
- `rag-knowledge`：规范知识库、RAG、GraphRAG、知识图谱项目。

`doctor` 会校验 `runtime/archsight-aios.manifest.json`、Agent、Skill、Workflow、路由表、用户级安装目录和 Gemini / Antigravity 托管说明块是否一致。`validate --temp` 会在本地临时目录执行一次 `init`，验证业务项目 `.ai/` 接入模板可以生成并引用当前登记的 Skills 和 Workflows。
