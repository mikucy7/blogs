// POST /api/login —— 管理员登录（口令 → 编辑会话 Cookie）
import { sha256Hex, SALT, COOKIE_NAME, MAX_AGE, json } from '../lib/_shared.js';

export async function onRequestPost({ request, env }) {
  try {
    const expected = env.SITE_PASSWORD || '';
    if (!expected) return json({ error: 'DEBUG: expected 为空', keys: Object.keys(env || {}), raw: String(env && env.SITE_PASSWORD) }, 500);

    const form = await request.formData();
    const pwd = String(form.get('password') || '');
    const next = String(form.get('next') || '/admin');

    if (!pwd || pwd !== expected) {
      return json({ error: '口令不正确' }, 401);
    }
    const token = await sha256Hex(SALT + expected);
    return new Response(null, {
      status: 302,
      headers: {
        Location: next.startsWith('/') && !next.startsWith('//') ? next : '/admin',
        'Set-Cookie': `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`,
      },
    });
  } catch (e) {
    return json({ error: 'DEBUG: ' + (e && e.message), stack: String(e && e.stack || '').slice(0, 300) }, 500);
  }
}
