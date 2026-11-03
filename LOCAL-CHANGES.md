# 定制修改说明

基于 `@specode/pi-subscription-usage@1.5.0` 的 npm 发布源码，保留原插件的查询、缓存、状态事件及 `/usage` 功能。

## 功能修改

- `src/status.ts`：默认 footer 额度显示改为中文单行、8 格进度条、明确的剩余/已用百分比、本地重置时间。
- 当天重置仅显示时分，跨天加上月日；已过期显示「待刷新」。
- `src/usage.ts`：状态文字使用 `ctx.ui.theme.fg("dim", value)`，与 Pi 原生 footer 的颜色一致；字体和字号沿用终端设置。
- 对外状态事件的紧凑英文标签和倒计时格式保持原样，兼容现有消费者。
- `test/status.test.ts`：新增 6 项显示测试，使用 `npm test` 运行。

## 仓库整理

- README 补充本仓库安装地址、跨电脑迁移方法、安全说明与测试范围。
- 上游原始英文和中文说明分别保留在 `README.upstream.md` 和 `README.zh-CN.md`。
- 保留原作者、MIT 许可证和第三方声明。
- `package.json` 更新仓库链接，设置 `private: true` 防止误发布到 npm；包名保留上游标识用于说明来源。
- `.gitignore` 排除常见个人配置、凭据、依赖、缓存和日志。

## 更新与恢复

Git 安装后可以通过 Pi 的包更新机制同步本仓库。本仓库不会自动合并上游更新，升级上游版本时需要手动合并显示改动并重新测试。

要恢复上游版，先移除本仓库来源，再安装：

```bash
pi remove git:github.com/leiyihai/pi-subscription-usage
pi install npm:@specode/pi-subscription-usage
```

然后在 Pi 中执行 `/reload`。不要同时加载上游版与定制版。
