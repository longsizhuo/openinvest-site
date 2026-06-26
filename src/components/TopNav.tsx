import { REPO } from '../data/site'
import { useI18n } from '../i18n'

interface TopNavProps {
  currentView?: 'landing' | 'docs';
}

export function TopNav({ currentView = 'landing' }: TopNavProps) {
  const { t, lang, setLang } = useI18n()
  const isDocs = currentView === 'docs'

  const handleNav = (id: string) => {
    if (isDocs) {
      window.location.hash = id
    } else {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.location.hash = id
      }
    }
  }

  return (
    <header className="glass-nav fixed inset-x-0 top-0 z-40">
      <nav className="mx-auto flex max-w-6xl items-center px-5 py-3">
        <button
          onClick={() => {
            if (isDocs) {
              window.location.hash = ''
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
          className="flex items-center gap-2 font-semibold text-white"
        >
          <img src="/favicon.svg" alt="" className="h-6 w-6" />
          OpenInvest
        </button>

        <div className="ml-auto flex items-center gap-0.5 text-sm text-white/70">
          <button
            onClick={() => handleNav('why')}
            className={`hidden px-3 py-1.5 transition-colors sm:block ${
              !isDocs ? 'hover:text-white' : 'hover:text-white text-white/40'
            }`}
          >
            {t.nav.why}
          </button>
          <button
            onClick={() => handleNav('evidence')}
            className={`hidden px-3 py-1.5 transition-colors sm:block ${
              !isDocs ? 'hover:text-white' : 'hover:text-white text-white/40'
            }`}
          >
            {t.nav.evidence}
          </button>
          <button
            onClick={() => handleNav('methodology')}
            className={`hidden px-3 py-1.5 transition-colors sm:block ${
              !isDocs ? 'hover:text-white' : 'hover:text-white text-white/40'
            }`}
          >
            {t.nav.methodology}
          </button>
          <button
            onClick={() => {
              window.location.hash = '#docs/01-architecture'
            }}
            className={`hidden px-3 py-1.5 transition-colors sm:block ${
              isDocs
                ? 'text-white font-semibold border-b-2 border-brand pb-0.5'
                : 'hover:text-white'
            }`}
          >
            {t.nav.docs}
          </button>
          <button
            onClick={() => handleNav('get-started')}
            className={`hidden px-3 py-1.5 transition-colors sm:block ${
              !isDocs ? 'hover:text-white' : 'hover:text-white text-white/40'
            }`}
          >
            {t.nav.install}
          </button>
          <button
            onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
            className="ml-1 border border-white/25 px-2.5 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10"
            aria-label="Toggle language"
          >
            {lang === 'en' ? '中文' : 'EN'}
          </button>
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            className="ml-2 bg-brand px-3 py-1.5 font-medium text-white transition-colors hover:bg-brand/90"
          >
            ★ <span className="hidden sm:inline">{t.nav.github}</span>
            <span className="sm:hidden">GitHub</span>
          </a>
        </div>
      </nav>
    </header>
  )
}

export default TopNav
