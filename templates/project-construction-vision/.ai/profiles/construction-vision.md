# 建筑施工视觉 AI 项目规则

## 适用项目

用于施工现场图像、视频、点云、目标检测、图像分割、缺陷识别、焊缝检测、裂缝检测、深度估计和现场质量巡检相关项目。

## 必读上下文

- `.ai/ARCHSIGHT_AIOS_RULES.md`
- `.ai/project-context.md`
- `.ai/agent-routing.md`
- `.ai/skills.md`
- `.ai/workflows.md`
- 数据集说明、标注规范、模型评估报告、样例图片和人工复核规则。

## 默认关注点

- 数据来源、拍摄条件、标注口径、类别定义和隐私处理。
- YOLO、SAM / Segment Anything、实例分割、语义分割、深度估计、OCR、点云融合等模型边界。
- 误检、漏检、遮挡、反光、低照度、模糊、尺度变化和现场环境差异。
- 推理结果的置信度、人工复核、缺陷严重度和工程责任边界。

## 推荐路由

| 任务 | 首选 Agent / Skill |
| --- | --- |
| 模型方案、数据闭环、评估指标 | Daedalus / `aios-runtime-design` |
| 建筑构件、施工工艺、缺陷语义 | Vitruvius / `aios-building-knowledge` |
| 训练脚本、推理服务、评估工具 | Hephaestus / `aios-controlled-execution` |
| 系统边界、边缘部署、数据流 | Atlas / `aios-architecture-review` |
| 代码、安全、依赖和发布风险 | Argus / `aios-code-review` |

## 验收要求

- 数据集必须说明来源、授权、类别、规模和划分方式。
- 模型输出必须包含置信度、阈值、失败样例和人工复核策略。
- 工程缺陷结论必须区分模型检测、规则推断和人工确认。
- 不在缺少标注规范和评估集时声称检测能力达标。

