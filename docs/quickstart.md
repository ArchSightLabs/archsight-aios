# 快速上手

本文给第一次使用 ArchSight AIOS 的用户。默认你已经安装 Node.js 18 或更高版本。

## 1. 安装到当前用户

```bash
npx @archsight/aios install --target all --scope user
```

这一步会把 ArchSight AIOS 的 Skills、Workflows、Runtime 和模板同步到当前用户目录，让 Codex、Claude Code、OpenCode、Gemini、Antigravity、WorkBuddy 等工具可以读取。

如果只是想先在 WorkBuddy 中试用标书 / 方案写作能力，可以先走最短路径：

```bash
npx @archsight/aios install --target workbuddy --scope user
```

面向建筑行业业务人员的自助试用说明见 [建筑行业技能包自助试用指南](industry-user-trial-guide.md)。
写作型工作流见 [v1.4.0 写作工作流快速使用](v1.4.0-writing-workflow-quickstart.md)。
工程知识治理见 [v1.5.0 Knowledge Pack 与本地 Reference Runtime](v1.5.0-knowledge-pack-runtime.md)。

## 2. 检查安装

```bash
npx @archsight/aios doctor
```

看到 `Doctor passed.` 表示安装路径、manifest、skills、workflows 和用户级规则入口都能被找到。

## 3. 进入你的业务项目

Windows PowerShell 示例：

```powershell
$projectPath = "<你的业务项目绝对路径>"
cd $projectPath
npx @archsight/aios init
```

macOS / Linux 示例：

```bash
cd /work/your-project
npx @archsight/aios init
```

`init` 不指定 `--cwd` 时默认使用当前目录。已有 `AGENTS.md`、`CLAUDE.md`、`GEMINI.md`、`OPENCODE.md` 或 `AI_CODING_RULES.md` 的项目不会被覆盖。

## 4. 查看自动识别结果

`init` 默认会自动生成 `.ai/profile-detection.md` 和预填 `.ai/project-context.md`。你可以直接打开这两个文件检查 AIOS 是否识别到了合适的 profile、Skill 候选、技术栈和常用命令。

通常不需要手动选择 profile。如果自动识别不符合项目实际，可以用下面的命令覆盖：

```bash
npx @archsight/aios init --profile auto
npx @archsight/aios init --profile none
npx @archsight/aios init --profile all
npx @archsight/aios init --profile bim-platform
npx @archsight/aios init --profile construction-vision
npx @archsight/aios init --profile rag-knowledge
```

## 5. 检查项目生成结果

业务项目中通常会出现：

```text
AGENTS.md
CLAUDE.md
GEMINI.md
OPENCODE.md
AI_CODING_RULES.md
.ai/
```

`.ai/` 是项目 AI 规则目录。不同 AI 工具会通过根目录入口文件读取这些规则。

## 6. 本地源码开发验证

如果你是从本仓库源码运行：

```bash
npm run install:user
npm run doctor
npm run smoke:project
npm test
```

## 常见问题

### 我不是开发人员，需要运行这些命令吗？

通常不需要。业务专家可以先阅读 `docs/business-expert-guide.md`，把规范、样例、判断口径和人工复核点准备好，由工程团队执行初始化命令。

### `init` 会覆盖我项目里的规则吗？

不会。默认模式只创建缺失文件，并在合适的入口文件中追加或刷新 ArchSight AIOS 托管块。

### 我应该用哪个 profile？

默认不用选。先运行：

```bash
npx @archsight/aios init
```

然后看 `.ai/profile-detection.md` 的识别结果。只有自动识别明显不符合项目实际时，再显式覆盖：

- BIM / Revit / CAD / IFC 平台：`bim-platform`
- 施工视觉 AI、检测、分割、深度估计：`construction-vision`
- 规范知识库、RAG、GraphRAG：`rag-knowledge`
