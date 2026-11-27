// Malin OPENING (membawa buntalan kain krem). Hanya untuk cinematic (OpeningVillageScene).
// Sheet 8×3, sel 280×280, pusat kepala x=140 dan pijakan kaki y=264 (sama dengan gameplay).
// Versi saat ini SEMENTARA: frame gameplay + buntalan yang digambar programatik oleh
// art-source/tools/build_malin_sheets.py. Ganti file PNG dengan hasil prompt
// art-source/characters/OPENING-SPRITESHEET-PROMPT.md; layout dan nama animasi tetap.
export const malinOpeningAsset = {
  key: 'malin-opening',
  url: `${import.meta.env.BASE_URL}assets/characters/malin/malin-opening-spritesheet.png`,
  frameWidth: 280,
  frameHeight: 280,
  feetY: 264, // pijakan kaki di dalam frame
  figureHeight: 258, // tinggi badan di dalam frame (untuk menghitung skala)
}

const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i)

export const malinOpeningAnimations = [
  { key: 'malin-opening-idle', frames: range(0, 7), frameRate: 6, repeat: -1 },
  { key: 'malin-opening-walk', frames: range(8, 15), frameRate: 9, repeat: -1 }, // jalan pelan
  { key: 'malin-opening-farewell', frames: range(16, 23), frameRate: 5, repeat: 0 },
  { key: 'malin-opening-look', frames: [18, 19], frameRate: 5, repeat: 0 }, // menoleh (bagian pose farewell)
]
