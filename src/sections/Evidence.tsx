import ChartCard from '../components/charts/ChartCard'
import BearCagrChart from '../components/charts/BearCagrChart'
import RegimeSharpeChart from '../components/charts/RegimeSharpeChart'
import AnalystGateChart from '../components/charts/AnalystGateChart'
import CrossModelHeatmap from '../components/charts/CrossModelHeatmap'
import { bearCagr, regimeSharpe, analystGate, crossModel, calibrationMath } from '../data/experiments'
import { FIGURES } from '../data/figures'
import { useI18n } from '../i18n'

// PDF lives in public/ with a CJK + spaces name — encodeURI makes a valid href.
const PAPER_HREF = encodeURI('/LLM 多智能体投资系统的架构选择与校准优先评估.pdf')

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
          {t.evidence.analystTitle}
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <ChartCard title={c.analyst.title} takeaway={c.analyst.takeaway} caveat={c.analyst.caveat} source={analystGate.source}>
            <AnalystGateChart />
          </ChartCard>
          <ChartCard title={c.cross.title} takeaway={c.cross.takeaway} caveat={c.cross.caveat} source={crossModel.source}>
            <CrossModelHeatmap />
          </ChartCard>
        </div>

        <h3 className="mb-6 mt-16 text-center text-lg font-semibold text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
          {t.evidence.mathTitle}
        </h3>
        <div className="grid gap-6 md:grid-cols-3">
          {calibrationMath.map((m) => (
            <div key={m.expr} className="glass-card flex flex-col p-6">
              <code className="font-mono text-lg font-semibold text-ink">{m.expr}</code>
              <span className="mt-1 font-mono text-xs text-muted">{m.sub}</span>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{lang === 'zh' ? m.zh : m.en}</p>
            </div>
          ))}
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

        <div className="mt-12 flex justify-center">
          <a
            href={PAPER_HREF}
            target="_blank"
            rel="noreferrer"
            className="glass-card inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:text-brand"
          >
            {t.evidence.paperLink}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
