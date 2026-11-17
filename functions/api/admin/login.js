function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST,OPTIONS', 'access-control-allow-headers': 'content-type' } });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST,OPTIONS', 'access-control-allow-headers': 'content-type' } });
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    if (!env.WCS_ADMIN_API_KEY || body.password !== env.WCS_ADMIN_API_KEY) return json({ error: 'Invalid credentials' }, 401);
    const token = `${crypto.randomUUID()}-${crypto.randomUUID()}`;
    await env.WCS_DB.prepare('INSERT INTO admin_sessions (token, expires_at) VALUES (?, ?)').bind(token, Date.now() + 1000 * 60 * 60 * 12).run();
    return json({ ok: true, token });
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }
}
