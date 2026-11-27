# Layer kampung dermaga (cinematic babak 2)

Panorama 3:1 (2172×724) yang disusun bertumpuk pada koordinat yang sama, tanpa offset.
Ini versi berlapis dari kampung yang sama dengan `art-source/level-1/kampung-tropis-cerah.png`
(sumber background Level 1), sehingga cinematic dan gameplay berada di lokasi yang sama.

| File | Asal di `malin-kundang-all-assets.zip` | Kedalaman `d` |
| --- | --- | --- |
| `sky.png` | `cinematic/layers/wide-sky-generated.png` | 0.1 |
| `islands.png` | `opening/backgrounds/islands-behind-clouds.png` | 0.3 |
| `clouds.png` | `opening/backgrounds/clouds-generated.png` | 0.2 (+drift) |
| `sea.png` | `opening/backgrounds/sea-layer.png` | 1 (+kilau ombak CSS) |
| `stilt-village.png` | `levels/level-1/backgrounds/kampung-minangkabau-tropis.png` | 1 |
| `pier.png` | `opening/props/pier-transparent.png` | 1 (jalur berjalan, pijakan y ≈ 0.652) |
| `fishing-boat.png` | `opening/props/ship-alt-generated.png` | 1.04 |

Kapal dagang memakai `public/assets/opening/opening-ship.png` (sama dengan Main Menu).
Urutan, kedalaman, dan posisi ada di `src/components/cinematicConfig.js`. Semua salinan
identik dengan file asli (hanya ganti nama). Lisensi belum diverifikasi, lihat
`ASSET_PROVENANCE.md`.
