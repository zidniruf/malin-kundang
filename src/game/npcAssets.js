// Konfigurasi terpusat sprite sheet Ibu Malin dan NPC kampung (paket malin-opening-mother-npc-pack,
// dijangkar ulang oleh art-source/tools/build_npc_sheets.py).
// Semua sheet: 4×3 frame 200×216, pusat kepala x=100, kaki y=210, menghadap kanan.
//   baris 1 (frame 0–3) idle · baris 2 (4–7) berjalan · baris 3 (8–11) aksi khusus.
const base = import.meta.env.BASE_URL
const character = (path) => `${base}assets/characters/${path}`

export const CHARACTER_FRAME = { frameWidth: 200, frameHeight: 216, feetY: 210, figureHeight: 200 }

const sheet = (key, path, { idleFps = 3, walkFps = 6, actionFps = 4, actionRepeat = 0 } = {}) => ({
  key,
  url: character(path),
  ...CHARACTER_FRAME,
  anims: {
    idle: { key: `${key}-idle`, frames: [0, 1, 2, 3], frameRate: idleFps, repeat: -1, yoyo: true },
    walk: { key: `${key}-walk`, frames: [4, 5, 6, 7], frameRate: walkFps, repeat: -1 },
    action: { key: `${key}-action`, frames: [8, 9, 10, 11], frameRate: actionFps, repeat: actionRepeat },
  },
})

// Ibu Malin: idle, berjalan, memanggil/berbicara (mother_idle / mother_walk / mother_talk).
export const motherAsset = {
  ...sheet('mother', 'mother/mother-malin-spritesheet.png', { idleFps: 3, walkFps: 6, actionFps: 4 }),
  // Gambar statis yang sudah ada; dipakai bila sprite sheet gagal dimuat.
  fallback: { key: 'mother-static', url: character('mother/mother-standing.png') },
}
motherAsset.anims.talk = {
  key: 'mother-talk', frames: [8, 9, 10, 11, 10, 9], frameRate: 4, repeat: -1,
}

export const npcAssets = {
  anak: sheet('npc-anak-desa', 'npc/npc-anak-desa.png', { walkFps: 7, actionFps: 4 }),
  nelayan: sheet('npc-nelayan', 'npc/npc-nelayan.png', { walkFps: 6, actionFps: 3, actionRepeat: 1 }),
  buruh: sheet('npc-buruh-pelabuhan', 'npc/npc-buruh-pelabuhan.png', { walkFps: 5, actionFps: 3 }),
  penjual: sheet('npc-penjual-ikan', 'npc/npc-penjual-ikan.png', { walkFps: 5, actionFps: 3 }),
}

// Peti di frame 8 buruh (di tanah, kanan kaki) dipotong menjadi frame tersendiri supaya peti tetap
// terlihat di tanah saat buruh berjalan atau diam (baris berjalan tidak membawa peti).
export const BURUH_CRATE = { frame: 'crate', x: 113, y: 432 + 161, width: 66, height: 50, offsetX: 13 }

export function registerCharacterAnimations(scene, asset) {
  for (const anim of Object.values(asset.anims)) {
    if (scene.anims.exists(anim.key)) continue
    scene.anims.create({
      key: anim.key,
      frames: anim.frames.map((frame) => ({ key: asset.key, frame })),
      frameRate: anim.frameRate,
      repeat: anim.repeat,
      yoyo: Boolean(anim.yoyo),
    })
  }
}
