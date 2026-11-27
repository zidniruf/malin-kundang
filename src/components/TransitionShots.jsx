import { useImperativeHandle, useRef } from 'react'
import { TRANSITION_SHOTS } from './cinematicConfig'

// Shot transisi babak 1: teluk (01) lalu dermaga (02). Bukan sistem cinematic terpisah:
// OpeningCinematic memanggil `write(frame)` dari jam yang sama dengan scene menu, dan frame
// dihitung oleh computeShotsFrame (cinematicMotion.js). Komponen ini hanya menyusun layer DOM.
const { bay, pier, clouds, waves, foliage, shipUrl } = TRANSITION_SHOTS

const NODE_KEYS = ['bay', 'bayStage', 'bayClouds', 'bayWaves', 'ship', 'foliage', 'pier', 'pierStage', 'pierClouds']
const px = (value) => `${value.toFixed(2)}px`

function placeStage(element, cam, W, H) {
  element.style.width = px(W)
  element.style.height = px(H)
  element.style.transform = `translate3d(${px(cam.tx)}, ${px(cam.ty)}, 0) scale(${cam.z.toFixed(4)})`
}

export default function TransitionShots({ controlRef }) {
  const rootRef = useRef(null)

  useImperativeHandle(controlRef, () => ({
    write(frame) {
      const root = rootRef.current
      if (!root) return
      const node = Object.fromEntries(NODE_KEYS.map((key) => [key, root.querySelector(`[data-node="${key}"]`)]))
      if (NODE_KEYS.some((key) => !node[key])) return
      const { W, H } = frame

      node.bay.style.opacity = frame.bay.o.toFixed(3)
      placeStage(node.bayStage, frame.bay.cam, W, H)
      node.bayClouds.style.transform = `translate3d(${px(frame.bay.cloudsX)}, ${px(-clouds.lift.bay * H)}, 0)`
      node.bayWaves.style.transform = `translate3d(${px(frame.bay.wavesX)}, ${px(frame.bay.wavesY)}, 0)`
      const shipW = bay.ship.width * W
      node.ship.style.width = px(shipW)
      node.ship.style.transform = `translate3d(${px(frame.bay.shipX - shipW / 2)}, ${px(bay.ship.waterline * H)}, 0) rotate(${frame.bay.shipRot.toFixed(2)}deg)`
      node.foliage.style.width = px(W)
      node.foliage.style.height = px(H)
      node.foliage.style.opacity = frame.bay.foliageO.toFixed(3)
      node.foliage.style.transform = `translate(-50%, -50%) translate3d(${px(frame.bay.foliageX)}, 0, 0) scale(${frame.bay.foliageS.toFixed(4)})`

      node.pier.style.opacity = frame.pier.o.toFixed(3)
      placeStage(node.pierStage, frame.pier.cam, W, H)
      node.pierClouds.style.transform = `translate3d(${px(frame.pier.cloudsX)}, ${px(-clouds.lift.pier * H)}, 0)`
    },
  }))

  return (
    <div ref={rootRef} className="oc-shots" aria-hidden="true">
      <div data-node="bay" className="oc-shot" style={{ opacity: 0 }}>
        <div data-node="bayStage" className="oc-shot-stage">
          {/* Latar teluk sedikit diperbesar (kapal ikut, agar tetap di garis air) supaya garis
              pantai menyatu dengan layer ombak di depannya. */}
          <div className="oc-shot-bgwrap" style={{ '--bg-scale': bay.bgScale }}>
            <img className="oc-shot-bg" src={bay.url} alt="" draggable="false" />
            <img
              data-node="ship"
              className="oc-shot-ship"
              src={shipUrl}
              alt=""
              draggable="false"
              style={{ '--ship-origin': `${bay.ship.waterlineInImage * 100}%` }}
            />
          </div>
          <div data-node="bayClouds" className="oc-shot-layer oc-shot-clouds" style={{ opacity: clouds.opacity.bay }}>
            <img src={clouds.url} alt="" draggable="false" />
          </div>
          <div data-node="bayWaves" className="oc-shot-layer oc-shot-waves">
            <img src={waves.url} alt="" draggable="false" />
          </div>
        </div>
        <div data-node="foliage" className="oc-shot-foliage">
          <img src={foliage.url} alt="" draggable="false" />
        </div>
      </div>

      <div data-node="pier" className="oc-shot" style={{ opacity: 0 }}>
        <div data-node="pierStage" className="oc-shot-stage">
          <img className="oc-shot-bg" src={pier.url} alt="" draggable="false" />
          <div data-node="pierClouds" className="oc-shot-layer oc-shot-clouds oc-shot-clouds--pier" style={{ opacity: clouds.opacity.pier }}>
            <img src={clouds.url} alt="" draggable="false" />
          </div>
        </div>
      </div>
    </div>
  )
}
