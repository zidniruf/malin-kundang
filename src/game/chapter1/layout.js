// Layout world map Chapter 1, disusun dari elemen modular (kit.json, dibangun oleh
// art-source/tools/build_chapter1_kit.py). File ini BOLEH diedit manual: ubah, tambah, atau ulangi
// elemen di mana saja. Setiap elemen hanya dimuat sekali walau dipakai berkali-kali.
//
// Koordinat dunia: lantai utama y=600 (FLOOR_Y), skala karakter tetap (Malin ±135 px).
// Helper:
//   walk(piece, x, { y, flip, s })   lantai/dermaga: x = tepi kiri, y = garis pijakan (default FLOOR_Y).
//                                    Collider dibuat otomatis dari `surface` elemen di kit.json.
//   run(piece, x0, x1, opts)         ulangi `piece` sambung-menyambung dari x0 sampai minimal x1.
//   ground(type, x0, x1, opts)       tanah menerus x0..x1 (satu jenis per daratan): ujung kiri + tengah
//                                    diulang + ujung kanan, permukaan dan garis bawah selalu satu baris.
//                                    type: ground-grass | ground-grass-flower | ground-sand |
//                                    ground-rocky | ground-dirt. opts: y, capLeft/capRight: false.
//   put(piece, x, y, opts)           objek biasa: x = tengah, y = dasar (titik berdiri).
//      opts: layer ('back' | 'prop' | 'front' | 'far'), s (skala tambahan), flip, sf (parallax),
//            solid (sisi atas bisa dipijak, untuk elemen yang punya `surface`), alpha.

export const FLOOR_Y = 600
export const HORIZON_Y = 455
export const WORLD_WIDTH = 7502
export const WORLD_HEIGHT = 849
// Rentang vertikal yang selalu tertutup gambar (dipakai framing kamera, levelFraming.js).
export const VIEW = { top: 77.4, bottom: 847.5 }
export const WALK_BOUNDS = { left: 120, right: 7480 }

// Batas area (sama dengan world map sebelumnya, sehingga posisi warga tidak berubah).
export const AREAS = [
  { id: 'area-01-rumah-malin', name: 'Rumah Malin', x0: 0, x1: 1324.5 },
  { id: 'area-02-dermaga-nelayan', name: 'Dermaga Nelayan', x0: 1324.5, x1: 2473.3 },
  { id: 'area-03-dermaga-rusak', name: 'Dermaga Rusak', x0: 2473.3, x1: 3622 },
  { id: 'area-04-jalan-kampung', name: 'Jalan Kampung', x0: 3622, x1: 5356.8 },
  { id: 'area-05-pasar-ikan', name: 'Pasar Ikan', x0: 5356.8, x1: 6505.5 },
  { id: 'area-06-pelabuhan', name: 'Pelabuhan', x0: 6505.5, x1: WORLD_WIDTH },
]

// Lapisan jauh (parallax). sf = scroll factor (0 = diam, 1 = ikut dunia).
// Strip diulang otomatis sepanjang dunia; `bottom` = garis dasar strip.
export const BACKDROP = {
  sky: { top: '#5fa8e2', bottom: '#d9f0f8' },
  strips: [
    { strip: 'mountain-far', bottom: HORIZON_Y + 6, sf: 0.1, alpha: 0.9 },
    { strip: 'mountain-mid', bottom: HORIZON_Y + 8, sf: 0.18 },
    { strip: 'mountain-near', bottom: HORIZON_Y + 12, sf: 0.28 },
    { strip: 'ocean', top: HORIZON_Y - 4, sf: 0.6, drift: 6 },
    { strip: 'forest-back', bottom: HORIZON_Y + 22, sf: 0.42 },
  ],
  // Awan: x = posisi saat kamera berada di x itu (dihitung ulang untuk parallax).
  clouds: [
    ['cloud-large-01', 260, 210], ['cloud-small-01', 820, 130], ['cloud-medium-02', 1350, 250],
    ['cloud-wisp-01', 1900, 150], ['cloud-large-02', 2500, 200], ['cloud-small-02', 3050, 120],
    ['cloud-medium-01', 3600, 230], ['cloud-wisp-02', 4150, 175], ['cloud-large-01', 4750, 190],
    ['cloud-small-01', 5300, 140], ['cloud-medium-02', 5900, 240], ['cloud-wisp-01', 6450, 140],
    ['cloud-large-02', 7050, 215], ['cloud-small-02', 7600, 120],
  ],
  cloudSf: 0.12,
}

const placements = []
const walk = (piece, x, opts = {}) => placements.push({ piece, x, layer: 'walk', y: opts.y ?? FLOOR_Y, ...opts, walk: true })
const put = (piece, x, y, opts = {}) => placements.push({ piece, x, y, layer: 'prop', ...opts })
// Ulangi elemen lantai. `step` = lebar elemen dikurangi tumpang-tindih (diisi world.js dari kit).
const runs = []
const grounds = []
const ground = (type, x0, x1, opts = {}) => grounds.push({ type, x0, x1, y: opts.y ?? FLOOR_Y, ...opts, index: grounds.length })
const run = (piece, x0, x1, opts = {}) => runs.push({ piece, x0, x1, opts })

// Strip hutan di belakang daratan (area 1, 4, 5): diulang di rentang x0..x1, ujungnya memudar.
// Dasar objek 'back' (titik berdiri). Ubah di sini untuk menaikkan/menurunkan semua bangunan sekaligus.
//   LAND_BASE: bangunan/pohon di daratan, tertanam di pita rumput (tepi belakang rumput y≈573).
//   DECK_BASE: bangunan di atas dermaga, tiang berakhir di belakang tepi belakang papan dek (y≈585).
export const LAND_BASE = 586
export const DECK_BASE = 615
export const LAND_FOREST = [
  { strip: 'forest-front', x0: -400, x1: 1000, bottom: 578 },
  { strip: 'forest-front', x0: 3640, x1: 6440, bottom: 578 },
]
put('tree-shade-b', 3760, LAND_BASE, { layer: 'back', flip: true }) // berdiri di tanah, bukan di air

// ---------------------------------------------------------------------------------------------
// Area 1 — Rumah Malin (daratan, rumah panggung sederhana, ujung dermaga)
// ---------------------------------------------------------------------------------------------
put('tree-shade-a', -60, LAND_BASE, { layer: 'back' })
put('hut-thatch', 170, LAND_BASE, { layer: 'back', flip: true }) // rumah Malin: tangga di kanan (Ibu turun dari sini)
put('tree-coconut-a', 470, LAND_BASE, { layer: 'back' })
put('drying-rack', 560, LAND_BASE, { layer: 'back' })
put('plant-hibiscus', 395, LAND_BASE + 10, { layer: 'back' })
put('tree-coconut-small', 820, LAND_BASE, { layer: 'back', flip: true })
ground('ground-grass', -150, 960)
put('pot', 470, 604)
put('basket-fish', 520, 606)
put('mats', 760, 604)
put('bush-b', 880, 606)
put('fg-plant-coastal-01', 60, 880, { layer: 'front' })
put('fg-rocks-01', 560, 860, { layer: 'front' })

// ---------------------------------------------------------------------------------------------
// Area 2 — Dermaga Nelayan (dermaga panjang, rumah nelayan di atas air, perahu)
// ---------------------------------------------------------------------------------------------
put('boat-row', 1250, 548, { layer: 'back', s: 0.6 })
put('hut-fisher', 1470, DECK_BASE, { layer: 'back' })
put('boat-fishing', 1900, 552, { layer: 'back', s: 0.6 })
put('hut-fisher', 2330, DECK_BASE, { layer: 'back', flip: true, s: 0.92 })
run('dock-long', 900, 2290)
walk('dock-short', 2280)
put('net-stand', 1010, 606)
put('fish-traps', 1120, 604)
put('floats', 1180, 604)
put('drying-rack', 1560, 604)
put('barrels', 1700, 604)
put('rope-coil', 1990, 604)
put('crates', 2090, 604)
put('oars', 2180, 606)
put('fg-pier-post-near', 1380, 905, { layer: 'front' })
put('fg-pier-post-near', 2200, 915, { layer: 'front', s: 0.9 })

// ---------------------------------------------------------------------------------------------
// Area 3 — Dermaga Rusak (celah air, papan dan tiang sebagai pijakan lompat)
// ---------------------------------------------------------------------------------------------
put('boat-canoe', 3330, 505, { layer: 'back', s: 0.5 })
put('island-rock', 3150, HORIZON_Y + 30, { layer: 'far', sf: 0.45 })
walk('dock-plank-small', 2800, { y: 578 })
walk('pier-post-rope', 3165, { y: 560 })
walk('pier-post', 3290, { y: 585 })
put('obstacle-broken-plank', 3020, 586)
walk('dock-corner', 3400)
put('obstacle-pier-hole', 2745, 760, { layer: 'back', s: 0.8 })
put('fg-rocks-02', 3050, 875, { layer: 'front' })

// ---------------------------------------------------------------------------------------------
// Area 4 — Jalan Kampung (daratan, rumah gadang, rangkiang, pepohonan)
// ---------------------------------------------------------------------------------------------
put('tree-coconut-b', 3700, LAND_BASE, { layer: 'back' })
put('house-gadang-a', 4020, LAND_BASE, { layer: 'back' })
put('rangkiang', 4520, LAND_BASE, { layer: 'back' })
put('tree-shade-b', 4760, LAND_BASE, { layer: 'back' })
put('house-gadang-long', 5050, LAND_BASE, { layer: 'back' })
put('tree-coconut-a', 5380, LAND_BASE, { layer: 'back', flip: true })
ground('ground-grass-flower', 3600, 5740)
put('plant-flower-yellow', 3800, 604)
put('plant-potted', 4330, 604)
put('bush-a', 4640, 606)
put('flower-basket', 4890, 604)
put('plant-hibiscus', 5260, 604)
put('fg-bush-01', 3900, 880, { layer: 'front' })
put('fg-grass-01', 4700, 860, { layer: 'front' })
put('fg-plant-coastal-02', 5250, 870, { layer: 'front' })

// ---------------------------------------------------------------------------------------------
// Area 5 — Pasar Ikan (lapak, meja ikan, keranjang)
// ---------------------------------------------------------------------------------------------
put('stall-thatch', 5530, LAND_BASE, { layer: 'back' })
put('stall-large', 5830, LAND_BASE, { layer: 'back' })
put('fish-rack-tall', 6060, LAND_BASE, { layer: 'back' })
put('stall-canopy', 6280, LAND_BASE, { layer: 'back' })
ground('ground-sand', 5700, 6440)
put('fish-table', 5640, 606)
put('fish-basket-blue', 5950, 606)
put('fish-basket-red', 6030, 606)
put('crate-stack', 6150, 604)
put('table-baskets', 6380, 606)
put('fg-rocks-01', 6000, 870, { layer: 'front' })

// ---------------------------------------------------------------------------------------------
// Area 6 — Pelabuhan (dermaga, kapal layar, muatan)
// ---------------------------------------------------------------------------------------------
put('boat-fishing', 6720, 552, { layer: 'back', flip: true, s: 0.6 })
put('ship-sail', 7170, 712, { layer: 'back' })
walk('dock-long', 6400)
walk('dock-rope', 7150)
put('obstacle-cargo-stack', 6600, 604)
put('anchor', 6760, 604)
put('obstacle-barrel', 6860, 604)
put('sacks', 6930, 604)
put('flag', 7080, 604)
put('crates', 7300, 604)
put('fg-pier-post-near', 6900, 910, { layer: 'front' })

export const PLACEMENTS = placements
export const RUNS = runs
export const GROUNDS = grounds
