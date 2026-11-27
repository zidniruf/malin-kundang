// Malin GAMEPLAY (tanpa bawaan di punggung). Dipakai LevelOneScene.
// Sheet 8×5, sel 280×280, dibangun oleh art-source/tools/build_malin_sheets.py: setiap frame
// dijangkar ulang (pusat kepala x=140, pijakan kaki y=264) sehingga cocok dengan PLAYER_SCALE (LevelOneScene) dan
// body collision 100×252 offset (90, 12) di LevelOneScene tanpa mengubah scene.
// Juga dipakai adegan keseharian di cinematic (OpeningVillageScene) agar Malin sebelum merantau
// sama dengan Chapter 1. Malin ber-buntalan (keberangkatan) ada di malinOpeningAssets.js.
export const malinAsset = {
  key: 'malin',
  url: `${import.meta.env.BASE_URL}assets/characters/malin/malin-gameplay-spritesheet.png`,
  frameWidth: 280,
  frameHeight: 280,
}

const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i)

// Nama `malin-idle`, `malin-walk`, `malin-jump` dipakai LevelOneScene; jangan diganti.
// `run`, `crouch`, dan `talk` sudah terdaftar untuk fitur gameplay berikutnya.
export const malinAnimations = [
  { key: 'malin-idle', frames: range(0, 7), frameRate: 6, repeat: -1 },
  { key: 'malin-walk', frames: range(8, 15), frameRate: 12, repeat: -1 },
  { key: 'malin-run', frames: range(16, 23), frameRate: 13, repeat: -1 },
  { key: 'malin-jump', frames: range(24, 31), frameRate: 10, repeat: 0 },
  { key: 'malin-crouch', frames: range(32, 35), frameRate: 8, repeat: 0 },
  { key: 'malin-talk', frames: range(36, 39), frameRate: 6, repeat: -1 },
]
