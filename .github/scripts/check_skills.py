#!/usr/bin/env python3
"""このリポジトリ（スキルの配布元）の、壊れやすいところを確かめる。check-skills.yml が動かす。

確かめること:
  1. Markdown の ```bash のかたまりが、bash -n（構文の確かめ）を通る（docs/logs/ と CHANGELOG.md は除く）
  2. YAML のファイル（skills/ のテンプレートと .github/）が読み込める
  3. テンプレートのワークフローの run: のシェルが、bash -n を通る（${{ ... }} は仮の値に置き換えてから）
  4. 古い構成（EmDash を標準にしていた版）の記述が、スキルとプロンプトに戻っていない
  5. --manifest を付けたときは、MANIFEST.txt が LICENSE と skills/ のファイルと一致する

使い方: python3 .github/scripts/check_skills.py [--manifest]
問題があれば1行ずつ表示して、終了コード 1 で終える。
"""
import hashlib
import pathlib
import re
import subprocess
import sys

import yaml

ROOT = pathlib.Path(__file__).resolve().parents[2]
problems = []


def tracked(*patterns):
    out = subprocess.run(["git", "-C", str(ROOT), "ls-files", "-z", "--", *patterns],
                         check=True, capture_output=True).stdout.decode()
    return [ROOT / p for p in out.split("\0") if p]


def bash_n(code, where):
    r = subprocess.run(["bash", "-n"], input=code.encode(), capture_output=True)
    if r.returncode != 0:
        problems.append(f"{where}: bash -n で失敗しました: {r.stderr.decode().strip()}")


# 1. Markdown の bash のかたまり
FENCE = re.compile(r"^([ \t]*)```bash[ \t]*\n(.*?)^\1```[ \t]*$", re.S | re.M)
for f in tracked("*.md"):
    rel = f.relative_to(ROOT).as_posix()
    if rel.startswith("docs/logs/") or rel == "CHANGELOG.md":
        continue
    text = f.read_text(encoding="utf-8")
    for m in FENCE.finditer(text):
        indent = m.group(1)
        body = "\n".join(line[len(indent):] if line.startswith(indent) else line
                         for line in m.group(2).split("\n"))
        line_no = text[:m.start()].count("\n") + 1
        bash_n(body, f"{rel}:{line_no}")

# 2. YAML と 3. ワークフローの run:
EXPR = re.compile(r"\$\{\{.*?\}\}", re.S)
for f in tracked("*.yml", "*.yaml"):
    rel = f.relative_to(ROOT).as_posix()
    try:
        data = yaml.safe_load(f.read_text(encoding="utf-8"))
    except yaml.YAMLError as e:
        problems.append(f"{rel}: YAML として読めません: {e}")
        continue
    if "/workflows/" not in f"/{rel}" or not isinstance(data, dict):
        continue
    for job_name, job in (data.get("jobs") or {}).items():
        for i, step in enumerate((job or {}).get("steps") or []):
            run = step.get("run") if isinstance(step, dict) else None
            shell = step.get("shell", "bash") if isinstance(step, dict) else "bash"
            if run and "bash" in shell:
                bash_n(EXPR.sub("X", run), f"{rel}: {job_name} の {i + 1} 番目のステップ（{step.get('name', '')}）")

# 4. 古い構成の記述
OLD = re.compile(r"(?i)emdash")
for f in tracked("skills/*", "prompts/*", "AGENTS.md", "README.md", "docs/how-to-use.md",
                 "docs/claude-account.md", "docs/forms.md", "docs/other-agents.md"):
    if f.suffix in {".png", ".jpg", ".jpeg", ".webp", ".gif"}:
        continue
    for n, line in enumerate(f.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
        if OLD.search(line):
            problems.append(f"{f.relative_to(ROOT).as_posix()}:{n}: 古い構成（EmDash）の記述が残っています")

# 5. MANIFEST.txt
if "--manifest" in sys.argv[1:]:
    manifest = ROOT / "MANIFEST.txt"
    if not manifest.is_file():
        problems.append("MANIFEST.txt がありません（README の「版の付け方」の手順2）")
    else:
        listed = {}
        for line in manifest.read_text(encoding="utf-8").splitlines():
            if not line or line.startswith("#"):
                continue
            digest, _, path = line.partition("  ")
            listed[path] = digest
        actual = {f.relative_to(ROOT).as_posix(): hashlib.sha256(f.read_bytes()).hexdigest()
                  for f in tracked("LICENSE", "skills")}
        for path in sorted(set(listed) | set(actual)):
            if path not in actual:
                problems.append(f"MANIFEST.txt: リポジトリにないファイルが載っています: {path}")
            elif path not in listed:
                problems.append(f"MANIFEST.txt: 載っていないファイルがあります: {path}")
            elif listed[path] != actual[path]:
                problems.append(f"MANIFEST.txt: SHA-256 が違います: {path}")

for p in problems:
    print(p)
if problems:
    print(f"\n{len(problems)} 件の問題があります。")
    sys.exit(1)
print("問題はありませんでした。")
