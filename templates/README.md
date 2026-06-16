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
- [模板扩展备忘](template-expansion-backlog.md)

## 项目 Profile

`project-ai/` 是通用 AIOS 接入底座。具体行业项目通过 `--profile` 叠加差异规则：

```bash
archsight-aios init --cwd /path/to/project --profile bim-platform
archsight-aios init --cwd /path/to/project --profile construction-vision
archsight-aios init --cwd /path/to/project --profile rag-knowledge
```

`init` 默认使用 `--mode auto`：新项目补齐根目录入口（`AGENTS.md`、`CLAUDE.md`、`GEMINI.md`、`OPENCODE.md`、`AI_CODING_RULES.md`）和 `.ai/`，已有 AI 工具入口文件的项目自动追加或刷新 ArchSight AIOS 托管引用块。Profile 只补充 `.ai/profiles/*.md`，不复制公共入口规则。
