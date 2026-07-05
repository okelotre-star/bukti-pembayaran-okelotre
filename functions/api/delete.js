export async function onRequestPost({ request, env }) {
  const bucket = env.BUKTI_BUCKET;
  if (!bucket) return json({ ok: false, error: 'R2 binding BUKTI_BUCKET belum diset.' }, 500);

  const adminPassword = env.ADMIN_PASSWORD;
  if (!adminPassword) return json({ ok: false, error: 'Environment variable ADMIN_PASSWORD belum diset.' }, 500);

  const body = await request.json().catch(() => ({}));
  if (body.password !== adminPassword) return json({ ok: false, error: 'Password admin salah.' }, 401);
  if (!body.key || typeof body.key !== 'string' || !body.key.startsWith('uploads/')) {
    return json({ ok: false, error: 'Key gambar tidak valid.' }, 400);
  }

  await bucket.delete(body.key);
  return json({ ok: true });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}
