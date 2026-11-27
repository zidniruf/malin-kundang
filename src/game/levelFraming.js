import Phaser from 'phaser'

import { WORLD } from './chapter1/world'

// Framing kamera Chapter 1 yang sama untuk gameplay (LevelOneScene) dan akhir intro
// (OpeningVillageScene), sehingga frame terakhir cinematic identik dengan frame pertama gameplay.
//
// Game memakai Scale.EXPAND dengan ukuran dasar 1280×720: kanvas selalu memenuhi layar dan ukuran
// game melebar/meninggi mengikuti rasio layar (tanpa stretch, tanpa area blur). Kamera lalu memilih
// potongan dunia yang terlihat:
//   - Lebar terlihat 1280 px dunia (ukuran karakter sama di semua layar ≥ 16:9). Kaki Malin dijaga
//     di ≤ 84% tinggi layar agar tombol sentuh tidak menutupinya.
//   - Tinggi terlihat dibatasi area yang tertutup gambar di SEMUA area (WORLD.view); layar yang lebih
//     tinggi (tablet 4:3) melihat lebar dunia yang lebih sempit.
//   - Dunia selebar 7500 px: kamera selalu mengikuti Malin secara horizontal.
export const LEVEL_VIEW = {
  worldWidth: WORLD.width,
  viewTop: WORLD.view.top,
  viewBottom: WORLD.view.bottom,
  viewWidth: 1280,
  floorY: WORLD.floorY,
  feetOnScreen: 0.84,
  followLerp: 0.12,
}

export function levelView(gameWidth, gameHeight, focusX) {
  const { worldWidth, viewTop, viewBottom, viewWidth, floorY, feetOnScreen } = LEVEL_VIEW
  const aspect = gameWidth / gameHeight
  let visibleWidth = viewWidth
  let visibleHeight = viewWidth / aspect
  if (visibleHeight > viewBottom - viewTop) {
    visibleHeight = viewBottom - viewTop
    visibleWidth = visibleHeight * aspect
  }
  const top = Phaser.Math.Clamp(floorY - feetOnScreen * visibleHeight, viewTop, viewBottom - visibleHeight)
  const left = Phaser.Math.Clamp(focusX - visibleWidth / 2, 0, worldWidth - visibleWidth)
  return {
    zoom: gameWidth / visibleWidth,
    centerX: left + visibleWidth / 2,
    centerY: top + visibleHeight / 2,
    visibleWidth,
    visibleHeight,
    follow: true,
  }
}

// Gameplay: terapkan framing sekarang dan setiap kali ukuran layar berubah.
export function attachLevelCamera(scene, target) {
  const camera = scene.cameras.main
  camera.setBounds(0, LEVEL_VIEW.viewTop, LEVEL_VIEW.worldWidth, LEVEL_VIEW.viewBottom - LEVEL_VIEW.viewTop)
  const apply = () => {
    const view = levelView(scene.scale.width, scene.scale.height, target.x)
    camera.setZoom(view.zoom)
    if (view.follow) {
      camera.startFollow(target, true, LEVEL_VIEW.followLerp, 0)
    } else {
      camera.stopFollow()
    }
    camera.centerOn(view.centerX, view.centerY)
  }
  apply()
  scene.scale.on(Phaser.Scale.Events.RESIZE, apply)
  scene.events.once('shutdown', () => scene.scale.off(Phaser.Scale.Events.RESIZE, apply))
}
