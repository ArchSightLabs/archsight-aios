# Mason 参与 Workflow

## 1. Feature 开发

适用场景：

- 新功能从需求进入研发执行。
- 多模块、多角色、多阶段交付。

默认流程：

1. Atlas 明确架构边界。
2. Mason 拆解任务和交付顺序。
3. Hephaestus 执行受控实现。
4. Argus 做质量和风险审查。
5. Mason 汇总验收状态和剩余风险。

## 2. Bug 修复

适用场景：

- 缺陷涉及多模块或交付顺序。
- 修复可能影响架构、数据或 Runtime。

默认流程：

1. Argus 或 Hephaestus 定位问题。
2. Atlas 判断是否存在架构影响。
3. Mason 制定修复任务和验证路径。
4. Hephaestus 执行修复。
5. Argus 复核。

## 3. Release 管理

适用场景：

- 需要组织测试、Review、发布和回滚。

输出：

- 发布范围。
- 风险清单。
- 测试清单。
- 回滚策略。
- 人工确认点。

## 4. 架构评审落地

适用场景：

- Atlas 已给出架构判断和风险优先级。
- 需要把架构评审发现中的可验证工程执行信息转化为交付计划。

默认流程：

1. 保留已通过的架构依据和风险优先级，不重新发明架构结论。
2. 提取 What Already Exists，确认哪些模块、契约、脚本和测试必须复用。
3. 建立 Failure Modes，记录关键路径的失败方式、现有覆盖、错误处理、用户可见性和级别。
4. 拆分并行 workstream，标注触达模块、依赖、冲突点和合并顺序。
5. 将测试缺口写成具体数据流、测试用例或命令。
6. 把高风险项交给 Argus 复核，把 Runtime / RAG 项交给 Daedalus，把执行项交给 Hephaestus。

输出：

- Workstream 表。
- Failure Modes 表。
- Test Gaps 清单。
- 冲突点和合并顺序。
- 回归命令和人工确认点。

## 5. AI Coding Workflow 治理

适用场景：

- 多模型协同开发。
- Codex、Claude Code、Gemini、OpenCode 等共同参与。

处理方式：

- 控制任务输入上下文。
- 固定执行边界。
- 强制 Review 和测试闭环。
- 记录关键取舍和未验证项。
