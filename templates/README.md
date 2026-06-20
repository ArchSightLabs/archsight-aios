# Templates

`templates/` 保存可复用模板。

推荐内容：

- Agent 定义模板
- Workflow 模板
- Skill 模板
- Prompt 评估模板
- Review 清单模板
- 实验记录模板
- [项目 AI 接入模板](project-ai/)
- [BIM / CAD / Revit 平台项目 profile](project-bim-platform/)
- [施工视觉 AI 项目 profile](project-construction-vision/)
- [规范知识库 / RAG / GraphRAG 项目 profile](project-rag-knowledge/)
- [工程文档写作 Markdown 工作母版](document-writing/)
- [工程知识治理 Knowledge Pack 工作台](knowledge-pack/)
- [Knowledge Pack 合成样板](knowledge-pack-samples/)
- [模板扩展备忘](template-expansion-backlog.md)

## 项目 Profile

`project-ai/` 是通用 AIOS 接入底座。行业 profile 默认作为 AIOS 包内 registry 存在，用户通常不需要先理解或选择 profile。`init` 默认使用 `--profile auto`，根据项目名、README、package / pyproject 和浅层文件名生成 `.ai/profile-detection.md`，并在首次创建 `.ai/project-context.md` 时预填项目事实草稿。

```bash
archsight-aios init --cwd /path/to/project
```

需要人工覆盖自动识别时再指定：

```bash
archsight-aios init --cwd /path/to/project --profile auto
archsight-aios init --cwd /path/to/project --profile none
archsight-aios init --cwd /path/to/project --profile all
archsight-aios init --cwd /path/to/project --profile bim-platform
archsight-aios init --cwd /path/to/project --profile construction-vision
archsight-aios init --cwd /path/to/project --profile rag-knowledge
```

`init` 默认使用 `--mode auto`：新项目补齐根目录入口和 `.ai/`；已有 AI 工具入口文件的项目自动追加或刷新 ArchSight AIOS 托管引用块。Profile 只在自动识别或显式指定后补充 `.ai/profiles/*.md`，不复制公共入口规则，也不修改已有 `AI_CODING_RULES.md` 正文。

## 工程文档写作

`document-writing/` 是 v1.4.0 写作型 Skill 的 Markdown 工作母版模板，用于标书、技术标、专项施工方案和交底材料的生成 / 改写流程。

```bash
archsight-aios writing:init --cwd /path/to/project --type tender
archsight-aios writing:init --cwd /path/to/project --type scheme --name scheme-workbench
archsight-aios writing:init --cwd /path/to/project --type tender --sample --name tender-sample
archsight-aios writing:validate --cwd /path/to/project --name document-writing
```

`document-writing-samples/` 提供两个端到端脱敏样板：`tender/` 和 `scheme/`。

## Knowledge Pack

`knowledge-pack/` 是 v1.5.0 工程知识治理工作台模板，用于把来源、标准、条文、实体、关系、查询规则、评估问题和人工复核状态编译成 Runtime 可消费的 Knowledge Pack。

```bash
archsight-aios knowledge:init --cwd /path/to/project --name knowledge-pack
archsight-aios knowledge:init --cwd /path/to/project --sample --name scheme-review
archsight-aios knowledge:validate --cwd /path/to/project --name scheme-review
archsight-aios knowledge:compile --cwd /path/to/project --name scheme-review
archsight-aios knowledge:eval --cwd /path/to/project --name scheme-review
```

`knowledge-pack-samples/scheme-review/` 提供端到端合成样板，可用于验证 `knowledge.norm_lookup` 本地 Reference Runtime。
