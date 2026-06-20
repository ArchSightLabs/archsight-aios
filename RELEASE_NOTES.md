# Release Notes

## 1.5.0

本版本主线是 **Knowledge Pack + 本地 Reference Runtime**。AIOS 不再只把工程资料整理成报告或草稿，而是能把规范摘录、企业标准、项目资料、历史审查口径和人工复核记录治理成可编译、可查询、可评估的工程知识资产。

### Highlights

- 新增 Knowledge Pack 对象模型：来源、授权、版本、标准、条文、实体、关系、lookup 规则、评估问题和人工复核状态。
- 新增 `knowledge:init` / `knowledge:validate` / `knowledge:compile` / `knowledge:inspect` / `knowledge:lookup` / `knowledge:eval`。
- 新增端到端合成样板 `templates/knowledge-pack-samples/scheme-review/`。
- `knowledge.norm_lookup` 接入本地 stdio MCP Reference Runtime，返回可追溯引用、适用性、版本和仲裁状态。
- 新增 Knowledge Pack 评分卡和 `validate:knowledge-pack` 发布门禁。
- `aios-knowledge`、`aios-runtime`、`aios-review`、`aios-construction-scheme` 已补充 Knowledge Pack 生产、消费和复核边界。
- 新增建筑行业自助试用指南，覆盖 WorkBuddy 安装、试用资料选择、脱敏边界、样例任务和人工复核方式。
- 新增更短的任务型 Skill 入口：`aios-tender`、`aios-tender-audit`、`aios-scheme`、`aios-scheme-audit`。原 `aios-commercial-*` 与 `aios-construction-*` 领域型入口继续保留，适合已培训和内部流程沉淀的团队。
- 扩充正式工程业务技能包：新增 `aios-contract-audit` / `aios-contract-draft`、`aios-daily` / `aios-daily-write`、`aios-meeting` / `aios-meeting-write`。合同草拟、施工日报生成和会议纪要生成都必须交回对应审核门禁，不能直接标为最终定稿。

### Verification

- `npm run validate:knowledge-pack`

## 1.4.0

本版本主线是把 AIOS 从“审核型 Skill”推进到“工程文档生成、改写与复核闭环”。新增写作型 Skill 负责初稿生成、历史素材复用和 Markdown 工作母版；现有审核型 Skill 继续负责响应性、证据链、风险和人工复核门禁。

核心变化：

- 新增 `aios-tender-write`：基于招标文件、评分办法、企业历史标书素材、类似项目案例和用户初稿生成 / 改写技术标章节。
- 新增 `aios-scheme-write`：基于方案初稿、历史方案素材、工程概况、专家意见和用户模板生成 / 改写专项施工方案章节。
- 新增 `templates/document-writing/`：提供 `source-normalized.md`、`material-index.md`、`writing-brief.md`、`draft.md`、`review-notes.md` 和 `final.md` 工作母版。
- 新增 `archsight-aios writing:init`：在业务项目中创建标书 / 方案 Markdown 写作工作台，已有文件不覆盖。
- 新增 `archsight-aios writing:validate`：检查写作工作台结构和关键边界。
- `writing:init --sample` 可生成技术标 / 专项施工方案端到端脱敏样板。
- 新增写作型脱敏评测 fixture 和 run-pack 命令：`validate:document-writing-run-pack`、`build:document-writing-run-pack`。
- 新增写作型 scorecard 和 skill-runtime 证据归档校验：`validate:document-writing-scorecard`、`validate:skill-runtime-evidence`。
- 新增 Codex / WorkBuddy 写作型 Skill raw output 归档和 scorecard 复核记录，覆盖 `aios-tender-write` / `aios-scheme-write` 四个宿主样板 case。
- 新增 WorkBuddy-first 快速使用说明、写作能力边界和 v1.4.0 release readiness 清单。
- 写作型 Skill 必须保留资料来源、素材复用判断、待补占位、人工复核岗位和审核门禁，不得把历史项目事实直接套入当前项目。
- CLI 自动识别对更具体的生成 / 改写短语加权，降低写作请求误入审核型 Skill 的概率。
- 当前 skill-runtime 归档已记录 Codex / WorkBuddy 真实触发 raw output，并按写作型 scorecard 复核通过；版本号已同步到 `1.4.0`，正式发布仍需 tag、push 和 GitHub Release。

发布前验证建议：

- `npm run validate:skills`
- `npm run validate:prompts`
- `npm run validate:document-writing-run-pack`
- `npm run validate:document-writing-scorecard`
- `npm run validate:skill-runtime-evidence`
- `npm test`
- `git diff --check`
- `npm pack --dry-run`

## 1.3.2

本版本修复 v1.3.1 后在不同宿主中出现的 Skill 遵从度不一致问题。用户只说“用 AIOS 分析该文档”且没有要求摘要时，AIOS 默认应输出标准详版报告，而不是短摘要。

核心变化：

- `aios` / `archsight-aios` 总入口明确短指令默认走“标准详版报告”。
- 招投标、合同、施工日报、会议纪要、变更签证和专项施工方案 Skill 增加“标准详版报告与输出自检”约束。
- 各工程业务 Skill 的轻量 `openai.yaml` 默认提示同步补充详版报告、自检、资料来源、主表 / 台账、资料缺口、人工复核和 AI 不应下结论事项。
- Prompt 评估策略增加宿主遵从度受控评测口径，避免把 WorkBuddy / Codex / Gemini / Antigravity 的整体效果差异直接归因到单一模型。

发布前验证建议：

- `npm run validate:skills`
- `npm test`
- `git diff --check`
- `npm pack --dry-run`

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
