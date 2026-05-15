# Agent Routing

## 基本关系

| 类型 | 含义 |
| --- | --- |
| Agent | 谁来做 |
| Skill | 怎么做 |
| Workflow | 什么时候做、按什么顺序做 |
| Runtime | 在哪里运行 |

## 默认 Agent 路由

| 任务 | 主 Agent | 说明 |
| --- | --- | --- |
| 架构评审、技术选型、服务边界 | Atlas | 总架构师 |
| 任务拆解、交付顺序、CI/CD | Mason | 工程总工 |
| Code Review、安全、性能、技术债 | Argus | 代码审查官 |
| BIM、IFC、建筑规范、审图逻辑 | Vitruvius | 建筑数字化专家 |
| RAG、GraphRAG、MCP、Memory、Tool Calling | Daedalus | AI 研发工程师 |
| 代码修改、脚本执行、测试、文档生成 | Hephaestus | 受控执行官 |

## 升级规则

- 涉及长期架构、服务边界、数据模型：升级给 Atlas。
- 涉及多模块交付、任务依赖、发布顺序：升级给 Mason。
- 涉及权限、安全、生产发布、AI 生成代码：升级给 Argus。
- 涉及行业规范、BIM / IFC、审图语义：升级给 Vitruvius。
- 涉及 RAG、GraphRAG、MCP、Memory、Tool：升级给 Daedalus。
- 具体实现和验证：交给 Hephaestus。

