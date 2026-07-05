export async function onRequestGet({ request, env }) {
  const bucket = env.BUKTI_BUCKET;
  if (!bucket) return new Response('R2 binding BUKTI_BUCKET belum diset.', { status: 500 });

  const url = new URL(request.url);
  const key = decodeURIComponent(url.pathname.replace(/^\/img\//, ''));
  if (!key || !key.startsWith('uploads/')) return new Response('Not found', { status: 404 });

  const object = await bucket.get(key);
  if (!object) return new Response('Not found', { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  return new Response(object.body, { headers });
}
