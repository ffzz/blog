import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 两个 collection 共用的 frontmatter 契约。
 *
 * `description` 强制必填 —— 它直接作为 meta description 和 OG description 输出，
 * 缺失是最常见的 SEO 失分点，用默认值兜底只会让问题静默。
 */
const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  heroImage: z.string().optional(),
  draft: z.boolean().default(false),
});

export type PostData = z.infer<typeof postSchema>;

/**
 * 目录结构即语言归属：`posts/zh/foo.md` 存在就有中文版，不存在就没有。
 * 不设 translationKey 字段 —— 同名 slug 即互为翻译。PRD §5.1 / §6。
 *
 * glob loader 生成的 id 形如 `zh/foo`，由 src/lib/i18n.ts 负责拆分。
 */
const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: postSchema,
});

const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.{md,mdx}' }),
  schema: postSchema,
});

/**
 * 固定页面的正文（/about，以及 P4 的 /privacy）。
 *
 * 不做成 .astro 里的硬编码文案：这些是作者撰写的内容，
 * 接入 CMS 后应当和文章一样可在后台编辑，否则它们会成为
 * 全站唯一改不了的页面。
 */
const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = { posts, notes, pages };
