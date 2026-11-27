# Malin Kundang - Chapter 1 Ready Assets

Paket ini berisi background per area, overlay transparan, tiles/platform, objek lingkungan, item ikan, parallax strip, dan spritesheet NPC opsional. Gaya visual mengikuti kampung nelayan Minangkabau tropis yang sudah dipilih.

## Struktur

- `backgrounds/area-01` sampai `area-06`: background masing-masing area, sudah dinormalisasi untuk viewport game.
- `backgrounds/world-map-preview.png`: gabungan seluruh segmen untuk pratinjau level; bukan pengganti segmen individual.
- `backgrounds/parallax/`: strip layer tambahan untuk efek kedalaman.
- `overlays/`: aset RGBA transparan berukuran lebar (kampung panggung, dermaga, pesisir, kapal).
- `elements/tiles/`: potongan platform dan terrain.
- `elements/buildings/`: rumah panggung, lapak, rak ikan, dan tiang lampu.
- `elements/props/`: batu, semak, peti, tong, papan, dan elemen dermaga.
- `elements/items/`: ikon ikan untuk inventori / jualan.
- `characters/npc/`: spritesheet NPC opsional.
- `references/`: atlas sumber sebagai referensi crop; jangan dipakai sebagai background gameplay.

## Penempatan ke proyek

Salin folder `backgrounds`, `overlays`, `elements`, dan `characters` ke:

```text
public/assets/chapter-1/
```

Contoh hasil:

```text
public/assets/chapter-1/backgrounds/area-01-rumah-malin.png
public/assets/chapter-1/elements/tiles/grass-platform-long.png
public/assets/chapter-1/overlays/long-wooden-pier-strip.png
```

## Contoh preload Phaser

```js
this.load.image('bg-rumah', '/assets/chapter-1/backgrounds/area-01-rumah-malin.png');
this.load.image('bg-dermaga', '/assets/chapter-1/backgrounds/area-02-dermaga-nelayan.png');
this.load.image('bg-dermaga-rusak', '/assets/chapter-1/backgrounds/area-03-dermaga-rusak.png');
this.load.image('bg-jalan-kampung', '/assets/chapter-1/backgrounds/area-04-jalan-kampung.png');
this.load.image('bg-pasar', '/assets/chapter-1/backgrounds/area-05-pasar-ikan.png');
this.load.image('bg-pelabuhan', '/assets/chapter-1/backgrounds/area-06-pelabuhan.png');
this.load.image('tile-grass-long', '/assets/chapter-1/elements/tiles/grass-platform-long.png');
this.load.image('market-stall', '/assets/chapter-1/elements/buildings/fish-market-stall.png');
this.load.image('fish-kembung', '/assets/chapter-1/elements/items/fish-kembung.png');
```

## Menyusun world map

Baca `map-layout.json` untuk posisi X setiap segmen. Total world: **8560 × 720 px**. Area 4 lebih lebar (2160 px) supaya perjalanan ke pasar terasa lebih panjang. Gunakan `x` dan `width` dari JSON saat membuat background GameObjects.

## Penting untuk Phaser

1. Jangan gunakan gambar background sebagai collider. Buat collider lantai, papan, lubang, peti, dan batu secara terpisah.
2. Background area adalah komposisi ilustrasi; beberapa properti visual sudah menyatu di gambar. Hindari menumpuk overlay yang menggandakan rumah atau dermaga yang sama.
3. Aset objek hasil crop dari atlas sudah dibuat dengan alpha transparan. Periksa ukuran dan posisi sprite sebelum menetapkan origin / physics body.
4. NPC di folder `characters/npc` adalah sheet visual; ukuran frame dan urutan animasinya perlu dicocokkan dengan grid aktual sebelum dipakai di animasi Phaser.
5. UI jualan (teks, tombol harga, indikator timbangan) sebaiknya dibuat dengan React/Phaser UI, bukan memakai teks yang tercetak di gambar atlas.

## Lisensi dan sumber

Aset visual dalam paket ini dibuat / diproses menggunakan AI untuk prototipe proyek ini. Alat pembuat dan ketentuan lisensi spesifik tidak tercatat dalam paket sumber. Untuk laporan akademik, cantumkan bahwa aset dibuat dengan bantuan AI dan tambahkan nama alat serta ketentuan penggunaan yang benar-benar kamu pakai.
