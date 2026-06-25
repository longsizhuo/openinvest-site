import { REPO } from '../data/site'
import { useI18n } from '../i18n'

function toId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function TopNav() {
  const { t, lang, setLang } = useI18n()
  return (
    <header className="glass-nav fixed inset-x-0 top-0 z-40">
      <nav className="mx-auto flex max-w-6xl items-center px-5 py-3">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 font-semibold text-white"
        >
          <img src="/favicon.svg" alt="" className="h-6 w-6" />
          OpenInvest
        </button>

        <div className="ml-auto flex items-center gap-0.5 text-sm text-white/70">
          <button onClick={() => toId('why')} className="hidden px-3 py-1.5 transition-colors hover:text-white sm:block">
            {t.nav.why}
          </button>
          <button onClick={() => toId('evidence')} className="hidden px-3 py-1.5 transition-colors hover:text-white sm:block">
            {t.nav.evidence}
          </button>
          <button onClick={() => toId('methodology')} className="hidden px-3 py-1.5 transition-colors hover:text-white sm:block">
            {t.nav.methodology}
          </button>
          <button onClick={() => toId('get-started')} className="hidden px-3 py-1.5 transition-colors hover:text-white sm:block">
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
