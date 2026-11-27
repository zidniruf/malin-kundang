# Aset opening cinematic

> **Status 26 November 2026:** file `01-…10-…png` di folder ini **tidak dipakai kode**
> dan identik dengan `public/assets/opening/`. Yang dipakai cinematic sekarang adalah
> subfolder `village/` (lihat README di sana). File lama tidak dihapus tanpa persetujuan
> pemilik proyek. Tabel di bawah adalah catatan penggunaan versi sebelumnya.

Dipakai oleh `src/components/OpeningCinematic.jsx` (React + CSS). Daftar URL, timeline,
keyframe kamera/kapal, dan teks narasi ada di `src/components/cinematicConfig.js`.

| File | Penggunaan |
| --- | --- |
| `01-sky.png` | Langit, parallax paling lambat (Scene 1–5) |
| `02-clouds.png` | Strip awan berulang (A + cermin A) bergerak kiri → kanan |
| `03-village-mountains.png` | Hanya shot Chapter 1 (Scene 5); tidak ditumpuk dengan `04` karena isinya sama |
| `04-beach-sea.png` | Dunia utama Scene 1–4: pegunungan, laut, kampung |
| `05-sailing-ship.png` | Kapal; haluan menghadap kiri, jadi berlayar ke kiri saat berangkat |
| `06-underwater-foreground.png` | Foreground karang, parallax tercepat |
| `07-title-logo.png` | Judul Scene 1 |
| `08-malin-poor.png` | Malin muda, Scene 3 |
| `09-malin-rich-later-story.png` | Belum dipakai (untuk cerita selanjutnya) |
| `10-malin-stone-later-story.png` | Belum dipakai (untuk cerita selanjutnya) |

## Catatan

- File-file ini identik (checksum sama) dengan file di `public/assets/opening/`; browser
  mengunduhnya dua kali karena URL berbeda. Pertimbangkan memakai satu folder saja.
- Belum ada aset ibu Malin. Isi `CINEMATIC_IMAGES.mother` di `cinematicConfig.js`
  dengan PNG transparan agar ibu tampil di Scene 3.
- Pegunungan dan kampung menyatu dalam satu gambar sehingga keduanya bergerak dengan
  kecepatan parallax yang sama.
- Pembuat, jenis sumber, dan lisensi: **belum dicatat**. Lengkapi sebelum dokumentasi final.
