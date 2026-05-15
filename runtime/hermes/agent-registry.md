# Hermes Agent Registry

## 定位

本文件定义 Hermes 中应创建哪些 Agent，以及它们从仓库哪里同步运行时 System Prompt。

Hermes Agent 是部署实例，不是角色资产源。

## Source / Runtime / Instance

| 层 | 内容 | 位置 |
| --- | --- | --- |
| Source | 角色资产包 | `agents/{agent}/` |
| Runtime | Hermes 使用的系统提示词 | `agents/{agent}/system-prompt.md` |
| Instance | Hermes Agent / 飞书机器人 | Hermes 控制台或运行配置 |

## 第一阶段 Agent

| Hermes Agent | Source | Runtime Prompt |
| --- | --- | --- |
| Atlas | `agents/atlas/` | `agents/atlas/system-prompt.md` |
| Mason | `agents/mason/` | `agents/mason/system-prompt.md` |
| Argus | `agents/argus/` | `agents/argus/system-prompt.md` |
| Vitruvius | `agents/vitruvius/` | `agents/vitruvius/system-prompt.md` |
| Daedalus | `agents/daedalus/` | `agents/daedalus/system-prompt.md` |
| Hephaestus | `agents/hephaestus/` | `agents/hephaestus/system-prompt.md` |

## 创建规则

- Hermes 创建 Agent 时只复制 `system-prompt.md`。
- 不让 Hermes 自由读取整个角色文件夹。
- 修改角色时，先改仓库 Source，再同步 Runtime Prompt。
- 飞书机器人只绑定 Hermes Agent，不承载复杂角色定义。

## 变更记录

每次同步 Hermes Agent，应记录：

```text
Agent：
Source commit：
Prompt path：
同步时间：
同步人：
变更摘要：
回滚方式：
```

