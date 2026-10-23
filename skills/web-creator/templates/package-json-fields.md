# package.json に入れる項目

サイトのリポジトリの package.json に、次の項目を入れます。`<...>` は作るときの最新版にします（runtime-update スキルの「最新版の調べ方」）。

```jsonc
{
  "private": true,
  "type": "module",
  // pnpm のバージョン。GitHub Actions（pnpm/action-setup）もここを読む
  "packageManager": "pnpm@<最新版>",
  // Node.js は .node-version と同じメジャーバージョンにする
  "engines": { "node": ">=<.node-version のメジャー>" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

- 依存パッケージは、追加するときに最新版を入れる（`pnpm add <パッケージ>@latest`、`pnpm add -D <パッケージ>@latest`）
- バージョンの範囲は pnpm の既定（`^`）のままにし、実際に使う版は pnpm-lock.yaml で固定する
