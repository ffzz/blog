import type { APIRoute } from 'astro';

import { buildLlmsFullTxt } from '../lib/llms';

export const GET: APIRoute = async () => {
  const body = await buildLlmsFullTxt();
  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
