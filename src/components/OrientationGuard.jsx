// Overlay "Putar Perangkat Anda" untuk HP/tablet dalam posisi portrait. Selalu terpasang agar
// muncul dan hilang dengan transisi; gameplay dijeda oleh PhaserGame, bukan dimuat ulang.
export default function OrientationGuard({ active }) {
  return (
    <div
      className={`ch-rotate${active ? ' is-active' : ''}`}
      role="alertdialog"
      aria-modal={active}
      aria-hidden={!active}
      aria-labelledby="ch-rotate-title"
      aria-describedby="ch-rotate-text"
    >
      <span className="ch-rotate-wave ch-rotate-wave--1" aria-hidden="true" />
      <span className="ch-rotate-wave ch-rotate-wave--2" aria-hidden="true" />
      <span className="ch-rotate-star ch-rotate-star--1" aria-hidden="true" />
      <span className="ch-rotate-star ch-rotate-star--2" aria-hidden="true" />
      <span className="ch-rotate-star ch-rotate-star--3" aria-hidden="true" />

      <div className="ch-rotate-card">
        <svg className="ch-rotate-phone" viewBox="0 0 120 120" aria-hidden="true">
          <path className="ch-rotate-arc" d="M24 34a44 44 0 0 1 58-14" />
          <path className="ch-rotate-arc-head" d="m76 12 7 8-10 3" />
          <g className="ch-rotate-device">
            <rect x="38" y="24" width="44" height="76" rx="9" />
            <rect className="ch-rotate-screen" x="43" y="32" width="34" height="58" rx="3" />
            <circle cx="60" cy="95" r="2.2" />
          </g>
        </svg>
        <h2 id="ch-rotate-title" className="ch-rotate-title">Putar Perangkat Anda</h2>
        <p id="ch-rotate-text" className="ch-rotate-text">Putar perangkat ke mode horizontal untuk bermain.</p>
      </div>
    </div>
  )
}
