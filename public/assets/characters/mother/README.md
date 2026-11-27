# Ibu Malin

**Acuan desain:** kerudung merah bermotif, selendang krem, baju krem sederhana, kain bawahan
marun, perempuan Minangkabau paruh baya. Kedua file di bawah memakai desain yang sama.

| File | Isi | Dipakai oleh |
| --- | --- | --- |
| `mother-malin-spritesheet.png` | Sheet 4×3, frame 200×216 (pusat kepala x=100, kaki y=210), menghadap kanan. Baris 1 idle (0–3), baris 2 berjalan (4–7), baris 3 memanggil/berbicara (8–11) | Cinematic `OpeningVillageScene` (berjalan masuk, bicara, idle) dan Chapter 1 (`levelOneNpcs.js`, NPC cerita di depan kios) |
| `mother-standing.png` | Gambar statis 1024×1536 | Fallback bila sprite sheet gagal dimuat |

Sheet dibangun oleh `art-source/tools/build_npc_sheets.py` dari sumber paket
`malin-opening-mother-npc-pack` (`art-source/characters/npc-pack-source/`): setiap frame dijangkar
ulang dan diskalakan 0,6 karena sumber bergeser antar-frame dan garis kakinya berbeda antar-baris.
Konfigurasi animasi: `src/game/npcAssets.js` (`mother-idle`, `mother-walk`, `mother-talk`).
Asal-usul dan lisensi: `ASSET_PROVENANCE.md`.
