# Hermes Sync Policy

## 目标

Hermes Agent 的运行时 Prompt 必须从仓库受控资产同步，避免控制台漂移。

## 本地流程

1. 修改 `agents/{agent}/` Source 文件。
2. 更新 `agents/{agent}/system-prompt.md`。
3. 运行 `archsight-aios hermes:validate`。
4. 运行 `archsight-aios hermes:sync-dry-run`。
5. 人工或外部集成执行真实同步。
6. 按 `sync-record-template.md` 记录同步结果。

## 漂移检测

本地 `hermes:detect-drift` 只检查仓库内 Source / Runtime Prompt 的可同步状态。真实 Hermes 控制台漂移检测需要未来接入 API 后补充。

