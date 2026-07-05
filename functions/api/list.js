export async function onRequestGet({ env }) {
  const bucket = env.BUKTI_BUCKET;
  if (!bucket) return json({ ok: false, error: 'R2 binding BUKTI_BUCKET belum diset.' }, 500);

  const list = await bucket.list({ prefix: 'uploads/', include: ['customMetadata'] });
  const items = list.objects
    .sort((a, b) => new Date(b.uploaded || 0) - new Date(a.uploaded || 0))
    .map((object) => {
      const meta = object.customMetadata || {};
      return {
        key: object.key,
        url: `/img/${encodeKey(object.key)}`,
        size: object.size,
        uploaded: object.uploaded,
        category: meta.category || 'bank',
        displayName: meta.displayName || '',
        amount: meta.amount || '',
        originalName: meta.originalName || ''
      };
    });

  return json({ ok: true, items });
}

function encodeKey(key) {
  return key.split('/').map(encodeURIComponent).join('/');
}
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}
