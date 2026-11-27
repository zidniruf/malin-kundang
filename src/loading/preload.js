import { STARTUP_IMAGES } from './assetManifest'

const images = new Map()
const decodedImages = new Map()
const listeners = new Set()
const TOTAL = STARTUP_IMAGES.length + 1
let snapshot = { status: 'idle', loaded: 0, total: TOTAL, failed: 0 }
let running = null
let adventurePromise = null

export const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
export const getSnapshot = () => snapshot
export const getLoadedImage = (url) => decodedImages.get(url)

function publish(update) {
  snapshot = { ...snapshot, ...update }
  for (const listener of listeners) listener()
}

// Simpan gambar yang sudah didekode; opening/cinematic memakai hasil yang sama.
// URL sama dengan loader Phaser agar HTTP cache browser bisa digunakan ulang.
export function loadImage(url) {
  if (images.has(url)) return images.get(url)
  const promise = new Promise((resolve, reject) => {
    const image = new Image()
    const timeout = window.setTimeout(() => finish(new Error(`Waktu muat habis: ${url}`)), 45000)
    let finished = false
    function finish(error) {
      if (finished) return
      finished = true
      window.clearTimeout(timeout)
      image.onload = image.onerror = null
      if (error) reject(error)
      else {
        decodedImages.set(url, image)
        resolve(image)
      }
    }
    image.decoding = 'async'
    image.onload = () => image.decode().then(() => finish(), finish)
    image.onerror = () => finish(new Error(`Gambar gagal dimuat: ${url}`))
    image.src = url
  }).catch((error) => {
    images.delete(url)
    throw error
  })
  images.set(url, promise)
  return promise
}

export const preloadImage = (url) => loadImage(url).then(
  () => ({ url, ok: true }),
  () => ({ url, ok: false }),
)

export function loadAdventure() {
  if (!adventurePromise) {
    adventurePromise = import('../Adventure').catch((error) => {
      adventurePromise = null
      throw error
    })
  }
  return adventurePromise
}

// Satu antrean bersama, termasuk saat React StrictMode menjalankan effect dua kali.
export function startPreload() {
  if (running || snapshot.status === 'ready') return running
  publish({ status: 'loading', loaded: 0, failed: 0 })
  running = (async () => {
    let cursor = 0
    let failed = 0
    const complete = () => publish({ loaded: snapshot.loaded + 1 })
    const recordFailure = (error) => {
      failed += 1
      console.warn('Persiapan game gagal:', error)
    }
    async function worker() {
      while (cursor < STARTUP_IMAGES.length) {
        const url = STARTUP_IMAGES[cursor++]
        try {
          await loadImage(url)
          complete()
        } catch (error) {
          recordFailure(error)
        }
      }
    }
    await Promise.all([
      loadAdventure().then(complete, recordFailure),
      ...Array.from({ length: 4 }, worker),
    ])
    publish({ status: failed ? 'error' : 'ready', failed })
  })().finally(() => { running = null })
  return running
}
