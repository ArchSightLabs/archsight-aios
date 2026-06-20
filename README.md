# ArchSight AIOS

ArchSight AIOS 是面向建筑行业的开源 AI 技能包与工程知识治理工具包。它让 WorkBuddy、Codex、Claude Code、OpenCode、Gemini、Antigravity 等 AI 工具可以使用同一组建筑行业 Skills、Workflows、Templates 和 Runtime 规则。

AIOS 不是从研发工具转成业务资料工具，而是在保留建筑 AI / 软件研发治理能力的基础上，扩展到建筑行业知识工作从业者。现在它同时覆盖两套并列能力：

- **建筑工程资料与知识工作技能包**：处理工程资料、技术标、合同履约、施工日报、工程会议、变更签证、专项施工方案、规范摘录和知识包治理。
- **建筑 AI / 软件研发治理技能包**：支持一把手评审、架构评审、产品与界面方案评审、交付规划、代码审查、Runtime 设计、RAG / GraphRAG、MCP / Tool Calling、Capability 证据仲裁和受控执行。

AIOS 的目标不是让 AI 替代专业人员做最终判断，而是帮助使用者把工程资料和行业知识整理成可复核的清单、台账、初稿、证据链、Knowledge Pack 和人工复核事项。它强调资料来源、版本、页码、章节、适用条件、风险提示和人工复核岗位，避免把模型推断误当成工程结论。

v1.5.0 开始，AIOS 的主线从“能写工程文档”推进到“能治理工程知识”：除了标书、方案、日报、会议纪要等写作与复核型 Skill，也提供 Knowledge Pack 工作台和本地 Reference Runtime，把规范摘录、企业标准、项目资料、历史审查口径和人工复核记录治理为可编译、可查询、可评估的工程知识资产。

## 设计目标

AIOS 的设计目标有五个：

1. 让建筑 AI / 软件研发更有边界：把产品定位、架构、界面方案、交付计划、代码审查和 Runtime 设计放进可复核的工作流。
2. 让研发团队有可验证的 Runtime 路径：涉及规范、结构计算、RAG / GraphRAG、Tool Calling 和多 Agent 协作时，优先回到项目事实、结构化知识和确定性工具证据。
3. 让建筑行业资料工作更可复核：把标书、合同、日报、会议、变更签证和施工方案整理成有来源、有缺口、有风险、有复核岗位的工作底稿。
4. 让工程知识可以治理：把规范摘录、企业标准、审查口径和项目经验沉淀为 Knowledge Pack，而不是散落在聊天记录和临时 Prompt 中。
5. 让多种 AI 工具保持一致边界：同一套 Skill、Workflow 和项目规则可安装到 WorkBuddy、Codex、Claude Code、OpenCode、Gemini、Antigravity 等工具。

AIOS 是建筑行业增强层，不是通用任务替代器。普通非建筑任务不应被强行套用 BIM、IFC、规范、审图或工程证据链假设；涉及法务、造价、财务、监理、安全、项目经理、总工、专家或注册人员签审时，AIOS 只做资料整理、风险标注和人工复核分流。

## 适合谁

AIOS 现在面向两类用户。第一类是建筑 AI / 软件研发团队，负责把行业能力做成可信系统；第二类是建筑行业知识工作从业者，负责把真实工程资料和经验转成可复核的工作底稿和知识资产。

### 建筑 AI / 软件研发治理

| 角色 | 可以用它做什么 |
| --- | --- |
| 建筑行业软件 / AI 产品负责人 | 用 `aios-ceo`、`aios-design` 和 `aios-plan` 评估产品定位、行业专业性、工作台体验、交付路线和停损信号。 |
| 架构师 / 后端 / AI 工程师 | 用 `aios-arch`、`aios-runtime`、`aios-structural` 和 `aios-exec` 评估服务边界、数据链路、Runtime、RAG / GraphRAG、结构计算工具链和受控执行。 |
| 代码审查 / 质量负责人 | 用 `aios-review` 审查 diff、PR、AI 生成代码、安全敏感改动、Prompt / Tool / Runtime 变更、测试缺口和发布准备度。 |
| 建筑数字化 / AI 应用团队 | 把行业知识、评估样例、RAG / GraphRAG、Tool Calling 和多 Agent 流程纳入可验证的工程链路。 |
| 企业负责人 / 研发负责人 | 统一多工具、多模型、多 Agent 的研发边界和交付检查方式，评估 AIOS 在团队中的使用范围、投入顺序和风险边界。 |

### 建筑工程资料与知识工作

| 角色 | 可以用它做什么 |
| --- | --- |
| 投标 / 技术标人员 | 复核招标文件、评分办法、资格条件和技术标要求，生成响应矩阵、资料缺口、废标风险和技术标章节初稿。 |
| 方案编制人员 / 技术负责人 | 复核专项施工方案、危险源、交底要点、专家意见和计算书缺口，生成方案章节或交底材料草稿。 |
| 项目资料员 / 项目管理人员 | 整理施工日报、工程会议纪要、待办闭环、现场问题和可追踪台账。 |
| 合同履约 / 商务人员 | 整理合同条款、履约节点、付款条件、变更签证资料链和责任边界线索。 |
| 业务专家 / 企业标准维护者 | 沉淀规范摘录、企业标准、审查口径、工程术语、样例和人工复核点，形成 Knowledge Pack。 |

## 解决什么问题

- AI 输出只有泛泛总结，缺少资料来源、页码、章节、条款位置和人工复核岗位。
- 标书、方案、合同、日报、会议纪要和变更签证资料散落，难以形成可继续工作的矩阵、清单、台账和初稿。
- 规范摘录、企业标准、历史审查口径和项目经验沉淀在个人经验或临时文档里，难以查询、评估和复用。
- 不同 AI 工具各读各的规则，导致输出格式、风险边界和交付检查方式不一致。
- 建筑行业任务容易把模型推断误当成工程结论，需要默认保留“需核验 / 转人工复核 / 不得下结论”的边界。
- 建筑 AI / 软件团队在做产品定位、架构设计、BIM / IFC、智能审图、RAG / GraphRAG、结构计算或 Runtime 接入时，缺少统一的评审、证据仲裁和发布验证路径。

## 快速开始

### 只想先试用技能包

如果只是想在 WorkBuddy 中试用标书、合同、日报、会议纪要或施工方案相关技能，优先使用：

```bash
npx @archsight/aios@latest install --target workbuddy --scope user
```

安装后可检查：

```bash
npx @archsight/aios@latest doctor
```

打开 WorkBuddy 后，可以先试下面几类指令：

研发治理类：

```text
$aios-ceo 请从一把手视角评估这个建筑行业 AI 产品的定位、行业专业性、工程可信度、证据链、商业验证、阶段路线和停损信号。
```

```text
$aios-arch 请评审以下建筑 AI 系统方案的服务边界、数据链路、模型 / Runtime 边界、GraphRAG 架构、Agent 工作流治理和长期复杂度风险。
```

```text
$aios-review 请审查以下 diff 或 PR，重点看 AI 生成代码风险、安全敏感改动、Prompt / Tool / Runtime 变更、测试缺口和发布准备度。
```

工程资料类：

```text
$aios-tender-audit 请复核以下技术标资料，输出评分点响应矩阵、废标风险、资料缺口和人工复核岗位。
```

```text
$aios-scheme-audit 请复核以下专项施工方案，输出危险源、交底要点、计算书缺口、专家意见回查和人工复核岗位。
```

```text
$aios-daily-write 请基于以下现场口述、项目群记录或照片说明，生成施工日报 Markdown 草稿，并保留资料来源、待补资料和审核门禁。
```

面向建筑行业业务人员的完整自助说明见 [建筑行业技能包自助试用指南](docs/industry-user-trial-guide.md)。

### 需要安装到多个 AI 工具

```bash
npx @archsight/aios@latest install --target all --scope user
npx @archsight/aios@latest doctor
```

这会把 AIOS 的 Skills、Workflows、Runtime 和模板安装到当前用户目录，让 Codex、Claude Code、OpenCode、Gemini、Antigravity、WorkBuddy 等工具可以读取。

### 需要给项目接入 AIOS 治理

```bash
cd /path/to/your-project
npx @archsight/aios@latest init
```

执行后，当前业务项目会获得统一的 AI 入口文件和 `.ai/` 项目治理目录。已有 `AGENTS.md`、`CLAUDE.md`、`GEMINI.md`、`OPENCODE.md` 或 `AI_CODING_RULES.md` 的项目不会被覆盖；CLI 会补充缺失文件，并在合适的位置追加 ArchSight AIOS 引用。

`init` 默认会读取项目名、README、package / pyproject 和浅层文件名，自动生成 `.ai/profile-detection.md`，并在首次创建 `.ai/project-context.md` 时预填项目名、技术栈、常用命令、代码结构和候选 AIOS 能力。用户不需要先理解 profile，也不需要手动合并 AI 规则文件。

如果你需要一步一步安装和验证，可以看 [快速上手](docs/quickstart.md)。

## 核心能力

| 能力 | 说明 |
| --- | --- |
| 工程资料技能包 | 覆盖招投标、合同履约、施工日报、工程会议、变更签证和专项施工方案，输出清单、矩阵、台账、初稿和人工复核事项。 |
| 工程文档写作工作台 | 用 Markdown 工作母版组织标书、技术标和施工方案的资料来源、历史素材、写作 brief、草稿、复核记录和人工定稿。 |
| Knowledge Pack | 把规范摘录、企业标准、项目资料、审查口径和复核记录治理为可编译、可查询、可评估的工程知识资产。 |
| 本地 Reference Runtime | 通过 `knowledge.norm_lookup` 查询编译后的 Knowledge Pack，返回引用、版本、适用性、冲突和仲裁状态。 |
| 建筑 AI / 软件研发治理 | 覆盖 `aios-ceo`、`aios-arch`、`aios-design`、`aios-plan`、`aios-review`、`aios-runtime`、`aios-exec` 等研发评审和执行入口。 |
| 多工具安装与公共发现 | 支持 WorkBuddy、Codex、Claude Code、OpenCode、Gemini、Antigravity、`npx skills` 等工具发现和安装。 |
| Capability 证据仲裁 | 对规范、结构计算、工具调用和多 Agent 冲突保留 `Claim / Evidence / Tool Result / Decision`，避免无证据结论。 |

## 常用技能入口

### 工程资料与知识工作

| 场景 | 推荐入口 |
| --- | --- |
| 招投标未区分写作或审核 | `aios-tender` |
| 技术标 / 招标文件复核 | `aios-tender-audit`，已培训旧命令的团队可继续使用 `aios-commercial-tender` |
| 技术标章节生成或改写 | `aios-tender-write` |
| 合同履约复核 | `aios-contract-audit`，已培训旧命令的团队可继续使用 `aios-commercial-contract` |
| 合同条款、补充协议或履约函件草拟 | `aios-contract-draft` |
| 施工日报未区分生成或复核 | `aios-daily` |
| 施工日报生成 | `aios-daily-write` |
| 施工日报复核和问题台账 | `aios-construction-daily` |
| 工程会议未区分生成或复核 | `aios-meeting` |
| 工程会议纪要生成 | `aios-meeting-write` |
| 工程会议纪要复核和待办闭环 | `aios-construction-meeting` |
| 专项施工方案未区分写作或审核 | `aios-scheme` |
| 专项施工方案复核 | `aios-scheme-audit`，已培训旧命令的团队可继续使用 `aios-construction-scheme` |
| 专项施工方案生成或改写 | `aios-scheme-write` |
| 规范、企业标准和知识包治理 | `aios-knowledge` |

`aios-commercial-*` 和 `aios-construction-*` 系列继续保留原有领域型入口含义，适合已经在团队培训和内部流程中使用这些命令的场景；`aios-tender*`、`aios-contract-*`、`aios-daily*`、`aios-meeting*` 和 `aios-scheme*` 是更短的任务型入口，适合新用户自助试用。

### 建筑 AI / 软件研发治理

| 场景 | 推荐入口 |
| --- | --- |
| 企业负责人 / 一把手深度评审 | `aios-ceo` |
| 架构、服务边界、数据 / 模型 / Runtime 边界和长期复杂度 | `aios-arch` |
| 建筑行业平台界面、审图工作台、BIM Viewer、规范检索和报告复核体验 | `aios-design` |
| 功能、bug、架构决策、PR / 发布顺序和 CI/CD 交付拆解 | `aios-plan` |
| diff、PR、AI 生成代码、安全敏感改动、依赖更新和发布准备度 | `aios-review` |
| Prompt、Context、Memory、MCP 权限、RAG / GraphRAG、Embedding 和多 Agent 编排 | `aios-runtime` |
| BIM、IFC、建筑规范、审图规则、领域实体和知识图谱 schema | `aios-knowledge` |
| 结构力学、荷载、边界条件、FEM 输入输出和确定性求解链路 | `aios-structural` |
| 明确范围内的代码、文档、脚本、测试和验证执行 | `aios-exec` |
| 两份文档、两个版本或两个 AI 输出的专业度对比 | `aios-compare` |
| 内部 Prompt / Skill 回归、weak/basic/runtime 三栏评测 | `aios-prompt-compare` |

## 自动行业识别

AIOS 默认内置所有行业 profile 模板。`init` 默认使用 `--profile auto`，根据当前项目和资料线索自动识别是否启用 profile：

```bash
npx @archsight/aios init
```

如果需要人工覆盖，也可以显式指定：

```bash
npx @archsight/aios init --profile auto
npx @archsight/aios init --profile none
npx @archsight/aios init --profile all
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
| `OPENCODE.md` | OpenCode 读取的项目入口。 |
| `AI_CODING_RULES.md` | 项目通用 AI 编码规则。 |
| `.ai/ARCHSIGHT_AIOS_RULES.md` | ArchSight AIOS 补充规则。 |
| `.ai/project-context.md` | 项目事实、业务背景和边界。 |
| `.ai/profile-detection.md` | 自动识别的 profile / Skill 候选、命中证据和人工复核边界。 |
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
| `install` | 安装 ArchSight AIOS 用户级资产到 Codex、Claude Code、OpenCode、Antigravity 2.0、Gemini、WorkBuddy 和共享目录。 |
| `doctor` | 检查仓库资产、manifest、用户级安装、Skill 和 Workflow 是否一致。 |
| `init` | 给具体业务项目接入 AI 规则、`.ai/` 治理目录、自动 profile 识别和项目上下文草稿。 |
| `writing:init` | 在业务项目中创建标书 / 方案写作 Markdown 工作台，用于写作型 Skill 生成和审核门禁交接。 |
| `writing:validate` | 检查写作工作台的文件链、来源、复用、待补、审核门禁和人工定稿边界。 |
| `knowledge:init` | 创建工程知识治理工作台，用于沉淀 Knowledge Pack。 |
| `knowledge:validate` | 检查知识包文件链、来源、标准、条文、图谱、查询规则和评估问题。 |
| `knowledge:compile` | 将工作台编译为 `archsight-aios.knowledge-pack` Runtime 资产。 |
| `knowledge:lookup` | 使用本地 Reference Runtime 查询编译后的 Knowledge Pack。 |
| `knowledge:eval` | 执行知识包评估问题，检查引用、版本、拒答、冲突和适用性。 |
| `validate` | 验证项目接入模板能否生成并引用当前登记的 Skills / Workflows。 |
| `validate:skills` | 校验公共 skill 发现入口、frontmatter、跨 host manifest 和 npm metadata 是否一致。 |
| `capability:call` | 按 Capability Registry 权限边界调用本地 MCP Adapter，并输出 Tool Result 与仲裁 Decision。 |

本地调用 `archsight-solver` 示例：

```powershell
$env:ARCHSIGHT_SOLVER_HOME = "<archsight-solver 本地仓库绝对路径>"
npx @archsight/aios capability:call --capability solver.beam_deflection --agent euclid --skill aios-structural --input beam-input.json
npx @archsight/aios capability:call --capability solver.beam_deflection_serviceability_check --agent euclid --skill aios-structural --input beam-serviceability-input.json
```

如果 `archsight-aios` 和 `archsight-solver` 是同级目录，CLI 会默认尝试使用相邻的 `../archsight-solver`，通常无需设置 `ARCHSIGHT_SOLVER_HOME`。

## 工程文档写作工作台

v1.4.0 开始，AIOS 提供写作型 Skill 和 Markdown 工作母版，用于标书、技术标、专项施工方案和交底材料的生成 / 改写。Markdown 是 AIOS 工作母版，Word / PDF / PPT 只作为后续交付格式。

在项目目录创建工作台：

```bash
npx @archsight/aios writing:init --type tender
npx @archsight/aios writing:init --type scheme --name scheme-workbench
npx @archsight/aios writing:init --type tender --sample --name tender-sample
```

生成目录默认包含：

- `source-normalized.md`：归一化输入资料和来源链。
- `material-index.md`：历史素材、复用级别和不可套用原因。
- `writing-brief.md`：写作任务、目标章节、禁止结论和人工复核岗位。
- `draft.md`：AI 生成或改写的章节草稿。
- `review-notes.md`：交给审核 Skill 后的复核记录。
- `final.md`：人工确认后的最终 Markdown 母版。

检查工作台完整性：

```bash
npx @archsight/aios writing:validate --name document-writing
```

推荐路由：

- 招投标通用入口：新用户优先使用 `aios-tender`；只做复核时使用 `aios-tender-audit`，写作时使用 `aios-tender-write`。
- 合同通用入口：只做合同履约复核时使用 `aios-contract-audit`；草拟补充协议、条款改写、履约通知或函件时使用 `aios-contract-draft`。
- 施工日报通用入口：新用户优先使用 `aios-daily`；从口述、项目群记录或照片说明生成日报时使用 `aios-daily-write`，复核已有日报和问题台账时使用 `aios-construction-daily`。
- 工程会议通用入口：新用户优先使用 `aios-meeting`；从录音转写、会议笔记或群聊摘要生成纪要时使用 `aios-meeting-write`，复核已有纪要和待办闭环时使用 `aios-construction-meeting`。
- 专项施工方案通用入口：新用户优先使用 `aios-scheme`；只做复核时使用 `aios-scheme-audit`，写作时使用 `aios-scheme-write`。
- 标书 / 技术标写作：先用 `aios-tender-write`，再交给 `aios-tender-audit` 审核门禁；已使用 `aios-commercial-tender` 的团队可继续使用原领域型入口。
- 合同草拟：先用 `aios-contract-draft`，再交给 `aios-contract-audit` 审核门禁；已使用 `aios-commercial-contract` 的团队可继续使用原领域型入口。
- 日报 / 会议纪要写作：先用 `aios-daily-write` 或 `aios-meeting-write`，再分别交给 `aios-construction-daily` 或 `aios-construction-meeting` 做证据链和闭环复核。
- 专项施工方案写作：先用 `aios-scheme-write`，再交给 `aios-scheme-audit` 审核门禁；已使用 `aios-construction-scheme` 的团队可继续使用原领域型入口。

`writing:init` 只创建缺失文件，重复执行不会覆盖已有工作台内容。

## Knowledge Pack 与本地 Reference Runtime

v1.5.0 开始，AIOS 提供工程知识治理能力：把规范摘录、企业标准、项目资料、历史审查口径和人工复核记录治理为可编译、可查询、可评估的 `Knowledge Pack`。

创建合成样板：

```bash
npx @archsight/aios knowledge:init --sample --name scheme-review
npx @archsight/aios knowledge:validate --name scheme-review
npx @archsight/aios knowledge:compile --name scheme-review
```

查询编译产物：

```bash
npx @archsight/aios knowledge:lookup --pack scheme-review/compiled/knowledge-pack.json --query "高支模方案是否应检查计算书"
npx @archsight/aios knowledge:eval --name scheme-review
```

`knowledge.norm_lookup` 现在有本地 stdio MCP Reference Runtime，可通过 `capability:call` 走同一套权限、证据和仲裁规则：

```bash
npx @archsight/aios capability:call --capability knowledge.norm_lookup --agent vitruvius --skill aios-knowledge --input lookup-input.json
```

`lookup-input.json` 至少包含：

```json
{
  "knowledgePackPath": "scheme-review/compiled/knowledge-pack.json",
  "query": "高支模方案是否应检查计算书"
}
```

Knowledge Pack 不是生产级规范数据库，也不替代法务、总工、专家、审图或注册人员签审。缺来源、缺版本、缺项目条件或存在冲突时，Reference Runtime 必须返回 `need_context`、`not_found`、`conflict` 或 `inapplicable`。

## 安装位置

`install --target all --scope user` 会写入当前用户目录：

- Codex：`~/.codex/skills/`、`~/.codex/workflows/aios/`
- Claude Code：`~/.claude/skills/`
- OpenCode：`~/.opencode/skills/`
- Gemini：`~/.gemini/GEMINI.md`、`~/.gemini/archsight-aios/`
- Antigravity 2.0：`~/.gemini/config/plugins/archsight-aios/`
- Antigravity 1.x legacy：仅当已存在 `~/.gemini/antigravity/` 时，写入 `~/.gemini/antigravity/skills/`；如果同时检测到 Antigravity 2.0 配置，也会额外写入 2.0 plugin 目录。
- WorkBuddy：`~/.workbuddy/skills/`

`~/.agents/skills/` 和 `~/.agents/workflows/aios/` 是可选的通用 Agent 共享目录，不是所有 AI Agent 都会自动读取。需要这类兼容目录时，单独执行：

```bash
npx @archsight/aios install --target agents --scope user
```

WorkBuddy 固定读取个人 skills 目录，可单独安装：

```bash
npx @archsight/aios install --target workbuddy --scope user
```

Claude Code 和 OpenCode 也可以按需单独写入个人 skills 目录：

```bash
npx @archsight/aios install --target claude-code --scope user
npx @archsight/aios install --target opencode --scope user
```

## 公共发现

AIOS 保留标准 `skills/` 目录作为公共发现入口，供 `skills.sh`、`npx skills`、Antigravity / agy、Gemini CLI extension、Claude Code plugin marketplace、OpenCode、WorkBuddy 和第三方索引器扫描。

```powershell
npx skills add ArchSightLabs/archsight-aios --list
npx skills add ArchSightLabs/archsight-aios --skill aios-arch --global
```

跨 host 发现元数据包括根目录 `gemini-extension.json`、`.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json` 和 `package.json` 的 `agent-skills` / `skills-sh` / `gemini-cli` 等关键词。公共发现、GitHub topics、索引请求和发布前检查见 [公共发现与上架清单](docs/PUBLIC_DISCOVERY.md)。

## init 默认行为

`init` 默认使用 `--mode auto`：

- 新项目或没有 AI 工具入口文件时，创建 `AGENTS.md`、`AI_CODING_RULES.md`、`CLAUDE.md`、`GEMINI.md`、`OPENCODE.md` 和 `.ai/` 模板文件。
- 已存在 `AGENTS.md`、`AI_CODING_RULES.md`、`CLAUDE.md`、`GEMINI.md` 或 `OPENCODE.md` 时，创建缺失的 `.ai/` 文件，并在 `AGENTS.md`、`CLAUDE.md`、`GEMINI.md`、`OPENCODE.md` 中追加或刷新 ArchSight AIOS 托管引用块。
- 默认使用 `--profile auto`：根据项目名、README、package / pyproject、浅层目录和资料文件名生成 `.ai/profile-detection.md`，并自动复制高置信度命中的 profile。
- 首次创建 `.ai/project-context.md` 时，会自动预填项目名、技术栈、常用命令、代码结构和候选 Skills；重复执行不会覆盖人工修订后的项目上下文。
- 重复执行不会重复追加托管块，也不会覆盖已有项目规则。
- 自动模式不修改已有 `AI_CODING_RULES.md` 正文。

## 行业边界

建筑行业能力通过 `.ai/profile-detection.md`、显式 `--profile` 或明确任务触发。未启用相关 profile 的项目，不应默认加载 BIM、IFC、GraphRAG、审图或建筑规范假设。

如需覆盖自动识别：

```bash
npx @archsight/aios init --profile none
npx @archsight/aios init --profile all
npx @archsight/aios init --profile bim-platform
```

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
npm run validate:skills
npx skills add . --list
npm test
```

## 核心材料

- [快速上手](docs/quickstart.md)
- [建筑行业技能包自助试用指南](docs/industry-user-trial-guide.md)
- [业务专家指南](docs/business-expert-guide.md)
- [术语表](docs/glossary.md)
- [AI 编码规范](AI_CODING_RULES.md)
- [Agents](agents/README.md)
- [Skills](skills/README.md)
- [Workflows](workflows/README.md)
- [Templates](templates/README.md)
- [Runtime 路由](runtime/agent-routing.md)
- [WorkBuddy 适配说明](adapters/workbuddy/README.md)
- [v1.4.0 写作工作流快速使用](docs/v1.4.0-writing-workflow-quickstart.md)
- [v1.4.0 写作能力边界](docs/v1.4.0-writing-boundary.md)
- [公共发现与上架清单](docs/PUBLIC_DISCOVERY.md)

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
