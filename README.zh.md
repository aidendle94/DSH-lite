# DSH-lite

[English](README.md) | 中文

DSH-lite（`dsh`）是 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 的分支（fork）；上游 DeepSeek Harness 是由 DeepSeek AI 开发、以 MIT 许可证发布的 agent harness（智能体框架）。DSH-lite 移除了所有向 DeepSeek 运营的服务器发送用户数据的代码路径，便于你搭配自己的模型提供商使用。DSH-lite 与 DeepSeek 无隶属关系，也未获 DeepSeek 背书。

被移除的组件包括：DeepSeek 遥测与产品分析、由反馈触发及随每次请求进行的 Session 日志上传、DeepSeek 账号登录、DeepSeek 网页搜索、中国大陆镜像兜底，以及 Desktop 自动更新器及其强制更新策略。其余部分保留上游**一切皆插件**的架构，由 [Cordis](https://github.com/cordiverse/cordis) 驱动，其设计参见论文 [_A Programming Paradigm for Spatiotemporal Composability_](https://arxiv.org/abs/2608.25512)。

## 移除内容

| 组件 | 发送的内容 | 发送目标 |
|---|---|---|
| Session 遥测 OTel 后端（`session-telemetry-otel`）与共享 OTel 服务（`telemetry/otel`） | 截至每条已记录反馈的权威 Session 日志，包括上下文与逐字备注，并附带匿名安装 ID | `dsh-otel-collector.deepseeksvc.com`，或 `DSH_TELEMETRY_OTLP_URL` |
| 产品遥测（`product-telemetry-otel`）与 Desktop 产品分析（`product-analytics`） | Desktop 交互事件，附带设备 ID、账号用户 ID、应用版本和环境字段 | `dsh-otel-collector.deepseeksvc.com` |
| Session 日志上传（`session-log-deepseek`）与请求扩展注册表（`deepseek-llm-api-extensions`） | 以 `dsh_session_log` 字段随每个符合条件的请求发送的增量 Session 日志，默认开启 | DeepSeek 官方 API（`api.deepseek.com`） |
| 插件包清单（`plugin-package-inventory-deepseek`） | 以 `dsh_plugin_packages` 请求字段发送的活动插件包列表 | DeepSeek 官方 API |
| 匿名用户 ID 请求头 | 每个 DeepSeek 提供商请求上的 `x-deepseek-harness-user-id` 请求头 | DeepSeek 官方 API |
| DeepSeek 网页搜索与抓取（`web-search-deepseek`、`web-deepseek-api`、`ui-settings-web-search`） | `web_search` 查询与抓取的 URL | `api.deepseek.com` 的 Messages、Search 与 Fetch API |
| DeepSeek 账号（`deepseek-account`、`deepseek-account-platform`、`llm-deepseek-account`、`account-controller`、`ui-settings-account`、`ui-settings-session-log`），以及 Desktop 欢迎页登录与内嵌 Platform 视图 | 登录授权、个人资料、余额与赠金查询，附带客户端版本、语言区域和时区 | `platform.deepseek.com` 与 `api.deepseek.com` |
| Desktop 自动更新器与强制更新策略 | 附带平台与客户端版本的更新及策略检查，以及安装包下载 | `download.deepseek.com` 与配置的策略服务 |
| 插件管理器镜像兜底 | Registry 探测、包元数据与安装 | `registry.npmmirror.com` |
| SenseVoice 模型镜像 | 语音模型下载 | `hf-mirror.com` |

你在界面中提交的反馈仍会记录到本地 Session 日志，但不会被上传。网页搜索现在会选用 profile 挂载的唯一可用提供商，例如 Exa 或 Perplexity；`web_fetch` 使用本地 HTTP 抓取提供商。Desktop 启动后直接进入工作区，无需登录。

## 开发者预览

上游项目处于 _开发者预览_ 阶段，正在快速迭代，DSH-lite 随之跟进。**未来将出现破坏兼容性的变更。**

运行本项目前，请阅读[安全说明](SAFETY.zh.md)。

<a id="run"></a>

## 运行

`@deepseek-ai/dsh` npm 包是上游构建，仍包含被移除的组件，因此请从源码运行 DSH-lite。

<a id="run-from-source"></a>

### 从源码运行

如需从仓库源码运行：

```sh
git clone https://github.com/aidendle94/DSH-lite.git
cd DSH-lite
pnpm install
pnpm run build
pnpm dsh web
```

`pnpm run build` 会准备仓库产物。`pnpm dsh web` 会直接使用这些已构建产物，不会重新构建。Web UI 默认在 `http://127.0.0.1:3080` 启动，本机启动时还会用默认浏览器打开页面。通过 SSH 启动时只打印宿主机 URL，因为本地转发地址由 SSH 客户端或编辑器持有。传入 `--no-open` 可仅运行服务器而不打开浏览器。详见 [Web UI 指南](docs/user/guide/index.zh.md)。

## 使用你自己的提供商

打开**设置 → 模型**并选择**添加模型提供商**。选取 `anthropic`、`openai`、`moonshotai` 或 `zai` 等内置提供商并输入其 API 密钥；对于使用 OpenAI Chat Completions、OpenAI Responses 或 Anthropic Messages 协议的网关或自托管服务器，可切换到**自定义模型 API**。该页面会写入 `$DSH_HOME/profiles/<profile>/cordis.patch.yml` 中的 `llm-pi-ai` 条目，你也可以直接编辑该文件；参见[模型配置指南](docs/user/guide/providers.zh.md)与 [`dsh-llm-pi-ai` 参考](packages/llm/llm-pi-ai/README.zh.md)。

DeepSeek 卡片和 `DEEPSEEK_API_KEY` 仍受支持，但均为可选。只有在你配置了 DeepSeek 密钥时，DSH-lite 才会连接 DeepSeek。

## 上游

DSH-lite 跟踪 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)。[上游文档站点](https://deepseek-harness.github.io/deepseek-harness/)也描述了此处已移除的组件；本仓库中的文档描述的是 DSH-lite。

## 参与贡献

参见 [CONTRIBUTING.md](CONTRIBUTING.zh.md)。

## 开发

请先阅读[开发指南](docs/development.zh.md)与[架构文档](docs/architecture.zh.md)。

`pnpm run dev:web` 会在一个终端里完成构建、启动，并在源码修改时重建 client bundle；`make help` 列出 Web 与 Desktop 对应的 Make target。完整表格见开发指南的「应用命令」一节。

面向 agent：请遵循 [AGENTS.md](AGENTS.md)。

## 引用

DSH-lite 派生自 DeepSeek Harness。请引用上游项目：

```bibtex
@misc{deepseek-harness2026,
  title={DeepSeek Harness: Everything is a Plugin},
  author={DeepSeek-AI},
  year={2026},
  publisher={GitHub},
  howpublished={\url{https://github.com/deepseek-ai/deepseek-harness}},
}
```

## 许可证

[MIT](LICENSE)。DSH-lite 保留上游的版权与许可声明。

第三方依赖及其许可证见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
