# BIM / CAD / Revit 平台项目规则

## 适用项目

用于 BIM / IFC / Revit / CAD / Dynamo / 建模平台 / 插件 / 模型质检 / 图纸到模型相关项目。

## 必读上下文

- `.ai/ARCHSIGHT_AIOS_RULES.md`
- `.ai/project-context.md`
- `.ai/agent-routing.md`
- `.ai/skills.md`
- `.ai/workflows.md`
- Revit / CAD / IFC / BIM 相关项目文档、模型样例、插件入口和数据字典。

## 默认关注点

- Revit API、Dynamo、AutoCAD、IFC 转换和模型数据边界。
- 构件、空间、楼层、族、参数、属性集、分类编码和版本来源。
- 图纸、模型、工程量、审查规则之间的可追溯关系。
- 插件运行环境、宿主软件版本、模型样例和人工复核点。

## 推荐路由

| 任务 | 首选 Agent / Skill |
| --- | --- |
| BIM / IFC / 建筑语义建模 | Vitruvius / `archsight-bim-domain-modeling` |
| 平台边界、插件架构、服务拆分 | Atlas / `archsight-architecture-review` |
| Revit / CAD / IFC 工程实现 | Hephaestus / `archsight-controlled-execution` |
| AI Runtime、RAG、Tool Calling | Daedalus / `archsight-ai-runtime-design` |
| 代码质量、安全、发布风险 | Argus / `archsight-code-review` |

## 验收要求

- 标明 Revit / CAD / IFC 版本和宿主环境。
- 说明模型样例、输入文件、输出文件和失败回退路径。
- 对无法自动判断的工程语义标注人工确认点。
- 不把 BIM 语义推断伪装成规范依据。

