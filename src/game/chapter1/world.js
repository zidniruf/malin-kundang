import Phaser from 'phaser'
import kit from './kit.json'
import { preloadAsset } from '../preloadAsset'
import {
  AREAS, BACKDROP, FLOOR_Y, GROUNDS, LAND_FOREST, PLACEMENTS, RUNS, VIEW, WALK_BOUNDS, WORLD_HEIGHT, WORLD_WIDTH,
} from './layout'

// World map Chapter 1: satu dunia side-scrolling (Rumah Malin → Dermaga Nelayan → Dermaga Rusak →
// Jalan Kampung → Pasar Ikan → Pelabuhan) yang DISUSUN dari elemen modular, bukan satu gambar panjang.
//
//   kit.json   (dibangkitkan art-source/tools/build_chapter1_kit.py)  ukuran, skala dan permukaan
//              pijakan setiap elemen; satu file WebP per elemen di public/assets/chapter-1/kit/.
//   layout.js  (boleh diedit manual)  penempatan elemen per area. Elemen yang sama boleh dipakai
//              berulang kali; teksturnya hanya dimuat sekali.
//
// Lantai/platform tidak diukur dari gambar lagi: dihitung dari `surface` elemen yang ditempatkan
// dengan walk()/solid. Lantai utama tetap y=600 dan skala karakter tidak berubah.

export const WORLD_DEPTH = {
  sky: -10,
  clouds: -9,
  backdrop: -8, // gunung, laut, hutan jauh (urutan di BACKDROP.strips)
  far: -4,
  landForest: -3,
  back: -2,
  background: 0, // lantai: tanah dan dermaga
  prop: 0.2,
  npc: 0.5,
  player: 1,
  foreground: 10, // tanaman/batu/tiang di depan Malin
}

const LAYER_DEPTH = { far: WORLD_DEPTH.far, back: WORLD_DEPTH.back, walk: WORLD_DEPTH.background, prop: WORLD_DEPTH.prop, front: WORLD_DEPTH.foreground }
const RUN_OVERLAP = 28 // px tumpang-tindih antar elemen lantai yang diulang (tiang ujung bertemu)
const WALK_INSET = 14 // tepi collider sedikit masuk dari tepi gambar
const SKY_KEY = 'c1-sky'
const BASE_VIEW_WIDTH = 1280
const textureKey = (name) => `c1-kit-${name}`
const url = (path) => `${import.meta.env.BASE_URL}${path}`

function piece(name) {
  const entry = kit.pieces[name]
  if (!entry) throw new Error(`Elemen kit tidak dikenal di layout Chapter 1: "${name}"`)
  return entry
}

const GROUND_PARTS = ['cap-l', 'mid', 'cap-r']
const FILL_KEY = textureKey('ground-fill')
const FILL_INSET = 36 // isian sedikit masuk dari ujung daratan (ujung semak/batu membulat)
const FILL_OVERLAP = 14 // isian dimulai di bawah pita batu tanah
const groundKey = (type, part) => textureKey(`${type}-${part}`)

function groundKit(type) {
  const entry = kit.grounds[type]
  if (!entry) throw new Error(`Jenis tanah tidak dikenal di layout Chapter 1: "${type}"`)
  return entry
}

// Tanah menerus x0..x1: ujung kiri + tengah diulang (TileSprite) + ujung kanan, semuanya dari potongan
// yang sama, jadi permukaan (y) dan garis bawahnya selalu satu baris.
function addGround(scene, ground) {
  const entry = groundKit(ground.type)
  const top = ground.y - entry.surface
  // Lebar ujung TANPA bagian pudar; bagian pudar menumpuk di atas tile tengah.
  const left = entry['cap-l'].w - entry.fade
  const right = entry['cap-r'].w - entry.fade
  // Sedikit di belakang dermaga/lantai lain: di pertemuan daratan–dermaga, ujung dermaga tampak di depan.
  const depth = WORLD_DEPTH.background - 0.01 + ground.index * 1e-5

  // Isian tanah di bawah daratan sampai di bawah layar (tidak ada air di bawah tanah).
  if (scene.textures.exists(FILL_KEY)) {
    const fillTop = top + entry.h - FILL_OVERLAP
    // Ujung yang bersambung dengan daratan lain tidak dimasukkan, agar tidak ada celah air di antaranya.
    const joined = (x) => GROUNDS.some((other) => other !== ground && other.x0 <= x && other.x1 >= x)
    const fillLeft = ground.x0 + (joined(ground.x0) ? 0 : FILL_INSET)
    const fillRight = ground.x1 - (joined(ground.x1) ? 0 : FILL_INSET)
    scene.add.tileSprite(fillLeft, fillTop, fillRight - fillLeft, WORLD_HEIGHT + 120 - fillTop, FILL_KEY)
      .setOrigin(0, 0).setDepth(depth - 1e-6)
  }
  // Tile tengah dimulai tepat di kolom sumber tempat ujung kiri berakhir, jadi sambungan kiri tidak bergeser.
  const midKey = groundKey(ground.type, 'mid')
  if (scene.textures.exists(midKey)) {
    scene.add.tileSprite(ground.x0 + left, top, ground.x1 - ground.x0 - left - right, entry.mid.h, midKey)
      .setOrigin(0, 0).setDepth(depth)
  }
  const capLeft = groundKey(ground.type, 'cap-l')
  const capRight = groundKey(ground.type, 'cap-r')
  if (ground.capLeft !== false && scene.textures.exists(capLeft)) scene.add.image(ground.x0, top, capLeft).setOrigin(0, 0).setDepth(depth + 1e-6)
  if (ground.capRight !== false && scene.textures.exists(capRight)) scene.add.image(ground.x1 - right - entry.fade, top, capRight).setOrigin(0, 0).setDepth(depth + 1e-6)
}

// Ubah layout (x tengah/dasar, helper run) menjadi kotak dunia yang pasti (kiri/atas/ukuran).
function resolvePlacements() {
  const expanded = [...PLACEMENTS]
  for (const { piece: name, x0, x1, opts } of RUNS) {
    const step = piece(name).w * (opts.s ?? 1) - RUN_OVERLAP
    for (let x = x0; x < x1; x += step) expanded.push({ piece: name, x, layer: 'walk', y: opts.y ?? FLOOR_Y, ...opts, walk: true })
  }
  return expanded.map((item, index) => {
    const entry = piece(item.piece)
    const s = item.s ?? 1
    const w = entry.w * s
    const h = entry.h * s
    let left
    let top
    if (item.walk) {
      left = item.x
      top = item.y - entry.surface * s
    } else {
      left = item.x - w / 2
      top = item.y - h
    }
    return { ...item, index, key: textureKey(item.piece), left, top, w, h, scale: entry.scale * s, sf: item.sf ?? 1, depth: LAYER_DEPTH[item.layer] ?? WORLD_DEPTH.prop }
  })
}

const PLACED = resolvePlacements()

// Permukaan pijakan: satu zona per elemen (tidak digabung) sehingga respawn kembali ke awal elemen
// terakhir yang dilewati, bukan ke awal dermaga panjang.
function collectSurfaces() {
  const floors = []
  const platforms = []
  for (const item of PLACED) {
    if (!item.walk && !item.solid) continue
    const entry = piece(item.piece)
    if (entry.surface === undefined) continue
    const inset = Math.min(WALK_INSET, item.w * 0.2)
    const surface = { x0: Math.round(item.left + inset), x1: Math.round(item.left + item.w - inset), y: Math.round(item.top + entry.surface * (item.s ?? 1)) }
    ;(item.walk && surface.y === FLOOR_Y ? floors : platforms).push(surface)
  }
  // Tanah menerus: satu lantai sepanjang jalur.
  for (const ground of GROUNDS) {
    const surface = { x0: Math.round(ground.x0 + WALK_INSET), x1: Math.round(ground.x1 - WALK_INSET), y: ground.y }
    ;(surface.y === FLOOR_Y ? floors : platforms).push(surface)
  }
  floors.sort((a, b) => a.x0 - b.x0)
  platforms.sort((a, b) => a.x0 - b.x0)
  return { floors, platforms }
}

const { floors, platforms } = collectSurfaces()

export const WORLD = {
  width: WORLD_WIDTH,
  height: WORLD_HEIGHT,
  floorY: FLOOR_Y,
  view: VIEW,
  walkLeft: WALK_BOUNDS.left,
  walkRight: WALK_BOUNDS.right,
  areas: AREAS,
  floors,
  platforms,
  placements: PLACED,
}

// Posisi x tampilan untuk objek parallax agar terlihat di x dunia `x` saat kamera berpusat di sana.
const parallaxX = (x, sf) => x * sf + (1 - sf) * (BASE_VIEW_WIDTH / 2)

function placedInRange(from = -Infinity, to = Infinity) {
  return PLACED.filter((item) => item.sf !== 1 || (item.left < to && item.left + item.w > from))
}

function textureList(range = {}) {
  const pieces = new Set(placedInRange(range.from, range.to).map((item) => item.piece))
  for (const [name] of BACKDROP.clouds) pieces.add(name)
  const list = [...pieces].map((name) => ({ key: textureKey(name), url: kit.pieces[name].url }))
  const strips = new Set([...BACKDROP.strips.map((s) => s.strip), ...LAND_FOREST.map((s) => s.strip)])
  for (const name of strips) list.push({ key: textureKey(name), url: kit.strips[name].url })
  for (const ground of GROUNDS) {
    if (ground.x0 >= (range.to ?? Infinity) || ground.x1 <= (range.from ?? -Infinity)) continue
    for (const part of GROUND_PARTS) list.push({ key: groundKey(ground.type, part), url: groundKit(ground.type)[part].url })
    list.push({ key: FILL_KEY, url: kit.strips['ground-fill'].url })
  }
  return [...new Map(list.map((texture) => [texture.key, texture])).values()]
}

// URL gambar dunia pada rentang tertentu (dipakai preload HTML sebelum cinematic dimulai).
export function worldImageUrls(range = {}) {
  return textureList(range).map((texture) => url(texture.url))
}

export function preloadWorld(scene, range = {}) {
  for (const texture of textureList(range)) {
    preloadAsset(scene, texture.key, url(texture.url))
  }
}

function addSky(scene) {
  if (!scene.textures.exists(SKY_KEY)) {
    const canvas = scene.textures.createCanvas(SKY_KEY, 4, 256)
    const gradient = canvas.context.createLinearGradient(0, 0, 0, 256)
    gradient.addColorStop(0, BACKDROP.sky.top)
    gradient.addColorStop(1, BACKDROP.sky.bottom)
    canvas.context.fillStyle = gradient
    canvas.context.fillRect(0, 0, 4, 256)
    canvas.refresh()
  }
  const margin = 3000
  scene.add.image(-margin, 0, SKY_KEY).setOrigin(0, 0)
    .setDisplaySize(WORLD_WIDTH + margin * 2, FLOOR_Y)
    .setScrollFactor(0, 1)
    .setDepth(WORLD_DEPTH.sky)
}

// Strip yang diulang sepanjang dunia. Lebar dilebihkan agar tetap menutup layar pada parallax,
// zoom sinematik, dan layar lebar.
function addStrip(scene, config, depth, x0 = null, x1 = null) {
  const strip = kit.strips[config.strip]
  const key = textureKey(config.strip)
  if (!scene.textures.exists(key)) return null
  const sf = config.sf ?? 1
  const left = x0 ?? -2500
  const width = x1 !== null ? x1 - x0 : WORLD_WIDTH * sf + 5000
  const top = config.top ?? config.bottom - strip.h + (strip.padBottom ?? 0)
  // Satu baris tile saja (laut tidak boleh berulang ke bawah: garis cakrawalanya akan muncul lagi).
  const sprite = scene.add.tileSprite(left, top, width, strip.h, key).setOrigin(0, 0).setScrollFactor(sf, 1).setDepth(depth)
  if (config.alpha !== undefined) sprite.setAlpha(config.alpha)
  return sprite
}

const STRIP_FADE = 220 // px dunia: ujung strip hutan daratan memudar, bukan tepi tegak

// Strip terbatas x0..x1 (hutan di belakang daratan) dengan ujung kiri/kanan memudar (alpha per sudut).
// Ketiga bagian membaca tekstur pada kolom dunia yang sama, jadi polanya menyambung.
function addFadedStrip(scene, config, depth) {
  const { x0, x1 } = config
  const fade = Math.min(STRIP_FADE, (x1 - x0) / 3)
  const main = addStrip(scene, config, depth, x0 + fade, x1 - fade)
  if (!main) return
  const left = addStrip(scene, config, depth, x0, x0 + fade)
  left.tilePositionX = -fade
  left.setAlpha(0, 1, 0, 1)
  const right = addStrip(scene, config, depth, x1 - fade, x1)
  right.tilePositionX = x1 - x0 - fade * 2
  right.setAlpha(1, 0, 1, 0)
}

// Air di depan kaki tiang dermaga: layar tinggi (tablet 4:3) melihat sampai y≈848, di bawah ujung tiang
// (y≈771). Laut yang sama digambar lagi DI DEPAN dermaga, bening di atas lalu makin pekat ke bawah,
// sehingga tiang tampak masuk ke air. Hanya di atas air: rentang daratan (ground) dilewati.
const WATER_FRONT = { top: 700, solidFrom: 790, alpha: 0.94 }

function waterRanges() {
  const land = GROUNDS.map((g) => [g.x0 + FILL_INSET, g.x1 - FILL_INSET]).sort((a, b) => a[0] - b[0])
  const ranges = []
  let x = -2500
  for (const [a, b] of land) {
    if (a > x) ranges.push([x, a])
    x = Math.max(x, b)
  }
  ranges.push([x, WORLD_WIDTH + 2500])
  return ranges
}

function addWaterFront(scene, ocean) {
  const strip = kit.strips[ocean.config.strip]
  const oceanTop = ocean.sprite.y
  const bottom = oceanTop + strip.h // tekstur laut tidak diulang ke bawah (cakrawala muncul lagi)
  const { top, solidFrom, alpha } = WATER_FRONT
  const depth = WORLD_DEPTH.background + 0.05 // di depan dermaga, di belakang properti, warga, Malin
  const sprites = []
  for (const [x0, x1] of waterRanges()) {
    const fade = scene.add.tileSprite(x0, top, x1 - x0, solidFrom - top, ocean.sprite.texture.key)
      .setOrigin(0, 0).setDepth(depth).setAlpha(0, 0, alpha, alpha)
    fade.tilePositionY = top - oceanTop
    const solid = scene.add.tileSprite(x0, solidFrom, x1 - x0, bottom - solidFrom, ocean.sprite.texture.key)
      .setOrigin(0, 0).setDepth(depth).setAlpha(alpha)
    solid.tilePositionY = solidFrom - oceanTop
    sprites.push(fade, solid)
  }
  return sprites
}

// Latar (langit, awan, gunung, laut, hutan) + seluruh elemen layout pada rentang x [from, to].
export function addWorldVisuals(scene, range = {}) {
  addSky(scene)

  const drifting = []
  let ocean = null
  BACKDROP.strips.forEach((config, i) => {
    const sprite = addStrip(scene, config, WORLD_DEPTH.backdrop + i * 0.5)
    if (sprite && config.drift) drifting.push({ sprite, speed: config.drift })
    if (sprite && config.strip === 'ocean') ocean = { sprite, config }
  })
  const waterFront = ocean ? addWaterFront(scene, ocean) : []
  for (const config of LAND_FOREST) addFadedStrip(scene, config, WORLD_DEPTH.landForest)
  for (const ground of GROUNDS) {
    if (ground.x0 < (range.to ?? Infinity) && ground.x1 > (range.from ?? -Infinity)) addGround(scene, ground)
  }

  for (const [name, x, y] of BACKDROP.clouds) {
    const key = textureKey(name)
    if (!scene.textures.exists(key)) continue
    scene.add.image(parallaxX(x, BACKDROP.cloudSf), y, key).setOrigin(0.5, 1)
      .setScale(kit.pieces[name].scale)
      .setScrollFactor(BACKDROP.cloudSf, 1)
      .setDepth(WORLD_DEPTH.clouds)
  }

  for (const item of placedInRange(range.from, range.to)) {
    if (!scene.textures.exists(item.key)) continue
    const x = item.sf === 1 ? item.left : parallaxX(item.left + item.w / 2, item.sf) - item.w / 2
    const image = scene.add.image(x, item.top, item.key).setOrigin(0, 0).setScale(item.scale)
      // Urutan dalam satu lapisan mengikuti urutan di layout (yang ditulis belakangan di depan).
      .setDepth(item.depth + item.index * 1e-5)
    if (item.flip) image.setFlipX(true)
    if (item.sf !== 1) image.setScrollFactor(item.sf, 1)
    if (item.alpha !== undefined) image.setAlpha(item.alpha)
  }

  // Laut bergerak pelan (tekstur bergeser, objek tidak dibuat ulang). Air di depan tiang mengikuti
  // kolom tekstur laut latar yang sama (parallax), jadi keduanya tampak sebagai satu permukaan air.
  if (drifting.length > 0 || waterFront.length > 0) {
    const camera = scene.cameras.main
    const onUpdate = (_time, delta) => {
      for (const { sprite, speed } of drifting) sprite.tilePositionX += (speed * delta) / 1000
      if (!ocean) return
      const sf = ocean.config.sf ?? 1
      for (const sprite of waterFront) {
        sprite.tilePositionX = sprite.x - ocean.sprite.x - camera.scrollX * (1 - sf) + ocean.sprite.tilePositionX
      }
    }
    scene.events.on(Phaser.Scenes.Events.UPDATE, onUpdate)
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => scene.events.off(Phaser.Scenes.Events.UPDATE, onUpdate))
  }
}

// Lantai dan platform: zona statis satu arah (hanya sisi atas yang menahan), sehingga Malin bisa
// melompat dari bawah ke pijakan yang lebih tinggi dan berjalan melewati tepi tanpa tersangkut.
// Celah di antaranya adalah air (lihat respawn di LevelOneScene).
const SURFACE_THICKNESS = 32

export function addWorldColliders(scene) {
  const group = scene.physics.add.staticGroup()
  for (const surface of [...WORLD.floors, ...WORLD.platforms]) {
    const width = surface.x1 - surface.x0
    const zone = scene.add.zone(surface.x0 + width / 2, surface.y + SURFACE_THICKNESS / 2, width, SURFACE_THICKNESS)
    group.add(zone)
    const { checkCollision } = zone.body
    checkCollision.down = false
    checkCollision.left = false
    checkCollision.right = false
  }
  return group
}

// Titik muncul kembali setelah jatuh ke air: awal lantai utama terakhir yang sudah dilewati.
export function respawnPoint(x) {
  const passed = WORLD.floors.filter((floor) => floor.x0 <= x).sort((a, b) => b.x0 - a.x0)[0] ?? WORLD.floors[0]
  return { x: Phaser.Math.Clamp(passed.x0 + 60, WORLD.walkLeft + 40, WORLD.walkRight - 40), y: WORLD.floorY }
}

export function areaAt(x) {
  return WORLD.areas.find((area) => x >= area.x0 && x < area.x1) ?? WORLD.areas[WORLD.areas.length - 1]
}
