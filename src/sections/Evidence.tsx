import ChartCard from '../components/charts/ChartCard'
import BearCagrChart from '../components/charts/BearCagrChart'
import RegimeSharpeChart from '../components/charts/RegimeSharpeChart'
import { bearCagr, regimeSharpe } from '../data/experiments'
import { FIGURES } from '../data/figures'
import { useI18n } from '../i18n'

export default function Evidence() {
  const { t, lang } = useI18n()
  const c = t.evidence.charts
  return (
    <section id="evidence" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
            {t.evidence.eyebrow}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.7)] sm:text-4xl">
            {t.evidence.title}
          </h2>
          <p className="mt-4 text-balance text-white/80 drop-shadow-[0_1px_12px_rgba(0,0,0,0.7)]">{t.evidence.lead}</p>
        </header>

        <h3 className="mb-6 mt-16 text-center text-lg font-semibold text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
          {t.evidence.defensiveTitle}
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <ChartCard title={c.bear.title} takeaway={c.bear.takeaway} caveat={c.bear.caveat} source={bearCagr.source}>
            <BearCagrChart />
          </ChartCard>
          <ChartCard title={c.regime.title} takeaway={c.regime.takeaway} caveat={c.regime.caveat} source={regimeSharpe.source}>
            <RegimeSharpeChart />
          </ChartCard>
        </div>

        <h3 className="mb-6 mt-16 text-center text-lg font-semibold text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
          {t.evidence.figuresTitle}
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          {FIGURES.map((f) => {
            const cap = lang === 'zh' ? f.zh : f.en
            return (
              <figure key={f.src} className="glass-card flex flex-col p-4">
                <img src={f.src} alt={cap} loading="lazy" className="w-full bg-white" />
                <figcaption className="mt-3 text-sm leading-relaxed text-ink/70">{cap}</figcaption>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
