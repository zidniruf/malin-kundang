// Fungsi gerak babak 1 (scene Main Menu + shot teluk/dermaga) dan preload aset cinematic. Tanpa React.
// Babak kampung dijalankan Phaser (src/game/scenes/OpeningVillageScene.js).
import {
  ALL_CINEMATIC_IMAGES, MENU_CAMERA_KEYS, MENU_DEPTH, SHIP_DRIFT_PER_SECOND, SHIP_FADE_IN_SECONDS, TRANSITION_SHOTS,
} from './cinematicConfig'
import { preloadImage } from '../loading/preload'

const MENU_STAGE_RATIO = 1672 / 941

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
export const lerp = (a, b, u) => a + (b - a) * u
export const easeInOutCubic = (u) => (u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2)
export const easeOutCubic = (u) => 1 - (1 - u) ** 3
const easeInCubic = (u) => u * u * u
export const progress = (t, from, to) => clamp((t - from) / (to - from), 0, 1)

function sampleKeys(keys, t) {
  if (t <= keys[0].t) return keys[0]
  const last = keys[keys.length - 1]
  if (t >= last.t) return last
  const index = keys.findIndex((key) => key.t > t)
  const from = keys[index - 1]
  const to = keys[index]
  const eased = easeInOutCubic((t - from.t) / (to.t - from.t))
  const result = {}
  for (const name of Object.keys(to)) result[name] = lerp(from[name], to[name], eased)
  return result
}

// Muat semua gambar cinematic sekali; dipanggil saat menu tampil agar siap sebelum dipakai.
let preloadPromise = null
export function preloadCinematic() {
  if (!preloadPromise) {
    preloadPromise = Promise.all(ALL_CINEMATIC_IMAGES.map(preloadImage))
  }
  return preloadPromise
}

function letterboxHeight(vw, vh) {
  if (vw > vh && vh <= 520) return 12
  if (vh > vw) return clamp(vh * 0.06, 14, 60)
  return clamp(vh * 0.075, 16, 84)
}

// Keadaan scene menu tepat saat tombol ditekan (sebelum animasi menu dihentikan).
export function measureStart(ship, malin) {
  const top = malin?.getBoundingClientRect().top
  return { ship: measureShip(ship), malinTop: Number.isFinite(top) ? top : null }
}

function measureShip(ship) {
  if (!ship?.parentElement) return { tx: 95, o: 1 }
  const shipRect = ship.getBoundingClientRect()
  const trackRect = ship.parentElement.getBoundingClientRect()
  const width = ship.offsetWidth || shipRect.width
  const centerX = shipRect.left + shipRect.width / 2 - trackRect.left
  return {
    tx: ((centerX - width / 2) / width) * 100,
    o: Number.parseFloat(window.getComputedStyle(ship).opacity) || 0,
  }
}

function menuCameraLimits(viewport, stageSize, anchor, zoom) {
  const stageOffset = anchor * (viewport - stageSize)
  const low = stageOffset - viewport / 2 + viewport / (2 * zoom)
  const high = stageOffset + stageSize - viewport / 2 - viewport / (2 * zoom)
  const margin = 0.97 / MENU_DEPTH.underwater
  return [low * margin, high * margin]
}

// Babak 1: kamera mendekat ke kampung; Malin tetap berdiri (animasi napas CSS),
// kapal melanjutkan posisi dan kecepatannya dari animasi menu.
export function computeMenuFrame(t, { vw, vh, anchor, ship0, malinTop, reduced }) {
  const stageW = Math.max(vw, vh * MENU_STAGE_RATIO)
  const stageH = stageW / MENU_STAGE_RATIO
  const camera = reduced ? MENU_CAMERA_KEYS[0] : sampleKeys(MENU_CAMERA_KEYS, t)
  let zoom = camera.z
  let camY = camera.y * vh
  // Zoom dibatasi agar kepala Malin tidak tertutup letterbox (penting di layar pendek).
  if (malinTop !== null && malinTop !== undefined) {
    const headRoom = vh / 2 - (letterboxHeight(vw, vh) + 8)
    const headFromCenter = vh / 2 - malinTop + camY * MENU_DEPTH.malin
    if (headFromCenter * zoom > headRoom) {
      zoom = Math.max(1, headRoom / headFromCenter)
      if (zoom === 1) camY = Math.min(camY, (headRoom - vh / 2 + malinTop) / MENU_DEPTH.malin)
    }
  }
  const [minX, maxX] = menuCameraLimits(vw, stageW, anchor.x, zoom)
  const [minY, maxY] = menuCameraLimits(vh, stageH, anchor.y, zoom)
  return {
    camX: clamp(camera.x * vw, minX, maxX),
    camY: clamp(camY, minY, maxY),
    camZ: zoom,
    shipTx: ship0.tx - (reduced ? 0 : t * SHIP_DRIFT_PER_SECOND),
    shipO: lerp(ship0.o, 1, easeOutCubic(progress(t, 0, SHIP_FADE_IN_SECONDS))),
  }
}

export function writeMenuFrame(element, frame) {
  const style = element.style
  style.setProperty('--cam-x', `${frame.camX.toFixed(2)}px`)
  style.setProperty('--cam-y', `${frame.camY.toFixed(2)}px`)
  style.setProperty('--cam-z', frame.camZ.toFixed(4))
  style.setProperty('--ship-tx', `${frame.shipTx.toFixed(3)}%`)
  style.setProperty('--ship-ty', '0%')
  style.setProperty('--ship-s', '1')
  style.setProperty('--ship-o', frame.shipO.toFixed(3))
}

// ---------- Shot transisi: teluk (01) dan dermaga (02) ----------
// Gambar 1672×941 selalu menutupi layar; kamera = translate + scale yang dijepit agar tepi gambar
// tidak pernah terlihat. Layer parallax digeser relatif terhadap gerak kamera sejak awal shot.

function shotCamera(keys, t, viewport, reduced) {
  const { vw, vh } = viewport
  const W = Math.max(vw, vh * TRANSITION_SHOTS.ratio)
  const H = W / TRANSITION_SHOTS.ratio
  const portrait = vw < vh
  const place = (key) => {
    const z = Math.max(1, key.z)
    const fx = portrait ? key.pfx : key.fx
    const tx = clamp(vw / 2 - fx * W * z, vw - W * z, 0)
    const ty = clamp(vh / 2 - key.fy * H * z, vh - H * z, 0)
    return { tx, ty, z, u: -tx / (W * z) }
  }
  const start = place(keys[0])
  const now = reduced ? start : place(sampleKeys(keys, t))
  return { W, H, ...now, pan: now.u - start.u }
}

export function computeShotsFrame(t, viewport, reduced) {
  const { bay, pier, clouds, waves, foliage } = TRANSITION_SHOTS
  const motion = reduced ? 0 : 1
  const bayCam = shotCamera(bay.camera, t, viewport, reduced)
  const pierCam = shotCamera(pier.camera, t, viewport, reduced)
  const { W, H } = bayCam
  const swing = Math.sin((t / waves.period) * Math.PI * 2) * motion
  const shipU = reduced ? bay.ship.from : lerp(bay.ship.from, bay.ship.to, progress(t, bay.fade[0], bay.camera.at(-1).t))
  const fly = easeInCubic(progress(t, foliage.flyFrom, foliage.flyTo)) * motion

  return {
    W,
    H,
    bay: {
      o: easeInOutCubic(progress(t, ...bay.fade)),
      cam: bayCam,
      // Awan jauh (tertinggal dari kamera) + hanyut pelan.
      cloudsX: (bayCam.pan * 0.4 + t * clouds.drift * motion) * W,
      // Ombak dekat (bergerak lebih dari kamera) + ayun horizontal.
      wavesX: (-bayCam.pan * 0.15 + swing * waves.sway) * W,
      wavesY: Math.abs(swing) * 0.004 * H,
      shipX: shipU * W,
      shipRot: Math.sin(t * 2.1) * 1.1 * motion,
      // Dedaunan paling dekat: ikut membesar bersama zoom dan bergeser lebih jauh dari latar;
      // skala selalu menyisakan margin agar tepi potongan daun tidak terlihat.
      foliageX: -bayCam.pan * 0.25 * W,
      foliageS: lerp(1.06 + (bayCam.z - 1) * 0.6, foliage.scaleTo, fly),
      foliageO: 1 - easeInOutCubic(progress(t, foliage.fadeFrom, foliage.fadeTo)),
    },
    pier: {
      o: easeInOutCubic(progress(t, ...pier.fade)),
      cam: pierCam,
      cloudsX: (pierCam.pan * 0.4 + t * clouds.drift * motion) * W,
    },
  }
}
