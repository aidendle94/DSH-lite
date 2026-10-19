# DSH-lite

English | [中文](README.zh.md)

DSH-lite (`dsh`) is a fork of [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness), the MIT-licensed DeepSeek Harness agent harness developed by DeepSeek AI. It removes every code path that sends user data to DeepSeek-operated servers, so you can run the harness against your own model provider. DSH-lite is not affiliated with or endorsed by DeepSeek.

The removed components are DeepSeek telemetry and product analytics, feedback-triggered and per-request Session-log upload, DeepSeek account sign-in, DeepSeek web search, mainland China mirror fallbacks, and the Desktop auto-updater with its mandatory-update policy. Everything else keeps the upstream **everything-is-a-plugin** architecture powered by [Cordis](https://github.com/cordiverse/cordis), whose design is described in [_A Programming Paradigm for Spatiotemporal Composability_](https://arxiv.org/abs/2608.25512).

## What was removed

| Component | What it sent | Where |
|---|---|---|
| Session telemetry OTel backend (`session-telemetry-otel`) and the shared OTel service (`telemetry/otel`) | The canonical Session log up to each recorded feedback item, including context and verbatim notes, with the anonymous installation id | `dsh-otel-collector.deepseeksvc.com`, or `DSH_TELEMETRY_OTLP_URL` |
| Product telemetry (`product-telemetry-otel`) and Desktop product analytics (`product-analytics`) | Desktop interaction events with device id, account user id, app version, and environment fields | `dsh-otel-collector.deepseeksvc.com` |
| Session-log upload (`session-log-deepseek`) and the request-extension registry (`deepseek-llm-api-extensions`) | The incremental Session log as the `dsh_session_log` field on every eligible request, on by default | DeepSeek official API (`api.deepseek.com`) |
| Plugin package inventory (`plugin-package-inventory-deepseek`) | The active plugin package list as the `dsh_plugin_packages` request field | DeepSeek official API |
| Anonymous user id header | The `x-deepseek-harness-user-id` header on every DeepSeek provider request | DeepSeek official API |
| DeepSeek web search and fetch (`web-search-deepseek`, `web-deepseek-api`, `ui-settings-web-search`) | `web_search` queries and fetched URLs | `api.deepseek.com` Messages, Search, and Fetch APIs |
| DeepSeek account (`deepseek-account`, `deepseek-account-platform`, `llm-deepseek-account`, `account-controller`, `ui-settings-account`, `ui-settings-session-log`) and the Desktop welcome sign-in and embedded Platform view | Sign-in grants, profile, balance, and bonus queries, with client version, locale, and timezone | `platform.deepseek.com` and `api.deepseek.com` |
| Desktop auto-updater and mandatory-update policy | Update and policy checks with platform and client version, and installer downloads | `download.deepseek.com` and the configured policy service |
| Plugin-manager mirror fallback | Registry pings, package metadata, and installs | `registry.npmmirror.com` |
| SenseVoice model mirror | Speech model downloads | `hf-mirror.com` |

Feedback you give in the UI is still recorded in the local Session log, but nothing uploads it. Web search now selects the single usable provider a profile mounts, such as Exa or Perplexity; `web_fetch` uses the local HTTP fetch provider. Desktop starts directly in the workspace, without sign-in.

## Developer preview

The upstream project is in _developer preview_ and iterating rapidly, and DSH-lite follows it. **THERE WILL BE COMPATIBILITY-BREAKING CHANGES.**

Review the [safety notice](SAFETY.md) before running the project.

## Run

The `@deepseek-ai/dsh` npm package is the upstream build and still contains the removed components, so run DSH-lite from source.

### Run from source

To run from a repository checkout:

```sh
git clone <DSH-lite repository URL> DSH-lite
cd DSH-lite
pnpm install
pnpm run build
pnpm dsh web
```

`pnpm run build` prepares the repository artifacts. `pnpm dsh web` uses those built artifacts without rebuilding. The Web UI starts at `http://127.0.0.1:3080` by default and opens in the default browser for a local launch. An SSH launch only prints the host URL because the SSH client or editor owns the local forwarded address. Pass `--no-open` to run the server without opening a browser. See [Web UI guide](docs/user/guide/index.md).

## Using your own provider

Open **Settings → Models** and choose **Add model provider**. Pick a built-in provider such as `anthropic`, `openai`, `moonshotai`, or `zai` and enter its API key, or switch to **Custom model API** for a gateway or self-hosted server that speaks OpenAI Chat Completions, OpenAI Responses, or Anthropic Messages. The page writes the `llm-pi-ai` entry of `$DSH_HOME/profiles/<profile>/cordis.patch.yml`, which you can also edit directly; see the [model configuration guide](docs/user/guide/providers.md) and the [`dsh-llm-pi-ai` reference](packages/llm/llm-pi-ai/README.md).

The DeepSeek card and `DEEPSEEK_API_KEY` remain supported but are optional. DSH-lite contacts DeepSeek only when you configure a DeepSeek key.

## Upstream

DSH-lite tracks [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness). The [upstream documentation site](https://deepseek-harness.github.io/deepseek-harness/) also describes the components removed here; the documentation in this repository describes DSH-lite.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Development

Start with the [development guide](docs/development.md) and [architecture documentation](docs/architecture.md).

`pnpm run dev:web` builds, serves, and rebuilds client bundles on source edits in one terminal, and `make help` lists the matching Make targets for Web and Desktop; the guide's application commands section owns the full table.

For agents, follow [AGENTS.md](AGENTS.md).

## Citation

DSH-lite is derived from DeepSeek Harness. Cite the upstream project:

```bibtex
@misc{deepseek-harness2026,
  title={DeepSeek Harness: Everything is a Plugin},
  author={DeepSeek-AI},
  year={2026},
  publisher={GitHub},
  howpublished={\url{https://github.com/deepseek-ai/deepseek-harness}},
}
```

## License

[MIT](LICENSE). DSH-lite retains the upstream copyright and license notice.

Third-party dependencies and their licenses are disclosed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
