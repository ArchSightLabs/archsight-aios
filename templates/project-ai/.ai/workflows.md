# Workflows

## 使用原则

Workflow 定义“什么时候做、按什么顺序做”。当任务涉及多个 Agent 或多个 Skill 时，必须选择对应 Workflow。

Workflow 是项目执行路径，不绑定某个运行平台。Hermes、飞书、Codex、Claude、Gemini 等只影响入口和执行方式，不改变项目事实、测试命令和验收标准。

AIOS Workflow 是建筑行业项目的增强路径，不是普通工程任务的强制替代。当前任务不涉及建筑行业语义、工程知识、RAG / GraphRAG、审图、证据链、人工复核或审计留痕时，可以使用宿主工具的通用流程。

## 推荐 Workflow

| 场景 | Workflow |
| --- | --- |
| 建筑行业项目实现新功能 | `feature-development` |
| 建筑行业项目修复缺陷 | `bug-fixing` |
| 建筑行业项目架构评审 | `architecture-review` |
| 建筑行业项目代码审查 | `code-review` |
| 建筑行业平台 UI / UX 方案评审 | `design-review` |
| UAT / 试运行确认 / 演示前质量门禁 | `quality-readiness` |
| RAG / GraphRAG 知识链路 | `rag-pipeline` |
| 发布前检查 | `release` |
| 前端生成 | `frontend-generation` |
| 施工日报、工程会议、现场异常和变更签证线索每日闭环 | `site-daily-loop` |
| 技术标历史 docx 母版保真改写 | `tender-docx-rewrite` |

## 执行要求

- 先明确输入和验收标准。
- 再选择 Workflow。
- 再调用对应 Skill。
- 最后用测试、构建、lint、typecheck 或人工检查验证。
- 涉及建筑行业、BIM、IFC、规范、审图或 RAG / GraphRAG 时，先确认项目是否启用对应 profile。
- 涉及规范检查、结构计算、安全扫描、测试门禁或 Agent 冲突时，输出 `Claim / Evidence / Tool Result / Decision`；工具证据缺失时不得标记为已验证。
- 涉及施工日报、会议纪要、联系单或变更签证线索时，使用 `site-daily-loop` 并保留 Source Map、Evidence 和人工复核结论。
- 涉及技术标历史 docx 母版保真改写时，使用 `tender-docx-rewrite`；对业务用户优先识别盘点母版、建立响应矩阵、整理替换清单、生成第 X 章修改单、写入 Word、扫描残留、生成候选版这 7 个中文动作。

## 本项目默认流程

待填写：

- Feature：
- Bug：
- Review：
- Quality readiness / UAT / 试运行确认：
- Release：
- RAG / GraphRAG：
- Site daily loop：
