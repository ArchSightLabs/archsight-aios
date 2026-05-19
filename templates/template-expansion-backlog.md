# Template Expansion Backlog

## 已实现 Profile

| Profile | 目录 | 用途 |
| --- | --- | --- |
| `bim-platform` | `templates/project-bim-platform/` | BIM / IFC / Revit / CAD / 建模平台项目 |
| `construction-vision` | `templates/project-construction-vision/` | 施工视觉 AI、检测、分割、深度估计项目 |
| `rag-knowledge` | `templates/project-rag-knowledge/` | 规范知识库、RAG、GraphRAG、知识图谱项目 |

## 可扩展 Profile 备忘

| 候选 Profile | 适用方向 | 触发条件 |
| --- | --- | --- |
| `agent-runtime` | Agent Runtime、MCP、Tool Calling、Memory、受控执行环境 | 出现独立 AI Runtime / MCP 平台项目 |
| `frontend-app` | 管理后台、审图工作台、BIM Viewer、数据看板 | 需要稳定 UI / UX / 浏览器验证规则 |
| `backend-service` | API、权限、任务队列、文件处理、审计日志 | 后端服务项目数量增加 |
| `cli-tool` | 自动化脚本、安装器、迁移工具、治理检查命令 | CLI 工具成为独立交付物 |
| `data-pipeline` | ETL、数据清洗、标准化、批处理、索引构建 | 数据链路和评估任务复杂化 |
| `solver-engine` | 结构力学、有限元、荷载分析、数值求解 | Euclid 相关项目进入实现阶段 |
| `plugin-revit` | Revit 插件、Dynamo 节点、模型校验插件 | BIM 平台 profile 需要细分插件交付 |
| `mobile-field` | 工地移动端、拍照采集、离线同步 | 现场采集端成为独立产品线 |

## 扩展原则

- 新 profile 只补充差异规则，不复制 `project-ai` 的公共入口。
- 每个 profile 必须能被 `init --profile <name>` 单独验证。
- 新 profile 必须说明适用项目、默认关注点、推荐路由和验收要求。
- 没有真实项目牵引时，不新增空模板。
