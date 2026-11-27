import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'malin-kundang:audio-settings'
const DEFAULT_SETTINGS = { musicOn: false, volume: 0.6 }

function readSettings() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
    return { ...DEFAULT_SETTINGS, ...saved }
  } catch {
    return DEFAULT_SETTINGS
  }
}

// Pengaturan audio menu; disimpan di localStorage agar tetap sama setelah kembali dari game.
export function useAudioSettings() {
  const [settings, setSettings] = useState(readSettings)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // Penyimpanan bisa diblokir (mode privat); pengaturan tetap berlaku untuk sesi ini.
    }
  }, [settings])

  return [settings, setSettings]
}

// Memutar musik latar menu secara loop. Tidak pernah autoplay: musik default mati,
// dan bila browser menolak play(), pemutaran menunggu interaksi pertama pengguna.
export function useMenuMusic(src, { musicOn, volume }) {
  const audioRef = useRef(null)

  useEffect(() => {
    if (!src) return undefined
    const audio = new Audio(src)
    audio.loop = true
    audio.preload = 'none'
    audioRef.current = audio
    return () => {
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
      audioRef.current = null
    }
  }, [src])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [src, volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined
    if (!musicOn) {
      audio.pause()
      return undefined
    }

    const retry = () => audio.play().catch(() => {})
    const removeRetry = () => {
      window.removeEventListener('pointerdown', retry)
      window.removeEventListener('keydown', retry)
    }
    audio.play().catch(() => {
      window.addEventListener('pointerdown', retry, { once: true })
      window.addEventListener('keydown', retry, { once: true })
    })
    return removeRetry
  }, [src, musicOn])
}
