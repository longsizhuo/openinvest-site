import { lazy, Suspense, useState, useEffect } from 'react'
import Background from './components/Background'
import TopNav from './components/TopNav'
import SnapController from './components/SnapController'
import Hero from './sections/Hero'
import WhyDifferent from './sections/WhyDifferent'
import Footer from './sections/Footer'
import { DocsView } from './sections/DocsView'

// Evidence pulls in recharts (~heavy) — separate chunk so the hero paints first.
const Evidence = lazy(() => import('./sections/Evidence'))
const ResearchMethodology = lazy(() => import('./sections/ResearchMethodology'))

export default function App() {
  const [view, setView] = useState<'landing' | 'docs'>('landing')
  const [activeSlug, setActiveSlug] = useState<string>('01-architecture')

  // Hash-based routing listener
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash.startsWith('#docs')) {
        setView('docs')
        const parts = hash.split('/')
        if (parts[1]) {
          setActiveSlug(parts[1])
        } else {
          setActiveSlug('01-architecture')
        }
      } else {
        setView('landing')
      }
    }

    // Initialize on mount
    handleHashChange()

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Smooth scroll to anchor after returning to landing page
  useEffect(() => {
    if (view === 'landing') {
      const hash = window.location.hash
      if (hash && hash !== '#docs') {
        const id = hash.replace('#', '')
        const timer = setTimeout(() => {
          const element = document.getElementById(id)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
        return () => clearTimeout(timer)
      }
    }
  }, [view])

  return (
    <>
      {view === 'landing' ? (
        <>
          <Background />
          <TopNav currentView="landing" />
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
      ) : (
        <>
          <TopNav currentView="docs" />
          <DocsView activeSlug={activeSlug} />
        </>
      )}
    </>
  )
}
