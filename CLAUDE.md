# CLAUDE.md

> 本文件供 **Claude Code** 在本仓库中工作时参考。
> 本文件是 Claude Code 的工具入口适配器，不复制公共规范正文。

---

## 必读入口

开始任何工作前，先阅读：

- [AI 编码规范（公共）](./AI_CODING_RULES.md)
- [项目总览](./README.md)
- [Agent Routing](./runtime/agent-routing.md)
- [Workflows](./workflows/README.md)

---

## Claude Code 特别说明

- Claude Code 在进行多文件编辑时，应先声明将要修改的文件列表；若任务明确且低风险，可按公共规范直接执行。
- 生成代码时，严格遵守 `AI_CODING_RULES.md` 第二节「AI 行为准则」，尤其是只触碰必须改动的部分和揭示取舍原则。
- Claude Code 不得在对话中假设需求已明确；如有关键歧义，必须先提问再动手。
