import { ChartCard, CrossModelHeatmap } from "openinvest-site";
export function InCard() {
  return (
    <div style={{ maxWidth: 520 }}>
      <ChartCard title="Cross-model validation — one lucky cell isn't a signal" takeaway="Across windows × models, only one analyst cell ever cleared the gate. 孤证不立." caveat="Gate = Wilson CI lower bound above baseline + mechanical map." source="docs/wiki/16-ta-analysts-experiment.md">
        <CrossModelHeatmap />
      </ChartCard>
    </div>
  );
}
