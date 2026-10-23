// HTML だけのサイト（LP など）: src/worker.ts に置く。
// /api/contact だけをこの Worker で処理し、それ以外は public/ のファイルをそのまま返す。
// wrangler.jsonc の例は wrangler-contact.jsonc を参照。
import { handleContact, type ContactEnv } from "./contact-handler";

interface Env extends ContactEnv {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/contact") return handleContact(request, env);
    return env.ASSETS.fetch(request);
  },
};
