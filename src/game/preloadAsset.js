import { getLoadedImage } from '../loading/preload'

// Transfer gambar siap pakai ke TextureManager; jangan unduh/dekode lagi di Phaser.
// Loader normal tetap tersedia untuk scene yang dijalankan tanpa startup preloader.
export function preloadAsset(scene, key, url, frameConfig) {
  if (scene.textures.exists(key)) return
  const image = getLoadedImage(url)
  if (image) {
    if (frameConfig) scene.textures.addSpriteSheet(key, image, frameConfig)
    else scene.textures.addImage(key, image)
  } else if (frameConfig) {
    scene.load.spritesheet(key, url, frameConfig)
  } else {
    scene.load.image(key, url)
  }
}
