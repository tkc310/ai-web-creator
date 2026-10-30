#!/usr/bin/env python3
"""原稿や、公開・記録する前のファイルに、機密情報と汚染（AI に向けた攻撃の文章）がないかを調べる。

使い方:
  python3 check_text.py ファイル [ファイル ...]
  python3 check_text.py フォルダ          # フォルダの中のテキストファイルをまとめて調べる
  python3 check_text.py . --exclude skills  # skills/ などを除く（フォルダもファイルの指定も。何度でも付けられる）
  python3 check_text.py --no-markup 下書き.md  # スクリプトや埋め込みのタグを調べない（ログの下書きなど）
  python3 check_text.py --baseline 前の版のフォルダ src/content/news/a.md  # 前の版から増えた指摘だけを出す
  git -c core.quotePath=false diff --cached --name-only --diff-filter=ACM -z | xargs -0 -r python3 check_text.py

見つかったら 1 行ずつ「ファイル:行: [種類] 内容」を表示し、終了コード 1 で終える。
何もなければ終了コード 0。機密情報らしいものは先頭の数文字だけを表示する。
指定したファイルが見つからない場合と、テキストのはずのファイルを UTF-8 で読めない場合も、
調べられなかったこととして表示し、終了コード 1 で終える（画像などのバイナリは調べずに飛ばす）。
日本語のファイル名を git から渡すときは、上の例のように core.quotePath=false と -z を使う。

原稿の中の不審な記述（スクリプト、埋め込み、隠すための CSS など）は、原稿として扱うファイル（.md など）だけで調べる。
ただし、実行ログと監査ログ（今のフォルダから見て logs/ と audit-log/ の下）は、公開されるページにならず、
原因の説明に「iframe のタグ」などと書くことがあるので調べない（機密情報、見えない文字、AI への命令の疑いは調べる）。
--no-markup を付けると、どのファイルでも調べない。

--baseline フォルダ を付けると、調べるファイルと同じ相対パスのファイルがそのフォルダにあるとき、
その前の版にもあった指摘（種類と内容が同じもの）は出さず、新しく増えた指摘だけを出す。
もとから埋め込みの動画がある記事を直したときに、止まらないようにするため。前の版がないファイルは、すべてを出す。

これは見落としを減らすための補助で、これだけで安全とは判断しない（references/security-rules.md）。
"""
import pathlib
import re
import sys

TEXT_SUFFIXES = {
    ".md", ".mdx", ".markdown", ".txt", ".html", ".htm", ".astro", ".json", ".jsonc",
    ".yml", ".yaml", ".toml", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".css",
    ".xml", ".svg", ".csv", ".env", ".vars",
}
# 中身を調べないファイル（画像、フォント、動画など）。指定されても飛ばす
BINARY_SUFFIXES = {
    ".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".ico", ".bmp", ".tif", ".tiff", ".heic",
    ".pdf", ".woff", ".woff2", ".ttf", ".otf", ".eot", ".mp4", ".webm", ".mov", ".mp3", ".wav",
    ".zip", ".gz",
}
SKIP_DIRS = {".git", "node_modules", "dist", ".astro", ".wrangler", "lighthouse-reports"}
MARKUP_SUFFIXES = {".md", ".mdx", ".markdown", ".txt", ".csv"}  # 原稿として扱うもの
LOG_DIRS = {"logs", "audit-log"}  # 原稿の中の不審な記述を調べないフォルダ（今のフォルダから見た最初のフォルダ）

# 機密情報の形
SECRET_PATTERNS = [
    ("GitHub のトークン", re.compile(r"\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})")),
    ("Anthropic の API キー", re.compile(r"\bsk-ant-[A-Za-z0-9_\-]{20,}")),
    ("OpenAI の API キー", re.compile(r"\bsk-(?:proj-)?[A-Za-z0-9]{32,}")),
    ("AWS のアクセスキー", re.compile(r"\b(?:AKIA|ASIA)[0-9A-Z]{16}\b")),
    ("Google の API キー", re.compile(r"\bAIza[0-9A-Za-z_\-]{35}\b")),
    ("Slack のトークン", re.compile(r"\bxox[abprs]-[A-Za-z0-9\-]{10,}")),
    ("秘密鍵", re.compile(r"-----BEGIN (?:[A-Z]+ )?PRIVATE KEY-----")),
    ("パスワードやトークンの代入", re.compile(
        r"(?i)\b(?:password|passwd|pwd|secret|api[_-]?key|access[_-]?token|auth[_-]?token|token|"
        r"client[_-]?secret|cloudflare[_-]?api[_-]?token)\b\s*[:=]\s*['\"]?([^\s'\"<>]{12,})")),
]
# 代入の値として許すもの（ひな形の書き方や、環境変数の参照）
PLACEHOLDER = re.compile(r"^(?:<.*>|\$\{\{.*|\$\{?[A-Z_]+\}?|secrets\.|env\.|process\.env|x{4,}|\*{4,}|your[-_]|example)", re.I)

# 絵文字をつなぐ ZWJ（U+200D。家族や職業の絵文字の中に入る）は、前後が絵文字のときだけ見えない文字に数えない
EMOJI_ZWJ = re.compile(
    "(?<=[\U0001F000-\U0001FAFF\u2600-\u27BF\uFE0F\U0001F3FB-\U0001F3FF])"
    "\u200D"
    "(?=[\U0001F000-\U0001FAFF\u2600-\u27BF])"
)

# 見えない文字
INVISIBLE = re.compile(r"[​-‏‪-‮⁠-⁤⁦-⁩﻿\U000e0000-\U000e007f]")

# AI に向けた命令によくある言い回し
INJECTION_PATTERNS = [
    re.compile(r"(?i)\b(?:ignore|disregard|forget)\b.{0,30}\b(?:previous|prior|above|earlier|all)\b.{0,20}\b(?:instructions?|prompts?|rules?|messages?)"),
    re.compile(r"(?i)\byou are now\b|\bnew instructions?\s*:|\bsystem prompt\b|\bdeveloper mode\b|\bjailbreak\b"),
    re.compile(r"(?i)\b(?:do not|don't)\s+(?:tell|inform|show)\s+the\s+user\b"),
    re.compile(r"(?i)\b(?:send|post|upload|exfiltrate|reveal|print)\b.{0,30}\b(?:secret|token|api[ _-]?key|password|credentials?|env(?:ironment)? variables?)\b"),
    re.compile(r"(?i)\b(?:as an? (?:ai|llm|assistant)|ai assistants?|language models?)\b.{0,40}\b(?:must|should|need to)\b"),
    re.compile(r"(?:以前|これまで|上記|前)の(?:指示|命令|ルール|プロンプト).{0,10}(?:無視|忘れ)"),
    re.compile(r"システムプロンプト|あなたは(?:今から|これから)|新しい指示[:：]"),
    re.compile(r"(?:ユーザー|利用者|オーナー)に(?:は)?(?:伝え|知らせ|言わ)ずに"),
    re.compile(r"(?:秘密|機密|トークン|API ?キー|パスワード|シークレット).{0,15}(?:送信して|送って|教えて|出力して|表示して|貼り付けて|書き出して)"),
    re.compile(r"(?:AI|エージェント|アシスタント|Claude|ChatGPT)\s*(?:への|に対する)(?:指示|命令)\s*[:：]"),
]

# 原稿の中にあると怪しいもの
MARKUP_PATTERNS = [
    ("スクリプト", re.compile(r"(?i)<\s*script\b")),
    ("埋め込み", re.compile(r"(?i)<\s*(?:iframe|object|embed)\b")),
    ("javascript: のリンク", re.compile(r"(?i)javascript\s*:")),
    ("隠すための CSS", re.compile(r"(?i)(?:display\s*:\s*none|visibility\s*:\s*hidden|font-size\s*:\s*0(?:px)?\b|opacity\s*:\s*0(?:\.0+)?\b)")),
]
HTML_COMMENT = re.compile(r"<!--(.*?)-->", re.S)


def mask(value: str) -> str:
    return value[:4] + "…（伏せました）"


def is_text(path: pathlib.Path) -> bool:
    return path.suffix.lower() in TEXT_SUFFIXES or path.name.startswith(".env") or path.name == ".dev.vars"


def is_excluded(path: pathlib.Path, excludes) -> bool:
    return any(path == e or e in path.parents for e in excludes)


def iter_files(args, excludes, problems):
    for arg in args:
        p = pathlib.Path(arg)
        if p.is_dir():
            for f in sorted(p.rglob("*")):
                if (f.is_file() and is_text(f) and not (set(f.parts) & SKIP_DIRS)
                        and not is_excluded(f.resolve(), excludes)):
                    yield f
        elif p.is_file():
            if p.suffix.lower() in BINARY_SUFFIXES or is_excluded(p.resolve(), excludes):
                continue
            yield p
        else:
            # 引用符つきのパス（core.quotePath）や、消えたファイルを渡されたとき。黙って通さない
            problems.append(f"{arg}: [調べられない] ファイルが見つかりません")


SELF = pathlib.Path(__file__).name  # このスクリプト自身は、命令の言い回しを含むので調べない


def relative(path: pathlib.Path):
    """今のフォルダから見た相対パス。外にあるときは None"""
    try:
        return path.resolve().relative_to(pathlib.Path.cwd().resolve())
    except ValueError:
        return None


def is_log(path: pathlib.Path) -> bool:
    rel = relative(path)
    return rel is not None and len(rel.parts) > 1 and rel.parts[0] in LOG_DIRS


def check(path: pathlib.Path, markup: bool = True):
    findings = []
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return [(0, "調べられない", "UTF-8 で読めません（文字コードを UTF-8 にするか、テキストでないなら調べる対象から外す）")]
    except OSError as e:
        return [(0, "調べられない", f"読めません（{e.__class__.__name__}）")]
    is_manuscript = markup and path.suffix.lower() in MARKUP_SUFFIXES
    lines = text.splitlines()

    for no, line in enumerate(lines, 1):
        for label, pat in SECRET_PATTERNS:
            for m in pat.finditer(line):
                value = m.group(m.lastindex or 0)
                if label == "パスワードやトークンの代入" and PLACEHOLDER.match(value):
                    continue
                findings.append((no, "機密情報", f"{label}: {mask(value)}"))
        inv = INVISIBLE.findall(EMOJI_ZWJ.sub("", line))
        if inv and not (no == 1 and inv == ["﻿"] and line.startswith("﻿")):
            codes = ", ".join(sorted({f"U+{ord(c):04X}" for c in inv}))
            findings.append((no, "見えない文字", codes))
        for pat in INJECTION_PATTERNS:
            m = pat.search(line)
            if m:
                findings.append((no, "AI への命令の疑い", m.group(0)[:60]))
                break
        if is_manuscript:
            for label, pat in MARKUP_PATTERNS:
                if pat.search(line):
                    findings.append((no, "原稿の中の不審な記述", label))

    for m in HTML_COMMENT.finditer(text):
        body = m.group(1)
        if any(p.search(body) for p in INJECTION_PATTERNS):
            no = text.count("\n", 0, m.start()) + 1
            findings.append((no, "AI への命令の疑い", "HTML のコメントの中"))
    return findings


def without_baseline(findings, base_findings):
    """前の版にもあった指摘（種類と内容が同じもの）を、数の分だけ取り除く"""
    left = {}
    for _, kind, detail in base_findings:
        left[(kind, detail)] = left.get((kind, detail), 0) + 1
    out = []
    for no, kind, detail in findings:
        if left.get((kind, detail), 0) > 0:
            left[(kind, detail)] -= 1
            continue
        out.append((no, kind, detail))
    return out


def parse_args(argv):
    paths, excludes = [], []
    opts = {"markup": True, "baseline": None}
    it = iter(argv)
    for a in it:
        if a == "--no-markup":
            opts["markup"] = False
        elif a == "--baseline" or a.startswith("--baseline="):
            value = a.split("=", 1)[1] if "=" in a else next(it, None)
            if not value or not pathlib.Path(value).is_dir():
                raise SystemExit("--baseline のあとに、前の版のファイルを置いたフォルダを書いてください")
            opts["baseline"] = pathlib.Path(value)
        elif a == "--exclude":
            value = next(it, None)
            if value is None:
                raise SystemExit("--exclude のあとに、除くフォルダかファイルを書いてください")
            excludes.append(pathlib.Path(value).resolve())
        elif a.startswith("--exclude="):
            excludes.append(pathlib.Path(a.split("=", 1)[1]).resolve())
        else:
            paths.append(a)
    return paths, excludes, opts


def main() -> int:
    paths, excludes, opts = parse_args(sys.argv[1:])
    if not paths:
        print(__doc__)
        return 2
    total = 0
    problems = []
    for f in iter_files(paths, excludes, problems):
        if f.name == SELF:
            continue
        markup = opts["markup"] and not is_log(f)
        findings = check(f, markup)
        if opts["baseline"] is not None and findings:
            rel = relative(f)
            base = opts["baseline"] / rel if rel is not None else None
            if base is not None and base.is_file():
                findings = without_baseline(findings, check(base, markup))
        for no, kind, detail in findings:
            print(f"{f}:{no}: [{kind}] {detail}")
            total += 1
    for line in problems:
        print(line)
        total += 1
    if total:
        print(f"\n{total} 件見つかりました。1件ずつ内容を見て判断してください（references/security-rules.md）。", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
