import { defineWranglerConfig } from "wrangler/experimental-config";

// cf 的构建设置（由 `cf migrate` 生成）。
//
// 这里不能用 `cf build`：它检测到 Astro 就只跑 `astro build`（跳过 pnpm build
// 里的字体检查、产物校验和 pagefind），而无适配器的静态 Astro 不产出 Build
// Output，cf 官方文档也写明 Astro 6+ 在 beta 期间不能用 cf 构建。所以先
// `pnpm build` 生成 ./dist，再由 `pnpm cf:output`（Wrangler 的 cf 构建入口）
// 按下面的 assetsDirectory 把它打包进 .cloudflare/output/v0/，最后
// `cf deploy --prebuilt` 发布这份产物。
export default defineWranglerConfig({
	types: {
		generate: false,
	},
	assetsDirectory: "./dist",
});
