# Aset opening / main menu

Dipakai oleh `src/components/MainMenu.jsx` (React + CSS, bukan Phaser). Daftar URL
ada di `src/components/openingAssets.js` dan memakai `import.meta.env.BASE_URL`.

| File | Ukuran | Transparansi | Penggunaan di opening |
| --- | --- | --- | --- |
| `opening-sky.png` | 1672×941 | Tidak | Layer langit (Scene 1, di-zoom dari atas) |
| `opening-clouds.png` | 1672×941 | Alpha | Awan, drift loop pelan |
| `opening-beach-layer.png` | 1672×941 | Alpha | Pantai, laut, kampung, pegunungan (layer utama) |
| `opening-ship.png` | 1448×1086 | Alpha | Kapal layar yang berlayar pelan di laut |
| `opening-underwater-foreground.png` | 1672×941 | Alpha | Foreground karang, parallax tercepat |
| `opening-title-art.png` | 1448×1086 | Alpha | Logo judul; fallback teks Fredoka/Baloo 2 bila gagal dimuat |
| `malin-poor.png` | 1086×1448 | Alpha | Malin muda di sisi kanan menu |
| `opening-village-layer.png` | 1672×941 | Alpha | **Tidak dipakai**: isinya tumpang tindih dengan beach layer dan memuat kapal sendiri, sehingga tampil ganda |
| `malin-rich.png` | 1086×1448 | Alpha | **Tidak dipakai** di opening utama (sesuai arahan pemilik proyek) |
| `malin-stone.png` | 1086×1448 | Alpha | **Tidak dipakai** di opening utama (sesuai arahan pemilik proyek) |

## Provenance

- Diberikan oleh pemilik proyek pada 26 November 2026.
- Pembuat, jenis sumber (buatan sendiri/AI/pihak ketiga), dan lisensi: **belum dicatat**.
  Lengkapi sebelum dokumentasi final; jangan menganggapnya CC0.

## Catatan

- Total ukuran PNG yang dipakai opening ±9,5 MB. Pertimbangkan kompresi/WebP untuk
  layer tanpa kebutuhan alpha setelah diuji pada perangkat mobile.
- Musik menu belum tersedia. Isi `OPENING_MUSIC` di `openingAssets.js` setelah file ada
  (misalnya `public/assets/audio/opening-theme.mp3`).
