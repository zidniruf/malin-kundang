# Referensi aset Level 1 — Kampung Nelayan

Delapan gambar gabungan dikirim pemilik proyek melalui percakapan pada
26 November 2026 untuk rencana aset game Malin Kundang.
File gambar asli belum tersedia di workspace dan **belum diimpor**.
Nama di bawah adalah nama tujuan, bukan file yang sudah ada.

| Nama file tujuan | Isi berdasarkan urutan lampiran | Status |
| --- | --- | --- |
| `l1-reference-01.png` | Asset Pack: panorama kampung, bangunan, tileset, dekorasi, dermaga, palet | Menunggu file asli |
| `l1-reference-02.png` | Asset Background: panorama dermaga, layer langit/pegunungan/desa/foreground, platform dan properti | Menunggu file asli |
| `l1-reference-03.png` | Preview komposit, enam layer parallax, variasi ground dan properti | Menunggu file asli |
| `l1-reference-04.png` | Paket Asset Background: panorama, enam layer, bangunan, tile modular dan detail tambahan | Menunggu file asli |
| `l1-reference-05.png` | Kampung Halaman: panorama, lima layer, bangunan, vegetasi, platform dan dekorasi laut | Menunggu file asli |
| `l1-reference-06.png` | Layered Background: lima layer, platform, objek gameplay, bangunan dan aset pendukung | Menunggu file asli |
| `l1-reference-07.png` | Asset Background 2D Stylized: enam layer, tilemap, platform dan objek dekoratif | Menunggu file asli |
| `l1-reference-08.png` | Panorama teluk dan air terjun, contoh susunan parallax, platform, properti dan palet | Menunggu file asli |

## Sumber dan penggunaan

- Penyedia: pemilik proyek melalui lampiran percakapan.
- Pembuat asli, alat pembuatan, penggunaan AI, dan lisensi: belum dikonfirmasi.
- Penggunaan yang direncanakan: referensi visual dan calon bahan aset Level 1.
- Belum ada gambar yang dipasang pada gameplay atau dimuat oleh aplikasi.

## Persiapan aset produksi

Sesuai `agent.md` dan `PRD.md`, sheet gabungan berlabel tidak digunakan
langsung sebagai background gameplay final. Simpan file asli di folder ini
sesuai urutan lampiran, kemudian siapkan aset terpisah:

- Background di `public/assets/backgrounds/level-1/`: langit, pegunungan,
  hutan jauh, permukiman, dan foreground dengan key konsisten seperti `l1-sky`.
- Bangunan, vegetasi, perahu, properti, dan platform di
  `public/assets/objects/`, dengan nama berawalan `l1-`.
- Objek dan layer yang membutuhkan transparansi menggunakan format yang
  mendukung alpha; warna gelap pada sheet belum membuktikan transparansi.
- Hilangkan judul, label, bingkai panel, dan palet dari aset gameplay.
- Pisahkan dekorasi dari collision/platform dan periksa sambungan tile.
- Catat sumber, lisensi, proses modifikasi, ukuran, dan penggunaan aktual
  setiap aset setelah file produksi tersedia.

Enam layer baru sudah dibuat ulang dengan AI berdasarkan referensi dan disimpan
di `public/assets/backgrounds/level-1/`; lihat README folder tersebut dan
`asset-generation.json` di root untuk rincian dan prompt. Delapan file asli
lampiran tetap belum diimpor, dan objek individual dari sheet belum dipisahkan.

Kanvas acuan gameplay
1280×720 tidak berarti potongan kecil dari sheet memiliki resolusi produksi
tersebut.
