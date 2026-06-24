import InstallTabs from '../components/InstallTabs'
import { LICENSE_URL, REPO, WIKI } from '../data/site'
import { useI18n } from '../i18n'

export default function Footer() {
  const { t } = useI18n()
  return (
    <footer id="get-started" className="px-6 py-28 text-white">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
          {t.footer.eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-bold drop-shadow-[0_2px_18px_rgba(0,0,0,0.7)] sm:text-4xl">{t.footer.title}</h2>
        <p className="mt-4 max-w-xl text-white/75 drop-shadow-[0_1px_12px_rgba(0,0,0,0.7)]">{t.footer.lead}</p>

        <div className="mt-8 flex w-full justify-center">
          <InstallTabs />
        </div>

        <nav className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm text-white/80">
          <a className="transition-colors hover:text-white" href={REPO} target="_blank" rel="noreferrer">
            {t.footer.github}
          </a>
          <a className="transition-colors hover:text-white" href={WIKI} target="_blank" rel="noreferrer">
            {t.footer.docs}
          </a>
          <a className="transition-colors hover:text-white" href={LICENSE_URL} target="_blank" rel="noreferrer">
            {t.footer.license}
          </a>
        </nav>

        <p className="mt-12 max-w-2xl text-xs leading-relaxed text-white/50">{t.footer.disclaimer}</p>
      </div>
    </footer>
  )
}
