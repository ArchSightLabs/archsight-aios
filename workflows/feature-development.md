# Feature 开发 Workflow

## 定位

用于从需求进入受控实现的标准流程。目标是把业务目标转成可执行、可审查、可验证的工程交付。

本 Workflow 面向建筑行业项目的 feature 交付增强。普通非建筑功能开发优先使用宿主工具的通用工程流程；只有项目 profile、上下文或任务事实涉及建筑行业语义、工程知识、RAG / GraphRAG、审图、证据链、人工复核或审计留痕时，才启用 `aios-*` 行业增强。

## 触发场景

- 新功能开发。
- 多模块需求实现。
- AI 生成方案需要进入工程执行。
- 需要明确 Agent、Skill、验收和发布顺序。

## 参与角色与 Skill

| 阶段 | 主 Agent | Skill |
| --- | --- | --- |
| 产品契约 | Janus | `aios-product` |
| 架构边界 | Atlas | `aios-arch` |
| 任务拆解 | Mason | `aios-plan` |
| 受控实现 | Hephaestus | `aios-exec` |
| 质量审查 | Argus | `aios-review` |
| AI Runtime 相关 | Daedalus | `aios-runtime` |
| BIM / IFC / 行业语义相关 | Vitruvius | `aios-knowledge` |
| 结构力学 / 求解链路相关 | Euclid | `aios-structural` |

## 输入

- 需求目标和业务背景。
- 已确认的产品方向、目标用户、版本范围、非目标和验收指标；缺失时先由 `aios-product` 补齐。
- 当前项目结构和相关模块。
- 约束条件：时间、权限、技术栈、发布节奏。
- 已知风险、历史决策和不得破坏的行为。

## 执行顺序

1. 如果用户问题、版本范围、非目标、验收指标或试点条件不清，Janus 先用 `aios-product` 形成产品契约；已有已验收产品契约时直接复用。
2. Atlas 判断需求是否涉及架构边界、数据模型、Runtime 或长期复杂度；如涉及，对 Product 草案逐项返回 `支持 / 需调整 / 技术阻断` 及证据。
3. Janus 将架构约束回写到版本范围、非目标和验收契约；只有核心用户价值、目标市场、投入边界或停损条件必须改变时才回到 `aios-ceo`。
4. Mason 将产品与架构约束拆成任务、依赖、验收标准和执行顺序。
5. 如涉及规范、结构计算、安全或 Runtime 权限，先按 Capability 证据和仲裁协议确认是否可进入执行。
6. Hephaestus 按 Mason 的任务执行最小改动。
7. Argus 审查 diff、测试缺口、安全和技术债风险。
8. Mason 汇总交付状态、剩余风险和发布条件，Janus 对照产品验收指标确认产品结果仍需哪些 UAT 或外部证据。

## 升级规则

- 涉及服务边界、数据模型、核心技术栈：升级给 Atlas。
- 涉及用户问题、产品范围、PRD、验收指标或试点闭环：升级给 Janus 并使用 `aios-product`。
- 涉及权限、安全、Prompt 注入、生产发布：升级给 Argus。
- 涉及 RAG、GraphRAG、MCP、Memory、Tool Calling：升级给 Daedalus。
- 涉及 BIM、IFC、规范、审图逻辑：升级给 Vitruvius。
- 涉及结构力学、荷载、边界条件、FEM 或结构计算工具链：升级给 Euclid。
- 任务拆解不清、依赖复杂或交付顺序冲突：升级给 Mason。
- Capability 返回阻断结果或证据缺失：按 `governance/arbitration-protocol.md` 回到对应 Agent 重评。

## 输出

- 架构判断。
- 产品契约或已确认的产品输入。
- 任务拆解。
- 实现变更。
- Review 结果。
- 验证证据。
- Claim / Evidence / Tool Result / Decision。
- 剩余风险和发布建议。

## 验收标准

- 每个任务有明确输入、输出和验证方式。
- 产品型 Feature 有明确用户、版本范围、非目标、验收指标和 UAT / 外部证据边界。
- 实现只触碰必要范围。
- 关键路径经过测试、构建、lint 或人工检查。
- Argus 无阻断问题。
- Capability 阻断项已清零，或已明确人工升级。
- 未验证项被明确记录。

## 回滚与恢复

- 每个实现任务应在独立分支或可审查 diff 中完成。
- Hephaestus 只能回滚本次任务范围内的改动，不得回滚用户或其他 Agent 的无关改动。
- 如果测试、构建或 Argus 审查失败，回到 Hephaestus 修复阶段，并保留失败证据。
- 如果失败源于任务拆解错误，回到 Mason 重新拆解依赖和执行顺序。
- 如果失败源于架构边界或技术选型错误，回到 Atlas 重新评审。
- 发布前必须明确回滚方式：Git revert、配置回退、数据库迁移回滚或人工恢复步骤。
