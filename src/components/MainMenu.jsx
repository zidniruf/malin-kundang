import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { OPENING_IMAGES, OPENING_MUSIC, OPENING_TIMING } from './openingAssets'
import OpeningCinematic from './OpeningCinematic'
import { measureStart, preloadCinematic } from './cinematicMotion'
import { useAudioSettings, useMenuMusic } from './useMenuMusic'
import { tryLockLandscape } from './useDeviceProfile'
import './MainMenu.css'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const INTRO_PHASES = ['loading', 'sky', 'reveal']

// Intro hanya diputar sekali per sesi; kembali dari game langsung ke menu.
let introPlayed = false

function subscribeReducedMotion(callback) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY)
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  )
}

function preloadImages(urls) {
  return Promise.all(urls.map((url) => new Promise((resolve) => {
    const image = new Image()
    image.onload = () => resolve({ url, ok: true })
    image.onerror = () => resolve({ url, ok: false })
    image.src = url
  })))
}

const ICONS = {
  play: <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />,
  settings: (
    <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" />
    </g>
  ),
  about: (
    <g fill="currentColor">
      <circle cx="12" cy="7" r="1.8" />
      <rect x="10.4" y="10.2" width="3.2" height="8.6" rx="1.6" />
    </g>
  ),
  exit: (
    <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 4H6.5A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20H10" />
      <path d="M14 8l4 4-4 4M18 12H9.5" />
    </g>
  ),
}

function MenuButton({ icon, index, primary = false, onClick, children, autoFocus = false }) {
  return (
    <li className="mm-nav-item" style={{ '--i': index }}>
      <button
        type="button"
        className={`mm-btn${primary ? ' mm-btn--primary' : ''}`}
        onClick={onClick}
        autoFocus={autoFocus}
      >
        <span className="mm-btn-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">{ICONS[icon]}</svg>
        </span>
        <span className="mm-btn-label">{children}</span>
      </button>
    </li>
  )
}

function TitleText() {
  return (
    <span className="mm-title-text">
      <span className="mm-title-main">MALIN KUNDANG</span>
      <span className="mm-title-sub">THE MORAL ADVENTURE</span>
    </span>
  )
}

function SettingsPanel({ settings, onChange }) {
  const musicAvailable = Boolean(OPENING_MUSIC)
  return (
    <>
      <div className="mm-setting">
        <div>
          <p className="mm-setting-label" id="mm-music-label">Musik latar</p>
          <p className="mm-setting-hint">
            {musicAvailable
              ? 'Musik hanya diputar setelah kamu menyalakannya.'
              : 'Musik instrumental tradisional Minangkabau akan ditambahkan nanti.'}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={musicAvailable && settings.musicOn}
          aria-labelledby="mm-music-label"
          className="mm-switch"
          disabled={!musicAvailable}
          onClick={() => onChange((current) => ({ ...current, musicOn: !current.musicOn }))}
        >
          <span className="mm-switch-thumb" />
          <span className="mm-switch-text">{musicAvailable && settings.musicOn ? 'Nyala' : 'Mati'}</span>
        </button>
      </div>
      <label className="mm-setting mm-setting--column">
        <span className="mm-setting-label">Volume musik: {Math.round(settings.volume * 100)}%</span>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={Math.round(settings.volume * 100)}
          disabled={!musicAvailable}
          onChange={(event) => onChange((current) => ({ ...current, volume: Number(event.target.value) / 100 }))}
          className="mm-range"
        />
      </label>
    </>
  )
}

function AboutPanel() {
  return (
    <>
      <p>
        Game edukasi petualangan yang mengadaptasi cerita rakyat Malin Kundang dari Sumatera Barat.
        Ikuti perjalanan Malin dari kampung nelayan, merantau melintasi laut, hingga kembali ke kampung halaman.
      </p>
      <h3>Nilai yang dipelajari</h3>
      <p>Menghormati orang tua, tanggung jawab, rendah hati, dan rasa syukur.</p>
      <h3>Kontrol</h3>
      <ul className="mm-controls">
        <li><kbd>A</kbd>/<kbd>D</kbd> atau <kbd>←</kbd>/<kbd>→</kbd> untuk bergerak</li>
        <li><kbd>Space</kbd> atau <kbd>↑</kbd> untuk melompat</li>
        <li>Di layar sentuh, gunakan tombol di bawah area permainan</li>
      </ul>
      <p className="mm-fineprint">© 2026 Malin Kundang: The Moral Adventure · Proyek mata kuliah Game Programming</p>
    </>
  )
}

function ExitPanel({ onCancel }) {
  const [blocked, setBlocked] = useState(false)
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  function tryClose() {
    window.close()
    // Browser hanya mengizinkan close() pada tab yang dibuka oleh skrip.
    timer.current = window.setTimeout(() => setBlocked(true), 300)
  }

  return (
    <>
      <p>Terima kasih sudah bermain! Yakin ingin keluar dari game?</p>
      {blocked && (
        <p className="mm-notice" role="status">
          Browser tidak mengizinkan game menutup tab ini secara otomatis. Silakan tutup tab browser secara manual.
        </p>
      )}
      <div className="mm-dialog-actions">
        <button type="button" className="mm-btn mm-btn--small" onClick={onCancel}>Batal</button>
        <button type="button" className="mm-btn mm-btn--small mm-btn--primary" onClick={tryClose}>Ya, keluar</button>
      </div>
    </>
  )
}

const PANELS = {
  settings: 'Pengaturan',
  about: 'Tentang Game',
  exit: 'Keluar',
}

export default function MainMenu({ onStart }) {
  const reducedMotion = usePrefersReducedMotion()
  const [phase, setPhase] = useState(() => (introPlayed ? 'menu' : 'loading'))
  const [failedImages, setFailedImages] = useState([])
  const [activePanel, setActivePanel] = useState(null)
  const [audioSettings, setAudioSettings] = useAudioSettings()
  const rootRef = useRef(null)
  const shipRef = useRef(null)
  const startStateRef = useRef(null)
  const dialogRef = useRef(null)
  const titleSlotRef = useRef(null)
  const titleRef = useRef(null)
  const inIntro = INTRO_PHASES.includes(phase)
  const inStory = phase === 'story'

  // Mulai Petualangan: menu memudar dan cinematic berlanjut dari scene yang sama.
  const startStory = useCallback(() => {
    if (phase !== 'menu') return
    // Klik ini satu-satunya interaksi sebelum gameplay (intro masuk Chapter 1 otomatis), jadi
    // percobaan layar penuh + kunci landscape di HP dilakukan di sini. Kegagalan diabaikan.
    tryLockLandscape()
    // Ukur kapal & Malin sebelum animasi menu berhenti agar cinematic melanjutkan dari sini.
    startStateRef.current = measureStart(shipRef.current, rootRef.current?.querySelector('.mm-malin'))
    setActivePanel(null)
    setPhase('story')
  }, [phase])

  useMenuMusic(OPENING_MUSIC, audioSettings)

  // Muat semua gambar dulu agar layer tidak muncul satu per satu saat intro.
  useEffect(() => {
    let cancelled = false
    const begin = () => {
      const skipIntro = window.matchMedia(REDUCED_MOTION_QUERY).matches
      setPhase((current) => (current === 'loading' ? (skipIntro ? 'menu' : 'sky') : current))
    }
    const timeout = window.setTimeout(() => {
      if (!cancelled) begin()
    }, OPENING_TIMING.preloadTimeoutMs)

    preloadImages(Object.values(OPENING_IMAGES).filter(Boolean)).then((results) => {
      if (cancelled) return
      window.clearTimeout(timeout)
      const failed = results.filter((result) => !result.ok).map((result) => result.url)
      if (failed.length) console.warn('Gambar opening gagal dimuat:', failed)
      setFailedImages(failed)
      begin()
    })

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [])

  // Urutan scene: langit → kamera turun → menu.
  useEffect(() => {
    if (phase === 'menu' || phase === 'story') {
      introPlayed = true
      return undefined
    }
    const next = { sky: 'reveal', reveal: 'menu' }[phase]
    if (!next) return undefined
    const delay = phase === 'sky' ? OPENING_TIMING.skyMs : OPENING_TIMING.revealMs
    const timer = window.setTimeout(() => setPhase(next), delay)
    return () => window.clearTimeout(timer)
  }, [phase])

  const skipIntro = useCallback(() => {
    setPhase((current) => (current === 'sky' || current === 'reveal' ? 'menu' : current))
  }, [])

  useEffect(() => {
    if (phase !== 'sky' && phase !== 'reveal') return undefined
    window.addEventListener('keydown', skipIntro)
    return () => window.removeEventListener('keydown', skipIntro)
  }, [phase, skipIntro])

  // Judul berada di slot menu (kiri). Saat intro, judul digeser ke tengah dan diperbesar
  // dengan transform agar transisi ke posisi menu halus pada semua ukuran layar.
  useLayoutEffect(() => {
    const slot = titleSlotRef.current
    const title = titleRef.current
    if (!slot || !title) return undefined

    const measure = () => {
      const rect = slot.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const targetWidth = Math.min(viewportWidth * 0.8, viewportHeight * 0.95 * (rect.width / rect.height), 920)
      const scale = Math.max(1, targetWidth / rect.width)
      const dx = viewportWidth / 2 - (rect.left + rect.width / 2)
      const dy = viewportHeight * 0.46 - (rect.top + rect.height / 2)
      title.style.setProperty('--title-dx', `${dx}px`)
      title.style.setProperty('--title-dy', `${dy}px`)
      title.style.setProperty('--title-scale', String(scale))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(slot)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  // Muat gambar cinematic di latar belakang setelah menu tampil, agar siap saat tombol ditekan.
  useEffect(() => {
    if (phase !== 'menu') return undefined
    const idle = window.setTimeout(() => preloadCinematic(), 800)
    return () => window.clearTimeout(idle)
  }, [phase])

  // Panel memakai <dialog> bawaan: fokus terkunci di panel dan Escape menutupnya.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (activePanel && !dialog.open) dialog.showModal()
    if (!activePanel && dialog.open) dialog.close()
  }, [activePanel])

  const imageOk = (key) => OPENING_IMAGES[key] && !failedImages.includes(OPENING_IMAGES[key])
  const showTitleArt = imageOk('titleArt')

  return (
    <main
      ref={rootRef}
      className="mm"
      data-phase={phase}
      data-reduced-motion={reducedMotion || undefined}
      style={{ '--reveal-ms': `${OPENING_TIMING.revealMs}ms` }}
      onPointerDown={inIntro ? skipIntro : undefined}
    >
      {/* Kamera cinematic: tanpa transform saat menu, sehingga tampilan menu tidak berubah. */}
      <div className="mm-camera">
      {/* Dunia opening: semua layer berbagi stage 16:9 yang menutupi viewport (cover). */}
      <div className="mm-stage" aria-hidden="true">
        <div className="mm-layer mm-sky">
          {imageOk('sky') && <img src={OPENING_IMAGES.sky} alt="" draggable="false" />}
        </div>
        <div className="mm-layer mm-clouds">
          {imageOk('clouds') && <img src={OPENING_IMAGES.clouds} alt="" draggable="false" />}
        </div>
        <div className="mm-layer mm-beach">
          {imageOk('beach') && <img src={OPENING_IMAGES.beach} alt="" draggable="false" />}
          <div className="mm-sea-shimmer" />
          <div className="mm-sea-shimmer mm-sea-shimmer--slow" />
          {imageOk('ship') && (
            <div className="mm-ship-track">
              <img ref={shipRef} className="mm-ship" src={OPENING_IMAGES.ship} alt="" draggable="false" />
            </div>
          )}
        </div>
        <div className="mm-layer mm-underwater">
          {imageOk('underwater') && <img src={OPENING_IMAGES.underwater} alt="" draggable="false" />}
        </div>
      </div>

      <div className="mm-scrim" aria-hidden="true" />

      {/* Rig Malin: lapisan kamera → jalan → gambar. Elemen yang sama dipakai menu dan cinematic. */}
      {(phase === 'menu' || inStory) && imageOk('malin') && (
        <div className="mm-malin-rig">
          <div className="mm-malin-walk">
            <img className="mm-malin" src={OPENING_IMAGES.malin} alt="Malin muda berdiri di pantai membawa buntelan" draggable="false" />
          </div>
        </div>
      )}
      </div>

      <div className="mm-ui">
        <div className="mm-column">
          <div className="mm-title-slot" ref={titleSlotRef}>
            <h1 className="mm-title" ref={titleRef}>
              <span className="mm-title-inner">
                {showTitleArt
                  ? <img src={OPENING_IMAGES.titleArt} alt="Malin Kundang: The Moral Adventure" draggable="false" />
                  : <TitleText />}
              </span>
            </h1>
          </div>

          <div className="mm-menu" inert={inIntro || inStory || undefined} aria-hidden={inIntro || inStory || undefined}>
            <p className="mm-tagline">
              Sebuah perjalanan tentang keluarga, perjuangan, dan pentingnya menghormati orang tua.
            </p>
            <nav aria-label="Menu utama">
              <ul className="mm-nav">
                <MenuButton icon="play" index={0} primary onClick={startStory} autoFocus={phase === 'menu'}>Mulai Petualangan</MenuButton>
                <MenuButton icon="settings" index={1} onClick={() => setActivePanel('settings')}>Pengaturan</MenuButton>
                <MenuButton icon="about" index={2} onClick={() => setActivePanel('about')}>Tentang Game</MenuButton>
                <MenuButton icon="exit" index={3} onClick={() => setActivePanel('exit')}>Keluar</MenuButton>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {phase === 'loading' && <p className="mm-loading" role="status">Memuat kampung pesisir…</p>}

      {(phase === 'sky' || phase === 'reveal') && (
        <button type="button" className="mm-skip" onClick={skipIntro}>
          Lewati intro <span aria-hidden="true">›</span>
        </button>
      )}

      {inStory && (
        <OpeningCinematic sceneRef={rootRef} startState={startStateRef} onPlay={onStart} />
      )}

      {phase === 'menu' && failedImages.length > 0 && (
        <p className="mm-error" role="alert">
          Sebagian gambar opening gagal dimuat. Periksa koneksi lalu muat ulang halaman.
        </p>
      )}

      <dialog
        ref={dialogRef}
        className="mm-dialog"
        aria-labelledby="mm-dialog-title"
        onClose={() => setActivePanel(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setActivePanel(null)
        }}
      >
        {activePanel && (
          <div className="mm-dialog-body">
            <h2 id="mm-dialog-title">{PANELS[activePanel]}</h2>
            {activePanel === 'settings' && <SettingsPanel settings={audioSettings} onChange={setAudioSettings} />}
            {activePanel === 'about' && <AboutPanel />}
            {activePanel === 'exit' && <ExitPanel onCancel={() => setActivePanel(null)} />}
            {activePanel !== 'exit' && (
              <div className="mm-dialog-actions">
                <button type="button" className="mm-btn mm-btn--small mm-btn--primary" onClick={() => setActivePanel(null)}>
                  Kembali
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </main>
  )
}
