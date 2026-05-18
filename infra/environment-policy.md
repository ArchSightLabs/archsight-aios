# Environment Policy

## 目标

AIOS 的本地、用户级和远程运行环境必须边界清晰。

## 环境层级

| 层级 | 说明 |
| --- | --- |
| Repo | 当前 AIOS 仓库 |
| User Store | `~/.archsight-aios/` |
| Project | 业务项目工作区 |
| Remote Runtime | Hermes / 飞书 / Gateway |

## 规则

- 安装命令只能写用户级资产目录和目标助手配置。
- 项目模板只能写目标项目缺失文件。
- 远程 Runtime 不直接替代本地测试和构建。

