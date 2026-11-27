// Path background Chapter 1 untuk Phaser (gameplay dan akhir intro).
const assetUrl = (name) => `${import.meta.env.BASE_URL}assets/backgrounds/level-1/${name}.png`

// Aktif: kampung nelayan di atas air. `l1-dermaga-tall.png` adalah potongan dari
// `art-source/level-1/kampung-tropis-cerah.png` (crop x 430 → 1522, skala 1280/1092) yang
// diteruskan sampai dasar sumber: 1280×849. 720 px teratas identik dengan `l1-dermaga.png`
// lama, jadi papan dermaga tetap di y = 600 (lantai collision). 129 px di bawahnya (air dan
// tiang) dipakai kamera untuk layar yang lebih tinggi dari 16:9. Lihat levelFraming.js dan
// art-source/tools/build_level1_background.py.
export const level1Assets = [
  { key: 'l1-dermaga-tall', url: assetUrl('l1-dermaga-tall'), offsetY: 0, width: 1280, height: 849 },
]
// `l1-dermaga.png` (1280×720) disimpan; tidak dimuat lagi.

// Enam layer Level 1 sebelumnya (kampung di atas tanah). Tidak dimuat lagi, file tetap disimpan.
export const level1LegacyAssets = [
  { key: 'l1-sky', url: assetUrl('l1-sky'), offsetY: 0 },
  { key: 'l1-mountains', url: assetUrl('l1-mountains'), offsetY: 0 },
  { key: 'l1-forest', url: assetUrl('l1-forest'), offsetY: 0 },
  { key: 'l1-village', url: assetUrl('l1-village'), offsetY: -0.09 },
  { key: 'l1-ground', url: assetUrl('l1-ground'), offsetY: 0 },
  { key: 'l1-foreground', url: assetUrl('l1-foreground'), offsetY: 0 },
]
