# Sprite sheet Malin

Ada dua karakter Malin yang **tidak boleh tertukar**:

| File | Karakter | Dipakai oleh | Texture / animasi |
| --- | --- | --- | --- |
| `malin-gameplay-spritesheet.png` | Malin **tanpa** bawaan di punggung | `LevelOneScene` dan adegan keseharian cinematic `OpeningVillageScene` lewat `src/game/malinAssets.js` | `malin`, animasi `malin-*` |
| `malin-opening-spritesheet.png` | Malin **membawa buntalan kain krem** | Belum dimuat; disimpan untuk adegan keberangkatan merantau (`src/game/malinOpeningAssets.js`) | `malin-opening`, animasi `malin-opening-*` |
| `malin-spritesheet.png` | Sheet lama 6×3 | Tidak dimuat lagi; disimpan | — |

Kedua sheet aktif memakai sel 280×280 px tanpa margin. Setiap frame dijangkar ulang:
pusat kepala di x=140 dan pijakan kaki di y=264. Karena itu skala 0.46 dan body collision
100×252 offset (90, 12) di `LevelOneScene` tetap cocok tanpa mengubah scene, dan karakter
tidak bergeser antar-frame.

## Gameplay: 8×5 (2240×1400), 40 frame

| Animasi | Frame | fps | Repeat | Dipakai saat ini |
| --- | --- | --- | --- | --- |
| `malin-idle` | 0–7 | 6 | loop | Ya |
| `malin-walk` | 8–15 | 12 | loop | Ya |
| `malin-run` | 16–23 | 13 | loop | Belum (terdaftar) |
| `malin-jump` | 24–31 | 10 | sekali | Ya |
| `malin-crouch` | 32–35 | 8 | sekali | Belum (terdaftar) |
| `malin-talk` | 36–39 | 6 | loop | Belum (terdaftar) |

Semua pose, termasuk pose di udara, diletakkan pada garis pijakan yang sama; ketinggian
lompatan diatur physics, bukan oleh gambar.

## Opening: 8×3 (2240×840), 24 frame (SEMENTARA)

| Animasi | Frame | Isi |
| --- | --- | --- |
| `malin-opening-idle` | 0–7 | Berdiri dengan buntalan |
| `malin-opening-walk` | 8–15 | Jalan pelan dengan buntalan |
| `malin-opening-farewell` | 16–23 | Melambat, berhenti, berdiri, menoleh, angkat tangan, melambai, turunkan tangan, berdiri |
| `malin-opening-look` | 18–19 | Menoleh (bagian dari pose farewell) |

**Status sementara:** frame opening adalah frame gameplay yang sama ditambah buntalan kain
krem dan tali selempang yang **digambar programatik** (bukan ilustrasi tangan). Pose farewell
memakai pose bicara/gestur dari sheet gameplay; pose "menoleh ke belakang bahu" belum ada.
Ganti PNG ini dengan hasil prompt `art-source/characters/OPENING-SPRITESHEET-PROMPT.md`;
layout 8×3, sel 280, jangkar, dan nama animasi tetap sama.

## Cara membangun ulang

```bash
python3 art-source/tools/build_malin_sheets.py
```

Sumber: `art-source/characters/malin-gameplay-spritesheet-source.png` (8×5, sel 198, dari
`malin-character-fix-pack`). Sumber itu bergeser sekitar 8 px per frame di setiap baris;
skrip memperbaikinya dengan menjangkar ulang tiap frame. Asal-usul dan lisensi ada di
`ASSET_PROVENANCE.md`.
