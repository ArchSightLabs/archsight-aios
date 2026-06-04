# 公共发现与上架清单

本文件记录 ArchSight AIOS 要被公共 skill 生态发现时，项目内需要提供的稳定入口。

结论：公共发现不是单一市场自动收录。AIOS 需要同时满足三类机制：

1. 本地自动发现：宿主扫描 `SKILL.md`、`skills/`、`.agents/skills/`、`.claude/skills/` 或 extension/plugin 目录。
2. 可分发安装：通过 GitHub、npm/npx、Antigravity/agy、Gemini extension 兼容入口、Claude marketplace、WorkBuddy、`skills.sh` / `npx skills` 安装。
3. 公共检索：依赖 GitHub topics、manifest、标准目录、README 关键词、release、安装量、star 和主动提交。

## 项目内入口

| 入口 | 文件 | 目的 |
| --- | --- | --- |
| 标准 skills 目录 | `skills/` | 让 `skills.sh`、`npx skills`、Antigravity/agy、Gemini extension 和其他标准 skill 索引器直接看到 `aios-*` Skill。 |
| Gemini extension manifest | `gemini-extension.json` | 保留 Gemini CLI extension 兼容入口和 Gallery / 第三方索引 manifest。 |
| Claude marketplace manifest | `.claude-plugin/marketplace.json` | 允许 Claude Code 用户通过 marketplace 方式发现本项目。 |
| Claude plugin manifest | `.claude-plugin/plugin.json` | 描述插件元数据，并把插件 skills 指向 `./skills/`。 |
| WorkBuddy adapter | `adapters/workbuddy/README.md` | 说明如何把 `aios-*` Skill 安装到 `~/.workbuddy/skills/`。 |
| npm metadata | `package.json` | 提供英文检索关键词、分发文件清单和 `validate:skills` 校验入口。 |
| 发现校验脚本 | `scripts/validate-skills.mjs` | 校验 manifest、skill frontmatter、跨 host manifest 和 npm metadata 是否一致。 |

## GitHub About 建议

这些内容需要在 GitHub 仓库页面右侧 About 区手动设置，不能只靠代码文件完成。

策略：默认展示中文，紧跟一段英文检索短语。中文用户能直接看懂项目定位，英文用户和索引器也能通过 `building-industry AI agent skills`、`project evidence work`、`BIM`、`IFC`、`GraphRAG`、`code review` 等词命中。

Description：

```text
面向建筑行业知识工作从业者与 AI 研发团队的 Skills、Workflow 与多 Agent 工具包 / Building-industry AI agent skills for BIM, IFC, RAG, GraphRAG, project evidence work, code review, and runtime governance.
```

Website：

```text
https://github.com/ArchSightLabs/archsight-aios
```

Topics：

```text
agent-skills
building-ai
construction-ai
aec
bim
ifc
building-code
graphrag
mcp
codex
claude-code
gemini-cli-extension
antigravity
architecture-review
code-review
design-review
runtime-design
structural-engineering
tender-review
construction-management
```

Pinned README 搜索摘要可使用：

```text
默认中文输出，保留英文检索能力：building-industry AI, project evidence work, BIM, IFC, building code, RAG, GraphRAG, MCP, architecture review, code review, runtime governance, structural review, construction management.
```

## 公共安装命令

`skills.sh` / Vercel skills CLI：

```powershell
npx skills add ArchSightLabs/archsight-aios --list
npx skills add ArchSightLabs/archsight-aios --skill aios-arch --global
```

Codex：

```powershell
npx @archsight/aios install --target codex --scope user
```

Antigravity / agy：

```powershell
npx @archsight/aios install --target antigravity --scope user
```

Gemini CLI extension 兼容入口：

```powershell
gemini extensions install https://github.com/ArchSightLabs/archsight-aios
```

Gemini 用户级支持资产：

```powershell
npx @archsight/aios install --target gemini --scope user
```

WorkBuddy：

```powershell
npx @archsight/aios install --target workbuddy --scope user
```

Claude Code marketplace：

```text
/plugin marketplace add ArchSightLabs/archsight-aios
/plugin install archsight-aios@archsight
```

## 对外搜索词

README、release、npm、GitHub topics 和 launch post 应优先覆盖这些关键词：

```text
agent skills
AI agent skills
Codex skills
Claude Code skills
Gemini CLI extension
Antigravity CLI
construction AI
building AI
building-industry AI
AEC AI
project evidence work
BIM
IFC
building code
building code review
smart drawing review
architecture review
technical design review
code review
runtime design
runtime governance
MCP
GraphRAG
RAG
structural review
construction daily
tender review
contract evidence chain
```

## find-skills / skills.sh 索引请求模板

如果 `npx skills find` 搜不到本项目，可向对应社区或仓库提交索引请求：

```text
Repository: https://github.com/ArchSightLabs/archsight-aios
Package: @archsight/aios
License: Apache-2.0
Supported agents: Codex, Claude Code, Antigravity/agy, Gemini CLI, WorkBuddy, OpenCode, Hermes
Canonical skill path: skills/
Install command: npx skills add ArchSightLabs/archsight-aios --list
NPM install command: npx @archsight/aios install --target all --scope user
Representative skills: aios-arch, aios-design, aios-plan, aios-exec, aios-review, aios-knowledge, aios-structural, aios-runtime, aios-commercial-tender, aios-construction-daily
Keywords: agent skills, construction AI, BIM, IFC, building code, GraphRAG, architecture review, design review, code review, runtime design, MCP, structural review, tender review, construction management
```

## 发布前检查

每次发版前至少验证：

```powershell
npm run validate:skills
npx skills add . --list
npm test
```

如果本机安装了对应 CLI，再验证：

```powershell
gemini extensions validate .
claude plugin validate .
```

## 参考

- Codex Agent Skills: https://developers.openai.com/codex/skills
- OpenAI skills catalog: https://github.com/openai/skills
- Claude Code plugin marketplace: https://code.claude.com/docs/en/plugin-marketplaces
- Claude Code plugin reference: https://code.claude.com/docs/en/plugins-reference
- Gemini CLI extension releasing: https://github.com/google-gemini/gemini-cli/blob/main/docs/extensions/releasing.md
- Vercel skills CLI discovery: https://github.com/vercel-labs/skills
