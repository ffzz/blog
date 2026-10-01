import { defineConfig } from "cf/config";

// 由 `cf migrate` 从 wrangler.jsonc 生成，取代它成为 cf 的部署配置。
//
// compatibilityDate 锁定 Workers 运行时的兼容性行为，改动会影响已上线的
// 行为——这是首次部署的当天日期，之后不要再改。
//
// 现在只发布纯静态站点（静态资源目录在 wrangler.config.ts 里）。以后要开
// 邮件订阅时，照 PRD/2026-08-06-launch-checklist.md 的 C1–C3 把入口
// （entrypoint）、KV/变量绑定（env）和 assets.runWorkerFirst 加到 worker 里。
export default defineConfig({
	accountId: "cd0014ca621ea6587554ab4cc4e02e45",
	worker: {
		name: "personal-blog",
		compatibilityDate: "2026-08-09",
	},
});
