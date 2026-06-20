# Construction Scheme Writing Sample

> 数据说明：以下客户、项目、人员、地点、日期、金额、编号均为虚构。该样板只用于演示 AIOS 写作工作台，不代表真实专项施工方案。

## 推荐流程

1. 读取 `source-normalized.md` 和 `material-index.md`。
2. 使用 `aios-scheme-write` 生成或改写 `draft.md`。
3. 使用 `aios-scheme-audit` 复核 `review-notes.md` 中的危险源、计算书、专家意见和交底要点；已使用 `aios-construction-scheme` 的团队可继续使用原入口。
4. 人工处理阻断项后整理 `final.md`。

## 边界

- 不把历史方案中的旧项目参数自动套入当前项目。
- 不确认方案合格、计算正确、专家论证通过或审批通过。
- `final.md` 仍是人工定稿前 Markdown 母版，不是正式审批文件。
