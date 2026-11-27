import { useState } from 'react'
import { level1Assets } from '../game/level1Assets'

export default function LevelOnePreview() {
  const [failedAssets, setFailedAssets] = useState([])

  function reportFailure(key) {
    setFailedAssets((current) => current.includes(key) ? current : [...current, key])
  }

  return (
    <section id="kampung-nelayan" className="w-full max-w-6xl scroll-mt-6" aria-labelledby="level-title">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 id="level-title" className="text-lg font-semibold text-amber-100">Level 1 · Kampung Nelayan</h2>
        <span className="text-sm text-slate-400">Pratinjau lingkungan</span>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-2xl border border-amber-300/20 bg-sky-400 shadow-2xl" role="img" aria-label="Kampung pesisir dengan rumah beratap gonjong, pohon kelapa, dermaga, dan pegunungan hijau.">
        {level1Assets.map((asset) => (
          <img
            key={asset.key}
            src={asset.url}
            alt=""
            aria-hidden="true"
            draggable="false"
            width="1672"
            height="941"
            onError={() => reportFailure(asset.key)}
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-fill"
            style={{ transform: `translateY(${asset.offsetY * 100}%)` }}
          />
        ))}
      </div>

      {failedAssets.length > 0 && (
        <p role="alert" className="mt-3 rounded-lg border border-red-300/30 bg-red-950 p-3 text-sm text-red-100">
          Gambar gagal dimuat: {failedAssets.join(', ')}. Muat ulang halaman; jika masih gagal, periksa file di public/assets/backgrounds/level-1/.
        </p>
      )}
    </section>
  )
}
