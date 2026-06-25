import { lazy, Suspense } from 'react'
import Background from './components/Background'
import TopNav from './components/TopNav'
import SnapController from './components/SnapController'
import Hero from './sections/Hero'
import WhyDifferent from './sections/WhyDifferent'
import Footer from './sections/Footer'

// Evidence pulls in recharts (~heavy) — separate chunk so the hero paints first.
const Evidence = lazy(() => import('./sections/Evidence'))
const ResearchMethodology = lazy(() => import('./sections/ResearchMethodology'))

export default function App() {
  return (
    <>
      <Background />
      <TopNav />
      <SnapController />
      <Hero />
      <WhyDifferent />
      <Suspense fallback={<div className="min-h-screen" />}>
        <Evidence />
      </Suspense>
      <Suspense fallback={<div className="min-h-screen" />}>
        <ResearchMethodology />
      </Suspense>
      <Footer />
    </>
  )
}
