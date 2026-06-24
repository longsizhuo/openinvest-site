import { lazy, Suspense } from 'react'
import SnapController from './components/SnapController'
import Hero from './sections/Hero'
import WhyDifferent from './sections/WhyDifferent'
import Footer from './sections/Footer'

// Evidence pulls in recharts (~heavy) — load it as a separate chunk so the hero
// paints without waiting on the chart library.
const Evidence = lazy(() => import('./sections/Evidence'))

export default function App() {
  return (
    <>
      <SnapController />
      <Hero />
      <WhyDifferent />
      <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
        <Evidence />
      </Suspense>
      <Footer />
    </>
  )
}
