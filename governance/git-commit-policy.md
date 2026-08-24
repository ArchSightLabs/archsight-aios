# Git 提交治理

ArchSight 项目的正式提交统一使用“中文 Conventional Commits + Lore 决策记录”。目标不是把提交信息写长，而是让版本图首先呈现中文动机，并保留约束、风险和验证证据。

## 格式

```text
<type>(<scope>): <中文动机标题>

<中文正文，说明为什么改以及关键约束>

Confidence: low|medium|high
Scope-risk: narrow|moderate|broad
Tested: <验证命令或中文验证说明>
```

- `scope` 可省略；破坏性变更可在冒号前使用 `!`。
- `Confidence`、`Scope-risk`、`Tested` 必填。
- trailer 必须位于消息末尾的连续区块，并与正文空一行。
- `fixup!` / `squash!` 可用于本地整理，但 pre-push、CI 和发布门禁必须拒绝。
- `commit-msg` 提供即时反馈，`pre-push` 检查实际推送范围，CI 再检查共享边界；三者不能互相替代。
- 不重写已发布历史；新规则只约束此后进入共享边界的提交。

## 校验器

```bash
python scripts/check_git_commit.py --message-file .git/COMMIT_EDITMSG
python scripts/check_git_commit.py --outgoing
python scripts/check_git_commit.py --range origin/main..HEAD
```

GitHub Actions 可直接复用 `.github/actions/commit-governance`。业务仓库应固定到已审核的 AIOS commit，而不是跟随浮动分支。
