// Astro: src/pages/api/contact.ts に置く。このファイルだけをアクセスのたびに処理する（SSR）。
// contact-handler.ts は src/lib/contact-handler.ts に置く。
// @astrojs/cloudflare（Astro 6 以降）が必要。サイトは要保守構成になる。
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { handleContact, type ContactEnv } from "../../lib/contact-handler";

export const prerender = false;

export const POST: APIRoute = ({ request }) => handleContact(request, env as unknown as ContactEnv);
