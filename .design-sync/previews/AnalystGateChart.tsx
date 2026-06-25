import { ChartCard, AnalystGateChart } from "openinvest-site";
export function InCard() {
  return (
    <div style={{ maxWidth: 520 }}>
      <ChartCard title="TradingAgents-style analysts vs a naive baseline" takeaway="Fundamental / news / sentiment all lose to a naive majority baseline — 0/3 passed the gate." caveat="30-day hit-rate, Wilson 95% CI, n=244/analyst." source="docs/wiki/16-ta-analysts-experiment.md">
        <AnalystGateChart />
      </ChartCard>
    </div>
  );
}
