import CommitteeFlow from '../components/diagrams/CommitteeFlow'
import { useI18n } from '../i18n'

export default function WhyDifferent() {
  const { t } = useI18n()
  return (
    <section id="why" className="flex min-h-screen w-full items-center justify-center px-6 py-28">
      <div className="mx-auto w-full max-w-5xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
            {t.why.eyebrow}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.7)] sm:text-4xl">
            {t.why.title}
          </h2>
          <p className="mt-4 text-balance text-white/85 drop-shadow-[0_1px_12px_rgba(0,0,0,0.7)] sm:text-lg">
            {t.why.lead}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {t.why.points.map((p, i) => (
            <div key={i} className="glass-card p-5">
              <h3 className="text-base font-semibold text-ink">{p.k}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{p.v}</p>
            </div>
          ))}
        </div>

        <div className="glass-card mt-6 p-6">
          <CommitteeFlow />
          <p className="mt-2 text-center text-sm text-ink/60">{t.why.committeeCaption}</p>
        </div>
      </div>
    </section>
  )
}
