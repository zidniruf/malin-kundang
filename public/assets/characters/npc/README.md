# NPC kampung nelayan

Empat sheet 4×3, frame 200×216 (pusat kepala x=100, kaki y=210), menghadap kanan. Dibangun oleh
`art-source/tools/build_npc_sheets.py` dari paket `malin-opening-mother-npc-pack`
(`art-source/characters/npc-pack-source/`): dijangkar ulang dan diskalakan 0,6 karena sumber
bergeser antar-frame (hingga ±60 px) dan garis kakinya berbeda antar-baris.

| File | Baris 1 (0–3) | Baris 2 (4–7) | Baris 3 (8–11) | Area di Chapter 1 |
| --- | --- | --- | --- | --- |
| `npc-penjual-ikan.png` | berdiri membawa keranjang | berjalan | menawarkan ikan | sekitar kios, x 360–450 |
| `npc-anak-desa.png` | idle | berjalan | gestur/menunjuk | dermaga tengah, x 540–760 |
| `npc-buruh-pelabuhan.png` | idle | berjalan | mengangkat peti | bongkar muat, x 790–960 (peti di x 880) |
| `npc-nelayan.png` | idle | berjalan | memakai jala | dekat perahu, x 1030–1190 |

Peti di frame 8 buruh juga dipakai sebagai properti di tanah (frame `crate`, lihat
`BURUH_CRATE` di `src/game/npcAssets.js`), supaya peti tidak hilang saat buruh berjalan.
Perilaku acak: `src/game/npc/AmbientNpc.js`; posisi dan area: `src/game/npc/levelOneNpcs.js`.
Penjual ikan dan nelayan juga tampil di establishing shot cinematic. Lisensi belum diverifikasi.
