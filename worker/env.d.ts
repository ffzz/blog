export interface Env {
  ASSETS: Fetcher;
  SUBSCRIBE_KV: KVNamespace;

  /** `wrangler secret put RESEND_API_KEY` */
  RESEND_API_KEY: string;
  /** `wrangler secret put TOKEN_SIGNING_SECRET`（生成方式见 worker/token.ts）。 */
  TOKEN_SIGNING_SECRET: string;

  RESEND_FROM_EMAIL: string;
  RESEND_SEGMENT_ID: string;
}
