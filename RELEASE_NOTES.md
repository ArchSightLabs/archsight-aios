# Release Notes

## 1.3.1

本版本聚焦“让使用者感觉简单”：新增 `aios` / `archsight-aios` 总入口，用户可以用短句调用 AIOS，由技能包根据资料类型自动路由；同时新增用户侧 `aios-compare`，并把内部 `aios-prompt-compare` 收紧为开发者显式调用的 Prompt 测试工具。

工程业务管理 Skill 的用户可见输出模板已改为中文字段，默认使用 `资料来源清单`、`证据仲裁`、`证据`、`工具结果` 和 `处理建议：可继续 / 需核验 / 转人工复核`，不再把 `Source Map`、`Arbitration`、`Evidence`、`Decision`、`Need verify` 作为默认输出标题。

发布前验证建议：

- `npm run validate:skills`
- `npm test`
- `git diff --check`

## 1.3.0

本版本把 AIOS 从通用建筑行业技能包进一步扩展为可评测、可对比、可初始化到项目上下文的工程业务管理与 Prompt 治理工具包。核心变化包括：

- 新增 `aios-prompt-compare`，用于对比弱提示词、便携强提示词和真实 Skill runtime 输出。
- 新增工程业务管理基础提示词资产，覆盖招投标、合同履约、施工日报、工程会议、变更签证和专项施工方案。
- 新增 prompt 评测 fixtures、公开咨询样例、run pack 构建、结果校验、模型输出校验、scorecard 校验和分析脚本。
- 增强项目初始化与模板推断能力，让 AIOS 能更稳定地写入项目上下文、profile 和入口文件。
- 版本号同步升级到 `1.3.0`，覆盖 npm package、Gemini extension、Claude plugin、runtime manifest 和 CLI MCP clientInfo。

发布前验证建议：

- `npm run validate:skills`
- `npm run validate:prompts`
- `npm run validate:prompt-run-pack`
- `npm run validate:public-advisory-run-pack`
- `npm run validate:prompt-run-results`
- `npm run validate:prompt-outputs`
- `npm run validate:prompt-scorecard`
- `npm run doctor`
- `npm run smoke:project`
- `npm test`
- `npx skills add . --list`
- `npm pack --dry-run`

## 1.2.0

本版本把 AIOS 的定位从单纯“建筑 AI 研发工具包”扩展为面向建筑行业知识工作从业者与 AI 研发团队的技能包。除了 BIM / IFC、RAG / GraphRAG、智能审图、Runtime 和代码治理，也覆盖招投标、合同履约、施工日报、工程会议、变更签证和专项施工方案等工程资料证据链工作。

### 新增

- 新增 WorkBuddy 支持：`npx @archsight/aios install --target workbuddy --scope user` 会把 `aios-*` skills 安装到 `~/.workbuddy/skills/`。
- `install --target all --scope user` 现在会同时安装 WorkBuddy skills。
- 新增 `adapters/workbuddy/README.md`，说明 WorkBuddy 安装位置、调用示例和维护边界。
- 新增公共 skill 发现支撑：`gemini-extension.json`、`.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json`、`docs/PUBLIC_DISCOVERY.md` 和 `scripts/validate-skills.mjs`。
- `package.json` 增加 `agent-skills`、`skills-sh`、`gemini-cli`、`workbuddy`、`building-ai`、`project-evidence-work` 等检索关键词。

### 调整

- 版本升级到 `1.2.0`，同步更新 npm package、Gemini extension、Claude plugin 和 runtime manifest。
- About / marketplace / manifest 描述改为默认中文、附带英文检索短语：面向建筑行业知识工作从业者与 AI 研发团队。
- README 增加 WorkBuddy 安装位置、公共发现说明和发布前验证命令。

### 验证

- `npm run validate:skills`
- `npm test`
- `npx skills add . --list`
- `node --check scripts\validate-skills.mjs`
- `npm pack --dry-run`
