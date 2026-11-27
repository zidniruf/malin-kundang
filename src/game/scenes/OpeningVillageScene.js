import Phaser from 'phaser'
import { malinAnimations } from '../malinAssets'
import { registerCharacterAnimations } from '../npcAssets'
import AmbientNpc from '../npc/AmbientNpc'
import { FLOOR_Y as NPC_FLOOR_Y } from '../npc/levelOneNpcs'
import { LEVEL_VIEW, levelView } from '../levelFraming'
import { WORLD_DEPTH, addWorldVisuals, preloadWorld } from '../chapter1/world'

// Babak kampung pada opening cinematic, di DUNIA YANG SAMA dengan Chapter 1: world map Area 1
// (Rumah Malin, chapter1/world.js), lantai y=600, Malin berakhir di posisi awal gameplay dan
// Ibu di posisi NPC-nya. Scene ini memakai Phaser instance sendiri (VillageStage.jsx) dengan
// Scale.EXPAND yang sama seperti PhaserGame.
//   - Kamera mulai dengan framing sinematik (zoom lebih dekat), lalu di akhir berbaur ke framing
//     gameplay (levelView) sehingga frame terakhir identik dengan frame pertama gameplay.
//   - Malin (sheet tanpa buntalan) dan Ibu (sprite sheet) bergerak dengan tween linear sambil
//     memainkan animasi jalan; idle saat berhenti; animasi bicara saat dialognya.
//   - Warga Chapter 1 sudah berdiri di posisinya (diam) tetapi di luar bingkai zoom; mereka
//     terlihat saat kamera mundur, dan gameplay membuat warga di posisi yang sama tanpa fade.
export default class OpeningVillageScene extends Phaser.Scene {
  constructor() {
    super('OpeningVillageScene')
  }

  init(data) {
    this.cfg = data.config
    this.onCue = data.onCue ?? (() => {})
    this.onReady = data.onReady ?? (() => {})
    this.reduced = Boolean(data.reduced)
    this.failed = new Set()
  }

  preload() {
    const { cfg } = this
    this.load.on('loaderror', (file) => {
      this.failed.add(file.key)
      console.error(`Aset cinematic gagal dimuat: ${file.key} (${file.url})`)
    })
    preloadWorld(this, cfg.worldRange)
    const villagerSheets = [...new Set(cfg.villagers.map((npc) => npc.asset))]
    for (const sheet of [cfg.malin, cfg.mother, ...villagerSheets]) {
      this.load.spritesheet(sheet.key, sheet.url, { frameWidth: sheet.frameWidth, frameHeight: sheet.frameHeight })
    }
  }

  create() {
    if (this.failed.has(this.cfg.mother.key)) {
      // Fallback: gambar Ibu statis yang sudah ada, lalu bangun adegan setelah termuat.
      this.load.image(this.cfg.mother.fallback.key, this.cfg.mother.fallback.url)
      this.load.once('complete', () => this.build())
      this.load.start()
      return
    }
    this.build()
  }

  build() {
    const { cfg, reduced } = this
    for (const animation of malinAnimations) {
      if (!this.anims.exists(animation.key)) {
        this.anims.create({ ...animation, frames: animation.frames.map((frame) => ({ key: cfg.malin.key, frame })) })
      }
    }

    addWorldVisuals(this, cfg.worldRange)
    this.cameras.main.setBounds(0, LEVEL_VIEW.viewTop, LEVEL_VIEW.worldWidth, LEVEL_VIEW.viewBottom - LEVEL_VIEW.viewTop)

    // Kamera sinematik: x = pusat horizontal (dunia), feet = posisi lantai di layar (0..1),
    // m = zoom × zoom gameplay, g = 0..1 campuran menuju framing gameplay yang dihitung langsung
    // dari ukuran layar saat ini (jadi tetap benar walau layar diputar/di-resize).
    const first = cfg.camera[0]
    this.shot = reduced ? { x: first.x, feet: first.feet, m: 1, g: 1 } : { x: first.x, feet: first.feet, m: first.m, g: 0 }

    const malinX = reduced ? cfg.malin.endX : cfg.malin.startX
    this.malin = this.add.sprite(malinX, LEVEL_VIEW.floorY, cfg.malin.key, 0)
      .setOrigin(0.5, cfg.malin.feetY / cfg.malin.frameHeight)
      .setScale(cfg.malin.scale)
      .setDepth(WORLD_DEPTH.player)
      .setFlipX(!reduced)
      .play('malin-idle')
    this.mother = this.createMother()
    this.villagers = this.createVillagers()

    if (!reduced) this.scheduleCamera()
    this.scheduleActors()
    this.scheduleCues()

    this.game.events.once('postrender', () => this.onReady())
  }

  createMother() {
    const { mother } = this.cfg
    const x = this.reduced ? mother.endX : mother.startX
    if (this.textures.exists(mother.key) && !this.failed.has(mother.key)) {
      registerCharacterAnimations(this, mother)
      const y = this.reduced ? LEVEL_VIEW.floorY : (mother.startY ?? LEVEL_VIEW.floorY)
      const sprite = this.add.sprite(x, y, mother.key, 0)
        .setOrigin(0.5, mother.feetY / mother.frameHeight)
        .setScale(mother.height / mother.figureHeight)
        .setDepth(0.5)
        .setAlpha(this.reduced ? 0 : 1)
        .play(mother.anims.idle.key)
      return { sprite, animated: true }
    }
    const sprite = this.add.image(mother.endX, LEVEL_VIEW.floorY, mother.fallback.key).setOrigin(0.5, 1).setDepth(0.5).setAlpha(0)
    sprite.setScale(mother.height / sprite.height)
    return { sprite, animated: false }
  }

  // Warga hanya diam (tanpa berjalan/aksi) agar posisinya tepat sama saat gameplay mengambil alih.
  createVillagers() {
    const villagers = []
    for (const npc of this.cfg.villagers) {
      if (this.failed.has(npc.asset.key) || !this.textures.exists(npc.asset.key)) continue
      villagers.push(new AmbientNpc(this, { ...npc, y: NPC_FLOOR_Y, seed: npc.id, walkChance: 0, actionChance: 0 }))
    }
    this.events.once('shutdown', () => villagers.splice(0).forEach((npc) => npc.destroy()))
    return villagers
  }

  // ---------- jadwal (semua memakai jam scene, ikut timeScale saat dipercepat) ----------

  // Semua aksi dimulai oleh jam scene (time.delayedCall); tween hanya mengatur durasi gerak.
  // Tween Phaser memakai jam dinding sedangkan timer memakai delta game loop, jadi `delay`
  // pada tween tidak dipakai agar urutan adegan tetap sinkron dengan narasi di perangkat lambat.
  at(seconds, callback) {
    this.time.delayedCall(seconds * 1000, callback)
  }

  scheduleCamera() {
    const keys = this.cfg.camera
    for (let i = 1; i < keys.length; i += 1) {
      const key = keys[i]
      const previous = keys[i - 1]
      const target = key.gameplay ? { g: 1 } : { x: key.x, feet: key.feet, m: key.m }
      this.at(previous.t, () => this.tweens.add({
        targets: this.shot,
        ...target,
        duration: (key.t - previous.t) * 1000,
        ease: 'Sine.easeInOut',
      }))
    }
  }

  scheduleActors() {
    for (const step of this.cfg.malinScript) this.at(step.t, () => this.runMalinStep(step))
    for (const step of this.cfg.motherScript) this.at(step.t, () => this.runMotherStep(step))
  }

  runMalinStep(step) {
    const { malin } = this
    if (step.face) malin.setFlipX(step.face < 0)
    if (step.action === 'walk' && !this.reduced) {
      malin.play({ key: 'malin-walk', frameRate: this.cfg.malin.walkFps }, true)
      this.tweens.add({
        targets: malin,
        x: step.to,
        duration: step.duration * 1000,
        ease: 'Linear', // kecepatan tetap agar langkah kaki tidak tergelincir
        onComplete: () => malin.play('malin-idle'),
      })
    } else if (step.action === 'talk') {
      malin.play('malin-talk', true)
    } else if (step.action === 'idle') {
      malin.play('malin-idle', true)
    }
  }

  runMotherStep(step) {
    const { sprite, animated } = this.mother
    const { anims } = this.cfg.mother
    if (step.face) sprite.setFlipX(step.face < 0)
    if (step.action === 'walk') {
      if (this.reduced || !animated) {
        // Reduced motion / fallback statis: muncul dengan fade di posisi akhir (tanpa digeser).
        sprite.setPosition(step.to, LEVEL_VIEW.floorY)
        this.tweens.add({ targets: sprite, alpha: 1, duration: 900 })
        return
      }
      sprite.play(anims.walk.key, true)
      this.tweens.add({
        targets: sprite,
        x: step.to,
        y: LEVEL_VIEW.floorY, // dari jalan setapak rumah (sedikit lebih tinggi) turun ke dermaga
        duration: step.duration * 1000,
        ease: 'Linear',
        onComplete: () => sprite.play(anims.idle.key),
      })
    } else if (animated && step.action === 'talk') {
      sprite.play(anims.talk.key, true)
    } else if (animated && step.action === 'idle') {
      sprite.play(anims.idle.key, true)
    }
  }

  scheduleCues() {
    for (const cue of this.cfg.cues) {
      this.at(cue.t, () => {
        this.setTimeScale(1)
        this.onCue(cue.id)
      })
    }
  }

  // Tombol Lanjut: percepat semua tween, timer, dan animasi sampai cue berikutnya.
  fastForward() {
    this.setTimeScale(this.cfg.fastForward)
  }

  setTimeScale(scale) {
    this.time.timeScale = scale
    this.tweens.timeScale = scale
    this.anims.globalTimeScale = scale
  }

  update() {
    if (!this.shot) return
    const { width, height } = this.scale
    const view = levelView(width, height, this.malin.x)
    const { x, feet, m, g } = this.shot
    const zoom = view.zoom * m
    // Layar pendek (HP landscape): kotak dialog relatif lebih tinggi, jadi karakter dinaikkan.
    const compact = this.scale.parentSize.height <= 520 ? this.cfg.compactFeetShift : 0
    const shotY = LEVEL_VIEW.floorY - (feet + compact - 0.5) * (height / zoom)
    const camera = this.cameras.main
    camera.setZoom(Phaser.Math.Linear(zoom, view.zoom, g))
    camera.centerOn(Phaser.Math.Linear(x, view.centerX, g), Phaser.Math.Linear(shotY, view.centerY, g))
  }
}
