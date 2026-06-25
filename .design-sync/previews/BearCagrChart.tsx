import { ChartCard, BearCagrChart } from "openinvest-site";
export function InCard() {
  return (
    <div style={{ maxWidth: 520 }}>
      <ChartCard title="2022 bear market — CAGR" takeaway="Committee +1.95% vs buy-and-hold −0.43% vs trend/regime ~−6%." caveat="GC=F walk-forward, 2022. n=251." source="gold_fourth_arm_result.json">
        <BearCagrChart />
      </ChartCard>
    </div>
  );
}
