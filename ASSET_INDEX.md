# Indeks aset gambar

Semua PNG di `public/assets/` (ikut ke build produksi). Asal-usul, alat, dan status
lisensi ada di [ASSET_PROVENANCE.md](ASSET_PROVENANCE.md). Terakhir diperbarui: 26 November 2026.

## Lingkungan utama

Satu lokasi untuk cinematic, Chapter 1, dan Level 1: **kampung nelayan pesisir
Minangkabau di atas air**, berupa rumah panggung, dermaga kayu sebagai jalur berjalan,
laut biru jernih, bukit hijau jauh, perahu nelayan, kapal layar, dan suasana pagi.
Main Menu (pantai berpasir dengan teluk) tetap seperti sebelumnya dan menjadi titik awal.
Cinematic berjalan dari pantai itu menuju kampung dermaga.

Desain ibu Malin mengacu ke `characters/mother/mother-standing.png`: kerudung merah
bermotif, selendang krem, baju krem sederhana, kain bawahan marun.

## Daftar file

| File (`public/assets/…`) | Ukuran px | Mode | KB | Status | Dipakai oleh |
| --- | --- | --- | ---: | --- | --- |
| `chapter-1/kit/*.webp` (118 elemen + 7 strip) | beragam (lihat `src/game/chapter1/kit.json`) | RGBA | ±5700 total | Aktif | World map Chapter 1 modular (gameplay + babak kampung intro), disusun `chapter1/layout.js` |
| `chapter-1/world/world-0.webp` … `world-3.webp` | 2052×724 (terakhir 256×724) | RGB | 527/412/528/65 | Disimpan | World map Chapter 1 lama (satu gambar per bagian); tidak dimuat lagi |
| `backgrounds/level-1/l1-dermaga-tall.png` | 1280×849 | RGB | 1516 | Disimpan | Latar Chapter 1 satu layar sebelumnya (masih didefinisikan di `level1Assets.js` untuk `LevelOnePreview`, tidak dimuat game) |
| `backgrounds/level-1/l1-dermaga.png` | 1280×720 | RGB | 1291 | Disimpan | Versi 16:9 sebelumnya; diganti `l1-dermaga-tall.png` |
| `backgrounds/level-1/l1-foreground.png` | 1672×941 | RGBA | 361 | Disimpan | Layer Level 1 lama (`level1LegacyAssets`) |
| `backgrounds/level-1/l1-forest.png` | 1672×941 | RGBA | 818 | Disimpan | Layer Level 1 lama (`level1LegacyAssets`) |
| `backgrounds/level-1/l1-ground.png` | 1672×941 | RGBA | 693 | Disimpan | Layer Level 1 lama (`level1LegacyAssets`) |
| `backgrounds/level-1/l1-mountains.png` | 1672×941 | RGBA | 1117 | Disimpan | Layer Level 1 lama (`level1LegacyAssets`) |
| `backgrounds/level-1/l1-sky.png` | 1672×941 | RGB | 1470 | Disimpan | Layer Level 1 lama (`level1LegacyAssets`) |
| `backgrounds/level-1/l1-village.png` | 1672×941 | RGBA | 1188 | Disimpan | Layer Level 1 lama (`level1LegacyAssets`) |
| `characters/malin/malin-gameplay-spritesheet.png` | 2240×1400 | RGBA | 1298 | Aktif | Phaser Level 1 (`malinAssets.js`) dan adegan kampung cinematic: Malin tanpa bawaan |
| `characters/malin/malin-opening-spritesheet.png` | 2240×840 | RGBA | 820 | Disimpan | Malin membawa buntalan (`malinOpeningAssets.js`); untuk adegan keberangkatan nanti. Adegan keseharian memakai sheet gameplay |
| `characters/malin/malin-spritesheet.png` | 1680×840 | RGBA | 486 | Disimpan | Sheet gameplay lama 6×3; tidak dimuat |
| `characters/mother/mother-malin-spritesheet.png` | 800×648 | RGBA | 352 | Aktif | Ibu beranimasi: cinematic babak kampung + NPC cerita Chapter 1 |
| `characters/mother/mother-standing.png` | 1024×1536 | RGBA | 1722 | Cadangan | Fallback bila sheet Ibu gagal dimuat (acuan desain) |
| `characters/npc/npc-anak-desa.png` | 800×648 | RGBA | 275 | Aktif | NPC ambient Chapter 1 |
| `characters/npc/npc-buruh-pelabuhan.png` | 800×648 | RGBA | 327 | Aktif | NPC ambient Chapter 1 (peti = frame `crate`) |
| `characters/npc/npc-nelayan.png` | 800×648 | RGBA | 338 | Aktif | NPC ambient Chapter 1 |
| `characters/npc/npc-penjual-ikan.png` | 800×648 | RGBA | 370 | Aktif | NPC ambient Chapter 1 |
| `cinematic/01-sky.png` | 1672×941 | RGB | 1592 | Duplikat, tidak dipakai | Salinan identik aset `opening/` |
| `cinematic/02-clouds.png` | 1672×941 | RGBA | 2061 | Duplikat, tidak dipakai | Salinan identik aset `opening/` |
| `cinematic/03-village-mountains.png` | 1672×941 | RGBA | 1063 | Duplikat, tidak dipakai | Salinan identik aset `opening/` |
| `cinematic/04-beach-sea.png` | 1672×941 | RGBA | 1540 | Duplikat, tidak dipakai | Salinan identik aset `opening/` |
| `cinematic/05-sailing-ship.png` | 1448×1086 | RGBA | 1390 | Duplikat, tidak dipakai | Salinan identik aset `opening/` |
| `cinematic/06-underwater-foreground.png` | 1672×941 | RGBA | 932 | Duplikat, tidak dipakai | Salinan identik aset `opening/` |
| `cinematic/07-title-logo.png` | 1448×1086 | RGBA | 730 | Duplikat, tidak dipakai | Salinan identik aset `opening/` |
| `cinematic/08-malin-poor.png` | 1086×1448 | RGBA | 972 | Duplikat, tidak dipakai | Salinan identik aset `opening/` |
| `cinematic/09-malin-rich-later-story.png` | 1086×1448 | RGBA | 1307 | Duplikat, tidak dipakai | Salinan identik aset `opening/` |
| `cinematic/10-malin-stone-later-story.png` | 1086×1448 | RGBA | 2179 | Duplikat, tidak dipakai | Salinan identik aset `opening/` |
| `cinematic/transition/01-teluk-establishing.png` | 1672×941 | RGB | 2629 | Aktif | Cinematic shot 2: teluk (`TransitionShots.jsx`) |
| `cinematic/transition/02-dermaga-closeup.png` | 1672×941 | RGB | 2915 | Aktif | Cinematic shot 3: dermaga (`TransitionShots.jsx`) |
| `cinematic/transition/overlay-awan.png` | 1672×941 | RGBA | 1419 | Aktif | Awan parallax di shot teluk dan dermaga |
| `cinematic/transition/overlay-dedaunan.png` | 1672×941 | RGBA | 1188 | Aktif | Bingkai dedaunan depan di shot teluk; "dilewati" kamera menuju dermaga |
| `cinematic/transition/overlay-ombak.png` | 1672×941 | RGBA | 795 | Aktif | Ombak depan di shot teluk (berisi pasir pantai, tidak dipakai di dermaga) |
| `cinematic/village/clouds.png` | 2172×724 | RGBA | 982 | Disimpan | Babak kampung lama (panorama 3:1); kini tidak dimuat |
| `cinematic/village/fishing-boat.png` | 1448×1086 | RGBA | 1568 | Disimpan | Babak kampung lama (panorama 3:1); kini tidak dimuat |
| `cinematic/village/islands.png` | 2172×724 | RGBA | 809 | Disimpan | Babak kampung lama (panorama 3:1); kini tidak dimuat |
| `cinematic/village/pier.png` | 2172×724 | RGBA | 1232 | Disimpan | Babak kampung lama (panorama 3:1); kini tidak dimuat |
| `cinematic/village/sea.png` | 2172×724 | RGBA | 1059 | Disimpan | Babak kampung lama (panorama 3:1); kini tidak dimuat |
| `cinematic/village/sky.png` | 2172×724 | RGB | 1555 | Disimpan | Babak kampung lama (panorama 3:1); kini tidak dimuat |
| `cinematic/village/stilt-village.png` | 2172×724 | RGBA | 2507 | Disimpan | Babak kampung lama (panorama 3:1); kini tidak dimuat |
| `opening/malin-poor.png` | 1086×1448 | RGBA | 972 | Aktif | Main Menu + cinematic (Malin muda) |
| `opening/malin-rich.png` | 1086×1448 | RGBA | 1307 | Disimpan | Cerita berikutnya |
| `opening/malin-stone.png` | 1086×1448 | RGBA | 2179 | Disimpan | Ending |
| `opening/opening-beach-layer.png` | 1672×941 | RGBA | 1540 | Aktif | Main Menu |
| `opening/opening-clouds.png` | 1672×941 | RGBA | 2061 | Aktif | Main Menu |
| `opening/opening-ship.png` | 1448×1086 | RGBA | 1390 | Aktif | Main Menu + cinematic shot teluk (kapal dagang berlayar) |
| `opening/opening-sky.png` | 1672×941 | RGB | 1592 | Aktif | Main Menu |
| `opening/opening-title-art.png` | 1448×1086 | RGBA | 730 | Aktif | Main Menu (logo) |
| `opening/opening-underwater-foreground.png` | 1672×941 | RGBA | 932 | Aktif | Main Menu |
| `opening/opening-village-layer.png` | 1672×941 | RGBA | 1063 | Tidak dipakai | Tumpang tindih dengan beach layer |

- Ringkasan ukuran di bawah dihitung sebelum penambahan sheet Malin baru (±2 MB) dan lima
  gambar transisi (±8,9 MB, semuanya di-preload saat menu tampil).
- Aktif: 21.9 MB
- Disimpan: 8.9 MB
- Tidak dipakai: 1.0 MB
- Duplikat, tidak dipakai: 13.4 MB

"Disimpan" berarti file tidak dimuat kode tetapi sengaja dipertahankan. "Duplikat"
dapat dihapus untuk menghemat sekitar 13 MB di build, tetapi hanya dengan persetujuan
pemilik proyek.

## Di luar `public/`

| File | Keterangan |
| --- | --- |
| `art-source/level-1/kampung-tropis-cerah.png` | Sumber `l1-dermaga-tall.png` dan `l1-dermaga.png` (2172×724). Tidak ikut build. |
| `art-source/tools/build_level1_background.py` | Skrip pembangun `l1-dermaga-tall.png`. |
| `art-source/chapter-1/` | Sumber world map: 6 background area (paket S8), `README.md`, `map-layout.json`, `ASSET_INDEX.csv` paket. Tidak ikut build. |
| `art-source/tools/build_chapter1_kit.py` | Skrip pembangun kit modular Chapter 1: memotong sprite sheet `art-source/chapter-1/kit-source/` (segmentasi alpha, buang serpihan/label), menyimpan WebP per elemen di `public/assets/chapter-1/kit/`, dan menulis `src/game/chapter1/kit.json` (ukuran, skala, permukaan pijakan). `--preview DIR` menulis lembar pratinjau. |
| `art-source/tools/build_chapter1_world.py` | (Tidak dipakai lagi) Skrip pembangun tile world map lama (termasuk rumah/lapak penutup sambungan) dan `src/game/chapter1/worldLayout.json` (posisi, lantai, platform). `--preview DIR` menulis pratinjau sambungan. |
| `art-source/characters/malin-gameplay-spritesheet-source.png` | Sumber kedua sheet Malin (8×5, sel 198). Tidak ikut build. |
| `art-source/characters/OPENING-SPRITESHEET-PROMPT.md` | Prompt untuk sheet opening final (buntalan). |
| `art-source/tools/build_malin_sheets.py` | Skrip pembangun sheet gameplay & opening. |
| `art-source/characters/npc-pack-source/` | Sumber sheet Ibu + 4 NPC (4×3, sel 362), README & prompt paket. Tidak ikut build. |
| `art-source/tools/build_npc_sheets.py` | Skrip pembangun sheet Ibu & NPC (jangkar ulang + skala 0,6). |
| `asset-generation.json` | Prompt dan alat untuk layer `l1-*` lama. |
