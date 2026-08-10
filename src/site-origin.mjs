// 站点源。astro.config.mjs 无法 import .ts，所以域名单独放这里，
// 由 src/consts.ts 再 re-export 给应用代码，保证全站只有这一个真相来源。
export const SITE_ORIGIN = 'https://ben-chen.com';
