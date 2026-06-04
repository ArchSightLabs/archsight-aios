# WorkBuddy 适配说明

WorkBuddy 可以从个人 skills 目录读取 Markdown skill。ArchSight AIOS 可以直接安装到 `~/.workbuddy/skills/<skill-name>/SKILL.md`，作为可按需加载的建筑 AI 研发技能包。

## 安装

安装 AIOS skills：

```powershell
npx @archsight/aios install --target workbuddy --scope user
```

`install --target all --scope user` 也会安装 WorkBuddy skills。

## 安装位置

| 模式 | 位置 |
| --- | --- |
| 个人目录 | `~/.workbuddy/skills/<skill-name>/SKILL.md` |

WorkBuddy 目标固定写入个人目录；不区分项目级目录。AIOS CLI 仍保留统一参数形式，所以命令中需要写 `--scope user`。

## 使用

在 WorkBuddy 中按 skill 名称调用或明确指定要使用的 AIOS 工具：

```text
使用 aios-arch skill 评审这个 BIM 平台方案的服务边界、数据归属和长期复杂度。
```

```text
使用 aios-review skill 审查这个 PR 的安全、测试缺口和发布风险。
```

```text
使用 aios-construction-daily skill 整理这份施工日报的异常、责任人和待确认事项。
```

## 维护建议

- WorkBuddy 只需要读取 `SKILL.md`，不需要额外放宽工具权限。
- AIOS 是建筑行业增强层；普通非建筑任务不要强行套 BIM、IFC、规范或审图假设。
- 如果 WorkBuddy skill 列表过长，可只保留实际使用频率最高的 `aios-*` 目录。
