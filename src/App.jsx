import { useState } from 'react'
import MainMenu from './components/MainMenu'
import { releaseLandscape } from './components/useDeviceProfile'
import PhaserGame from './PhaserGame'

// Alur: Main Menu → cinematic (berlanjut di dalam MainMenu) → gameplay Chapter 1, tanpa menu di antaranya.
// Serah terima tanpa potongan:
//   1. Di akhir intro kamera sudah memakai framing gameplay; MainMenu memanggil onStart(entrance).
//   2. PhaserGame dipasang DI BAWAH cinematic yang masih menampilkan frame terakhirnya.
//   3. Setelah frame pertama gameplay dilukis (onReady), MainMenu/cinematic dilepas.
// stage: 'menu' | 'handoff' (keduanya terpasang) | 'game'
function App() {
  const [stage, setStage] = useState('menu')
  const [entrance, setEntrance] = useState('fade')

  return (
    <>
      {stage !== 'menu' && (
        <main>
          <PhaserGame
            entrance={entrance}
            onReady={() => setStage((current) => (current === 'handoff' ? 'game' : current))}
            onExit={() => {
              releaseLandscape()
              setStage('menu')
            }}
          />
        </main>
      )}
      {stage !== 'game' && (
        <MainMenu
          onStart={(how = 'fade') => {
            setEntrance(how)
            setStage((current) => (current === 'menu' ? 'handoff' : current))
          }}
        />
      )}
    </>
  )
}

export default App
