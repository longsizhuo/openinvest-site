import { motion } from 'motion/react'
import InstallTabs from '../components/InstallTabs'
import heroBg from '../assets/hero-bg.svg'

export default function Hero() {
  return (
    <section
      className="snap-start snap-always relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-hero px-6 text-white"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex w-full max-w-3xl flex-col items-center text-center">
        <h1
          style={{ color: '#ffffff' }}
          className="text-6xl font-bold tracking-tight drop-shadow-[0_2px_40px_rgba(46,111,242,0.45)] sm:text-7xl md:text-8xl"
        >
          OpenInvest
        </h1>
        <p className="mt-5 max-w-xl text-balance text-lg text-white/70 sm:text-xl">
          Self-hosted AI investment committee. Four independent LLM roles
          challenge each other — the decision stays yours.
        </p>

        <div className="mt-9 flex w-full justify-center">
          <InstallTabs />
        </div>
      </div>

      {/* scroll affordance (decorative bounce only — no opacity gating) */}
      <div className="absolute bottom-8 flex flex-col items-center text-white/40" aria-hidden="true">
        <span className="text-xs tracking-wide">scroll</span>
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </div>
    </section>
  )
}
