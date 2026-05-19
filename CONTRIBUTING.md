# Contributing

欢迎提交 ArchSight AIOS 的规则、文档、profile、skill、workflow 和测试改进。

## 贡献类型

| 类型 | 示例 |
| --- | --- |
| 文档 | 快速上手、业务专家指南、术语解释、案例说明。 |
| Profile | BIM 平台、施工视觉、规范知识库之外的新项目类型。 |
| Skill | 可重复执行、可验证的 AI 工作能力。 |
| Workflow | 架构评审、审图规则沉淀、数据评估、发布检查等流程。 |
| 测试 | CLI 行为、模板输出、manifest 一致性和回归用例。 |

## 提交前检查

```bash
npm test
npm run doctor
npm run smoke:project
```

## 编写原则

- 面向外部读者时，先说明用途，再说明实现细节。
- 面向业务专家时，使用行业语言，避免只写工程术语。
- 所有规范、条文、样例和业务判断都应保留来源、版本和适用范围。
- 不提交涉密项目资料、未授权图纸、个人信息或客户内部数据。
- 不把模型推断写成确定工程结论。

## 新增 profile 的要求

新增 profile 应放在 `templates/project-<name>/.ai/profiles/<name>.md`，并说明：

- 适用项目
- 必读上下文
- 默认关注点
- 推荐 Agent / Skill 路由
- 验收要求

同时更新：

- `runtime/archsight-aios.manifest.json`
- `templates/README.md`
- `README.md`
- `tests/cli.test.mjs`

## 新增 skill 的要求

新增 skill 应包含：

- `SKILL.md`
- `agents/openai.yaml`
- 清晰的输入、工作流、输出格式和约束

同时更新 manifest、routing 和必要测试。

## Commit 建议

提交信息应说明为什么改，而不仅是改了什么。涉及取舍时记录约束、拒绝的方案、验证方式和未验证风险。
