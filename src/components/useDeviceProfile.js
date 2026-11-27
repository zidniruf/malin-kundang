import { useSyncExternalStore } from 'react'

// Profil perangkat untuk layar gameplay.
//   touch:    pointer utama kasar (HP/tablet). Menentukan tombol sentuh, teks petunjuk, dan
//             penjaga orientasi. Desktop dengan mouse tidak pernah dianggap touch.
//   portrait: orientasi layar saat ini.
const TOUCH_QUERY = '(pointer: coarse)'
const PORTRAIT_QUERY = '(orientation: portrait)'

function subscribe(callback) {
  const queries = [TOUCH_QUERY, PORTRAIT_QUERY].map((query) => window.matchMedia(query))
  queries.forEach((query) => query.addEventListener('change', callback))
  // Sebagian browser HP memperbarui media query orientasi sedikit terlambat; dengarkan juga
  // Screen Orientation API dan resize sebagai cadangan.
  window.screen.orientation?.addEventListener?.('change', callback)
  window.addEventListener('resize', callback)
  return () => {
    queries.forEach((query) => query.removeEventListener('change', callback))
    window.screen.orientation?.removeEventListener?.('change', callback)
    window.removeEventListener('resize', callback)
  }
}

function snapshot() {
  const touch = window.matchMedia(TOUCH_QUERY).matches
  const portrait = window.matchMedia(PORTRAIT_QUERY).matches
  return `${touch ? 1 : 0}${portrait ? 1 : 0}`
}

export function useDeviceProfile() {
  const value = useSyncExternalStore(subscribe, snapshot, () => '00')
  return { touch: value[0] === '1', portrait: value[1] === '1' }
}

// Screen Orientation API: hanya dicoba dari interaksi pengguna (klik "Mulai Bermain").
// Kebanyakan browser HP mewajibkan layar penuh sebelum orientasi boleh dikunci; iPhone tidak
// mendukung keduanya. Semua kegagalan diabaikan karena overlay portrait tetap menjadi
// mekanisme utama.
let enteredFullscreen = false

export function tryLockLandscape() {
  if (!window.matchMedia(TOUCH_QUERY).matches) return
  const root = document.documentElement
  const lock = () => window.screen.orientation?.lock?.('landscape').catch(() => {})
  try {
    if (!document.fullscreenElement && root.requestFullscreen) {
      root.requestFullscreen({ navigationUI: 'hide' })
        .then(() => {
          enteredFullscreen = true
          return lock()
        })
        .catch(() => lock())
    } else {
      lock()
    }
  } catch {
    // API tidak tersedia atau ditolak: abaikan.
  }
}

export function releaseLandscape() {
  try {
    window.screen.orientation?.unlock?.()
  } catch {
    // Tidak semua browser mengizinkan unlock.
  }
  if (enteredFullscreen && document.fullscreenElement) {
    document.exitFullscreen?.().catch(() => {})
  }
  enteredFullscreen = false
}
