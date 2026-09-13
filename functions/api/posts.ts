// /api/posts —— 在线文章管理
// GET    公开：列出全部在线文章
// POST   需登录：新建文章 {title, description?, tags?, slug?, md}
// DELETE 需登录：删除文章 {id}
import { sha256Hex, SALT, COOKIE_NAME, json, isAuthed } from '../lib/_shared.js';

function makeSlug(title, provided) {
  if (provided && /^[a-z0-9-]{2,60}$/i.test(provided)) return provided.toLowerCase();
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 5);
  const ascii = title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().slice(0, 20);
  return (ascii ? ascii + '-' : 'p-') + stamp + rand;
}

export async function onRequestGet({ env }) {
  if (!env.POSTS_KV) return json({ posts: [], notice: 'KV 未绑定' });
  const list = await env.POSTS_KV.list({ prefix: 'post:' });
  const posts = await Promise.all(
    list.keys.map(async k => {
      const raw = await env.POSTS_KV.get(k.name);
      if (!raw) return null;
      try {
        const p = JSON.parse(raw);
        return {
          id: p.slug,
          slug: p.slug,
          title: p.title,
          tags: p.tags || [],
          description: p.description || '',
          date: p.created,
        };
      } catch {
        return null;
      }
    })
  );
  const clean = posts.filter(Boolean).sort((a, b) => b.date.localeCompare(a.date));
  return json({ posts: clean });
}

export async function onRequestPost({ request, env }) {
  if (!(await isAuthed(request, env))) return json({ error: '未登录' }, 401);
  if (!env.POSTS_KV) return json({ error: 'KV 未绑定' }, 500);

  const body = await request.json().catch(() => ({}));
  if (body.action === 'delete') {
    if (!body.id) return json({ error: '缺少 id' }, 400);
    await env.POSTS_KV.delete('post:' + body.id);
    return json({ ok: true, deleted: body.id });
  }

  const title = String(body.title || '').trim();
  const md = String(body.md || '').trim();
  if (!title || !md) return json({ error: '标题和正文不能为空' }, 400);

  const slug = makeSlug(title, String(body.slug || ''));
  const created = new Date().toISOString();
  const tags = Array.isArray(body.tags)
    ? body.tags
    : String(body.tags || '')
        .split(/[,，\s]+/)
        .filter(Boolean);
  const description = String(body.description || '').slice(0, 160) || md.replace(/[#>*`\-$\[\]]/g, '').slice(0, 100);

  await env.POSTS_KV.put(
    'post:' + slug,
    JSON.stringify({ slug, title, tags, description, md, created })
  );
  return json({ ok: true, slug, url: '/online/' + slug });
}
