import { ChartCard, BearCagrChart } from "openinvest-site";

// The frosted-glass evidence card wrapper (title + takeaway + chart + caveat + source).
export function WithChart() {
  return (
    <div style={{ maxWidth: 520 }}>
      <ChartCard
        title="2022 bear market — the committee protected capital"
        takeaway="When gold fell through 2022, the committee stayed +1.95% while buy-and-hold turned negative."
        caveat="Walk-forward replay on GC=F, 2022 (pre-cutoff, no look-ahead). n=251."
        source="experiments/ta-analysts/baselines/gold_fourth_arm_result.json"
      >
        <BearCagrChart />
      </ChartCard>
    </div>
  );
}
