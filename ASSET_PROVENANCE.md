# Asal-usul aset (Asset Provenance)

Catatan asal setiap aset gambar yang dipakai game. Terakhir diperbarui: 27 November 2026.

**Aturan:** kolom yang belum diketahui ditulis "belum dikonfirmasi". Jangan mengisi
lisensi atau pembuat tanpa bukti. Status lisensi semua aset di bawah ini **belum
diverifikasi**: tidak ada yang boleh dianggap CC0 atau bebas pakai.

## Ringkasan sumber

| Kode | Sumber | Tanggal di arsip | Catatan |
| --- | --- | --- | --- |
| S1 | Dibuat ulang dengan AI melalui Codex untuk pemilik proyek | 26 Nov 2026 | Prompt dan alat tercatat di `asset-generation.json` |
| S2 | `malin-kundang-opening-assets.zip` dari pemilik proyek | 26 Nov 2026 14:36 | README di `docs/previous-packs/opening-assets-README.md` (paket S4) |
| S3 | Spritesheet Malin dari pemilik proyek | 26 Nov 2026 | Lihat `public/assets/characters/malin/README.md` |
| S4 | `malin-kundang-all-assets.zip` dari pemilik proyek | 26 Nov 2026 09:07–09:21 | Paket gabungan; berisi `README.md`, `PROMPTS.md`, `ASSET_INDEX.csv` |
| S5 | `malin-character-fix-pack.zip` dari pemilik proyek | 26 Nov 2026 17:24 | Sprite sheet gameplay 8×5 (sel 198), JSON animasi, prompt sheet opening. README paket menyebutnya "working draft" hasil generate |
| S7 | Folder `malin-opening-mother-npc-pack` dari pemilik proyek | 26 Nov 2026 19:09 | Sprite sheet Ibu + 4 NPC (4×3, sel 362) + `README.md`, `PROMPT_UPDATE_OPENING_DAN_NPC.md`. Tidak menyebut pembuat, alat, maupun lisensi |
| S6 | Folder `malin-intro-transition-assets` dari pemilik proyek | 26 Nov 2026 18:30 | 5 gambar transisi intro + `README.md`, `ASSET_INDEX.csv`, `PROMPT_AGENT.md`. Tidak menyebut pembuat, alat, maupun lisensi |
| S8 | `malin-kundang-chapter1-ready-assets.zip` (dan folder ekstraknya) dari pemilik proyek | 26 Nov 2026 22:29 | 6 background area, elemen kecil, strip parallax, overlay, sheet NPC, atlas referensi, `map-layout.json`. README paket: "dibuat / diproses menggunakan AI … alat pembuat dan ketentuan lisensi spesifik tidak tercatat". Overlay dan sheet NPC di paket ini identik (MD5) dengan file S4/S2/S7 yang sudah ada, jadi tidak disalin. Area 04 identik dengan sumber `kampung-tropis-cerah.png` (S4) setelah diskalakan |
| S9 | Folder `asset-malin-kundang` dari pemilik proyek (8 subfolder: Kapal dan perahu, Gunung awan dan laut, Rintangan dan foreground, Dermaga dan tanah, Rumah dan bangunan, Dekorasi Nelayan, Pohon dan hutan, Pasar Ikan) | 27 Nov 2026 | 95 file, sebagian sprite sheet bernama `Pasted image (n).png`. README di tiga subfolder menyebut aset "extracted … from the generated art sheet" (mengindikasikan image generator AI); alat, pembuat, dan lisensi tidak tercatat. File yang dipakai disalin ke `art-source/chapter-1/kit-source/` (lihat README di sana) |

Petunjuk dari paket S4: nama file referensinya berbentuk kalimat prompt
(misalnya `a_clean_png_illustration_on_a_transparent_checkerb.png`), dan
`PROMPTS.md` memuat "Prompt image generator untuk aset tambahan". Ini
**mengindikasikan** gambar dibuat dengan image generator AI, tetapi alat, model,
akun, dan prompt per file **belum dikonfirmasi**. Paket tidak mencantumkan lisensi.

## Aset aktif

| File di proyek | Sumber | Path asli di arsip | Pembuat / alat | Prompt | Modifikasi | Lisensi |
| --- | --- | --- | --- | --- | --- | --- |
| `public/assets/opening/*.png` (Main Menu) | S2 | `public/assets/opening/` | Belum dikonfirmasi | Belum dikonfirmasi | Tidak ada | Belum diverifikasi |
| `public/assets/characters/malin/malin-gameplay-spritesheet.png` | S5 (turunan) | `malin-gameplay-spritesheet.png` | Sumber: belum dikonfirmasi (README S5 menyebut "generated"). Turunan: `art-source/tools/build_malin_sheets.py` (Pillow) | Belum dikonfirmasi | Piksel alpha < 10 dibersihkan; skala ×1,441 (LANCZOS); tiap frame dijangkar ulang (pusat kepala x=140, kaki y=264) ke sel 280 karena sumber bergeser ±8 px/frame | Belum diverifikasi |
| `public/assets/characters/malin/malin-opening-spritesheet.png` | S5 (turunan, **sementara**) | — | Turunan dari sheet gameplay di atas + buntalan kain & tali yang digambar programatik oleh skrip yang sama | Prompt pengganti final: `art-source/characters/OPENING-SPRITESHEET-PROMPT.md` (belum dijalankan) | 24 frame dari frame gameplay 0–15, 12, 15, 0, 36, 37, 38, 37, 39 + buntalan | Belum diverifikasi |
| `public/assets/characters/malin/malin-spritesheet.png` (tidak dimuat lagi) | S3 | — | Belum dikonfirmasi | — | Tidak ada; identik dengan `malin-spritesheet-final.png` di S4 | Belum diverifikasi |
| `art-source/characters/malin-gameplay-spritesheet-source.png` | S5 | `malin-gameplay-spritesheet.png` | Belum dikonfirmasi | — | Salinan identik, tidak ikut build | Belum diverifikasi |
| `public/assets/characters/mother/mother-standing.png` | S4 | `public/assets/characters/mother/mother-standing.png` | Belum dikonfirmasi (indikasi AI) | Kemungkinan dari prompt umum di `PROMPTS.md` S4, belum dikonfirmasi | Tidak ada (salinan identik) | Belum diverifikasi |
| `public/assets/cinematic/village/sky.png` | S4 | `public/assets/cinematic/layers/wide-sky-generated.png` | Belum dikonfirmasi (indikasi AI) | Belum dikonfirmasi | Hanya ganti nama | Belum diverifikasi |
| `public/assets/cinematic/village/islands.png` | S4 | `public/assets/opening/backgrounds/islands-behind-clouds.png` | Belum dikonfirmasi (indikasi AI) | Belum dikonfirmasi | Hanya ganti nama | Belum diverifikasi |
| `public/assets/cinematic/village/clouds.png` | S4 | `public/assets/opening/backgrounds/clouds-generated.png` | Belum dikonfirmasi (indikasi AI) | Belum dikonfirmasi | Hanya ganti nama | Belum diverifikasi |
| `public/assets/cinematic/village/sea.png` | S4 | `public/assets/opening/backgrounds/sea-layer.png` | Belum dikonfirmasi (indikasi AI) | Belum dikonfirmasi | Hanya ganti nama | Belum diverifikasi |
| `public/assets/cinematic/village/stilt-village.png` | S4 | `public/assets/levels/level-1/backgrounds/kampung-minangkabau-tropis.png` | Belum dikonfirmasi (indikasi AI) | Belum dikonfirmasi | Hanya ganti nama | Belum diverifikasi |
| `public/assets/cinematic/village/pier.png` | S4 | `public/assets/opening/props/pier-transparent.png` | Belum dikonfirmasi (indikasi AI) | Belum dikonfirmasi | Hanya ganti nama | Belum diverifikasi |
| `public/assets/cinematic/village/fishing-boat.png` | S4 | `public/assets/opening/props/ship-alt-generated.png` | Belum dikonfirmasi (indikasi AI) | Belum dikonfirmasi | Hanya ganti nama | Belum diverifikasi |
| `public/assets/backgrounds/level-1/l1-dermaga.png` | S4 (turunan) | `public/assets/levels/level-1/backgrounds/kampung-tropis-cerah.png` | Sumber: belum dikonfirmasi (indikasi AI). Turunan: dipotong oleh Claude Code (Pillow, LANCZOS) | Belum dikonfirmasi | Crop (430, 0)–(1522, 614) dari 2172×724, diskalakan ke 1280×720 agar pijakan dermaga (y=512 sumber) jatuh di y=600 = lantai collision | Belum diverifikasi |
| `public/assets/backgrounds/level-1/l1-dermaga-tall.png` | S4 (turunan) | `public/assets/levels/level-1/backgrounds/kampung-tropis-cerah.png` | Sumber: belum dikonfirmasi (indikasi AI). Turunan: `art-source/tools/build_level1_background.py` (Pillow, LANCZOS) oleh Claude Code | Belum dikonfirmasi | Crop (430, 0)–(1522, 724) dari 2172×724, diskalakan ke 1280×849 (skala sama dengan `l1-dermaga.png`, sehingga 720 px atasnya identik dan pijakan dermaga tetap di y=600; 129 px bawah = air dari sumber, bukan hasil generate) | Belum diverifikasi |
| `public/assets/chapter-1/kit/*.webp` (aktif) | S9 (turunan) | Lihat tabel di `art-source/chapter-1/kit-source/README.md` | Sumber: belum dikonfirmasi (README paket: hasil generate). Turunan: `art-source/tools/build_chapter1_kit.py` (Pillow) oleh Claude Code | Belum dikonfirmasi | Dipotong dari sprite sheet dengan segmentasi alpha; serpihan objek tetangga dan label teks dibuang; diskalakan ke ukuran tampilan ×1,25 (maks. ukuran sumber); strip gunung/laut/hutan dipotong di atas label, tepi 2% dibuang, lalu disambung dengan cerminannya agar bisa diulang; WebP kualitas 86 | Belum diverifikasi |
| `public/assets/chapter-1/world/world-{0..3}.webp` (disimpan, tidak dimuat) | S8 + S4 + S2 + S6 (turunan) | `backgrounds/area-01…06-*.png` (S8); `cinematic/village/pier.png` dan `sea.png` (S4); `opening/opening-ship.png` (S2); `cinematic/village/stilt-village.png` (S4, penutup sambungan) | Sumber: belum dikonfirmasi (S8 menyatakan dibuat/diproses dengan AI). Turunan: `art-source/tools/build_chapter1_world.py` (Pillow) oleh Claude Code | Belum dikonfirmasi | 6 area disusun berurutan tanpa regangan; tiap area digeser vertikal agar garis dermaga sejajar; tumpang tindih 300 px dengan gradasi smoothstep; Area 4 dipotong x 380–2160, Area 6 dipotong x 0–1000 dan ditambah dermaga depan (potongan `pier.png`), air (potongan `sea.png`, warna disamakan dengan air Area 5), dan kapal (`opening-ship.png` ×0,36); tiap sambungan ditutup potongan bangunan dari `stilt-village.png` (rumah kiri, rumah tengah, lapak, rumah kiri dicerminkan, rumah bertangga + lapak dicerminkan; tepi dipudarkan 60 px; pucuk pohon yang terpotong dihapus); dipotong per 2048 px, WebP kualitas 90 | Belum diverifikasi |
| `art-source/chapter-1/backgrounds/area-0{1..6}-*.png` | S8 | `backgrounds/area-0*.png` | Belum dikonfirmasi (AI menurut README paket) | Belum dikonfirmasi | Tidak ada (salinan identik), tidak ikut build | Belum diverifikasi |
| `art-source/level-1/kampung-tropis-cerah.png` | S4 | sama dengan baris di atas | Belum dikonfirmasi | Belum dikonfirmasi | Salinan sumber, tidak ikut build | Belum diverifikasi |
| `public/assets/characters/mother/mother-malin-spritesheet.png` | S7 (turunan) | `assets/characters/mother/mother-malin-spritesheet.png` | Sumber: belum dikonfirmasi. Turunan: `art-source/tools/build_npc_sheets.py` (Pillow) | Belum dikonfirmasi | Alpha < 10 dibersihkan; skala ×0,6 (LANCZOS); tiap frame dijangkar ulang (pusat kepala x=100, kaki y=210) ke sel 200×216 karena sumber bergeser antar-frame | Belum diverifikasi |
| `public/assets/characters/npc/npc-anak-desa.png` | S7 (turunan) | `assets/characters/npc/npc-anak-desa.png` | Sumber: belum dikonfirmasi. Turunan: `art-source/tools/build_npc_sheets.py` (Pillow) | Belum dikonfirmasi | Alpha < 10 dibersihkan; skala ×0,6 (LANCZOS); tiap frame dijangkar ulang (pusat kepala x=100, kaki y=210) ke sel 200×216 karena sumber bergeser antar-frame | Belum diverifikasi |
| `public/assets/characters/npc/npc-nelayan.png` | S7 (turunan) | `assets/characters/npc/npc-nelayan.png` | Sumber: belum dikonfirmasi. Turunan: `art-source/tools/build_npc_sheets.py` (Pillow) | Belum dikonfirmasi | Alpha < 10 dibersihkan; skala ×0,6 (LANCZOS); tiap frame dijangkar ulang (pusat kepala x=100, kaki y=210) ke sel 200×216 karena sumber bergeser antar-frame | Belum diverifikasi |
| `public/assets/characters/npc/npc-buruh-pelabuhan.png` | S7 (turunan) | `assets/characters/npc/npc-buruh-pelabuhan.png` | Sumber: belum dikonfirmasi. Turunan: `art-source/tools/build_npc_sheets.py` (Pillow) | Belum dikonfirmasi | Alpha < 10 dibersihkan; skala ×0,6 (LANCZOS); tiap frame dijangkar ulang (pusat kepala x=100, kaki y=210) ke sel 200×216 karena sumber bergeser antar-frame | Belum diverifikasi |
| `public/assets/characters/npc/npc-penjual-ikan.png` | S7 (turunan) | `assets/characters/npc/npc-penjual-ikan.png` | Sumber: belum dikonfirmasi. Turunan: `art-source/tools/build_npc_sheets.py` (Pillow) | Belum dikonfirmasi | Alpha < 10 dibersihkan; skala ×0,6 (LANCZOS); tiap frame dijangkar ulang (pusat kepala x=100, kaki y=210) ke sel 200×216 karena sumber bergeser antar-frame | Belum diverifikasi |
| `art-source/characters/npc-pack-source/*.png` | S7 | `assets/characters/{mother,npc}/` | Belum dikonfirmasi | — | Salinan identik, tidak ikut build | Belum diverifikasi |
| `public/assets/cinematic/transition/01-teluk-establishing.png` | S6 | `public/assets/cinematic/transition/01-teluk-establishing.png` | Belum dikonfirmasi | Belum dikonfirmasi | Tidak ada (salinan identik) | Belum diverifikasi |
| `public/assets/cinematic/transition/02-dermaga-closeup.png` | S6 | `public/assets/cinematic/transition/02-dermaga-closeup.png` | Belum dikonfirmasi | Belum dikonfirmasi | Tidak ada (salinan identik) | Belum diverifikasi |
| `public/assets/cinematic/transition/overlay-awan.png` | S6 | `public/assets/cinematic/transition/overlay-awan.png` | Belum dikonfirmasi | Belum dikonfirmasi | Tidak ada (salinan identik) | Belum diverifikasi |
| `public/assets/cinematic/transition/overlay-dedaunan.png` | S6 | `public/assets/cinematic/transition/overlay-dedaunan.png` | Belum dikonfirmasi | Belum dikonfirmasi | Tidak ada (salinan identik) | Belum diverifikasi |
| `public/assets/cinematic/transition/overlay-ombak.png` | S6 | `public/assets/cinematic/transition/overlay-ombak.png` | Belum dikonfirmasi | Belum dikonfirmasi | Tidak ada (salinan identik) | Belum diverifikasi |

Checksum MD5 salinan saat dicatat:

| File | MD5 |
| --- | --- |
| `characters/mother/mother-standing.png` | `5e211857f8aab646a1e8864248bfb923` |
| `cinematic/village/sky.png` | `237f3d77f5a7f23edc8eb24e6b1cccb0` |
| `cinematic/village/islands.png` | `696f25da348c89a004cef1303e5e8544` |
| `cinematic/village/clouds.png` | `6f677f50cdb9b4d1e4a4c6985ca6042b` |
| `cinematic/village/sea.png` | `7d221d1cbfa3d2356f00ec080002ab1d` |
| `cinematic/village/stilt-village.png` | `3ec645caa120888ba2e64da815c98215` |
| `cinematic/village/pier.png` | `5045e0fee9364cae923d3474e05d159e` |
| `cinematic/village/fishing-boat.png` | `1f2a6beb462bbafec1e370a828214c23` |
| `backgrounds/level-1/l1-dermaga.png` | `ac3c7f418cb21b9edbf63c6355bffaa8` |
| `backgrounds/level-1/l1-dermaga-tall.png` | `27beed34aa728f639152887922a9fe52` |
| `chapter-1/world/world-0.webp` | `058da3f12b018c9838223e6a7621e901` |
| `chapter-1/world/world-1.webp` | `9f182a8b1e4cb641c2962c74abe7b84f` |
| `chapter-1/world/world-2.webp` | `bc548998287edf230eb5080f3ce4c4b3` |
| `chapter-1/world/world-3.webp` | `5caa6478b6144e28bdfa6c3018893a9d` |
| `art-source/chapter-1/backgrounds/area-01-rumah-malin.png` | `84899374a4ea7645acb2932204b1ab3a` |
| `art-source/chapter-1/backgrounds/area-02-dermaga-nelayan.png` | `df1f373db151f69b4d9639ad6ce6afb5` |
| `art-source/chapter-1/backgrounds/area-03-dermaga-rusak.png` | `4a1a9714fa1988d47dcf81858a65b3c7` |
| `art-source/chapter-1/backgrounds/area-04-jalan-kampung.png` | `a01dd35506892a7db2ed82ad7e09f959` |
| `art-source/chapter-1/backgrounds/area-05-pasar-ikan.png` | `b97cc96ecb35e05137c50582d45bb3cf` |
| `art-source/chapter-1/backgrounds/area-06-pelabuhan.png` | `7e71355f32f79cabe0caaaa8ec1570e9` |
| `art-source/level-1/kampung-tropis-cerah.png` | `231605ada2eb90a3e7577d01b26270d2` |
| `characters/malin/malin-gameplay-spritesheet.png` | `08ecab017a827c619c64776b789d7c02` |
| `characters/malin/malin-opening-spritesheet.png` | `926eb71333f0d24baa62efc9ba6a6d20` |
| `art-source/characters/malin-gameplay-spritesheet-source.png` | `8844a624a25134b403eee63ab7cc8bb2` |
| `characters/mother/mother-malin-spritesheet.png` | `08b055a19d9f26a74b3aff95c59b5559` |
| `characters/npc/npc-anak-desa.png` | `e2c8c11fe636139dcbf8d50cba07615e` |
| `characters/npc/npc-nelayan.png` | `09a14c87ce775fb751c9e210646929c7` |
| `characters/npc/npc-buruh-pelabuhan.png` | `13cbc4ed5b34085bc85d19f136f80879` |
| `characters/npc/npc-penjual-ikan.png` | `ccb90cddce713efe09dac1c799e0f6d7` |
| `art-source/.../npc-pack-source/mother-malin-spritesheet.png` (sumber) | `5675d382fdbd04d30452e0183e2ffcad` |
| `cinematic/transition/01-teluk-establishing.png` | `99e1f746c554742ba055239db58f6837` |
| `cinematic/transition/02-dermaga-closeup.png` | `37e6f8ae82168c7df469a03ad27ebe21` |
| `cinematic/transition/overlay-awan.png` | `07ef764c5ff028d96663ac64643b09d0` |
| `cinematic/transition/overlay-dedaunan.png` | `1d21a5e8b9d098444b2888f85b887bae` |
| `cinematic/transition/overlay-ombak.png` | `26bc0176f393a0582ee595cb38e15bf2` |

## Catatan paket S5 (malin-character-fix-pack)

- README S5 menyatakan `malin-spritesheet.png` (1680×840) "bukan grid seragam". Untuk file
  di proyek ini hal itu **tidak benar**: tidak ada piksel yang melintasi garis grid 280×280.
  File lama tetap disimpan, tetapi gameplay kini memakai `malin-gameplay-spritesheet.png`.
- Sheet S5 sendiri bergeser horizontal sekitar 8 px per frame di setiap baris (idle: pusat
  129 → 74 px) dan berisi piksel alpha 1–9 di seluruh sel; keduanya diperbaiki skrip.
- Sheet opening dengan buntalan tidak disertakan di S5 (hanya prompt).

## Aset yang disimpan tetapi tidak dipakai

| File | Sumber | Alasan |
| --- | --- | --- |
| `public/assets/backgrounds/level-1/l1-{sky,mountains,forest,village,ground,foreground}.png` | S1 | Diganti `l1-dermaga.png` (kampung di atas air). Tidak dihapus tanpa persetujuan. |
| `public/assets/backgrounds/level-1/l1-dermaga.png` | S4 (turunan) | Diganti `l1-dermaga-tall.png` (air tambahan untuk layar lebih tinggi dari 16:9). |
| `public/assets/backgrounds/level-1/l1-dermaga-tall.png` | S4 (turunan) | Diganti world map Chapter 1. Lukisan yang sama sudah ada di dunia sebagai Area 4 (Jalan Kampung), jadi tidak dipasang ulang di Area 2 agar kios tidak muncul dua kali. |
| Elemen kecil, strip parallax, atlas referensi paket S8 | S8 | Belum disalin: elemen 69–262 px perlu diperbesar 2–3× (buram) dan strip parallax hanya ±408×58 px. Atlas hanya referensi crop. Dipertimbangkan untuk props/rintangan tahap berikutnya. |
| `public/assets/cinematic/village/*.png` (7 layer) | S4 | Babak kampung cinematic kini memakai dunia Chapter 1. Tidak dihapus tanpa persetujuan. |
| `public/assets/opening/malin-rich.png`, `malin-stone.png` | S2 | Disimpan untuk bagian cerita berikutnya. |
| `public/assets/opening/opening-village-layer.png` | S2 | Isinya tumpang tindih dengan `opening-beach-layer.png`. |
| `public/assets/cinematic/01-sky.png` … `10-malin-stone-later-story.png` | Paket cinematic v1 | Salinan identik dari `public/assets/opening/`; tidak dipakai kode. |

## Aset paket S4 yang tidak disalin

| File di S4 | Alasan |
| --- | --- |
| `cinematic/scenes/village-morning.png`, `malin-mother-farewell.png` | Desain ibu (kerudung putih, baju oranye) berbeda dari `mother-standing.png`. Perlu dibuat ulang; lihat prompt di bawah. |
| `cinematic/scenes/fisher-village-life.png` | Ada sosok perempuan dengan desain ibu yang berbeda. |
| `cinematic/scenes/busy-fishing-pier.png`, `malin-looking-at-ship.png` | Panel datar tanpa parallax; Malin di panel berbeda dari `malin-poor.png`. Adegan disusun dari layer dan cutout. |
| `levels/level-1/backgrounds/chapter-1-card-generated.png` | Teks "Chapter 1 Kampung Nelayan" tercetak di gambar; teks kartu dibuat dengan React. |
| `characters/malin/malin-spritesheet-final.png` | Identik dengan spritesheet yang sudah dipakai. |
| `characters/malin/malin-spritesheet-previous.png` | Versi lama spritesheet. |
| `cinematic/layers/01-…10-…png` | Identik dengan aset yang sudah ada di proyek. |
| `references/**` | Lembar konsep/mockup/storyboard berlabel; acuan desain, bukan aset runtime. |

Catatan: `ASSET_INDEX.csv` di S4 mencantumkan 6 file referensi yang tidak ada di
folder hasil ekstrak, tetapi ada di dalam ZIP (`references/opening-concepts/*`,
`references/storyboards/malin-kundang-storyboard.png`, satu mockup UI).

## Prompt usulan untuk membuat ulang dua panel

Belum dijalankan; tidak ada alat pembuat gambar di sesi integrasi. Simpan hasilnya
dengan mencatat alat, tanggal, dan prompt yang benar-benar dipakai di file ini.

**village-morning (Malin dan ibu di kampung):**

```text
2D hand-painted game illustration, 16:9, warm morning light. A coastal Minangkabau fishing
village built on wooden stilts over clear turquoise water, long wooden pier, thatched
rumah panggung with curved gonjong roofs, distant green hills, traditional fishing boats.
On the pier, young poor Malin (red patterned headband, worn beige vest over white shirt,
brown patched trousers, red-patterned sash, barefoot, cloth sack) mends a fishing net beside
his mother. His mother MUST match this design exactly: middle-aged Minangkabau woman, red
patterned headscarf, cream shawl draped over shoulders, simple cream long blouse, maroon
patterned sarong, barefoot, warm gentle expression. No text, no logo, no UI.
```

**malin-mother-farewell (berpamitan di dermaga):**

```text
2D hand-painted game illustration, 16:9, soft late-afternoon light. The same stilt fishing
village and wooden pier; a large traditional wooden merchant sailing ship docked beside the
pier. Young Malin (same design as above, carrying his cloth sack) holds his mother's hands
to say goodbye. Mother MUST match: red patterned headscarf, cream shawl, cream blouse,
maroon sarong, middle-aged, teary but loving expression. Emotional but gentle, suitable for
students aged 11–17. No text, no logo, no UI.
```
