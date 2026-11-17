function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET,POST,DELETE,OPTIONS', 'access-control-allow-headers': 'content-type,x-wcs-admin-key' }
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET,POST,DELETE,OPTIONS', 'access-control-allow-headers': 'content-type,x-wcs-admin-key' } });
}

export async function onRequestGet({ request, env }) {
  if (!(await isAuthorized(request, env))) return json({ error: 'Unauthorized' }, 401);
  const { results } = await env.WCS_DB.prepare(
    'SELECT id, name, phone, course, description, date, status FROM requests ORDER BY created_at DESC'
  ).all();
  return json({ requests: results || [] });
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const id = `request-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const name = String(body.name || '').trim().slice(0, 160);
    const phone = String(body.phone || '').trim().slice(0, 80);
    const course = String(body.course || '').trim().slice(0, 200);
    const description = String(body.description || '').trim().slice(0, 2000);
    if (!name || !phone) return json({ error: 'Name and phone are required' }, 400);
    await env.WCS_DB.prepare(
      'INSERT INTO requests (id, name, phone, course, description, date, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, name, phone, course, description, new Date().toLocaleDateString('ru-RU'), 'Новая', Date.now()).run();
    return json({ ok: true, request: { id, name, phone, course, description, status: 'Новая' } }, 201);
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }
}

export async function onRequestDelete({ request, env }) {
  if (!(await isAuthorized(request, env))) return json({ error: 'Unauthorized' }, 401);
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return json({ error: 'Request id is required' }, 400);
  await env.WCS_DB.prepare('DELETE FROM requests WHERE id = ?').bind(id).run();
  return json({ ok: true });
}

async function isAuthorized(request, env) {
  const token = request.headers.get('x-wcs-admin-token');
  if (!token) return false;
  const session = await env.WCS_DB.prepare('SELECT token FROM admin_sessions WHERE token = ? AND expires_at > ?').bind(token, Date.now()).first();
  return Boolean(session);
}
