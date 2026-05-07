# OPENCODE.md

> 本文件供 **opencode** 在本仓库中工作时参考。  
> 本文件是 opencode 的工具入口适配器，不复制公共规范正文。

---

## 必读入口

开始任何工作前，先阅读：

- [AI 编码规范（公共）](./AI_CODING_RULES.md)
- [项目总览](./README.md)
- [Agent Routing](./runtime/agent-routing.md)
- [Workflows](./workflows/README.md)

---

## opencode 特别说明

- opencode 在执行终端命令时，须优先使用项目根目录的 `Makefile` 或 `scripts/` 中的辅助脚本（如存在）。
- 生成代码时，严格遵守 `AI_CODING_RULES.md` 第二节「AI 行为准则」，尤其是最小代码和不做假设原则。
- opencode 不得在未验证的状态下关闭 PR 或标记任务为完成。
