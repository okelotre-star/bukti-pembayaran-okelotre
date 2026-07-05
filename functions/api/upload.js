export async function onRequestPost({ request, env }) {
  const bucket = env.BUKTI_BUCKET;
  if (!bucket) return json({ ok: false, error: 'R2 binding BUKTI_BUCKET belum diset.' }, 500);

  const adminPassword = env.ADMIN_PASSWORD;
  if (!adminPassword) return json({ ok: false, error: 'Environment variable ADMIN_PASSWORD belum diset.' }, 500);

  const form = await request.formData();
  const password = form.get('password');
  const file = form.get('file');
  const category = normalizeCategory(form.get('category'));
  const displayName = cleanText(form.get('displayName') || '', 32);
  const amount = cleanText(form.get('amount') || '', 32);

  if (password !== adminPassword) return json({ ok: false, error: 'Password admin salah.' }, 401);
  if (!file || typeof file === 'string') return json({ ok: false, error: 'File gambar tidak ditemukan.' }, 400);
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
    return json({ ok: false, error: 'Format gambar harus JPG, PNG, WEBP, atau GIF.' }, 400);
  }
  if (file.size > 8 * 1024 * 1024) return json({ ok: false, error: 'Ukuran maksimal 8MB.' }, 400);

  const safeName = sanitizeFileName(file.name || 'bukti-jp');
  const ext = extensionFromType(file.type, safeName);
  const key = `uploads/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  await bucket.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
    customMetadata: {
      originalName: safeName,
      category,
      displayName,
      amount
    }
  });

  return json({ ok: true, key, url: `/img/${encodeKey(key)}` });
}

function normalizeCategory(value) {
  const v = String(value || 'bank').toLowerCase();
  return ['bank', 'ewallet', 'qris'].includes(v) ? v : 'bank';
}
function cleanText(value, max) {
  return String(value || '').replace(/[<>]/g, '').trim().slice(0, max);
}
function sanitizeFileName(name) {
  return String(name).toLowerCase().replace(/[^a-z0-9._-]/g, '-').replace(/-+/g, '-').slice(0, 80);
}
function extensionFromType(type, name) {
  if (type === 'image/png') return 'png';
  if (type === 'image/webp') return 'webp';
  if (type === 'image/gif') return 'gif';
  if (name.includes('.')) {
    const ext = name.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg'].includes(ext)) return 'jpg';
  }
  return 'jpg';
}
function encodeKey(key) {
  return key.split('/').map(encodeURIComponent).join('/');
}
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}
