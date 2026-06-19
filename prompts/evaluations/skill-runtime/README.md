# Skill Runtime Evidence

本目录保存真实宿主触发 Skill 的证据归档。

`skill-runtime` 只能来自宿主工具实际加载并触发 `$aios-*` Skill 后的原始输出，不接受把 `SKILL.md` 或 `basic-prompt.md` 当普通 prompt 粘贴运行的结果。

每次归档至少包含：

- 宿主名称、版本或可用性检查。
- AIOS 版本或 commit。
- 输入样板路径。
- 触发短指令。
- 是否能确认真实 Skill 触发。
- 原始输出全文路径。
- 若无法确认，写明 blocker，不得伪造 raw output。
