# AIOS Roadmap

## Phase 1：治理骨架

- 核心 Agent 角色资产。
- `aios-*` Skills。
- Workflow、Runtime routing、项目模板。
- CLI 安装和 doctor。

## Phase 2：产品化闭环

- 统一 AIOS 命名和发布入口。
- 行为级测试。
- 治理、交付、记忆、知识工程政策。
- Hermes dry-run 同步与漂移检测。

### v1.4.0：工程文档生成、改写与复核闭环

- 新增写作型能力：`aios-tender-write` 和 `aios-scheme-write`。
- 明确 Markdown 是 AIOS 工作母版，Word / PDF / PPT 是交付格式。
- 建立历史方案 / 标书素材复用工作流，区分可复用、仅参考、不可套用和需人工确认内容。
- 保留现有审核型 Skill 作为质量门禁：标书生成后回到 `aios-commercial-tender`，方案生成后回到 `aios-construction-scheme`。
- 详见 [v1.4.0 工程文档生成、改写与复核闭环](v1.4.0-engineering-document-workflow.md)。

## Phase 3：行业知识工程

### v1.5.0：Knowledge Pack + 本地 Reference Runtime

- 定义 AIOS 原生 `Knowledge Pack`：来源、授权、版本、标准、条文、实体、关系、lookup 规则、评估问题和人工复核状态。
- 新增 `knowledge:init` / `knowledge:validate` / `knowledge:compile` / `knowledge:inspect` / `knowledge:lookup` / `knowledge:eval`。
- 新增端到端合成样板 `templates/knowledge-pack-samples/scheme-review/`。
- 将 `knowledge.norm_lookup` 接入本地 stdio MCP Reference Runtime，返回可追溯引用、适用性和仲裁状态。
- 建立 Knowledge Pack 评分卡和发布验证入口 `validate:knowledge-pack`。
- 详见 [v1.5.0 Knowledge Pack 与本地 Reference Runtime](../docs/v1.5.0-knowledge-pack-runtime.md)。

### 后续行业知识工程方向

- BIM / IFC / 规范知识源登记深化。
- RAG / GraphRAG 评估集扩展到更多知识域。
- 审图规则图谱和条文冲突治理。
- 第二阶段 Agent 深化。

## Phase 4：企业级运行

- 可选企业 Runtime Adapter：Hermes / 飞书等真实集成。
- 权限审计。
- 多项目接入仪表盘。
- 发布和回滚自动化。
