# Pi 订阅额度栏 · 精简单行版

基于 [specode/pi-subscription-usage](https://github.com/specode/pi-subscription-usage) **1.5.0** 的定制版。保留上游额度查询、缓存、账号验证和 `/usage` 功能，将默认 footer 改为更直观的中文单行展示。

```text
5小时 ███░░░░░ 剩余32% · 13:20重置  |  7天 █░░░░░░░ 剩余12% · 11/05 14:41重置
```

- 8 格短进度条，默认明确显示「剩余」百分比。
- 重置时间采用电脑本地时区：当天仅显示时分，跨天显示月日和时分。
- 状态文字使用 Pi 原生 footer 同款 `dim` 主题色。
- 字体、字号由终端控制，不额外加粗或放大。
- 不替换 Pi 整个 footer，不影响 token、费用、模型等原有信息。
- 额度信息保持单行；终端过窄时由 Pi 原生 footer 截断显示。

## 在其他电脑安装

需要已安装 [Pi](https://github.com/earendil-works/pi)。本次定制所用 Pi 版本为 **1.4.0**，其他版本需自行验证兼容性。

在终端执行：

```bash
pi install git:github.com/leiyihai/pi-subscription-usage
```

如果已安装原版，请先移除，避免重复加载 `/usage` 和额度状态：

```bash
pi remove npm:@specode/pi-subscription-usage
```

如果先前在 `~/.pi/agent/settings.json` 中配置过本地副本，例如 `./local/pi-subscription-usage`，也请移除该条目，只保留本仓库的安装来源。

然后在 Pi 中执行：

```text
/reload
```

每台电脑在 Pi 中自行通过 `/login` 登录，**不需要也不要复制其他电脑的 `auth.json`**。

### OpenAI 登录说明

继承上游行为：使用 OpenAI（ChatGPT）模型时，额度查询需要同一 ChatGPT 账号、同一 workspace 的 `OpenAI Codex (legacy)` 登录。具体步骤见[上游中文说明](./README.zh-CN.md)。

上游还支持 Codex、OpenCode Go、xAI Grok、Kimi Coding、Antigravity 和 Claude（部分需要额外扩展）；本次修改仅针对显示，未逐一实测所有服务。

### 手动复制安装

也可以将本仓库复制到：

```text
~/.pi/agent/local/pi-subscription-usage
```

在 `~/.pi/agent/settings.json` 已有的 `packages` 数组中加入：

```json
"./local/pi-subscription-usage"
```

保留其他配置，移除其他来源的同款插件，再执行 `/reload`。此插件无需单独编译或执行 `npm install`。

## 使用与配置

- footer 显示当前模型对应的额度。
- `/usage` 查看完整额度明细，并主动刷新查询；Claude 仅使用桥接扩展上报的数据。
- 继承上游缓存和约 5 分钟自动刷新机制。
- **注意：** 若账号有可用的额度重置券，`/usage` 可能提供兑换选项；只有手动确认后才会兑换。

默认显示剩余额度。若需显示已用额度，在 `~/.pi/agent/subscription-usage.json` 中配置：

```json
{
  "displayMode": "used"
}
```

修改后执行 `/reload`。进度条、百分比及「已用/剩余」文字会同步切换。

## 隐私与安全

- 本仓库仅包含插件源码、测试、文档和许可证，不包含个人 Pi 配置、登录凭据、会话记录或真实额度数据。
- `.gitignore` 已忽略常见凭据文件、环境变量、私钥、个人配置目录、依赖和缓存。
- 插件运行时通过 Pi 提供的登录状态访问服务商接口；请在各台电脑独立登录。
- `.gitignore` 不是敏感信息检测器，新增文件时仍应检查是否含有 token、Cookie、账号信息或私钥。

## 开发

需要支持原生 TypeScript 的 Node.js（本次测试使用 Node.js 24）。

```bash
npm test
```

当前仓库包含 6 项本地显示测试，覆盖单行布局、已用/剩余、极值、重置时间以及状态事件兼容性，**不是上游完整测试套件或真实服务商集成测试**。

修改说明见 [LOCAL-CHANGES.md](./LOCAL-CHANGES.md)。上游原始文档保留在 [README.upstream.md](./README.upstream.md) 和 [README.zh-CN.md](./README.zh-CN.md)，其中原版安装地址和显示样式不代表本定制版。

## 来源与许可证

本项目基于 `@specode/pi-subscription-usage@1.5.0`，并非从零编写。

保留上游 [MIT 许可证](./LICENSE)及[第三方声明](./THIRD_PARTY_NOTICES.md)。本定制版没有发布到上游 npm 包，推荐通过本仓库 Git 地址安装。
