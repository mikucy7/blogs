// GET /online/<slug> —— 渲染在线发布的文章
import { marked } from 'marked';
import { html } from '../lib/_shared.js';

export async function onRequestGet({ params, env }) {
  const slug = String(params.slug || '');
  if (!env.POSTS_KV) return html('<p>KV 未绑定</p>', 500);
  const raw = await env.POSTS_KV.get('post:' + slug);
  if (!raw) return html('<p>文章不存在</p>', 404);

  const post = JSON.parse(raw);
  const content = marked.parse(post.md || '');
  const tagsHtml = (post.tags || []).map(t => `<span class="tag">#${t}</span>`).join(' ');
  const dateStr = (post.created || '').slice(0, 10);

  const page = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${post.title} · 拾光集</title>
<meta name="description" content="${(post.description || '').replace(/"/g, '&quot;')}">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"
  onload="renderMathInElement(document.body, {delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}], throwOnError:false})"></script>
<style>
  :root { --fg: #1f2937; --dim: #6b7280; --acc: #0d9488; --line: #e5e7eb; }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 0; background: #fcfcfd; color: var(--fg);
    font-family: "Segoe UI", "Microsoft YaHei", "PingFang SC", sans-serif;
    line-height: 1.9;
  }
  .wrap { max-width: 760px; margin: 0 auto; padding: 48px 22px 80px; }
  .back { display: inline-block; color: var(--dim); text-decoration: none; font-size: 14px; margin-bottom: 28px; }
  .back:hover { color: var(--acc); }
  h1 { font-size: 30px; line-height: 1.4; margin: 10px 0 6px; }
  .meta { color: var(--dim); font-size: 13.5px; display: flex; gap: 14px; flex-wrap: wrap; align-items: center;
    border-bottom: 1px solid var(--line); padding-bottom: 18px; margin-bottom: 30px; }
  .tag { color: var(--acc); font-size: 13px; }
  .content h2 { font-size: 22px; margin: 34px 0 14px; padding-bottom: 8px; border-bottom: 1px solid var(--line); }
  .content h3 { font-size: 18px; margin: 26px 0 10px; }
  .content p { margin: 0 0 18px; }
  .content code { background: #f1f5f4; border-radius: 5px; padding: 2px 7px; font-size: 0.9em; color: #0f766e; }
  .content pre { background: #0f172a; color: #e2e8f0; padding: 18px; border-radius: 12px; overflow-x: auto; }
  .content pre code { background: none; color: inherit; padding: 0; }
  .content blockquote { margin: 20px 0; padding: 10px 20px; border-left: 3px solid var(--acc); color: var(--dim); background: #f6faf9; }
  .content img { max-width: 100%; border-radius: 10px; }
  .foot { margin-top: 56px; padding-top: 18px; border-top: 1px solid var(--line);
    color: var(--dim); font-size: 13px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
  .foot a { color: var(--acc); text-decoration: none; }
</style>
</head>
<body>
<div class="wrap">
  <a class="back" href="/blog">← 返回文章列表</a>
  <h1>${post.title}</h1>
  <div class="meta">
    <span>📅 ${dateStr}</span>
    ${tagsHtml}
  </div>
  <div class="content">${content}</div>
  <div class="foot">
    <span>© 拾光集 · 转载请注明出处</span>
    <a href="https://pure-shiguang.pages.dev/">pure-shiguang.pages.dev</a>
  </div>
</div>
</body>
</html>`;
  return html(page);
}
