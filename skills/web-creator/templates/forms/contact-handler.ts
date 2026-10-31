// お問い合わせフォームの送信を受け、確かめてから、オーナーにメールで知らせる。
// Cloudflare Workers で動く。src/lib/contact-handler.ts に置き、src/pages/api/contact.ts から呼ぶ（references/forms.md）。
//
// 守っていること:
//   - 送信元が自分のサイトか（Origin。本番、www、確認用の workers.dev を SITE_ORIGINS に並べる）、大きさ、必須項目、文字数、メールアドレスの形を確かめる
//   - ロボットが埋める隠し項目（website）が埋まっていたら、成功したふりをして何もしない
//   - Cloudflare Turnstile のトークンを、サーバーから siteverify で確かめる（ホスト名も確かめる）。確かめられなかったときも送らない
//   - Turnstile を通ったあとで、送信回数を制限する（Workers の Rate Limiting の接続 CONTACT_LIMITER がある場合。サイト全体で1分に5件まで）。
//     Turnstile より前で数えると、トークンを持たない POST を繰り返すだけで、本物の問い合わせを止められてしまうため
//   - メールは本文をテキストだけで送る（HTML を組み立てない）。件名に改行を入れない
//   - 送信内容はどこにも保存しない。ログにも個人情報を書かない

export interface ContactEnv {
  EMAIL: {
    send(message: {
      to: string;
      from: string | { email: string; name?: string };
      subject: string;
      text: string;
      replyTo?: string;
    }): Promise<{ messageId: string }>;
  };
  TURNSTILE_SECRET_KEY: string; // 秘密の鍵。Cloudflare の画面で Secret として登録する
  CONTACT_TO: string; // 通知を受けるアドレス（Cloudflare で確認済みのもの）
  CONTACT_FROM: string; // 送信元。Email Sending に登録したドメインのアドレス（例: form@example.co.jp）
  // 許可する送信元。カンマ区切りで、本番、www、確認用の workers.dev を並べる（末尾の / なし）
  // 例: https://example.co.jp,https://www.example.co.jp,https://example-site.example.workers.dev
  SITE_ORIGINS: string;
  // 送信回数の制限（wrangler.jsonc の ratelimits）。ない場合は制限しない
  CONTACT_LIMITER?: { limit(options: { key: string }): Promise<{ success: boolean }> };
}

const LIMITS = { name: 100, company: 100, email: 254, phone: 30, message: 5000 } as const;
const MAX_BYTES = 20_000;
const EMAIL_RE = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]+$/;

export async function handleContact(request: Request, env: ContactEnv): Promise<Response> {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const origins = env.SITE_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean);
  const origin = request.headers.get("Origin") ?? "";
  if (!origins.includes(origin)) return new Response("Forbidden", { status: 403 });
  // 戻り先は、許可した送信元のうち、送信してきたもの
  const to = (path: string) => Response.redirect(new URL(path, origin).toString(), 303);
  const fail = (reason: string) => to(`/contact/?error=${reason}`);

  if (Number(request.headers.get("Content-Length") ?? "0") > MAX_BYTES) {
    return new Response("Payload Too Large", { status: 413 });
  }
  const type = request.headers.get("Content-Type") ?? "";
  if (!type.startsWith("application/x-www-form-urlencoded") && !type.startsWith("multipart/form-data")) {
    return new Response("Unsupported Media Type", { status: 415 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("invalid");
  }
  const get = (key: string) => String(form.get(key) ?? "").trim();

  // 隠し項目が埋まっていればロボット。成功したように見せて終える
  if (get("website") !== "") return to("/contact/thanks/");

  const name = get("name");
  const company = get("company");
  const email = get("email");
  const phone = get("phone");
  const message = get("message");

  if (!name || !email || !message) return fail("required");
  if (
    name.length > LIMITS.name ||
    company.length > LIMITS.company ||
    email.length > LIMITS.email ||
    phone.length > LIMITS.phone ||
    message.length > LIMITS.message
  ) {
    return fail("too_long");
  }
  if (!EMAIL_RE.test(email)) return fail("email");

  const token = get("cf-turnstile-response");
  if (!token) return fail("captcha");
  let result: { success?: boolean; hostname?: string };
  try {
    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: request.headers.get("CF-Connecting-IP") ?? "",
      }),
    });
    result = (await verify.json()) as { success?: boolean; hostname?: string };
  } catch {
    // 確かめられなかったときは送らない（通信の失敗や、想定しない応答）
    return fail("captcha");
  }
  if (!result.success || result.hostname !== new URL(origin).hostname) return fail("captcha");

  // 送信回数の制限。Turnstile を通った送信だけを数える。個人を特定しないよう、サイト全体で数える
  if (env.CONTACT_LIMITER) {
    const { success } = await env.CONTACT_LIMITER.limit({ key: "contact" });
    if (!success) return fail("busy");
  }

  const oneLine = (s: string) => s.replace(/[\r\n\t]+/g, " ").slice(0, 100);
  const text = [
    "サイトのお問い合わせフォームから送信がありました。",
    "このメールに返信すると、送信した人に届きます。",
    "",
    `お名前: ${name}`,
    `会社名: ${company || "（なし）"}`,
    `メールアドレス: ${email}`,
    `電話番号: ${phone || "（なし）"}`,
    "",
    "お問い合わせ内容:",
    message,
  ].join("\n");

  try {
    await env.EMAIL.send({
      to: env.CONTACT_TO,
      from: { email: env.CONTACT_FROM, name: "サイトのお問い合わせ" },
      replyTo: email,
      subject: `【お問い合わせ】${oneLine(name)} 様`,
      text,
    });
  } catch (error) {
    // 個人情報を出さないよう、エラーの種類だけを記録する
    console.error("contact: send failed", (error as { code?: string }).code ?? "unknown");
    return fail("send");
  }

  return to("/contact/thanks/");
}
