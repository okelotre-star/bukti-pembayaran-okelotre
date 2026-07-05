OKELOTRE BUKTI JP - Cloudflare Pages + R2
Tema: biru putih petir neon

LINK:
- Halaman utama: /
- Admin upload: /admin/

CARA PASANG DI CLOUDFLARE PAGES:
1. Extract file ZIP ini.
2. Upload folder project ke Cloudflare Pages / GitHub.
3. Buat R2 bucket bernama:
   bukti-jp-images
4. Masuk ke project Pages:
   Settings > Bindings > Add > R2 bucket
   Binding / Variable name: BUKTI_BUCKET
   Bucket: bukti-jp-images
5. Masuk ke:
   Settings > Environment variables
   Tambahkan variable:
   ADMIN_PASSWORD = password-kuat-kamu
6. Deploy ulang.
7. Buka /admin/ untuk upload gambar.
8. Buka / untuk melihat gambar tampil otomatis.

EDIT LINK LOGIN/DAFTAR/PROMO/WHATSAPP:
Buka file index.html, cari:
https://okenaga.com/okelogin
https://okenaga.com/okedaftar
https://okenaga.com/okelogin
https://okenaga.com/okelotre
https://direct.lc.chat/18176232/

Catatan:
- Jangan taruh password asli di file HTML.
- Password admin harus dibuat dari Cloudflare Environment Variables.
- Upload maksimal 8MB per gambar.
