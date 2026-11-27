import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import {
  ASSET_HOLD_AT, DIALOGUE, NARRATION, SKIP_FADE_MS, TRANSITION_SHOTS,
  VILLAGE_AT, VILLAGE_FADE_MS, VILLAGE_SCENE,
} from './cinematicConfig'
import {
  computeMenuFrame, computeShotsFrame, easeInOutCubic, preloadCinematic, progress, writeMenuFrame,
} from './cinematicMotion'
import TransitionShots from './TransitionShots'
import VillageStage from './VillageStage'
import './OpeningCinematic.css'

// Cinematic yang berlanjut dari Main Menu (urutan lengkap ada di cinematicConfig.js).
//   Babak 1: jam React menggerakkan kamera scene menu (variabel CSS pada `sceneRef`), lalu shot
//            teluk dan dermaga (TransitionShots) beserta cue narasinya.
//   Babak 2: VillageStage (Phaser) memainkan adegan kampung dan mengirim cue narasi/dialog.
//   Akhir: elemen intro menghilang, kamera zoom out ke framing gameplay, lalu App memasang
//          PhaserGame di bawah cinematic dan melepas cinematic setelah frame pertama gameplay siap.

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const ORDER = ['leaving', 'bay', 'approach', 'village', 'ibu', 'malin', 'penutup', 'lepas', 'outro']
// Waktu baca narasi sebelum memudar sendiri: dasar + per kata (±2–3 detik per kalimat pendek).
const readSeconds = (words) => 1.4 + words * 0.3
const READY_TIMEOUT_MS = 10000

function subscribeReducedMotion(callback) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY)
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia(REDUCED_MOTION_QUERY).matches, () => false)
}

// Partikel deterministik, dibuat sekali saat modul dimuat.
function seeded(seed) {
  let value = seed
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}
const random = seeded(20261126)
const MOTES = Array.from({ length: 18 }, (_, key) => ({
  key,
  left: `${(random() * 100).toFixed(1)}%`,
  top: `${(10 + random() * 85).toFixed(1)}%`,
  size: `${(3 + random() * 6).toFixed(1)}px`,
  delay: `${(-random() * 14).toFixed(1)}s`,
  duration: `${(10 + random() * 10).toFixed(1)}s`,
  drift: `${(random() * 60 - 30).toFixed(0)}px`,
}))
const LEAVES = Array.from({ length: 6 }, (_, key) => ({
  key,
  top: `${(18 + random() * 55).toFixed(1)}%`,
  delay: `${(-random() * 16).toFixed(1)}s`,
  duration: `${(11 + random() * 7).toFixed(1)}s`,
  hue: Math.round(85 + random() * 45),
  scale: (0.7 + random() * 0.6).toFixed(2),
}))

function readAnchor(scene) {
  const style = window.getComputedStyle(scene)
  const x = Number.parseFloat(style.getPropertyValue('--mm-stage-x'))
  const y = Number.parseFloat(style.getPropertyValue('--mm-stage-y'))
  return { x: Number.isFinite(x) ? x / 100 : 0.5, y: Number.isFinite(y) ? y / 100 : 0.5 }
}

function Particles() {
  return (
    <div className="oc-particles" aria-hidden="true">
      {MOTES.map((mote) => (
        <span
          key={mote.key}
          className="oc-mote"
          style={{ left: mote.left, top: mote.top, '--size': mote.size, '--delay': mote.delay, '--dur': mote.duration, '--drift': mote.drift }}
        />
      ))}
      {LEAVES.map((leaf) => (
        <span
          key={`leaf-${leaf.key}`}
          className="oc-leaf"
          style={{ top: leaf.top, '--delay': leaf.delay, '--dur': leaf.duration, '--hue': leaf.hue, '--scale': leaf.scale }}
        />
      ))}
    </div>
  )
}

function Narration({ cue, onNext }) {
  const words = NARRATION[cue].split(' ')
  return (
    <div className="oc-narration" key={cue} style={{ '--hold': `${readSeconds(words.length)}s` }}>
      <p className="oc-narration-text">
        {words.map((word, i) => (
          <span key={i} className="oc-word" style={{ '--w': i }}>{word} </span>
        ))}
      </p>
      <button type="button" className="oc-next" onClick={onNext}>
        Lanjut <span aria-hidden="true">›</span>
      </button>
    </div>
  )
}

function Dialogue({ cue, onNext }) {
  const line = DIALOGUE[cue]
  return (
    <div className={`oc-dialog oc-dialog--${cue}`} key={cue}>
      <span className="oc-dialog-speaker">{line.speaker}</span>
      <p className="oc-dialog-text">
        <span className="sr-only">{line.speaker}: </span>
        {line.text}
      </p>
      <button type="button" className="oc-next" onClick={onNext}>
        Lanjut <span aria-hidden="true">›</span>
      </button>
    </div>
  )
}

export default function OpeningCinematic({ sceneRef, startState, onPlay }) {
  const reducedMotion = usePrefersReducedMotion()
  const overlayRef = useRef(null)
  const reducedRef = useRef(reducedMotion)
  const villageControl = useRef(null)
  const onPlayRef = useRef(onPlay)
  const shotsControl = useRef(null)
  const timers = useRef([])
  const control = useRef({
    t: 0, speed: 1, loaded: false, villageRequested: false, villageVisible: false, menuDone: false,
    shotsDone: false, firedCues: 0, skipFrom: null, darkHold: false, finished: false,
  })
  const [cue, setCue] = useState('leaving')
  const [shotsGone, setShotsGone] = useState(false)
  const [villageMounted, setVillageMounted] = useState(false)
  const [villageVisible, setVillageVisible] = useState(false)
  const [skipping, setSkipping] = useState(false)

  const at = (id) => ORDER.indexOf(cue) >= ORDER.indexOf(id)

  useEffect(() => {
    reducedRef.current = reducedMotion
  }, [reducedMotion])

  useEffect(() => {
    onPlayRef.current = onPlay
  }, [onPlay])

  const later = useCallback((ms, fn) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), [])

  useEffect(() => {
    let active = true
    preloadCinematic().then((results) => {
      const missing = results.filter((result) => !result.ok).map((result) => result.url)
      if (missing.length) console.warn('Aset cinematic gagal dimuat:', missing)
      if (active) control.current.loaded = true
    })
    return () => {
      active = false
    }
  }, [])

  // Akhir intro: minta App memasang gameplay Chapter 1 di bawah cinematic. Cinematic tetap
  // menampilkan frame terakhirnya sampai frame pertama gameplay siap, lalu App melepasnya.
  //   'seamless' — dari akhir intro: framing kamera sudah sama dengan gameplay.
  //   'fade'     — dari Lewati Cinematic: layar sudah gelap, gameplay masuk dari gelap.
  const finish = useCallback((entrance) => {
    const state = control.current
    if (state.finished) return
    state.finished = true
    onPlayRef.current?.(entrance)
  }, [])

  const onVillageCue = useCallback((id) => {
    setCue(id)
    if (id === 'outro') finish('seamless')
  }, [finish])

  const onVillageReady = useCallback(() => {
    control.current.villageVisible = true
    control.current.speed = 1
    setVillageVisible(true)
    setCue((current) => (current === 'leaving' ? 'village' : current))
    // Setelah crossfade selesai, scene menu dan shot transisi tidak perlu dilukis lagi.
    later(VILLAGE_FADE_MS + 100, () => {
      control.current.menuDone = true
      control.current.shotsDone = true
      setShotsGone(true)
      if (sceneRef.current) sceneRef.current.dataset.cineCovered = 'true'
    })
  }, [later, sceneRef])

  // Jam babak 1 + efek redup tombol Skip. Frame pertama ditulis sebelum browser melukis.
  useLayoutEffect(() => {
    const scene = sceneRef.current
    const overlay = overlayRef.current
    if (!scene || !overlay) return undefined
    const ship0 = startState.current?.ship ?? { tx: 95, o: 1 }
    const malinTop = startState.current?.malinTop ?? null
    const state = control.current
    let anchor = readAnchor(scene)
    const onResize = () => { anchor = readAnchor(scene) }
    window.addEventListener('resize', onResize)

    let frame = 0
    let last = performance.now()
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      state.t += dt * state.speed
      // Tahan di awal transisi sampai semua gambar siap, agar shot tidak muncul setengah termuat.
      if (!state.loaded && state.t > ASSET_HOLD_AT) state.t = ASSET_HOLD_AT
      const viewport = { vw: window.innerWidth, vh: window.innerHeight }
      if (!state.menuDone) {
        writeMenuFrame(scene, computeMenuFrame(state.t, {
          ...viewport, anchor, ship0, malinTop, reduced: reducedRef.current,
        }))
        // Shot teluk sudah menutup layar: scene menu berhenti dilukis.
        if (state.t >= TRANSITION_SHOTS.bay.fade[1]) {
          state.menuDone = true
          scene.dataset.cineCovered = 'true'
        }
      }
      if (!state.shotsDone) shotsControl.current?.write(computeShotsFrame(state.t, viewport, reducedRef.current))
      // Cue narasi babak 1 (teluk, dermaga).
      const nextCue = TRANSITION_SHOTS.cues[state.firedCues]
      if (nextCue && state.t >= nextCue.t && !state.finished) {
        state.firedCues += 1
        state.speed = 1
        setCue(nextCue.id)
      }
      // Mulai babak kampung setelah babak 1 selesai dan gambar siap.
      if (!state.villageRequested && state.t >= VILLAGE_AT && state.loaded && !state.finished) {
        state.villageRequested = true
        setVillageMounted(true)
        later(READY_TIMEOUT_MS, () => {
          // Babak kampung gagal tampil: jangan macet, masuk gameplay dari gelap.
          if (!overlay.querySelector('.oc-village.is-visible') && state.skipFrom === null) {
            state.skipFrom = performance.now()
          }
        })
      }

      // Lewati: layar meredup lalu tetap gelap sampai gameplay siap mengambil alih.
      let dim = state.darkHold ? 1 : 0
      if (state.skipFrom !== null && !state.darkHold) {
        dim = easeInOutCubic(progress(now, state.skipFrom, state.skipFrom + SKIP_FADE_MS))
        if (dim >= 1) {
          state.darkHold = true
          finish('fade')
        }
      }
      overlay.style.setProperty('--dim-o', dim.toFixed(3))
      frame = window.requestAnimationFrame(tick)
    }
    tick(performance.now())

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      delete scene.dataset.cineCovered
    }
  }, [sceneRef, startState, later, finish])

  const skip = useCallback(() => {
    const state = control.current
    if (state.finished || state.skipFrom !== null) return
    state.skipFrom = performance.now()
    setSkipping(true)
  }, [])

  // Lanjut: percepat waktu sampai cue berikutnya (tanpa lompatan). Babak 1 memakai jam React,
  // babak kampung meminta Phaser mempercepat tween, timer, dan animasinya.
  const nextLine = useCallback(() => {
    if (control.current.villageVisible) villageControl.current?.fastForward()
    else control.current.speed = VILLAGE_SCENE.fastForward
  }, [])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') skip()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [skip])

  return (
    <div ref={overlayRef} className="oc" data-cue={cue} data-village={villageVisible || undefined}>
      {!shotsGone && <TransitionShots controlRef={shotsControl} />}
      {villageMounted && (
        <VillageStage
          reduced={reducedMotion}
          visible={villageVisible}
          onCue={onVillageCue}
          onReady={onVillageReady}
          controlRef={villageControl}
        />
      )}
      <Particles />

      <div className="oc-letterbox oc-letterbox--top" aria-hidden="true" />
      <div className="oc-letterbox oc-letterbox--bottom" aria-hidden="true" />
      <div className="oc-dim" aria-hidden="true" />

      <div className="oc-narration-slot" aria-live="polite">
        {NARRATION[cue] && <Narration cue={cue} onNext={nextLine} />}
        {DIALOGUE[cue] && <Dialogue cue={cue} onNext={nextLine} />}
      </div>

      {/* Mulai `lepas`: teks, tombol, dan letterbox menghilang sementara kamera menuju framing gameplay. */}
      {!at('lepas') && !skipping && (
        <button type="button" className="oc-skip" onClick={skip}>
          Skip <span aria-hidden="true">››</span>
        </button>
      )}
    </div>
  )
}
