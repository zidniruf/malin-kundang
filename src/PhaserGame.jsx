import { useCallback, useEffect, useRef, useState } from 'react'
import Phaser from 'phaser'
import { EventBus } from './game/EventBus'
import { CHAPTER_ONE } from './components/cinematicConfig'
import LevelOneScene, { LEVEL_SIZE } from './game/scenes/LevelOneScene'
import OrientationGuard from './components/OrientationGuard'
import TouchControls from './components/TouchControls'
import { useDeviceProfile } from './components/useDeviceProfile'
import './components/ChapterOne.css'

// Layar gameplay Chapter 1 (mobile first, landscape).
//   - Phaser dengan ukuran dasar 1280×720 dan Scale.EXPAND: kanvas memenuhi seluruh layar tanpa
//     stretch dan tanpa area blur; LevelOneScene memilih potongan dunia (src/game/levelFraming.js).
//   - Intro menyerahkan layar ke sini tanpa potongan: komponen ini dipasang di bawah cinematic,
//     lalu `onReady` dipanggil setelah frame pertama dilukis sehingga cinematic bisa dilepas.
//   - HUD HTML di atas canvas: label level, label chapter singkat, petunjuk kontrol, tombol menu,
//     tombol sentuh.
//   - HP/tablet portrait: scene dijeda dan overlay "Putar Perangkat Anda" tampil; saat kembali
//     landscape scene dilanjutkan tanpa memuat ulang atau mengatur ulang posisi Malin.
const SCENE_KEY = 'LevelOneScene'
const HINT_FADE_MS = 400
const MOVE_KEYS = new Set(['KeyA', 'KeyD', 'ArrowLeft', 'ArrowRight', 'Space', 'ArrowUp'])
const CHAPTER_TOAST_MS = 3200

// entrance: 'seamless' (dari akhir intro, frame sama) | 'fade' (setelah Lewati / dari gelap)
export default function PhaserGame({ onExit, onReady, entrance = 'fade' }) {
  const container = useRef(null)
  const gameRef = useRef(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [hint, setHint] = useState('shown') // shown | leaving | gone (tidak muncul lagi)
  const [toast, setToast] = useState(true) // label chapter singkat, hilang otomatis
  const onReadyRef = useRef(onReady)
  useEffect(() => {
    onReadyRef.current = onReady
  }, [onReady])
  const { touch, portrait } = useDeviceProfile()
  const blocked = touch && portrait

  useEffect(() => {
    const host = container.current
    let game
    let disposed = false
    // Serah terima dari intro setelah scene siap DAN warga (termasuk Ibu) sudah ada, lalu satu
    // frame dilukis. Batas waktu cadangan agar NPC yang lambat/gagal tidak menahan gameplay.
    const ready = { scene: false, npcs: false, sent: false }
    let npcTimeout = 0
    const notifyReady = () => {
      if (disposed || ready.sent || !ready.scene || !ready.npcs) return
      ready.sent = true
      game?.events.once('postrender', () => {
        if (!disposed) onReadyRef.current?.()
      })
    }
    const onSceneReady = () => {
      if (disposed) return
      setStatus('ready')
      host.focus({ preventScroll: true })
      ready.scene = true
      npcTimeout = window.setTimeout(() => {
        ready.npcs = true
        notifyReady()
      }, 2500)
      notifyReady()
    }
    const onNpcsReady = () => {
      ready.npcs = true
      notifyReady()
    }
    EventBus.on('npcs-ready', onNpcsReady)
    const onError = (message) => {
      if (!disposed) {
        setError(message)
        setStatus('error')
      }
    }
    EventBus.on('game-ready', onSceneReady)
    EventBus.on('game-error', onError)

    // Strict Mode cancels its first effect before a Phaser instance is created.
    const start = window.setTimeout(() => {
      if (disposed) return
      try {
        game = new Phaser.Game({
          type: Phaser.AUTO,
          parent: host,
          width: LEVEL_SIZE.width,
          height: LEVEL_SIZE.height,
          backgroundColor: '#39b8e8',
          input: { keyboard: { target: host } },
          scale: { mode: Phaser.Scale.EXPAND, autoCenter: Phaser.Scale.CENTER_BOTH },
          physics: { default: 'arcade', arcade: { gravity: { y: 1050 }, debug: false } },
          scene: [LevelOneScene],
          audio: { noAudio: true },
        })
        gameRef.current = game
        // Hanya mode dev (npm run dev): akses instance untuk pengujian otomatis world map.
        if (import.meta.env.DEV) window.__MALIN_GAME__ = game
      } catch (cause) {
        onError(`Game gagal dimulai: ${cause.message}. Muat ulang halaman atau gunakan browser lain.`)
      }
    }, 0)

    return () => {
      disposed = true
      window.clearTimeout(start)
      EventBus.emit('release-controls')
      EventBus.off('game-ready', onSceneReady)
      EventBus.off('npcs-ready', onNpcsReady)
      window.clearTimeout(npcTimeout)
      EventBus.off('game-error', onError)
      gameRef.current = null
      if (import.meta.env.DEV && window.__MALIN_GAME__ === game) delete window.__MALIN_GAME__
      if (game) game.destroy(true)
    }
  }, [])

  // Portrait di perangkat sentuh: jeda scene (posisi, animasi, dan physics tersimpan apa adanya),
  // lepas semua tombol agar Malin tidak terus berjalan, lalu lanjutkan saat kembali landscape.
  useEffect(() => {
    const game = gameRef.current
    if (status !== 'ready' || !game) return
    EventBus.emit('release-controls')
    if (blocked) {
      game.scene.pause(SCENE_KEY)
    } else {
      game.scene.resume(SCENE_KEY)
      game.scale.refresh()
      container.current?.focus({ preventScroll: true })
    }
  }, [blocked, status])

  // Petunjuk hilang pada penggunaan pertama tombol gerak/lompat dan tidak muncul lagi.
  const dismissHint = useCallback(() => {
    setHint((current) => (current === 'shown' ? 'leaving' : current))
  }, [])

  useEffect(() => {
    if (status !== 'ready') return undefined
    const id = window.setTimeout(() => setToast(false), CHAPTER_TOAST_MS)
    return () => window.clearTimeout(id)
  }, [status])

  useEffect(() => {
    if (hint !== 'leaving') return undefined
    const id = window.setTimeout(() => setHint('gone'), HINT_FADE_MS)
    return () => window.clearTimeout(id)
  }, [hint])

  const hintText = touch
    ? 'Gunakan tombol arah untuk bergerak • Lompat untuk melompat'
    : 'A / D atau ← → untuk bergerak • Space / ↑ untuk melompat'

  return (
    <section
      id="kampung-nelayan"
      className={`ch-screen ch-screen--${entrance}${blocked ? ' is-blocked' : ''}`}
      aria-labelledby="game-title"
    >
      <div
        ref={container}
        tabIndex={0}
        role="region"
        aria-label="Area permainan Malin Kundang"
        aria-describedby="game-controls"
        className="ch-game"
        onPointerDown={() => container.current.focus({ preventScroll: true })}
        onKeyDown={(event) => {
          if (MOVE_KEYS.has(event.code)) dismissHint()
        }}
        onBlur={() => EventBus.emit('release-controls')}
      />
      {status !== 'ready' && (
        <div className="ch-status" role={error ? 'alert' : 'status'}>
          <p className="ch-status-card">{error || 'Memuat kampung dan karakter Malin…'}</p>
        </div>
      )}

      <div className={`ch-hud${status === 'ready' ? ' is-live' : ''}`} inert={blocked}>
        <header className="ch-top">
          <h2 id="game-title" className="ch-level">
            <span className="ch-level-kicker">Level 1</span>
            <span className="ch-level-sep" aria-hidden="true"> · </span>
            <span className="ch-level-name">Kampung Nelayan</span>
          </h2>
          <div className="ch-hint-slot">
            {status === 'ready' && hint !== 'gone' && (
              <p className={`ch-hint${hint === 'leaving' ? ' is-leaving' : ''}`}>{hintText}</p>
            )}
            {/* Setelah petunjuk kontrol hilang, slot yang sama menampilkan tujuan chapter. */}
            {status === 'ready' && hint === 'gone' && (
              <p className="ch-objective" role="status">
                <span className="ch-objective-label">Tujuan</span> {CHAPTER_ONE.objective}
              </p>
            )}
          </div>
          <button type="button" className="ch-back" onClick={onExit}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 11.2 12 4.5l8 6.7M6.5 9.5V19h11V9.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Kembali ke Menu</span>
          </button>
        </header>

        {status === 'ready' && (
          <div className={`ch-toast${toast ? '' : ' is-leaving'}`} role="status">
            <span className="ch-toast-kicker">{CHAPTER_ONE.kicker}</span>
            <span className="ch-toast-title">{CHAPTER_ONE.title}</span>
            <span className="ch-toast-objective">{CHAPTER_ONE.objective}</span>
          </div>
        )}

        {touch && status === 'ready' && <TouchControls onUse={dismissHint} />}
      </div>

      <p id="game-controls" className="sr-only">
        A/D atau panah kiri dan kanan untuk bergerak, Space atau panah atas untuk melompat.
        Di perangkat sentuh gunakan tombol arah di kiri bawah dan tombol Lompat di kanan bawah.
      </p>

      {touch && <OrientationGuard active={blocked} />}
    </section>
  )
}
