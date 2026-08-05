// 站点源。astro.config.mjs 无法 import .ts，所以域名单独放这里，
// 由 src/consts.ts 再 re-export 给应用代码，保证全站只有这一个真相来源。
//
// TODO(上线前): 替换为真实域名。scheme + host，不带路径不带尾斜杠。
export const SITE_ORIGIN = 'https://example.com';
