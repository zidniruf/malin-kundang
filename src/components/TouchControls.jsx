import { useRef } from 'react'
import { EventBus } from '../game/EventBus'

// Tombol sentuh Chapter 1. Mengirim perintah lewat EventBus `control` yang sudah dibaca
// PlayerControls; tidak ada logika gerak di sini.
//   - Ditekan dan ditahan: status `pressed` bertahan sampai jari dilepas.
//   - pointerup / pointercancel / pointerleave melepas tombol, sehingga Malin tidak terus
//     bergerak ketika jari bergeser keluar atau sentuhan terputus.
//   - Capture implisit sentuhan dilepas agar pointerleave benar-benar terjadi dan jari dapat
//     digeser dari ← ke → tanpa diangkat.
function ControlButton({ action, label, className, onUse, children }) {
  const pointers = useRef(new Set())

  function press(event) {
    if (pointers.current.has(event.pointerId)) return
    pointers.current.add(event.pointerId)
    if (pointers.current.size === 1) EventBus.emit('control', { action, pressed: true })
    onUse()
  }

  function release(event) {
    if (!pointers.current.delete(event.pointerId)) return
    if (pointers.current.size === 0) EventBus.emit('control', { action, pressed: false })
  }

  return (
    <button
      type="button"
      aria-label={label}
      className={`ch-pad ${className}`}
      onPointerDown={(event) => {
        event.preventDefault()
        press(event)
      }}
      // Capture implisit dipasang browser setelah pointerdown; lepas di sini.
      onGotPointerCapture={(event) => event.target.releasePointerCapture?.(event.pointerId)}
      onPointerEnter={(event) => {
        // Jari yang bergeser masuk dari tombol lain (mouse hanya bila sedang ditekan).
        if (event.pointerType !== 'mouse' || (event.buttons & 1) === 1) press(event)
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerLeave={release}
      onContextMenu={(event) => event.preventDefault()}
      onKeyDown={(event) => {
        if (!event.repeat && (event.code === 'Space' || event.code === 'Enter')) {
          event.preventDefault()
          EventBus.emit('control', { action, pressed: true })
          onUse()
        }
      }}
      onKeyUp={(event) => {
        if (event.code === 'Space' || event.code === 'Enter') {
          event.preventDefault()
          EventBus.emit('control', { action, pressed: false })
        }
      }}
      onBlur={() => {
        pointers.current.clear()
        EventBus.emit('control', { action, pressed: false })
      }}
    >
      {children}
    </button>
  )
}

const Arrow = ({ flip }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
    <path d="M15.5 4.5 8 12l7.5 7.5" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const JumpIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 14.5 12 7.5l7 7" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.5 19.5h9" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" opacity="0.7" />
  </svg>
)

export default function TouchControls({ onUse }) {
  return (
    <div className="ch-controls" aria-label="Kontrol sentuh">
      <div className="ch-controls-move">
        <ControlButton action="left" label="Bergerak ke kiri" className="ch-pad--arrow" onUse={onUse}><Arrow /></ControlButton>
        <ControlButton action="right" label="Bergerak ke kanan" className="ch-pad--arrow" onUse={onUse}><Arrow flip /></ControlButton>
      </div>
      <ControlButton action="jump" label="Lompat" className="ch-pad--jump" onUse={onUse}>
        <JumpIcon />
        <span className="ch-pad-text">Lompat</span>
      </ControlButton>
    </div>
  )
}
