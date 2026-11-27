import Phaser from 'phaser'
import { EventBus } from '../EventBus'
import { malinAsset, malinAnimations } from '../malinAssets'
import PlayerControls from '../PlayerControls'
import { spawnLevelOneNpcs } from '../npc/levelOneNpcs'
import { attachLevelCamera } from '../levelFraming'
import { WORLD, WORLD_DEPTH, addWorldColliders, addWorldVisuals, preloadWorld, respawnPoint } from '../chapter1/world'

// Ukuran dasar game (Scale.EXPAND); dunia Chapter 1 sendiri jauh lebih lebar (WORLD.width).
export const LEVEL_SIZE = { width: 1280, height: 720 }
const GROUND_Y = WORLD.floorY
// Posisi awal Malin di Area 1 (Rumah Malin), di dermaga dekat rumah; akhir intro menempatkan Malin
// di titik yang sama (perpindahan mulus).
export const PLAYER_START_X = 700
// Jatuh ke air (celah Dermaga Rusak): muncul kembali di awal lantai terakhir yang dilewati.
const FALL_RESET_Y = GROUND_Y + 160
// Skala sprite Malin (juga dipakai intro agar serah terima identik). Body collision Arcade ikut
// skala ini; pijakan kaki tetap di baris 264 sheet, jadi movement/jump tidak berubah.
export const PLAYER_SCALE = 0.53
const MOVE_SPEED = 230
const JUMP_SPEED = 440

export default class LevelOneScene extends Phaser.Scene {
  constructor() {
    super('LevelOneScene')
  }

  preload() {
    this.failedAssets = []
    const onLoadError = (file) => {
      this.failedAssets.push(file.key)
      EventBus.emit('game-error', `Aset gagal dimuat: ${file.key}. Periksa file ${file.url}, lalu coba lagi.`)
    }
    this.load.on('loaderror', onLoadError)
    this.load.once('complete', () => this.load.off('loaderror', onLoadError))
    preloadWorld(this)
    this.load.spritesheet(malinAsset.key, malinAsset.url, {
      frameWidth: malinAsset.frameWidth,
      frameHeight: malinAsset.frameHeight,
    })
  }

  create() {
    if (this.failedAssets.length > 0) return

    addWorldVisuals(this)

    for (const animation of malinAnimations) {
      if (!this.anims.exists(animation.key)) {
        this.anims.create({
          ...animation,
          frames: animation.frames.map((frame) => ({ key: malinAsset.key, frame })),
        })
      }
    }

    // Batas jalan kiri/kanan dunia; bagian bawah dibiarkan lebih dalam dari air agar Malin bisa jatuh.
    this.physics.world.setBounds(WORLD.walkLeft, 0, WORLD.walkRight - WORLD.walkLeft, WORLD.height + 200)
    // Collision terpisah dari gambar: lantai dan platform diukur dari background (worldLayout.json).
    const floor = addWorldColliders(this)
    this.player = this.physics.add.sprite(PLAYER_START_X, GROUND_Y - 10, malinAsset.key, 0)
      .setOrigin(0.5, 1)
      .setScale(PLAYER_SCALE)
      .setDepth(WORLD_DEPTH.player)
      .setCollideWorldBounds(true)
    this.player.body.setSize(100, 252, false).setOffset(90, 12)
    this.physics.add.collider(this.player, floor)
    this.player.play('malin-idle')
    this.controls = new PlayerControls(this)
    // Warga kampung (ambient, tanpa physics): dimuat terpisah dan tidak memblokir gameplay.
    spawnLevelOneNpcs(this)
    // Kamera memenuhi layar tanpa stretch (framing yang sama dengan akhir intro).
    attachLevelCamera(this, this.player)
    this.events.once('shutdown', () => {
      this.controls.destroy()
      this.player = null
    })
    EventBus.emit('game-ready')
  }

  update() {
    if (!this.player) return
    if (this.player.y > FALL_RESET_Y) {
      const point = respawnPoint(this.player.x)
      // body.reset juga mengatur posisi "sebelumnya"; tanpa itu platform satu arah mengira Malin
      // datang dari bawah dan Malin jatuh menembus lantai.
      this.player.body.reset(point.x, point.y - 10)
    }
    const { direction, jumpPressed } = this.controls.read()
    const grounded = this.player.body.blocked.down || this.player.body.touching.down
    this.player.setVelocityX(direction * MOVE_SPEED)
    if (direction !== 0) this.player.setFlipX(direction < 0)

    if (jumpPressed && grounded) {
      this.player.setVelocityY(-JUMP_SPEED)
      this.player.play('malin-jump', true)
    } else if (grounded) {
      this.player.play(direction === 0 ? 'malin-idle' : 'malin-walk', true)
    }
  }
}
