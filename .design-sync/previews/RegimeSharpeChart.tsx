import { ChartCard, RegimeSharpeChart } from "openinvest-site";
export function InCard() {
  return (
    <div style={{ maxWidth: 520 }}>
      <ChartCard title="Risk-adjusted return across three regimes" takeaway="Committee leads the 2022 bear, edges the bull, trails buy-and-hold in the 2020 V-crash." caveat="† 2024–26 bull carries look-ahead. Sharpe, GC=F." source="gold_fourth_arm_result.json">
        <RegimeSharpeChart />
      </ChartCard>
    </div>
  );
}
