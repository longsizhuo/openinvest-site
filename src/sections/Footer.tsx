import InstallTabs from '../components/InstallTabs'
import { LICENSE_URL, REPO, WIKI } from '../data/site'

export default function Footer() {
  return (
    <footer className="bg-hero px-6 py-24 text-white">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Get started</p>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Install in one line</h2>
        <p className="mt-4 max-w-xl text-white/60">
          The plugin ships only the agent skill layer — the backend self-bootstraps (git clone +
          uv sync) on first call. No API key needed on the Coordinator path.
        </p>

        <div className="mt-8 flex w-full justify-center">
          <InstallTabs />
        </div>

        <nav className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm text-white/70">
          <a className="transition-colors hover:text-white" href={REPO} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="transition-colors hover:text-white" href={WIKI} target="_blank" rel="noreferrer">
            Docs &amp; wiki
          </a>
          <a className="transition-colors hover:text-white" href={LICENSE_URL} target="_blank" rel="noreferrer">
            MIT License
          </a>
        </nav>

        <p className="mt-12 max-w-2xl text-xs leading-relaxed text-white/40">
          LLM-driven decision support — <span className="text-white/65">not investment advice</span>.
          The system never auto-trades; the internal ledger is a local record and connects to no real
          payment or brokerage. Published hit-rate is ~25% directional / 84% HOLD — this tool
          won&rsquo;t make you rich, it makes the decision process transparent. Past performance does
          not predict future returns.
        </p>
      </div>
    </footer>
  )
}
