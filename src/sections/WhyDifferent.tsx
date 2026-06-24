export default function WhyDifferent() {
  return (
    <section
      id="why"
      className="snap-start snap-always flex h-screen w-full flex-col items-center justify-center bg-canvas px-6"
    >
      <div className="max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">The approach</p>
        <h2 className="mt-4 text-balance text-4xl font-bold leading-tight text-ink sm:text-5xl">
          We tested the hyped multi-agent playbook. It didn&rsquo;t beat simple baselines.
        </h2>
        <p className="mt-5 text-balance text-lg text-muted">
          So we built something more rigorous: a four-role committee that debates,
          cross-challenges, and earns a measured defensive edge — proven on real data below.
        </p>
        {/* CommitteeFlow diagram is added in the next step */}
      </div>
    </section>
  )
}
