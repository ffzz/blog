import type { Locale } from '../consts';

/**
 * 简历页的全部内容。/resume 与 /zh/resume 唯一的数据来源。
 *
 * ── 为什么内容在这里而不在 content collection ──────────────────
 * 其他固定页面（/about、/privacy）的正文走 Markdown，因为它们就是散文。
 * 简历不是：甘特图要算日期、技术栈条要算年限、数字卡要对齐 —— 这些是
 * 结构化数据，塞进 Markdown 只能靠约定俗成的格式再解析回来。所以这里
 * 直接用带类型的对象，Resume.astro 只负责画。
 *
 * ── 两条必须遵守的纪律 ────────────────────────────────────────
 *
 * 1) 中文标题必须写在 `title` / `heading` 键下。
 *    scripts/heading-font.mjs 会扫这个文件的这两个键，把中文字收进
 *    标题衬线的字体子集。写在别的键里、或者硬编码进 .astro，字体子集
 *    就漏掉它们 —— 页面上中文标题会掉回系统字体（Android 上直接掉到
 *    无衬线，标题和正文再无区分）。而 `npm run fonts:check` 不会报错，
 *    因为它和采集共用同一套逻辑，采不到就无从发现。
 *    改完这个文件跑一次 `npm run fonts`，把重新生成的子集一起提交。
 *
 * 2) 事实边界不得放大。
 *    素材源是 jobs-application/.claude/skills/job-application-assistant/
 *    references/candidate-persona.md，那份档案里写明了哪些话不能说：
 *    hybrid-rag-service 没有付费客户/生产流量（状态词固定 in development）、
 *    诊所站点是「AI 辅助交付、工程判断在人这边」而不是「AI 建的」、
 *    Small Business PEAK 只能说建了其中的检索增强聊天机器人而不是整个平台、
 *    PicPolisher 不引用自有站点的营销数字（自述、不可验证、面试会被追问）。
 *    这些不是措辞偏好，是面试时会被逐条追问的东西。
 *
 * ── 联系方式 ──────────────────────────────────────────────────
 * 只放站内邮箱与两个公开主页，不放手机号 —— 这一页是公开可访问的，
 * 电话号码放上去就会被爬去做垃圾短信和诈骗。需要的人可以邮件索取。
 */

/** 一段经历。`start`/`end` 用 `YYYY-MM`，`end` 为 null 表示至今。 */
export interface TimelineItem {
  org: string;
  role: string;
  city: string;
  start: string;
  end: string | null;
  /** 收起状态下显示的一句话。 */
  summary: string;
  /** 展开后的要点。 */
  points: string[];
  /** 当时用的技术栈，展开后以标签形式显示。 */
  stack: string[];
  /** 当前这段经历。甘特图用实心强调色，条目默认展开。 */
  current?: boolean;
}

/**
 * 技术栈的上手年限。用可核实的起止时间，不用自评分数 ——
 * 「React 熟练度 9/10」这种是没法核实也没法追问的，起止年份可以。
 *
 * 用 `YYYY-MM` 而不是整年：整年会系统性地虚报。React 是 2021-11 开始的，
 * 记成 `2021` 就凭空多出 10 个月，几条加起来就是一份不老实的图。
 */
export interface StackItem {
  label: string;
  from: string;
  /** null 表示至今。 */
  to: string | null;
  note: string;
}

export interface StatItem {
  value: string;
  label: string;
}

/** AI 实践的一个案例。 */
export interface AICase {
  name: string;
  /** 状态词。live / in development 之类，直接显示，不做映射。 */
  status: string;
  href?: string;
  /** 收起状态下的一句话结论。 */
  summary: string;
  points: string[];
  stack: string[];
  current?: boolean;
}

/** AI 实践三层模型的一层。 */
export interface AILayer {
  name: string;
  desc: string;
}

export interface ProjectItem {
  name: string;
  status: string;
  href?: string;
  /** 链接上显示的文字。省略协议头，比裸 URL 好读。 */
  hrefLabel?: string;
  desc: string;
  stack: string[];
}

export interface EducationItem {
  school: string;
  degree: string;
  period: string;
}

export interface ResumeContent {
  /** 页面 <title> 与 <h1> 之外的 meta。受 heading-font.mjs 扫描。 */
  title: string;
  description: string;

  name: string;
  positioning: string;
  location: string;
  workRights: string;
  /** 页头的状态徽章。 */
  availability: string;

  /** 章节标题。受 heading-font.mjs 扫描。 */
  heading: {
    stats: string;
    status: string;
    ai: string;
    timeline: string;
    skills: string;
    projects: string;
    education: string;
    contact: string;
  };

  /** 章节下方的一行说明。 */
  kicker: {
    ai: string;
    timeline: string;
    skills: string;
    projects: string;
  };

  ui: {
    downloadResume: string;
    downloadHint: string;
    emailMe: string;
    present: string;
    stackLabel: string;
    /**
     * 四张图的图注。图本身由真实文本构成（CSS 定位的条，不是 SVG 里画的字），
     * 所以不需要 role="img" + <desc> 那套替代文本 —— 那反而会把可读的文本
     * 对屏幕阅读器藏起来。这些字符串是给所有人看的 <figcaption>。
     */
    ganttCaption: string;
    stackCaption: string;
    layersCaption: string;
    pipelineCaption: string;
  };

  status: string[];
  stats: StatItem[];
  aiIntro: string;
  aiLayers: AILayer[];
  aiCases: AICase[];
  /** 混合检索流水线图的节点文字，按顺序。 */
  pipeline: string[];
  timeline: TimelineItem[];
  stacks: StackItem[];
  /** 技术标签网格。分组显示。 */
  toolbox: { group: string; items: string[] }[];
  projects: ProjectItem[];
  education: EducationItem[];
  languages: string[];
}

/** 页面与 PDF 共用的联系方式。两种语言相同，不重复写。 */
export const CONTACT = {
  email: 'hello@ben-chen.com',
  linkedin: 'https://linkedin.com/in/ben-fz-chen',
  linkedinLabel: 'linkedin.com/in/ben-fz-chen',
  github: 'https://github.com/ffzz',
  githubLabel: 'github.com/ffzz',
  /** public/ 下的实际文件名。用描述性文件名，招聘方存到本地时自带身份。 */
  resumePdf: '/Fangzheng-Ben-Chen-Resume.pdf',
} as const;

export const RESUME: Record<Locale, ResumeContent> = {
  en: {
    title: 'Resume',
    description:
      'Fangzheng (Ben) Chen — full-stack engineer in Canberra, building retrieval and LLM systems. Experience, projects, and a downloadable resume.',

    name: 'Fangzheng (Ben) Chen',
    positioning: 'Full-stack engineer who ships AI-backed products end to end',
    location: 'Canberra, ACT, Australia',
    workRights: 'Australian Permanent Resident',
    availability: 'Open to full-time roles — Canberra, Sydney, or remote worldwide',

    heading: {
      stats: 'At a glance',
      status: 'Where I am now',
      ai: 'Working with AI',
      timeline: 'Experience',
      skills: 'Skills and stack',
      projects: 'Selected projects',
      education: 'Education and languages',
      contact: 'Get in touch',
    },

    kicker: {
      ai: 'Three layers of depth, from AI-assisted delivery to retrieval systems I built myself.',
      timeline: 'Five years of production delivery. Open any role for detail.',
      skills: 'Measured in hands-on years rather than self-assigned scores.',
      projects: 'Live URLs where they exist, honest status words where they do not.',
    },

    ui: {
      downloadResume: 'Download resume',
      downloadHint: 'PDF, 2 pages',
      emailMe: 'Email me',
      present: 'Present',
      stackLabel: 'Stack',
      ganttCaption:
        'Five consecutive roles — Shenzhen until 2023, Canberra since. Bar length is time in the role.',
      stackCaption:
        'Bar length is time in production use, taken from the roles above rather than self-assessed.',
      layersCaption:
        'Each layer rests on the one before it. Most AI experience stops at the first two.',
      pipelineCaption:
        'The same shape in both retrieval systems, and the same deliberate constraints: no LangChain, no separate vector database, no Kubernetes. Retrieval runs on PostgreSQL, so a deployment fits inside a customer-controlled environment.',
    },

    status: [
      'Since November 2025 I have been working independently full-time — running a paid AI product that real customers buy, and building a Python retrieval and voice-agent platform alongside it.',
      'Before that I spent two years at a Canberra consultancy delivering client systems, then six months inside a production learning platform. The independent stretch was a deliberate choice: I wanted to own something end to end, including the parts that are nobody’s favourite — billing edge cases, ingestion failures, the third rewrite of a retrieval heuristic.',
      'I am now looking for a full-time engineering role where AI is part of the product rather than a demo. Canberra, Sydney, or remote anywhere in the world — I have worked across time zones before and am set up for it.',
    ],

    stats: [
      { value: '5 yrs', label: 'Shipping production software' },
      { value: '20+', label: 'Client systems delivered' },
      { value: '30.5k', label: 'Lines of Python, 60k lines of tests' },
      { value: 'Gov-funded', label: 'AI chatbot, covered in the press' },
    ],

    aiIntro:
      'I have been building with language models since 2023, before most of the tooling existed. That timing matters: the retrieval systems I have shipped were assembled from parts rather than pulled off a shelf, so I know what each piece is actually doing.',

    aiLayers: [
      {
        name: 'Delivery layer',
        desc: 'AI as a multiplier on my own work — click-through wireframes for client sign-off, AI-assisted implementation, with architecture and review staying mine.',
      },
      {
        name: 'Integration layer',
        desc: 'Amazon Bedrock, OpenAI and Anthropic APIs wired into existing products, inside established permission boundaries and application logic.',
      },
      {
        name: 'Systems layer',
        desc: 'Retrieval built from the parts up — embeddings, hybrid dense and sparse search, rank fusion, cross-encoder reranking, grounding and scope limits.',
      },
    ],

    aiCases: [
      {
        name: 'Small Business PEAK — retrieval-grounded chatbot',
        status: 'Live',
        href: 'https://smallbusinesspeak.org.au/',
        summary:
          'A government-funded chatbot that answers small-business questions about workplace relations law, grounded in a curated regulatory corpus.',
        points: [
          'Built at OPF Consulting for COSBOA, the national peak body for small business, funded by the Australian Government Department of Employment and Workplace Relations through the Productivity Education and Training Fund.',
          'Australian media reported the launch as one of the first times an explicitly AI-powered chatbot was used to explain regulatory change with government backing.',
          'Answers are grounded in a curated corpus through embeddings, retrieval and reranking, so the model stays inside source material rather than generating freely — in a domain where a wrong answer has real compliance cost.',
          'Published scope limits direct users to independent legal advice, the Fair Work Ombudsman, Safe Work Australia and the ATO for specific circumstances.',
          'I built the chatbot and its supporting delivery work, not the whole PEAK platform.',
        ],
        stack: ['Embeddings', 'Retrieval', 'Reranking', 'PHP', 'JavaScript'],
      },
      {
        name: 'AI Front Desk — 24/7 phone agent for small business',
        status: 'In development',
        summary:
          'A voice agent that answers every inbound call and completes bookings end to end. Retrieval is one part of it — the rest is crawling, context compression, per-caller memory, and the guardrails a live phone call needs.',
        points: [
          'Roughly 126,000 lines of TypeScript across 660 files and 472 commits: a monorepo holding the agent runtime, an API, a merchant web app and a CLI.',
          'Knowledge ingestion: Firecrawl-driven crawling with webhook callbacks and two scopes — whole-site sitemap discovery, or a single page with no discovery — behind SSRF-guarded URL validation shared by the browser and the server so the two checks cannot drift apart.',
          'Retrieval: chunking, cached embeddings and pgvector search over a per-merchant knowledge base. One package among many, not the whole product.',
          'Context: approved knowledge is compressed into a prompt-ready brief instead of dumping raw retrieval output into the prompt.',
          'Memory, and the trust boundary around it: anything learned during a call can only be written as a candidate and never reaches the live prompt on its own. Only a merchant action approves one, and an approved fact cannot be silently downgraded by automatic extraction.',
          'Memory writes are idempotent per tenant, caller and field, and a write failure is swallowed on purpose — memory is written during call teardown, so a database error must never take down the end of a call. The caller number is the identity key but never reaches the logs, and only structured field values are stored, never raw call text.',
          'The parts a demo never has to handle: concurrency, emergency escalation, spam filtering, call recording, launch guardrails, and OpenTelemetry tracing across the whole turn.',
        ],
        stack: [
          'TypeScript',
          'LiveKit Agents',
          'Drizzle ORM',
          'PostgreSQL',
          'pgvector',
          'Firecrawl',
          'OpenAI',
          'Twilio',
          'OpenTelemetry',
        ],
        current: true,
      },
      {
        name: 'PicPolisher — paid AI product',
        status: 'Live',
        href: 'https://picpolisher.com',
        summary:
          'An AI headshot generator with a self-serve purchase flow, built and operated solo. Real customers, real money.',
        points: [
          'I own the full path from purchase to delivery: authenticated customer flows, Stripe webhook events, database records and asynchronous generation.',
          'Explicit state transitions mean a retried or out-of-order webhook cannot lose or duplicate an order — the failure mode that costs you customers rather than uptime.',
          'Product planning, engineering, deployment, analytics and iteration, as sole engineer.',
        ],
        stack: ['Next.js', 'TypeScript', 'Supabase', 'Stripe', 'Vercel'],
      },
      {
        name: 'Amazon Bedrock in a production LMS',
        status: 'Shipped',
        summary:
          'Integrated Bedrock into an established learning platform without loosening its permission model.',
        points: [
          'The interesting constraint was not the model call — it was fitting generation into workflows that already had permissions, structured application logic and reporting depending on them.',
          'Delivered at Acorn PLMS alongside performance work: removed N+1 query patterns, replaced cron-heavy processing with queue-based jobs and caching.',
        ],
        stack: ['Amazon Bedrock', 'PHP', 'SQL', 'Redis'],
      },
      {
        name: 'AI-assisted client delivery',
        status: 'Ongoing',
        summary:
          'Clinic websites built AI-assisted end to end, with architecture, accessibility and content structure staying under my review.',
        points: [
          'AI-generated click-through HTML wireframes let clients react to something real before implementation started, which surfaced scope problems weeks earlier than a static mockup would.',
          'Every generated change was reviewed against accessibility and content-structure standards before it shipped.',
          'The honest framing: AI is a delivery multiplier here, not the engineer. The judgement calls stayed mine.',
        ],
        stack: ['Next.js', 'TypeScript', 'AI-assisted delivery'],
      },
    ],

    pipeline: [
      'Documents & web',
      'Ingest',
      'Chunk & embed',
      'Dense ∥ sparse',
      'Rank fusion',
      'Rerank',
      'Grounded answer',
    ],

    timeline: [
      {
        org: 'Independent',
        role: 'Developer — AI platform & web projects',
        city: 'Canberra',
        start: '2025-11',
        end: null,
        summary:
          'Running a live paid SaaS product while building AI Front Desk, a voice agent for small business.',
        points: [
          'Building AI Front Desk end to end: crawling and knowledge ingestion, retrieval, context compression, per-caller memory behind an explicit approval boundary, and an agent runtime that has to survive a real phone call.',
          'Own the full purchase-to-delivery loop for PicPolisher, including Stripe webhook handling designed so a retry or an out-of-order event cannot lose or duplicate an order.',
          'Also built a separate Python retrieval service — hybrid dense and sparse search with rank fusion and cross-encoder reranking — roughly 30,500 lines of source against 60,000 lines of tests.',
          'Delivered production clinic websites for independent clients, AI-assisted end to end with architecture and accessibility review staying mine.',
        ],
        stack: [
          'TypeScript',
          'LiveKit Agents',
          'Python',
          'FastAPI',
          'Next.js',
          'PostgreSQL',
          'Stripe',
          'Docker',
        ],
        current: true,
      },
      {
        org: 'Acorn PLMS',
        role: 'Software Engineer',
        city: 'Canberra',
        start: '2025-05',
        end: '2025-10',
        summary:
          'Built and maintained a core capability-evaluation module inside an established production learning platform.',
        points: [
          'Integrated Amazon Bedrock into existing workflows inside established permission boundaries.',
          'Replaced cron-heavy processing with queue-based jobs and caching, and removed N+1 query patterns.',
          'Built radar-chart reporting views that drew positive feedback from clients, colleagues and a supervisor.',
        ],
        stack: ['PHP', 'SQL', 'Amazon Bedrock', 'Redis', 'JavaScript'],
      },
      {
        org: 'OPF Consulting',
        role: 'Full-stack Developer',
        city: 'Canberra',
        start: '2023-05',
        end: '2025-05',
        summary:
          'Delivered and maintained 20+ client websites and digital systems, including a government-funded AI chatbot.',
        points: [
          'Ran scoping calls directly with non-technical stakeholders and translated requirements into production builds across many concurrent engagements.',
          'Built the retrieval-grounded AI chatbot for Small Business PEAK, a COSBOA service funded by the Department of Employment and Workplace Relations.',
          'Balanced accessibility, content structure, analytics tagging, usability and long-term maintainability across a wide client mix.',
          'Fast context switching across PHP, JavaScript/TypeScript, SQL, WordPress and modern web tooling.',
        ],
        stack: ['PHP', 'TypeScript', 'SQL', 'WordPress', 'GA4', 'Embeddings'],
      },
      {
        org: 'Prudential Technology',
        role: 'Frontend Developer',
        city: 'Shenzhen',
        start: '2022-10',
        end: '2023-05',
        summary: 'Built a cross-platform lifestyle application from scratch.',
        points: [
          'Features included live streaming, prayer time reminders, a prayer direction compass and a nearby mosque finder.',
          'Delivered across web and mobile from one codebase, backed by Google Cloud and Firebase.',
        ],
        stack: ['React', 'React Native', 'TypeScript', 'Taro', 'Firebase', 'Google Cloud'],
      },
      {
        org: 'Tencent',
        role: 'Full-stack Developer',
        city: 'Shenzhen',
        start: '2021-11',
        end: '2022-09',
        summary:
          'Contributed to a user-segmentation and marketing platform in a large product organisation.',
        points: [
          'Built React and Ant Design interfaces, plus Node/Egg and MySQL service-layer features between those interfaces and back-end systems.',
          'The team’s work contributed to a 3x increase in user count.',
          'First exposure to requirements assessment, documentation and collaboration at scale.',
        ],
        stack: ['React', 'Ant Design', 'UmiJS', 'Node.js', 'Egg', 'MySQL'],
      },
    ],

    stacks: [
      {
        label: 'React / TypeScript',
        from: '2021-11',
        to: null,
        note: 'Primary front end throughout',
      },
      { label: 'Node.js', from: '2021-11', to: '2022-09', note: 'Service layer at Tencent' },
      { label: 'PHP / Laravel', from: '2023-05', to: '2025-10', note: 'Consulting and LMS work' },
      {
        label: 'LLM / RAG',
        from: '2023-06',
        to: null,
        note: 'From the PEAK chatbot to hybrid retrieval',
      },
      { label: 'AWS / Cloudflare', from: '2023-05', to: null, note: 'Delivery and hosting' },
      {
        label: 'Python / FastAPI',
        from: '2025-11',
        to: null,
        note: 'Second production language',
      },
    ],

    toolbox: [
      {
        group: 'Languages',
        items: ['TypeScript', 'JavaScript', 'Python', 'PHP', 'SQL'],
      },
      {
        group: 'Frameworks',
        items: ['React', 'Next.js', 'Astro', 'Node.js', 'Laravel', 'FastAPI', 'React Native'],
      },
      {
        group: 'AI',
        items: [
          'Amazon Bedrock',
          'OpenAI',
          'Anthropic',
          'Embeddings',
          'RAG',
          'Reranking',
          'Structured outputs',
          'LiveKit Agents',
        ],
      },
      {
        group: 'Data',
        items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Queues', 'Caching'],
      },
      {
        group: 'Delivery',
        items: [
          'Docker',
          'GitHub Actions',
          'AWS',
          'Cloudflare',
          'Vercel',
          'Supabase',
          'Stripe',
          'Linux',
          'Nginx',
        ],
      },
      {
        group: 'Web craft',
        items: ['Accessibility', 'SEO-aware SSR', 'GA4', 'Semantic HTML', 'Performance'],
      },
    ],

    projects: [
      {
        name: 'PicPolisher',
        status: 'Live',
        href: 'https://picpolisher.com',
        hrefLabel: 'picpolisher.com',
        desc: 'A paid AI headshot generator with a self-serve purchase flow. Built and operated solo — product planning, engineering, deployment, analytics and iteration.',
        stack: ['Next.js', 'TypeScript', 'Supabase', 'Stripe', 'Vercel'],
      },
      {
        name: 'hybrid-rag-service',
        status: 'In development',
        desc: 'A separate Python service from AI Front Desk above: a multi-tenant knowledge platform with hybrid dense and sparse retrieval, reciprocal rank fusion and cross-encoder reranking, fed by Docling and crawl4ai ingestion. Retrieval runs on PostgreSQL — no separate vector database, no LangChain, no Kubernetes.',
        stack: ['Python 3.12', 'FastAPI', 'PostgreSQL', 'Docling', 'crawl4ai', 'Docker'],
      },
      {
        name: 'Her Health & Aesthetics',
        status: 'Live',
        href: 'https://hhanda.com.au',
        hrefLabel: 'hhanda.com.au',
        desc: 'A Canberra women’s health and doctor-led aesthetics clinic site. Service taxonomy, appointment-matching pathway, fees, resources and careers — delivered end to end.',
        stack: ['Next.js', 'TypeScript', 'Accessibility', 'SEO'],
      },
      {
        name: 'Neurodiversity Ninjas',
        status: 'Live',
        href: 'https://neurodiversityninjas.com.au',
        hrefLabel: 'neurodiversityninjas.com.au',
        desc: 'A Canberra clinic website covering information architecture, booking-flow integration, SEO structure and launch.',
        stack: ['Next.js', 'TypeScript', 'Accessibility'],
      },
    ],

    education: [
      {
        school: 'Central China Normal University',
        degree: 'Master of Journalism',
        period: '2014 – 2017',
      },
      {
        school: 'Central China Normal University',
        degree: 'Double Bachelor of Information Technology and Journalism',
        period: '2010 – 2014',
      },
    ],

    languages: ['English — professional fluency', 'Mandarin Chinese — native'],
  },

  zh: {
    title: '简历',
    description:
      'Fangzheng (Ben) Chen，堪培拉全栈工程师，做检索与大模型系统。经历、项目与可下载的简历。',

    name: 'Fangzheng (Ben) Chen',
    positioning: '端到端交付 AI 产品的全栈工程师',
    location: '澳大利亚堪培拉',
    workRights: '澳洲永久居民',
    availability: '开放全职机会 —— 堪培拉、悉尼，或全球远程',

    heading: {
      stats: '几个数字',
      status: '目前状态',
      ai: 'AI 实践',
      timeline: '工作经历',
      skills: '能力与技术栈',
      projects: '精选项目',
      education: '教育与语言',
      contact: '联系我',
    },

    kicker: {
      ai: '从 AI 辅助交付到自己搭的检索系统，三层深度。',
      timeline: '五年生产环境交付。点开任意一段看细节。',
      skills: '按实际上手年限计，不用自评分数。',
      projects: '有线上地址的给地址，没有的如实标状态。',
    },

    ui: {
      downloadResume: '下载简历',
      downloadHint: 'PDF，两页',
      emailMe: '发邮件给我',
      present: '至今',
      stackLabel: '技术栈',
      ganttCaption: '五段连续的经历 —— 2023 年之前在深圳，之后在堪培拉。条的长度是在职时间。',
      stackCaption: '条的长度是实际投入生产的时间，取自上方的经历，不是自评。',
      layersCaption: '每一层都建立在前一层之上。多数人的 AI 经验停在前两层。',
      pipelineCaption:
        '两套检索系统是同一个形状，也是同样几个刻意的约束：不用 LangChain、不引独立向量库、不上 Kubernetes。检索跑在 PostgreSQL 上，因此整套部署能放进客户自己控制的环境。',
    },

    status: [
      '2025 年 11 月起我全职独立开发：运营一个有真实付费用户的 AI 产品，同时在建一个 Python 检索与语音 agent 平台。',
      '在那之前，我在堪培拉一家咨询公司做了两年客户系统交付，又在一个生产环境的学习平台里待了半年。转独立是个刻意的选择 —— 我想完整地拥有一个东西，包括那些没人爱碰的部分：计费的边界情况、摄取流程的失败重试、某个检索启发式的第三次重写。',
      '现在在找一份全职工程岗位，希望 AI 是产品的一部分而不是一个演示。地点在堪培拉、悉尼，或者全球任何地方的远程 —— 跨时区协作我做过，也准备好了。',
    ],

    stats: [
      { value: '5 年', label: '生产环境软件交付' },
      { value: '20+', label: '交付的客户系统' },
      { value: '3 万行', label: 'Python 源码，6 万行测试' },
      { value: '政府资助', label: 'AI 聊天机器人，有媒体报道' },
    ],

    aiIntro:
      '我从 2023 年开始做大模型相关的东西，那时候现在这些工具链大多还不存在。这个时间点是有意义的：我交付过的检索系统是一块块拼出来的，不是从货架上拿的，所以每个部件到底在做什么，我心里有数。',

    aiLayers: [
      {
        name: '交付层',
        desc: 'AI 作为我自己工作的倍增器 —— 生成可点击的线框图给客户确认、AI 辅助实现，但架构和审查始终在我这边。',
      },
      {
        name: '集成层',
        desc: '把 Amazon Bedrock、OpenAI 与 Anthropic 的 API 接进已有产品，在原有的权限边界和业务逻辑里工作。',
      },
      {
        name: '系统层',
        desc: '从零件开始搭检索 —— embedding、稠密与稀疏混合召回、排序融合、cross-encoder 重排、接地与范围限制。',
      },
    ],

    aiCases: [
      {
        name: 'Small Business PEAK —— 检索接地的聊天机器人',
        status: '已上线',
        href: 'https://smallbusinesspeak.org.au/',
        summary: '一个政府资助的聊天机器人，在一份精选的法规语料上回答小企业的劳资法问题。',
        points: [
          '在 OPF Consulting 为 COSBOA（澳大利亚小企业组织理事会，全国性行业协会）建造，由澳大利亚政府就业与劳资关系部通过 Productivity Education and Training Fund 资助。',
          '澳洲媒体在报道中称这是首批获政府背书、用 AI 聊天机器人向公众解释法规变化的案例之一。',
          '回答通过 embedding、检索与重排接地在精选语料上，模型只在源材料范围内作答而不是自由生成 —— 在这个领域，答错是有真实合规成本的。',
          '站上公开声明了能力边界：具体情形请咨询独立法律意见，并指向 Fair Work Ombudsman、Safe Work Australia 与澳洲税务局。',
          '我建的是这个聊天机器人及配套交付工作，不是整个 PEAK 平台。',
        ],
        stack: ['Embedding', '检索', '重排', 'PHP', 'JavaScript'],
      },
      {
        name: 'AI Front Desk —— 面向小微商户的 7×24 电话 agent',
        status: '开发中',
        summary:
          '一个接起每一通来电、并把预订完整走完的语音 agent。检索只是其中一块，其余是抓取、上下文压缩、按来电者的记忆，以及一通真实通话所需要的各种护栏。',
        points: [
          '约 126,000 行 TypeScript，660 个文件，472 次提交：一个 monorepo，装着 agent 运行时、API、商户端 Web 应用和一个 CLI。',
          '知识摄取：基于 Firecrawl 的抓取，带 webhook 回调与两种范围 —— 整站 sitemap 发现，或只抓目标页不做发现。URL 校验的 SSRF 边界由浏览器端和服务端共用同一份实现，避免两处私网判定漂移。',
          '检索：分块、带缓存的 embedding、在每个商户自己的知识库上做 pgvector 检索。它是众多包中的一个，不是产品本身。',
          '上下文：已审核的知识会被压缩成一份可直接进提示词的 brief，而不是把原始检索结果整坨塞进提示词。',
          '记忆，以及围绕它的信任边界：通话里学到的任何东西只能写成 candidate，绝不会自己进入实时提示词；只有商户的动作才能把它转成 approved，而已 approved 的事实不会被自动抽取悄悄降级。',
          '记忆的写入按「租户 + 来电号码 + 字段」幂等去重；写失败一律吞掉——记忆是在通话收尾时写的，数据库出错绝不能把通话的结束流程带崩。来电号码作为身份键存储但不进日志，且只存结构化字段值，不存原始通话文本。',
          '还有一堆演示永远不必面对的东西：并发、紧急情况升级、垃圾来电过滤、通话录音、上线护栏，以及贯穿整轮对话的 OpenTelemetry 追踪。',
        ],
        stack: [
          'TypeScript',
          'LiveKit Agents',
          'Drizzle ORM',
          'PostgreSQL',
          'pgvector',
          'Firecrawl',
          'OpenAI',
          'Twilio',
          'OpenTelemetry',
        ],
        current: true,
      },
      {
        name: 'PicPolisher —— 付费 AI 产品',
        status: '已上线',
        href: 'https://picpolisher.com',
        summary: '一个 AI 证件照/头像生成器，带自助购买流程，独自建造与运营。真实用户，真实付费。',
        points: [
          '从购买到交付的整条链路由我负责：登录态的用户流程、Stripe webhook 事件、数据库记录与异步生成。',
          '状态迁移是显式的，所以 webhook 重试或乱序都不会丢单或重复出单 —— 这类故障丢的是客户，不是可用率。',
          '作为唯一的工程师，包办产品规划、工程实现、部署、数据分析与迭代。',
        ],
        stack: ['Next.js', 'TypeScript', 'Supabase', 'Stripe', 'Vercel'],
      },
      {
        name: '在生产 LMS 中集成 Amazon Bedrock',
        status: '已交付',
        summary: '把 Bedrock 接进一个成熟的学习平台，同时不放松它原有的权限模型。',
        points: [
          '难的不是调用模型，而是把生成能力嵌进已经有权限体系、结构化业务逻辑和报表依赖的工作流里。',
          '在 Acorn PLMS 交付，同期做了性能工作：清掉 N+1 查询，把重度依赖 cron 的处理换成队列任务加缓存。',
        ],
        stack: ['Amazon Bedrock', 'PHP', 'SQL', 'Redis'],
      },
      {
        name: 'AI 辅助的客户交付',
        status: '持续进行',
        summary: '诊所网站全程 AI 辅助建造，架构、无障碍与内容结构始终经我审查。',
        points: [
          'AI 生成的可点击 HTML 线框图让客户在实现开始前就能对着真实的东西提意见，比静态设计稿提前数周暴露出范围问题。',
          '每一处生成的改动上线前都对照无障碍与内容结构标准审过一遍。',
          '如实地说：AI 在这里是交付倍增器，不是工程师。判断仍然在我这边。',
        ],
        stack: ['Next.js', 'TypeScript', 'AI 辅助交付'],
      },
    ],

    pipeline: ['文档与网页', '摄取', '分块与向量化', '稠密 ∥ 稀疏', '排序融合', '重排', '接地作答'],

    timeline: [
      {
        org: '独立开发',
        role: 'AI 平台与 Web 项目',
        city: '堪培拉',
        start: '2025-11',
        end: null,
        summary: '运营一个已上线的付费 SaaS，同时在建 AI Front Desk —— 面向小微商户的语音 agent。',
        points: [
          '端到端在建 AI Front Desk：抓取与知识摄取、检索、上下文压缩、带显式审核边界的来电者记忆，以及一套要能扛住真实通话的 agent 运行时。',
          '负责 PicPolisher 从购买到交付的完整链路，其中 Stripe webhook 的处理方式保证重试或乱序事件都不会丢单或重复出单。',
          '另外做了一个独立的 Python 检索服务：稠密与稀疏混合召回，配排序融合与 cross-encoder 重排，约 30,500 行源码对 60,000 行测试。',
          '为独立客户交付了生产环境的诊所网站，全程 AI 辅助，架构与无障碍审查由我负责。',
        ],
        stack: [
          'TypeScript',
          'LiveKit Agents',
          'Python',
          'FastAPI',
          'Next.js',
          'PostgreSQL',
          'Stripe',
          'Docker',
        ],
        current: true,
      },
      {
        org: 'Acorn PLMS',
        role: '软件工程师',
        city: '堪培拉',
        start: '2025-05',
        end: '2025-10',
        summary: '在一个成熟的生产学习平台里建造并维护核心的能力评估模块。',
        points: [
          '在既有的权限边界内把 Amazon Bedrock 集成进现有工作流。',
          '把重度依赖 cron 的处理换成队列任务加缓存，并清掉了 N+1 查询模式。',
          '做的雷达图报表视图获得了客户、同事与主管的正面反馈。',
        ],
        stack: ['PHP', 'SQL', 'Amazon Bedrock', 'Redis', 'JavaScript'],
      },
      {
        org: 'OPF Consulting',
        role: '全栈开发',
        city: '堪培拉',
        start: '2023-05',
        end: '2025-05',
        summary: '交付并维护 20 多个客户网站与数字系统，其中包括一个政府资助的 AI 聊天机器人。',
        points: [
          '直接与非技术方开需求会，在多个并行项目里把需求翻译成能上线的实现。',
          '为 Small Business PEAK 建造了检索接地的 AI 聊天机器人 —— 那是 COSBOA 的项目，由就业与劳资关系部资助。',
          '在差异很大的客户之间平衡无障碍、内容结构、埋点、易用性与长期可维护性。',
          '在 PHP、JavaScript/TypeScript、SQL、WordPress 与现代 Web 工具链之间快速切换上下文。',
        ],
        stack: ['PHP', 'TypeScript', 'SQL', 'WordPress', 'GA4', 'Embedding'],
      },
      {
        org: '瑞信科技',
        role: '前端开发',
        city: '深圳',
        start: '2022-10',
        end: '2023-05',
        summary: '从零建造一个跨平台的生活方式应用。',
        points: [
          '功能包括直播、祷告时间提醒、朝向罗盘与附近清真寺查找。',
          '一套代码同时交付 Web 与移动端，后端依托 Google Cloud 与 Firebase。',
        ],
        stack: ['React', 'React Native', 'TypeScript', 'Taro', 'Firebase', 'Google Cloud'],
      },
      {
        org: '腾讯',
        role: '全栈开发',
        city: '深圳',
        start: '2021-11',
        end: '2022-09',
        summary: '在一个大型产品组织里参与用户分群与营销平台的建设。',
        points: [
          '做 React 与 Ant Design 的界面，以及界面与后端系统之间的 Node/Egg、MySQL 服务层功能。',
          '团队的工作支撑了用户量三倍增长。',
          '第一次接触规模化的需求评估、文档与协作方式。',
        ],
        stack: ['React', 'Ant Design', 'UmiJS', 'Node.js', 'Egg', 'MySQL'],
      },
    ],

    stacks: [
      { label: 'React / TypeScript', from: '2021-11', to: null, note: '一直是主力前端' },
      { label: 'Node.js', from: '2021-11', to: '2022-09', note: '腾讯时期的服务层' },
      { label: 'PHP / Laravel', from: '2023-05', to: '2025-10', note: '咨询与 LMS 阶段' },
      { label: '大模型 / RAG', from: '2023-06', to: null, note: '从 PEAK 到混合检索' },
      { label: 'AWS / Cloudflare', from: '2023-05', to: null, note: '交付与托管' },
      { label: 'Python / FastAPI', from: '2025-11', to: null, note: '第二门生产语言' },
    ],

    toolbox: [
      {
        group: '语言',
        items: ['TypeScript', 'JavaScript', 'Python', 'PHP', 'SQL'],
      },
      {
        group: '框架',
        items: ['React', 'Next.js', 'Astro', 'Node.js', 'Laravel', 'FastAPI', 'React Native'],
      },
      {
        group: 'AI',
        items: [
          'Amazon Bedrock',
          'OpenAI',
          'Anthropic',
          'Embedding',
          'RAG',
          '重排',
          '结构化输出',
          'LiveKit Agents',
        ],
      },
      {
        group: '数据',
        items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', '队列', '缓存'],
      },
      {
        group: '交付',
        items: [
          'Docker',
          'GitHub Actions',
          'AWS',
          'Cloudflare',
          'Vercel',
          'Supabase',
          'Stripe',
          'Linux',
          'Nginx',
        ],
      },
      {
        group: 'Web 工程',
        items: ['无障碍', 'SEO 友好的 SSR', 'GA4', '语义化 HTML', '性能优化'],
      },
    ],

    projects: [
      {
        name: 'PicPolisher',
        status: '已上线',
        href: 'https://picpolisher.com',
        hrefLabel: 'picpolisher.com',
        desc: '一个付费的 AI 头像生成器，带自助购买流程。独自建造与运营 —— 产品规划、工程、部署、数据与迭代。',
        stack: ['Next.js', 'TypeScript', 'Supabase', 'Stripe', 'Vercel'],
      },
      {
        name: 'hybrid-rag-service',
        status: '开发中',
        desc: '和上面的 AI Front Desk 是两个项目：一个多租户的 Python 知识服务，稠密与稀疏混合召回、reciprocal rank fusion、cross-encoder 重排，摄取侧接 Docling 与 crawl4ai。检索跑在 PostgreSQL 上 —— 不引独立向量库、不用 LangChain、不上 Kubernetes。',
        stack: ['Python 3.12', 'FastAPI', 'PostgreSQL', 'Docling', 'crawl4ai', 'Docker'],
      },
      {
        name: 'Her Health & Aesthetics',
        status: '已上线',
        href: 'https://hhanda.com.au',
        hrefLabel: 'hhanda.com.au',
        desc: '堪培拉一家女性健康与医生主导的医美诊所站点。服务分类、预约匹配路径、收费、资源与招聘，端到端交付。',
        stack: ['Next.js', 'TypeScript', '无障碍', 'SEO'],
      },
      {
        name: 'Neurodiversity Ninjas',
        status: '已上线',
        href: 'https://neurodiversityninjas.com.au',
        hrefLabel: 'neurodiversityninjas.com.au',
        desc: '堪培拉的一家诊所网站，覆盖信息架构、预约流程集成、SEO 结构与上线。',
        stack: ['Next.js', 'TypeScript', '无障碍'],
      },
    ],

    education: [
      {
        school: '华中师范大学',
        degree: '新闻学硕士',
        period: '2014 – 2017',
      },
      {
        school: '华中师范大学',
        degree: '信息技术与新闻学双学士',
        period: '2010 – 2014',
      },
    ],

    languages: ['英语 —— 专业工作水平', '中文 —— 母语'],
  },
};
