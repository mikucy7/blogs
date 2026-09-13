// 拾光集 在线发文系统 —— 共享工具函数
// 口令：环境变量 SITE_PASSWORD（wrangler pages secret put SITE_PASSWORD --project-name blogs）

export const SALT = 'shiguang-admin-v1';
export const COOKIE_NAME = 'shiguang_admin';
export const MAX_AGE = 60 * 60 * 24 * 7; // 编辑会话 7 天

export async function sha256Hex(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders },
  });
}

export async function isAuthed(request, env) {
  const expected = env.SITE_PASSWORD || '';
  if (!expected) return false;
  const token = await sha256Hex(SALT + expected);
  const cookies = request.headers.get('Cookie') || '';
  return cookies.split(/;\s*/).some(c => c === `${COOKIE_NAME}=${token}`);
}

export function html(body, status = 200, extraHeaders = {}) {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...extraHeaders },
  });
}
