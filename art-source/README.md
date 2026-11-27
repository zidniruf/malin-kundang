# Sumber aset (tidak ikut build)

File resolusi asli yang dipakai untuk membuat aset turunan di `public/assets/`.
Folder ini tidak disalin ke `dist/`.

- `characters/malin-gameplay-spritesheet-source.png`: sumber sprite sheet Malin (8×5, sel 198)
  dari `malin-character-fix-pack`. Tidak diubah.
- `characters/OPENING-SPRITESHEET-PROMPT.md`: prompt untuk membuat sheet Malin opening final
  (buntalan kain). Hasilnya cukup menggantikan `public/assets/characters/malin/malin-opening-spritesheet.png`.
- `tools/build_malin_sheets.py`: membangun `malin-gameplay-spritesheet.png` (dijangkar ulang ke
  sel 280) dan `malin-opening-spritesheet.png` (sementara). Jalankan
  `python3 art-source/tools/build_malin_sheets.py` dari root proyek (butuh Pillow).
- `level-1/kampung-tropis-cerah.png`: sumber `public/assets/backgrounds/level-1/l1-dermaga.png`.
  Crop (430, 0)–(1522, 614), lalu diskalakan ke 1280×720 (Pillow, LANCZOS). Pijakan papan
  dermaga di y=512 sumber menjadi y=600, sama dengan lantai collision LevelOneScene.
  Untuk menggeser area yang terlihat, ubah x crop (430) tanpa mengubah y/tinggi crop.
  Versi aktif `l1-dermaga-tall.png` (1280×849) dibangun oleh `tools/build_level1_background.py`:
  crop (430, 0)–(1522, 724) dengan skala yang sama, sehingga 720 px atas identik dan air di
  bawah dermaga terlihat pada layar lebih tinggi dari 16:9. Jalankan
  `python3 art-source/tools/build_level1_background.py` dari root proyek.
- `chapter-1/backgrounds/area-0*.png`: enam background area world map Chapter 1 (paket
  `malin-kundang-chapter1-ready-assets`), beserta `README.md`, `map-layout.json`, dan
  `ASSET_INDEX.csv` paket. Area 04 adalah lukisan yang sama dengan `level-1/kampung-tropis-cerah.png`.
- `tools/build_chapter1_world.py`: menyusun keenam area menjadi satu dunia (geser vertikal agar garis
  dermaga sejajar, tumpang tindih 300 px dengan gradasi, Area 6 diberi dermaga depan + air + kapal),
  menutup tiap sambungan dengan rumah/lapak dari `public/assets/cinematic/village/stilt-village.png`,
  menulis tile WebP ke `public/assets/chapter-1/world/`, dan
  `src/game/chapter1/worldLayout.json` (posisi tile, sambungan, batas area, lantai, platform).
  Jalankan `python3 art-source/tools/build_chapter1_world.py` dari root proyek; tambahkan
  `--preview DIR` untuk menulis pratinjau setiap sambungan. Ubah pengaturan di `SEGMENTS`/`HARBOR`,
  jangan mengedit JSON secara manual.
- `tools/stitch_chapter1_map.py` (+ `tools/dermaga_rusak.py`, `tools/stitch_outputs.py`): versi baru
  peta Chapter 1 sebagai PNG lossless tinggi 720 (BELUM dipakai game; untuk ditinjau). Area digeser
  vertikal utuh agar papan dermaga sejajar (y=481), dahan pohon pojok yang terpotong bingkai
  dihapus, tiap sambungan: zona overlap 240–400 px, warp horizon hanya di zona (sambungan 1–3),
  koreksi warna per baris, potongan graph-cut + gradasi smoothstep. Area 3 diberi 3 lubang dermaga
  yang bisa dilompati (air dari baris yang sama di Area 3). Keluaran di `chapter-1/map-stitched/`:
  `map_full.png`, `map_bagian_1..3.png`, `map_data.json`, `preview_sambungan.png`, `cek_hasil.json`.
  Jalankan `python3 art-source/tools/stitch_chapter1_map.py` dari root proyek (±20 dtk, hanya Pillow).
- `characters/npc-pack-source/`: sumber sprite sheet Ibu Malin dan 4 NPC (4×3, sel 362) dari
  paket `malin-opening-mother-npc-pack`, beserta README dan prompt paket.
- `tools/build_npc_sheets.py`: membangun `public/assets/characters/mother/mother-malin-spritesheet.png`
  dan `public/assets/characters/npc/*.png` (jangkar ulang kepala/kaki, skala 0,6). Jalankan
  `python3 art-source/tools/build_npc_sheets.py` dari root proyek.
