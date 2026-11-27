import Phaser from 'phaser'
import { BURUH_CRATE, registerCharacterAnimations } from '../npcAssets'

// NPC ambient: sprite animasi yang berganti aksi secara acak di area patrolinya.
//   - Aksi baru dipilih hanya saat aksi sebelumnya selesai (bukan acak setiap frame).
//   - Pola: diam → (berjalan | aksi khusus) → diam → ... ; berjalan selalu sampai tujuan.
//   - Posisi dijepit ke [minX, maxX], jadi NPC tidak keluar dermaga atau jatuh ke air.
//   - Tanpa body physics: NPC tidak menghalangi Malin dan tidak mengubah collision.
//   - Semua timer/tween milik scene dan dibersihkan di destroy() (dipanggil saat shutdown).
//     Saat scene dijeda (mis. HP portrait) timer dan tween ikut berhenti.
const DEFAULTS = {
  idle: [2, 5], // detik
  walkChance: 0.5,
  actionChance: 0.25,
  walkDistance: [40, 140], // px dunia
  speed: 55, // px/detik
  actionHold: [0, 0], // detik tambahan setelah animasi aksi selesai
}

export default class AmbientNpc {
  constructor(scene, options) {
    this.scene = scene
    this.opts = { ...DEFAULTS, ...options }
    const { asset, x, y, height, depth = 0.5, face = 1, seed } = this.opts
    this.rng = new Phaser.Math.RandomDataGenerator([String(seed ?? asset.key)])
    registerCharacterAnimations(scene, asset)

    this.sprite = scene.add.sprite(x, y, asset.key, 0)
      .setOrigin(0.5, asset.feetY / asset.frameHeight)
      .setScale(height / asset.figureHeight)
      .setDepth(depth)
      .setFlipX(face < 0)
    this.timer = null
    this.tween = null
    this.destroyed = false

    if (this.opts.crate) this.createCrate()
    this.idle(this.rng.realInRange(0.5, 2)) // awal acak agar NPC tidak bergerak serempak
  }

  // Peti buruh: properti di tanah pada titik kerja, disembunyikan saat peti ada di tangan.
  createCrate() {
    const { asset, crate } = this.opts
    const texture = this.scene.textures.get(asset.key)
    if (!texture.has(BURUH_CRATE.frame)) {
      texture.add(BURUH_CRATE.frame, 0, BURUH_CRATE.x, BURUH_CRATE.y, BURUH_CRATE.width, BURUH_CRATE.height)
    }
    const scale = this.sprite.scaleX
    this.crateSpot = crate.spotX
    this.crate = this.scene.add.image(crate.spotX + BURUH_CRATE.offsetX * scale, this.opts.y, asset.key, BURUH_CRATE.frame)
      .setOrigin(0, 1)
      .setScale(scale)
      .setDepth(this.sprite.depth - 0.01)
    // Frame 8 sudah menggambar peti di tanah; frame 9–11 peti di tangan.
    this.sprite.on('animationupdate', (_anim, frame) => this.syncCrate(frame))
    this.sprite.on('animationstart', (_anim, frame) => this.syncCrate(frame))
  }

  syncCrate(frame) {
    if (!this.crate) return
    const index = Number(frame.textureFrame)
    this.crate.setVisible(!(index >= 8 && index <= 11))
  }

  later(seconds, callback) {
    this.timer?.remove(false)
    this.timer = this.scene.time.delayedCall(seconds * 1000, () => {
      if (!this.destroyed) callback()
    })
  }

  idle(seconds = this.rng.realInRange(...this.opts.idle)) {
    this.sprite.play(this.opts.asset.anims.idle.key, true)
    this.syncCrate({ textureFrame: 0 })
    this.later(seconds, () => this.decide())
  }

  decide() {
    const roll = this.rng.frac()
    if (roll < this.opts.actionChance) this.action()
    else if (roll < this.opts.actionChance + this.opts.walkChance) this.walk()
    else this.idle()
  }

  walk(targetX) {
    const { minX, maxX, walkDistance } = this.opts
    let target = targetX
    if (target === undefined) {
      const distance = this.rng.realInRange(...walkDistance)
      const direction = this.sprite.x - distance < minX ? 1 : this.sprite.x + distance > maxX ? -1 : this.rng.sign()
      target = this.sprite.x + direction * distance
    }
    target = Phaser.Math.Clamp(target, minX, maxX)
    const distance = Math.abs(target - this.sprite.x)
    if (distance < 4) {
      this.idle()
      return
    }
    this.sprite.setFlipX(target < this.sprite.x)
    this.sprite.play(this.opts.asset.anims.walk.key, true)
    this.syncCrate({ textureFrame: 4 })
    this.tween = this.scene.tweens.add({
      targets: this.sprite,
      x: target,
      duration: (distance / this.opts.speed) * 1000,
      ease: 'Linear', // kecepatan tetap agar langkah tidak tergelincir
      onComplete: () => {
        this.tween = null
        if (!this.destroyed) (this.afterWalk ? this.consumeAfterWalk() : this.idle())
      },
    })
  }

  consumeAfterWalk() {
    const next = this.afterWalk
    this.afterWalk = null
    next()
  }

  action() {
    // Buruh mengangkat peti hanya di titik kerjanya: berjalan dulu ke peti bila jauh.
    if (this.crate && Math.abs(this.sprite.x - this.crateSpot) > 2) {
      this.afterWalk = () => this.action()
      this.walk(this.crateSpot)
      return
    }
    if (this.crate) this.sprite.setFlipX(false) // peti selalu di sisi kanan kaki
    const { anims } = this.opts.asset
    const hold = this.rng.realInRange(...this.opts.actionHold)
    this.sprite.play(anims.action.key)
    this.sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      if (this.destroyed) return
      this.later(hold, () => {
        if (!this.crate) {
          this.idle()
          return
        }
        // Letakkan kembali peti (animasi angkat dibalik), lalu diam di samping peti.
        this.sprite.playReverse(anims.action.key)
        this.sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
          if (!this.destroyed) this.later(0.6, () => this.idle())
        })
      })
    })
  }

  destroy() {
    this.destroyed = true
    this.timer?.remove(false)
    this.tween?.remove()
    this.sprite.removeAllListeners()
    this.sprite.destroy()
    this.crate?.destroy()
  }
}
