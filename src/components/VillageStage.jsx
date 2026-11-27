import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import OpeningVillageScene from '../game/scenes/OpeningVillageScene'
import { LEVEL_SIZE } from '../game/scenes/LevelOneScene'
import { VILLAGE_SCENE } from './cinematicConfig'

// Phaser instance khusus babak kampung pada opening cinematic. Terpisah dari PhaserGame
// (gameplay): tidak memakai EventBus, input dimatikan, dan dihancurkan saat cinematic selesai.
export default function VillageStage({ reduced, visible, onCue, onReady, controlRef }) {
  const host = useRef(null)
  const callbacks = useRef({ onCue, onReady })
  // `reduced` hanya dibaca saat scene dibuat; perubahan di tengah adegan tidak memulai ulang.
  const reducedAtStart = useRef(reduced)

  useEffect(() => {
    callbacks.current = { onCue, onReady }
  }, [onCue, onReady])

  useEffect(() => {
    const parent = host.current
    let game = null
    // Strict Mode membatalkan effect pertama sebelum instance Phaser dibuat.
    const start = window.setTimeout(() => {
      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent,
        // Sama dengan PhaserGame (ukuran dasar 1280×720, EXPAND) agar framing akhir identik.
        width: LEVEL_SIZE.width,
        height: LEVEL_SIZE.height,
        backgroundColor: '#39b8e8',
        scale: { mode: Phaser.Scale.EXPAND, autoCenter: Phaser.Scale.CENTER_BOTH },
        input: { keyboard: false, mouse: false, touch: false, gamepad: false },
        audio: { noAudio: true },
        banner: false,
      })
      game.scene.add('OpeningVillageScene', OpeningVillageScene, true, {
        config: VILLAGE_SCENE,
        reduced: reducedAtStart.current,
        onCue: (id) => callbacks.current.onCue?.(id),
        onReady: () => callbacks.current.onReady?.(),
      })
      controlRef.current = {
        fastForward: () => game?.scene.getScene('OpeningVillageScene')?.fastForward(),
      }
    }, 0)

    return () => {
      window.clearTimeout(start)
      controlRef.current = null
      if (game) game.destroy(true)
    }
  }, [controlRef])

  return <div ref={host} className={`oc-village${visible ? ' is-visible' : ''}`} aria-hidden="true" />
}
