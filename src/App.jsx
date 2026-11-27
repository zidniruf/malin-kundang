import { lazy, Suspense, useCallback, useState } from 'react'
import LoadingScreen from './loading/LoadingScreen'
import { loadAdventure } from './loading/preload'

const Adventure = lazy(loadAdventure)

export default function App() {
  const [ready, setReady] = useState(false)
  const complete = useCallback(() => setReady(true), [])
  if (!ready) return <LoadingScreen onComplete={complete} />
  return (
    <Suspense fallback={<LoadingScreen onComplete={complete} />}>
      <Adventure />
    </Suspense>
  )
}
