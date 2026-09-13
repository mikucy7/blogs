// GET /admin —— 在线发文编辑器（需口令登录）
import { sha256Hex, SALT, COOKIE_NAME, isAuthed, html } from './lib/_shared.js';

function loginPage(err) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>拾光集 · 管理登录</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #fcfcfd; color: #1f2937; font-family: "Segoe UI", "Microsoft YaHei", sans-serif; }
  .card { width: min(380px, 90vw); padding: 42px 36px 34px; text-align: center;
    background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; box-shadow: 0 10px 40px -18px rgba(13,148,136,.35); }
  .glyph { font-size: 30px; color: #0d9488; }
  h1 { font-size: 20px; margin: 14px 0 4px; }
  .sub { color: #6b7280; font-size: 13px; margin-bottom: 24px; }
  input { width: 100%; padding: 12px 14px; font-size: 15px; border: 1px solid #d1d5db;
    border-radius: 10px; outline: none; text-align: center; }
  input:focus { border-color: #0d9488; box-shadow: 0 0 0 3px rgba(13,148,136,.15); }
  button { width: 100%; margin-top: 14px; padding: 12px; font-size: 15px; font-weight: 600;
    color: #fff; background: #0d9488; border: none; border-radius: 10px; cursor: pointer; }
  button:hover { background: #0f766e; }
  .err { color: #dc2626; font-size: 13px; margin-top: 12px; min-height: 18px; }
</style>
</head>
<body>
  <form class="card" method="POST" action="/api/login">
    <div class="glyph">✒️</div>
    <h1>拾光集 · 写作入口</h1>
    <div class="sub">请输入管理员口令</div>
    <input type="password" name="password" placeholder="口令" autofocus>
    <input type="hidden" name="next" value="/admin">
    <button type="submit">进 入</button>
    <div class="err">${err ? '✗ 口令不正确' : ''}</div>
  </form>
</body>
</html>`;
}

function editorPage() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>拾光集 · 写作台</title>
<style>
  :root { --acc: #0d9488; --line: #e5e7eb; --dim: #6b7280; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f8faf9; color: #1f2937; font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
    line-height: 1.7; padding: 34px 18px 80px; }
  .wrap { max-width: 860px; margin: 0 auto; }
  header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; flex-wrap: wrap; gap: 10px; }
  h1 { font-size: 22px; }
  h1 span { color: var(--acc); }
  .hint { color: var(--dim); font-size: 13px; }
  .panel { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 22px; margin-bottom: 22px; }
  label { display: block; font-size: 13px; color: var(--dim); margin: 14px 0 5px; }
  input, textarea { width: 100%; padding: 10px 13px; font-size: 14.5px; border: 1px solid #d1d5db;
    border-radius: 9px; outline: none; font-family: inherit; background: #fff; }
  input:focus, textarea:focus { border-color: var(--acc); box-shadow: 0 0 0 3px rgba(13,148,136,.12); }
  textarea { min-height: 380px; font-family: Consolas, "Microsoft YaHei", monospace; line-height: 1.8; resize: vertical; }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .pub { width: 100%; margin-top: 18px; padding: 13px; font-size: 15.5px; font-weight: 700; letter-spacing: 3px;
    color: #fff; background: linear-gradient(120deg, #0d9488, #14b8a6); border: none; border-radius: 10px; cursor: pointer; }
  .pub:hover { filter: brightness(1.08); }
  .pub:disabled { opacity: .55; cursor: wait; }
  .status { margin-top: 12px; font-size: 13.5px; min-height: 20px; }
  .status.ok { color: #059669; }
  .status.bad { color: #dc2626; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  td { padding: 9px 6px; border-top: 1px solid var(--line); }
  td a { color: var(--acc); text-decoration: none; }
  td.del { text-align: right; }
  td.del button { background: none; border: 1px solid #fca5a5; color: #dc2626; border-radius: 7px;
    padding: 3px 10px; cursor: pointer; font-size: 12.5px; }
  td.del button:hover { background: #fef2f2; }
  @media (max-width: 640px) { .row { grid-template-columns: 1fr; } }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>✒️ 拾光集 <span>· 写作台</span></h1>
    <span class="hint">发布后即刻上线 · 无需 git</span>
  </header>

  <div class="panel">
    <label>标题 *</label>
    <input id="title" placeholder="文章标题">
    <div class="row">
      <div>
        <label>标签（逗号分隔）</label>
        <input id="tags" placeholder="随笔, 生活">
      </div>
      <div>
        <label>自定义链接（可选，英文数字）</label>
        <input id="slug" placeholder="留空自动生成">
      </div>
    </div>
    <label>摘要（可选，列表展示用）</label>
    <input id="desc" placeholder="留空则自动截取正文开头">
    <label>正文（Markdown，支持 $$公式$$）*</label>
    <textarea id="md" placeholder="# 标题&#10;&#10;正文……"></textarea>
    <button class="pub" id="publish">发 布</button>
    <div class="status" id="status"></div>
  </div>

  <div class="panel">
    <label style="margin-top:0">已发布的在线文章</label>
    <table><tbody id="list"><tr><td style="color:var(--dim)">加载中…</td></tr></tbody></table>
  </div>
</div>

<script>
let cookieOk = false;
async function refresh() {
  const r = await fetch('/api/posts');
  const d = await r.json();
  const tb = document.getElementById('list');
  const posts = d.posts || [];
  if (!posts.length) { tb.innerHTML = '<tr><td style="color:var(--dim)">还没有在线文章，发布第一篇吧。</td></tr>'; return; }
  tb.innerHTML = posts.map(p =>
    '<tr><td><a href="/online/' + p.slug + '" target="_blank">' + p.title + '</a>' +
    ' <span style="color:var(--dim);font-size:12px">' + (p.date || '').slice(0, 10) + '</span></td>' +
    '<td class="del"><button onclick="delPost(\\'' + p.slug + '\\')">删除</button></td></tr>'
  ).join('');
}
async function delPost(id) {
  if (!confirm('确定删除《' + id + '》？')) return;
  await fetch('/api/posts', { method: 'DELETE', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'delete', id }) });
  refresh();
}
document.getElementById('publish').addEventListener('click', async () => {
  const st = document.getElementById('status');
  const btn = document.getElementById('publish');
  const payload = {
    title: document.getElementById('title').value.trim(),
    tags: document.getElementById('tags').value,
    slug: document.getElementById('slug').value.trim(),
    description: document.getElementById('desc').value.trim(),
    md: document.getElementById('md').value,
  };
  if (!payload.title || !payload.md) { st.className = 'status bad'; st.textContent = '标题和正文不能为空'; return; }
  btn.disabled = true; st.className = 'status'; st.textContent = '发布中…';
  try {
    const r = await fetch('/api/posts', { method: 'POST',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || r.status);
    st.className = 'status ok';
    st.innerHTML = '✅ 已发布：<a href="/online/' + d.slug + '" target="_blank">查看文章</a>';
    document.getElementById('title').value = '';
    document.getElementById('md').value = '';
    document.getElementById('slug').value = '';
    document.getElementById('desc').value = '';
    refresh();
  } catch (e) {
    st.className = 'status bad'; st.textContent = '发布失败：' + e.message;
  } finally { btn.disabled = false; }
});
refresh();
</script>
</body>
</html>`;
}

export async function onRequestGet({ request, env }) {
  if (!(await isAuthed(request, env))) return html(loginPage(false));
  return html(editorPage());
}

export async function onRequestPost({ request, env }) {
  // 登录表单提交（form-encoded）
  const expected = env.SITE_PASSWORD || '';
  const form = await request.formData();
  const pwd = String(form.get('password') || '');
  const next = String(form.get('next') || '/admin');
  if (!expected || pwd !== expected) {
    return html(loginPage(true), 401);
  }
  const token = await sha256Hex(SALT + expected);
  return new Response(null, {
    status: 302,
    headers: {
      Location: next.startsWith('/') && !next.startsWith('//') ? next : '/admin',
      'Set-Cookie': `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`,
    },
  });
}
