# Malin Kundang — Mother + NPC Sprite Pack

Paket ini berisi 5 spritesheet PNG transparan: 1 karakter Ibu Malin dan 4 karakter NPC kampung nelayan. File prompt implementasi ada di `PROMPT_UPDATE_OPENING_DAN_NPC.md`.

## Isi paket

| File | Kegunaan |
|---|---|
| `assets/characters/mother/mother-malin-spritesheet.png` | Ibu Malin: idle, berjalan, memanggil/berbicara |
| `assets/characters/npc/npc-anak-desa.png` | Anak desa: idle, berjalan, gestur |
| `assets/characters/npc/npc-nelayan.png` | Nelayan: idle, berjalan, menggunakan jala |
| `assets/characters/npc/npc-buruh-pelabuhan.png` | Buruh pelabuhan: idle, berjalan, mengangkat peti |
| `assets/characters/npc/npc-penjual-ikan.png` | Penjual ikan: berdiri membawa ikan, berjalan, menawarkan dagangan |

## Format spritesheet

Semua gambar berukuran **1448 × 1086 px**, format PNG RGBA dengan transparansi. Susunan visualnya **4 kolom × 3 baris**, sehingga ukuran sel nominal adalah **362 × 362 px**. Setiap baris mewakili jenis gerakan/aksi; lihat panduan per karakter di bawah.

### Pemetaan baris

- **Ibu Malin**: baris 1 = idle; baris 2 = berjalan; baris 3 = memanggil/berbicara.
- **Anak desa**: baris 1 = idle; baris 2 = berjalan; baris 3 = gestur/menunjuk.
- **Nelayan**: baris 1 = idle; baris 2 = berjalan; baris 3 = memegang/menggunakan jala.
- **Buruh pelabuhan**: baris 1 = idle; baris 2 = berjalan; baris 3 = mengangkat/membawa peti.
- **Penjual ikan**: baris 1 = berdiri membawa keranjang; baris 2 = berjalan; baris 3 = menawarkan/menunjukkan dagangan.

Catatan: tiap sel berukuran 362 × 362 px secara nominal. Karakter memiliki ruang transparan di dalam sel; jangan memotong setiap frame berdasarkan bounding box secara otomatis tanpa menjaga titik pijak yang konsisten. Gunakan origin/baseline kaki yang sama agar karakter tidak terlihat meloncat saat animasi.

## Penempatan ke proyek

Salin folder `assets/characters/` ke `public/assets/characters/` pada proyek Vite/React. Hasil yang disarankan:

```text
public/
└── assets/
    └── characters/
        ├── mother/
        │   └── mother-malin-spritesheet.png
        └── npc/
            ├── npc-anak-desa.png
            ├── npc-nelayan.png
            ├── npc-buruh-pelabuhan.png
            └── npc-penjual-ikan.png
```

Jika proyek sudah punya struktur folder aset yang berbeda, ikuti struktur yang sudah dipakai dan jangan membuat salinan duplikat. Di Vite, file public biasanya dirujuk dari root URL, misalnya `/assets/characters/mother/mother-malin-spritesheet.png`.

## Penting

- Preview hitam pada beberapa penampil gambar sebenarnya adalah area transparan; file PNG menyimpan alpha channel. Jangan ubah menjadi JPG.
- Sprite sheet ini adalah aset gambar, bukan kode animasi siap pakai. Prompt di file terpisah meminta AI agent memetakan frame dan membuat animasi di arsitektur React/Phaser proyek.
- Jangan mengubah gameplay Chapter 1 yang sudah berjalan selain menambahkan NPC ambient dan penyerahan kontrol dari intro.
