import { useEffect, useSyncExternalStore } from 'react'
import { OPENING_IMAGES } from '../components/openingAssets'
import { getSnapshot, startPreload, subscribe } from './preload'
import './LoadingScreen.css'

export default function LoadingScreen({ onComplete }) {
  const { status, loaded, total, failed } = useSyncExternalStore(subscribe, getSnapshot)
  const percent = Math.floor(loaded / total * 100)

  useEffect(() => { startPreload() }, [])
  useEffect(() => {
    if (status !== 'ready') return
    const timer = window.setTimeout(onComplete, 600)
    return () => window.clearTimeout(timer)
  }, [status, onComplete])

  return (
    <main className="loading-screen" data-state={status} aria-label="Persiapan petualangan">
      <div className="loading-world" aria-hidden="true">
        <img className="loading-sky" src={OPENING_IMAGES.sky} alt="" />
        <img className="loading-clouds" src={OPENING_IMAGES.clouds} alt="" />
        <img className="loading-coast" src={OPENING_IMAGES.beach} alt="" />
        <img className="loading-reef" src={OPENING_IMAGES.underwater} alt="" />
        <img className="loading-ship" src={OPENING_IMAGES.ship} alt="" />
      </div>
      <div className="loading-content">
        <img className="loading-logo" src={OPENING_IMAGES.titleArt} alt="Malin Kundang: The Moral Adventure" />
        <div className="loading-panel">
          <h1>{status === 'error' ? 'Ombaknya sedang besar…' : status === 'ready' ? 'Petualangan siap!' : 'Loading…'}</h1>
          <div className="loading-track" role="progressbar" aria-label="Memuat aset petualangan"
            aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}
            aria-valuetext={`${loaded} dari ${total} bagian siap`}>
            <div className="loading-fill" style={{ width: `${percent}%` }} />
          </div>
          <div className="loading-meta"><span>Memuat petualangan…</span><strong>{percent}%</strong></div>
          <p className="loading-caption" role="status">
            {status === 'error'
              ? `${failed} bagian belum termuat. Periksa koneksi internet, lalu coba lagi.`
              : status === 'ready' ? 'Selamat datang di kampung Malin.' : 'Menyiapkan dunia, karakter, dan cerita untukmu.'}
          </p>
          {status === 'error' && <button type="button" className="loading-retry" onClick={startPreload}>Coba lagi</button>}
        </div>
      </div>
    </main>
  )
}
