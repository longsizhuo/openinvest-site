import ChartCard from '../components/charts/ChartCard'
import BearCagrChart from '../components/charts/BearCagrChart'
import RegimeSharpeChart from '../components/charts/RegimeSharpeChart'
import AnalystGateChart from '../components/charts/AnalystGateChart'
import CrossModelHeatmap from '../components/charts/CrossModelHeatmap'
import { analystGate, bearCagr, crossModel, regimeSharpe } from '../data/experiments'

export default function Evidence() {
  return (
    <section id="evidence" className="bg-canvas px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Evidence</p>
          <h2 className="mt-3 text-balance text-3xl font-bold text-ink sm:text-4xl">
            Measured on real data — wins and honest losses
          </h2>
          <p className="mt-4 text-balance text-muted">
            Every chart is built from the experiment file it cites. Look-ahead-prone windows are
            flagged; we show the cases where the committee trails, not just where it leads.
          </p>
        </header>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <ChartCard title={bearCagr.title} takeaway={bearCagr.takeaway} caveat={bearCagr.caveat} source={bearCagr.source}>
            <BearCagrChart />
          </ChartCard>
          <ChartCard title={regimeSharpe.title} takeaway={regimeSharpe.takeaway} caveat={regimeSharpe.caveat} source={regimeSharpe.source}>
            <RegimeSharpeChart />
          </ChartCard>
          <ChartCard title={analystGate.title} takeaway={analystGate.takeaway} caveat={analystGate.caveat} source={analystGate.source}>
            <AnalystGateChart />
          </ChartCard>
          <ChartCard title={crossModel.title} takeaway={crossModel.takeaway} caveat={crossModel.caveat} source={crossModel.source}>
            <CrossModelHeatmap />
          </ChartCard>
        </div>
      </div>
    </section>
  )
}
