// 事前ビルドした JSON（Static Assets）を読んで、アクセスのたびに HTML を組み立てる Worker。
// 組み立てた HTML は Workers Cache に置かれ、キャッシュがある間はこの Worker は動かない。
// 記事が変わったら、CI が /__cache/purge に変わったタグを送り、そのあと主なページを開いてキャッシュを温める。

import site from "../site.config.json";
import { renderArchive, renderHome, renderNotFound, renderPost, renderSearch, renderTag } from "./render";
import type { IndexShard, PostDetail, ShardsDoc, TagShard } from "./types";

interface Env {
  ASSETS: { fetch(input: Request | string): Promise<Response> };
  IMAGES: R2BucketLike;
  PURGE_TOKEN?: string;
}

interface R2BucketLike {
  get(key: string): Promise<{
    body: ReadableStream;
    httpEtag: string;
    size: number;
    httpMetadata?: { contentType?: string };
  } | null>;
}

// ページ（HTML）は、ブラウザには短く、Workers Cache には長く置く。記事が変わればタグでパージする
const PAGE_CACHE = { browser: "public, max-age=60", edge: "public, max-age=2592000" };
// 検索結果は、文字の組み合わせが多いので短めにする
const SEARCH_CACHE = { browser: "public, max-age=60", edge: "public, max-age=600" };

export default {
  async fetch(request: Request, env: Env, ctx: { cache?: Purger }): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/__cache/purge") return purge(request, env, ctx.cache);
    if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method Not Allowed", { status: 405 });
    if (url.pathname.startsWith("/img/")) return image(url, env);

    // 末尾のスラッシュをそろえる（キャッシュのキーを1つにする）
    if (!url.pathname.endsWith("/") && !url.pathname.includes(".")) {
      return Response.redirect(`${url.origin}${url.pathname}/${url.search}`, 301);
    }

    const t0 = Date.now();
    const timing = { data: 0 };
    const load = async <T>(p: string): Promise<T | null> => {
      const s = Date.now();
      const res = await env.ASSETS.fetch(`https://assets.local/data/${p}.json`);
      timing.data += Date.now() - s;
      return res.ok ? ((await res.json()) as T) : null;
    };

    let m: RegExpMatchArray | null;
    let html: string | null = null;
    let tags: string[] = [];
    let policy = PAGE_CACHE;

    if (url.pathname === "/") {
      const [latest, shards] = await Promise.all([load<IndexShard>("latest"), load<ShardsDoc>("shards")]);
      if (latest && shards) {
        html = renderHome(latest, shards);
        tags = ["html", "latest", "shards"];
      }
    } else if ((m = url.pathname.match(/^\/posts\/([a-z0-9-]+)\/$/))) {
      const post = await load<PostDetail>(`posts/${m[1]}`);
      if (post) {
        html = renderPost(post);
        tags = ["html", `post:${post.slug}`];
      }
    } else if ((m = url.pathname.match(/^\/archive\/(\d{4})\/$/))) {
      const year = m[1];
      const page = pageParam(url);
      // 年で1つのファイルを先に探し、なければ（記事が多くて月ごとに分けた年）目録から月のファイルを探す
      let shard = await load<IndexShard>(`index/${year}`);
      tags = ["html", `index:${year}`];
      if (!shard) {
        const shards = await load<ShardsDoc>("shards");
        const keys = shards?.shards.filter((s) => s.year === year).map((s) => s.key) ?? [];
        const parts = (await Promise.all(keys.map((k) => load<IndexShard>(`index/${k}`)))).filter((x): x is IndexShard => !!x);
        if (parts.length) {
          shard = { key: year, count: parts.reduce((n, p) => n + p.count, 0), posts: parts.flatMap((p) => p.posts) };
          tags = ["html", "shards", ...keys.map((k) => `index:${k}`)];
        }
      }
      if (shard) html = renderArchive(year, shard, page);
    } else if ((m = url.pathname.match(/^\/tags\/([a-z0-9-]+)\/(?:(\d{4})\/)?$/))) {
      // 記事が多いタグは、/tags/<タグ>/<年>/ に年ごとの一覧がある
      const tag = await load<TagShard>(m[2] ? `tags/${m[1]}/${m[2]}` : `tags/${m[1]}`);
      if (tag) {
        html = renderTag(tag, pageParam(url));
        tags = ["html", m[2] ? `tag:${tag.slug}:${m[2]}` : `tag:${tag.slug}`];
      }
    } else if (url.pathname === "/search/") {
      const q = (url.searchParams.get("q") ?? "").trim().slice(0, 50);
      const shards = await load<ShardsDoc>("shards");
      if (shards) {
        const year = url.searchParams.get("year");
        const keys = shards.shards.filter((s) => !year || s.year === year).map((s) => s.key);
        const results: SearchRow[] = [];
        // 索引は新しい順に並んでいる。6つずつ読み、新しい順に50本見つかったら残りは読まない（記事が多くても CPU 時間を抑える）
        for (let i = 0; q && i < keys.length && results.length < 50; i += 6) {
          const batch = await Promise.all(keys.slice(i, i + 6).map((k) => load<SearchRow[]>(`search/${k}`)));
          results.push(...search(q, batch.flat()));
        }
        results.splice(50);
        html = renderSearch(q, results, shards);
        tags = ["html", "search", "shards"];
        policy = SEARCH_CACHE;
      }
    }

    if (html === null) {
      // 404 はキャッシュしない（予約投稿が公開された直後に、古い 404 が残らないようにする）
      return new Response(renderNotFound(), {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
      });
    }

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": policy.browser,
        "Cloudflare-CDN-Cache-Control": policy.edge,
        "Cache-Tag": tags.join(","),
        "Server-Timing": `data;dur=${timing.data}, total;dur=${Date.now() - t0}`,
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    });
  },
};

// Workers Cache の ctx.cache（wrangler.jsonc の cache.enabled が true のときに使える）
interface Purger {
  purge?: (o: unknown) => Promise<{ success: boolean; errors?: unknown[] }>;
}

interface SearchRow {
  s: string;
  t: string;
  d: string;
  g: string[];
  x: string;
}

function search(q: string, rows: (SearchRow | null)[]): SearchRow[] {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const tagNames = site.tags as Record<string, string>;
  const hits: SearchRow[] = [];
  for (const r of rows) {
    if (!r) continue;
    const hay = `${r.t} ${r.x} ${r.g.map((g) => tagNames[g]).join(" ")}`.toLowerCase();
    if (words.every((w) => hay.includes(w))) hits.push(r);
  }
  return hits.sort((a, b) => (a.d < b.d ? 1 : -1));
}

function pageParam(url: URL): number {
  const n = Number(url.searchParams.get("page") ?? "1");
  return Number.isInteger(n) && n > 0 && n < 1000 ? n : 1;
}

async function image(url: URL, env: Env): Promise<Response> {
  const key = decodeURIComponent(url.pathname.slice("/img/".length));
  if (!/^[\w./-]+$/.test(key) || key.includes("..")) return new Response("Not Found", { status: 404 });
  const obj = await env.IMAGES.get(key);
  if (!obj) return new Response("Not Found", { status: 404, headers: { "Cache-Control": "no-store" } });
  // 画像のキーには中身のハッシュが入っているので、同じ URL の中身は変わらない
  return new Response(obj.body, {
    headers: {
      "Content-Type": obj.httpMetadata?.contentType ?? "application/octet-stream",
      "Content-Length": String(obj.size),
      ETag: obj.httpEtag,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Cache-Tag": "img",
    },
  });
}

// CI や Claude が、公開のあとに呼ぶ。秘密の文字列（PURGE_TOKEN）がないと動かない
async function purge(request: Request, env: Env, purger: Purger | undefined): Promise<Response> {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  const auth = request.headers.get("Authorization") ?? "";
  if (!env.PURGE_TOKEN || !timingSafeEqual(auth, `Bearer ${env.PURGE_TOKEN}`)) {
    return new Response("Unauthorized", { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as { tags?: string[]; pathPrefixes?: string[]; purgeEverything?: boolean } | null;
  if (!body) return Response.json({ success: false, error: "JSON を送ってください" }, { status: 400 });
  if (!purger?.purge) return Response.json({ success: false, error: "この環境では Workers Cache のパージが使えません" }, { status: 501 });

  const opts = body.purgeEverything
    ? { purgeEverything: true }
    : { ...(body.tags?.length ? { tags: body.tags.slice(0, 100) } : {}), ...(body.pathPrefixes?.length ? { pathPrefixes: body.pathPrefixes.slice(0, 100) } : {}) };
  if (!("purgeEverything" in opts) && !("tags" in opts) && !("pathPrefixes" in opts)) {
    return Response.json({ success: false, error: "tags、pathPrefixes、purgeEverything のどれかを送ってください" }, { status: 400 });
  }
  const result = await purger.purge(opts);
  return Response.json(result, { status: result.success ? 200 : 502, headers: { "Cache-Control": "no-store" } });
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
