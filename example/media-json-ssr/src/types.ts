// scripts/build-data.mjs が書き出す JSON の形

export interface ImageRef {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface PostEntry {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  image: ImageRef | null;
}

export interface PostDetail {
  slug: string;
  title: string;
  date: string;
  updated: string | null;
  author: string;
  authorName: string;
  tags: { slug: string; name: string }[];
  summary: string;
  image: ImageRef | null;
  html: string;
}

export interface IndexShard {
  key: string;
  count: number;
  posts: PostEntry[];
}

export interface TagShard extends IndexShard {
  slug: string;
  name: string;
  // 年ごとのファイル（tags/<タグ>.json だけにある。記事が多くて分けたタグのとき）
  years?: { year: string; count: number }[];
  // 年ごとのファイルのときの年
  year?: string;
}

export interface ShardsDoc {
  total: number;
  shards: { key: string; year: string; count: number }[];
  tags: { slug: string; name: string; count: number }[];
}
