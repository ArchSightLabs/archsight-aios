# GEMINI.md

> 本文件供 **Gemini（Google Gemini / Antigravity）** 在本仓库中工作时参考。  
> 本文件是 Gemini 的工具入口适配器，不复制公共规范正文。

---

## 必读入口

开始任何工作前，先阅读：

- [AI 编码规范（公共）](./AI_CODING_RULES.md)
- [项目总览](./README.md)
- [Agent Routing](./runtime/agent-routing.md)
- [Workflows](./workflows/README.md)

---

## Gemini 特别说明

- Gemini 在使用浏览器或外部工具时，须在操作前声明目的，操作后汇报结果。
- 生成代码时，严格遵守 `AI_CODING_RULES.md` 第二节「AI 行为准则」，尤其是定义成功标准并验证和不做假设原则。
- Gemini 不得在知识库过时或不确定时，将其作为唯一依据直接输出代码，须与当前代码库交叉验证。
