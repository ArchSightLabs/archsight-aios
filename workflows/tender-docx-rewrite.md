# 技术标 DOCX 保真改写 Workflow

本 workflow 用于打分制技术标、施工组织设计、专项技术响应等已有高质量 Word 模板的项目化改写。目标不是从零生成 Word，而是在尽量不破坏原 docx 版式的前提下，把旧项目模板改写成本项目可继续人工定稿的技术标底稿。

## 一、适用场景

优先使用本 workflow 的条件：

- 用户已有历史技术标、打分制标书或企业标准 Word 模板。
- 模板包含可复用的页眉页脚、目录、标题层级、表格、图片、流程图、样式和编号。
- 新项目有招标文件、评分办法、工程量清单、答疑澄清或至少明确的技术标评分要求。
- 目标是生成可人工继续修改的 docx 底稿，而不是只要 Markdown 草稿。

不适用条件：

- 没有可用 Word 母版，或母版本身质量很差。
- 用户要求完全自动形成正式投标文件、最终报价或盖章文件。
- 缺少招标文件、评分办法或本项目基本工程信息。
- 旧模板包含大量无法识别的图片文字、扫描页、宏、受保护内容或复杂域代码，且无法人工复核。

## 二、核心判断

AIOS 标书写作应区分两种模式：

| 模式 | 适用情况 | 主要产物 |
|---|---|---|
| Markdown 工作母版 | 没有成熟 Word 模板，或先做内容结构和内部草稿 | source-normalized.md、material-index.md、draft.md、review-notes.md |
| DOCX 保真改写 | 有成熟历史技术标模板，且需要保留格式、图片和表格 | 改写后的 docx、响应矩阵、量化数据摘录、残留扫描、人工复核清单 |

本 workflow 只覆盖第二种模式。

## 三、输入材料

最小输入：

1. 历史技术标 Word 母版：template.docx。
2. 本项目招标文件或技术标要求。
3. 评分办法或打分项。
4. 本项目基础信息：项目名称、招标人、地点、范围、工期、质量目标、规模。

增强输入：

- 工程量清单、清单摘录或可验证的量化数据。
- 图纸目录、总平面图、专项方案要求、危大工程清单。
- 企业真实人员、设备、业绩、证书和管理体系资料。
- 投标负责人反馈、页数限制、格式要求和历史标书修改意见。

## 四、工作目录建议

```text
docx-preserve-rewrite/
  source/
    template.docx
    tender-requirements.md
    score-method.md
    project-basic-info.md
  state/
    runtime-state.json
    template-baseline.json
    progress.md
  mapping/
    response-matrix.md
    replacement-map.json
    residual-terms.txt
    quantity-extract.md
  change-sets/
    CS-001.yaml
    CS-002.yaml
  output/
    draft-v1.docx
    candidate-v1.docx
    apply-report.md
    residual-scan.md
    verification-report.md
    review-handoff.md
```

目录职责：

- source/ 保存脱敏后的输入资料和 Word 母版。
- state/ 保存当前阶段、母版结构基线、已确认修改单和下一步建议，避免靠聊天上下文记进度。
- mapping/ 保存响应矩阵、替换规则、残留扫描词和量化数据来源。
- change-sets/ 保存分章修改单；未确认的修改单不得写入 Word。
- output/ 只保存阶段版 Word、候选版 Word、扫描报告、验证报告和人工复核交接。

## 五、面向标书编制者的七步操控

对外只暴露中文业务动作；对内再映射为稳定阶段。用户不需要说英文命令，也不需要理解 Runtime、OpenXML 或状态文件。

| 顺序 | 标书编制者动作 | 内部阶段 | 阶段成果 | 是否输出完整 docx |
|---|---|---|---|---|
| 1 | 盘点母版 / 检查这份历史标书 | inspect-template | 母版结构摘要、可改写性判断、旧项目残留线索 | 否 |
| 2 | 建立响应矩阵 / 对照评分办法 | build-response-matrix | 评分点到章节映射、资料缺口、人工复核项 | 否 |
| 3 | 整理替换清单 / 替换项目基础信息 | build-replacement-map | 项目基础信息替换表、残留扫描词、量化数据来源 | 否 |
| 4 | 生成第 X 章修改单 / 先改第 X 章 | draft-change-set | Change Set 修改单、来源依据、风险项 | 否 |
| 5 | 把已确认修改写入 Word / 生成阶段版 | apply-change-set | 阶段版 Word、写入报告、已应用修改单清单 | 是，阶段版 |
| 6 | 扫描旧项目残留 / 查残留 | scan-residuals | 残留扫描报告、明确错误、疑似通用术语 | 否 |
| 7 | 生成候选版 / 出复核清单 | release-candidate | 候选版 Word、验证报告、人工复核交接 | 是，候选版 |

每轮输出必须带一个简短进度块：

```text
当前动作：
已完成：
待确认：
下一步建议：
当前不能做的事：
```

### 1. 盘点母版

触发说法：盘点母版、检查历史标书、看看这份 Word 能不能保真改。

读取 Word 母版并输出结构摘要：

- 段落数量、表格数量、图片 / inline shapes 数量、媒体文件数量。
- 页眉页脚、图片说明元数据和正文 XML 是否可扫描。
- 旧项目绑定词、旧日期、旧地点、旧设备、旧工程量、旧特殊章节。
- 模板是否适合继续走保真改写；不适合时停止并说明原因。

本阶段不得改写正文，不得生成阶段版 Word。

### 2. 建立响应矩阵

触发说法：建立响应矩阵、对照评分办法、看看评分点怎么覆盖。

使用 aios-tender-audit 先建立响应矩阵：

- 评分项 / 格式项。
- 招标文件关注点。
- 模板中可承接的位置。
- 状态：已覆盖 / 需改写 / 需补资料 / 需人工复核。

带星或高权重评分项不能只靠模板继承，必须明确对应章节和资料依据。本阶段不得写入 Word。

### 3. 整理替换清单

触发说法：整理替换清单、替换项目基础信息、先把旧项目名和基础信息列出来。

输出 replacement map 和 residual terms，至少覆盖：

- 项目名称、招标人、建设地点、工程规模、承包范围。
- 工期、计划开竣工日期、质量目标、安全文明目标。
- 旧项目地点、旧楼栋编号、旧工程量、旧设备型号、旧日期。
- 页眉页脚、表格单元格、图片说明元数据中的旧项目词。
- 可写入的量化数据及其来源：文件名、页码、清单编号或条款位置。

没有来源的数据不能写成确定事实，只能写成待补或人工复核项。本阶段不得大段改写章节。

### 4. 生成第 X 章修改单

触发说法：生成第 X 章修改单、先改第 X 章、给我修改单不要写入 Word。

修改单是写入 Word 前的控制单元，推荐格式：

```yaml
id: CS-001
chapter: 第三章 施工部署
target_range: 3.1-3.3
change_type: rewrite_section
source:
  - 招标文件: 技术标评分办法第 X 条
  - 本项目资料: project-basic-info.md
status: pending_review
apply_to_docx: false
risk:
  - 人员证书需人工核验
  - 设备型号未提供来源
```

本阶段只输出修改单、来源依据、风险项和是否可写入 Word，不得直接修改 docx。

### 5. 把已确认修改写入 Word

触发说法：把已确认修改写入 Word、生成阶段版、应用 CS-001。

只允许写入 status: approved 或用户明确确认的 Change Set。输出：

- 阶段版 docx 路径。
- 已应用 Change Set 清单。
- 未应用 Change Set 清单及原因。
- 写入报告：替换次数、章节写入位置、无法写入项。

本阶段输出的是阶段版，不是最终定稿；必须进入残留扫描。

### 6. 扫描旧项目残留

触发说法：扫描旧项目残留、查残留、看看还有没有旧项目词。

对输出 docx 做残留扫描，至少覆盖：

- 正文 XML。
- 表格单元格。
- 页眉页脚。
- 图片说明、alt text、media 关系元数据。
- 旧项目名、旧地点、旧日期、旧楼栋编号、旧设备型号、旧工程量和旧特殊章节。

残留扫描报告应区分：明确错误、疑似通用术语、未命中。本阶段只扫描和报告，不顺手重写正文。

### 7. 生成候选版和复核清单

触发说法：生成候选版、出复核清单、形成可人工终审版本。

只有在响应矩阵、替换清单、已确认 Change Set、残留扫描和验证报告都有记录时，才能生成候选版输出：

- 候选版 docx 路径。
- 验证报告：paragraphs、tables、inline_shapes、media_parts、current_project_hits、old_project_hits、residual_hits。
- 人工复核清单：页数、目录、页眉页脚、编号、图片、表格、分页、人员证书、业绩、设备、报价一致性。
- 不能由 AI 自动确认的事项。

候选版不等于正式投标定稿，不替代投标负责人、技术负责人、经营、法务、造价或单位签章流程。

## 六、输出契约

本 workflow 的输出分为三类，不要求每一轮都输出完整 docx。

### 控制成果

- progress.md：当前动作、已完成、待确认、下一步建议、当前不能做的事。
- response-matrix.md：评分点到章节映射、资料缺口和人工复核项。
- replacement-map.json：项目基础信息替换表、替换来源和残留扫描词。
- change-sets/CS-xxx.yaml：分章修改单、来源依据、风险项和写入状态。

### 验证成果

- residual-scan.md：旧项目残留命中、疑似通用术语和未命中说明。
- verification-report.md：paragraphs、tables、inline_shapes、media_parts、current_project_hits、old_project_hits、residual_hits。
- review-handoff.md：投标负责人、技术负责人、经营、法务、造价和资料员需要人工复核的事项。

### 文档成果

- draft-v1.docx：只在已确认 Change Set 写入后生成，属于阶段版。
- candidate-v1.docx：只在响应矩阵、替换清单、残留扫描和验证报告齐备后生成，属于候选版。
- 不输出最终定稿、盖章版、报价承诺或投标决策结论。

## 七、停止条件

遇到以下情况，应停止生成改写版 Word，只输出待补资料和复核建议：

- 没有可读取的 Word 母版。
- 缺少本项目招标文件、评分办法或基础工程信息。
- 用户要求保留格式，但模板结构严重损坏或无法解析。
- 旧项目残留词无法建立扫描清单。
- 用户要求自动填写真正投标人员、证书、业绩、设备、报价或最终承诺，但未提供可验证依据。

## 八、产品化边界

短期应作为 aios-tender-write 的一种模式，而不是新建大量技能名：

```text
aios-tender-write
  mode: markdown-workbench
  mode: docx-preserve-rewrite
```

长期可以沉淀为 DOCX Reference Runtime：

- docx.inspect：读取母版结构和媒体资源。
- docx.rewrite_text：按 replacement map 保真替换文本。
- docx.rewrite_sections：对指定章节做受控改写。
- docx.scan_residuals：扫描旧项目残留。
- docx.verify_layout：输出结构指标和人工复核清单。

AIOS 的职责是把写作判断、证据矩阵、替换计划和验证门禁组织好；最终 docx 成品仍必须由投标团队人工定稿。