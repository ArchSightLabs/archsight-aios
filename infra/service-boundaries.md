# Service Boundaries

## 当前边界

| 服务 | 职责 |
| --- | --- |
| AIOS Repo | 规范、Agent、Skill、Workflow、Runtime 资产 |
| User Store | 安装后的共享资产副本 |
| Business Project | 真实代码、测试、构建和交付 |
| Hermes | Agent 实例和异步任务调度 |
| Feishu | 协作入口和通知入口 |

## 禁止混淆

- 不把 AIOS 仓库当作业务项目。
- 不把飞书消息当作完整工程上下文。
- 不把 Hermes Prompt 当作唯一资产源。

