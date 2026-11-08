# Redesign portfolio personal — status implementasi

Dokumen ini menggantikan rencana Research Studio yang ditolak karena terlalu kaku.

## Arah yang disetujui

Portfolio lebih hangat, personal, bersih, dan mengalir. Nama serta peran mudah dipahami; bukti proyek tetap akurat. Demo hanya Koii dan KasMate. Deployment tidak termasuk scope.

## Sudah diimplementasikan

- Hero ringkas dengan pengantar personal, Work dan Resume; diagram teknis dipindahkan ke showcase CDE.
- Warna putih hangat, charcoal, aksen vermilion, serta bidang sage/peach/lavender yang terbatas pada artefak proyek.
- Font IBM Plex lokal yang benar-benar disertakan melalui package, bukan sekadar nama fallback.
- Showcase dengan komposisi mengikuti materi: benchmark lebar, diagram CDE/OCR, preview Koii/KasMate dengan ukuran berbeda.
- Foto dalam bagian profil, tanpa teks menimpa gambar; prinsip kerja diringkas dalam narasi.
- Seluruh 16 proyek tersedia melalui library kategori dengan tautan langsung.
- Projects, About, Resume, seluruh case study, navigasi, footer, 404, favicon, dan Open Graph diselaraskan.
- Case study memiliki daftar isi dan evidence yang tetap bersumber dari konten lama.
- Video memakai poster dengan tombol Play, lalu native controls, pause offscreen, dan tanpa autoplay/resume otomatis. Tampilan poster mencegah spinner native Chromium saat metadata belum dimuat; tanpa JS tetap tersedia native player.
- CDE memakai highlight tiga tahap saat scroll desktop, tanpa pinning. Mobile, reduced motion, dan tanpa JS menampilkan semua tahap statis.
- Sumber Markdown tidak diubah. Tidak ada video baru, backend, deployment, atau push GitHub.

## Verifikasi

Build, lint, dan TypeScript lolos; 26 static outputs berhasil dibuat. Putaran konfirmasi terhadap production build lokal selesai dengan **226 pemeriksaan lolos, 0 gagal, 0 runtime errors**. Laporan final: `artifacts/redesign/confirm/report.json`.

Matriks pemeriksaan mencakup seluruh 20 halaman konten pada lebar 1440, 1366, 820, 390, dan 320px; route/link/anchor, native video controls, no-autoplay, pause offscreen, reduced motion, keyboard, no-JS, dan cetak A4.

Putaran pertama menemukan tinggi intrinsik foto About dan race pada scroll pengujian video. Ukuran foto diperbaiki dan pengujian video menunggu posisi viewport stabil sebelum menekan play. Keduanya lolos pada putaran konfirmasi. Screenshot desktop/mobile sudah ditinjau; Resume dicetak menjadi dua halaman A4 dan ditinjau. Detector Impeccable tidak menemukan temuan mekanis.

Snapshot sumber sebelum perubahan tersedia di `D:\Project\cv's\work\portfolio-before-soft-redesign-20261008-154149`.

## Catatan dependency terpisah

`npm audit` pada 8 Oktober 2026 melaporkan advisory yang sudah ada pada Next.js 16.3.4, termasuk severity critical di `next/og`. Redesign ini tidak melakukan upgrade framework; pembaruan dependency perlu ditangani sebelum publikasi. Hasil build dan UI lokal tidak berarti audit keamanan bersih.
