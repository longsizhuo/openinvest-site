import CommitteeFlow from '../components/diagrams/CommitteeFlow'

export default function WhyDifferent() {
  return (
    <section
      id="why"
      className="flex h-screen w-full flex-col items-center justify-center bg-canvas px-6"
    >
      <div className="w-full max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">The approach</p>
        <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-ink sm:text-4xl">
          Not more agents — a committee that debates.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-muted">
          Three independent analysts argue from different evidence, cross-challenge in a second
          round, and a CIO synthesizes one verdict with a confidence level. We chose this over the
          hyped analyst-voting playbook because, on real data, that playbook failed our gates.
        </p>
        <div className="mx-auto mt-10 max-w-3xl">
          <CommitteeFlow />
        </div>
      </div>
    </section>
  )
}
