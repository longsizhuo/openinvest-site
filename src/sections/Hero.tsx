import { motion } from 'motion/react'
import InstallTabs from '../components/InstallTabs'
import { useI18n } from '../i18n'

export default function Hero() {
  const { t } = useI18n()
  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-start px-6 pt-[20vh] text-white">
      <div className="flex w-full max-w-3xl flex-col items-center text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
          {t.hero.tagline}
        </p>
        <h1
          style={{ color: '#ffffff' }}
          className="text-5xl font-bold tracking-tight drop-shadow-[0_2px_40px_rgba(0,0,0,0.6)] sm:text-7xl md:text-8xl"
        >
          OpenInvest
        </h1>
        <p className="mt-5 max-w-xl text-balance text-lg text-white/80 drop-shadow-[0_1px_12px_rgba(0,0,0,0.7)] sm:text-xl">
          {t.hero.subtitle}
        </p>

        <div className="mt-14 flex w-full justify-center">
          <InstallTabs />
        </div>
      </div>

      <div className="absolute bottom-8 flex flex-col items-center text-white/50" aria-hidden="true">
        <span className="text-xs tracking-wide">{t.hero.scroll}</span>
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
