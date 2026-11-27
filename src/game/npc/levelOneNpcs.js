import AmbientNpc from './AmbientNpc'
import { EventBus } from '../EventBus'
import { motherAsset, npcAssets } from '../npcAssets'

// Warga kampung di world map Chapter 1 (lantai y=600; batas area di worldLayout.json):
//   Area 1 Rumah Malin 0–1324 · Area 2 Dermaga Nelayan 1324–2473 · Area 3 Dermaga Rusak 2473–3622 ·
//   Area 4 Jalan Kampung 3622–5357 · Area 5 Pasar Ikan 5357–6505 · Area 6 Pelabuhan 6505–7502.
// Semua area patroli berada di lantai utama (bukan celah air Dermaga Rusak), jadi NPC tidak
// keluar platform. Tinggi NPC ±15% lebih besar dari versi awal, sebanding dengan Malin (0.53).
// Warga sudah berada di dunia sejak intro: bingkai kamera intro yang di-zoom (sekitar Ibu & Malin
// di x≈610–700) tidak mencakup mereka; nelayan di dermaga Area 1 (x 1200–1320) baru terlihat saat kamera
// mundur ke framing gameplay. Jangan taruh warga di x≈200–1160 tanpa menyesuaikan kamera intro.
export const FLOOR_Y = 600

export const LEVEL_ONE_NPCS = [
  // Ibu: NPC cerita di ujung jalan setapak rumah, menghadap Malin. Tidak berpatroli.
  { id: 'ibu', asset: motherAsset, x: 610, height: 128, minX: 610, maxX: 610, face: 1, walkChance: 0, actionChance: 0.15, idle: [4, 8] },
  // Nelayan: di ujung dermaga dekat rumah, berjalan pendek lalu memakai jala.
  { id: 'nelayan', asset: npcAssets.nelayan, x: 1250, height: 138, minX: 1200, maxX: 1320, face: -1, walkChance: 0.35, actionChance: 0.4, walkDistance: [40, 110], speed: 48, actionHold: [0.5, 1.5] },
  // Buruh: bolak-balik di dermaga nelayan dan mengangkat peti di titik kerjanya.
  { id: 'buruh', asset: npcAssets.buruh, x: 1760, height: 134, minX: 1680, maxX: 1960, face: 1, walkChance: 0.45, actionChance: 0.35, walkDistance: [50, 130], speed: 42, actionHold: [1, 2], crate: { spotX: 1820 } },
  // Anak desa: berjalan santai di jalan kampung, sesekali menunjuk.
  { id: 'anak', asset: npcAssets.anak, x: 4080, height: 100, minX: 3900, maxX: 4300, face: -1, walkChance: 0.6, actionChance: 0.2, idle: [1.5, 4], walkDistance: [50, 150], speed: 60 },
  // Penjual ikan: di depan lapak pasar, kebanyakan diam/menawarkan ikan.
  { id: 'penjual', asset: npcAssets.penjual, x: 5720, height: 128, minX: 5660, maxX: 5800, face: -1, walkChance: 0.2, actionChance: 0.45, walkDistance: [20, 50], speed: 32, actionHold: [1, 2.5] },
]

// Sheet NPC dimuat setelah scene siap dan tidak memblokir gameplay: bila gagal dimuat, NPC itu
// dilewati (Ibu memakai gambar statis) dan error dicatat di konsol, bukan layar error game.
export function spawnLevelOneNpcs(scene) {
  const npcs = []
  let active = true
  const load = scene.load
  const assets = [...new Set(LEVEL_ONE_NPCS.map((npc) => npc.asset))]
  const failed = new Set()

  const onError = (file) => {
    failed.add(file.key)
    console.error(`NPC gagal dimuat: ${file.key} (${file.url})`)
    if (file.key === motherAsset.key) load.image(motherAsset.fallback.key, motherAsset.fallback.url)
  }

  const spawn = () => {
    load.off('loaderror', onError)
    if (!active) return
    for (const npc of LEVEL_ONE_NPCS) {
      const { asset } = npc
      if (!failed.has(asset.key) && scene.textures.exists(asset.key)) {
        // Tanpa fade: Ibu dan warga melanjutkan posisi yang sama dengan akhir intro.
        npcs.push(new AmbientNpc(scene, { ...npc, y: FLOOR_Y, seed: npc.id }))
      } else if (npc.id === 'ibu' && scene.textures.exists(motherAsset.fallback.key)) {
        const image = scene.add.image(npc.x, FLOOR_Y, motherAsset.fallback.key).setOrigin(0.5, 1).setDepth(0.5)
        image.setScale(npc.height / image.height)
        npcs.push({ destroy: () => image.destroy() })
      }
    }
    // PhaserGame menunggu sinyal ini sebelum melepas cinematic (Ibu sudah ada di frame).
    EventBus.emit('npcs-ready')
  }

  load.on('loaderror', onError)
  for (const asset of assets) {
    if (!scene.textures.exists(asset.key)) {
      load.spritesheet(asset.key, asset.url, { frameWidth: asset.frameWidth, frameHeight: asset.frameHeight })
    }
  }
  load.once('complete', spawn)
  load.start()

  const destroy = () => {
    active = false
    load.off('loaderror', onError)
    load.off('complete', spawn)
    npcs.splice(0).forEach((npc) => npc.destroy())
  }
  scene.events.once('shutdown', destroy)
  return { npcs, destroy }
}
