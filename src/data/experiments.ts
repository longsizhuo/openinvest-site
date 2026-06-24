// All numbers below are extracted verbatim from the openInvest repo. Sources are
// cited per chart. Honesty rules honored: only pre-2024-06-30 backtests are
// look-ahead-clean (2020/2022); 2024-26 bull figures are upper-bound only and
// flagged; no symbols/thresholds/holdings beyond the published research asset
// (gold GC=F walk-forward), consistent with the repo's public-data redline.

export const palette = {
  committee: '#2E6FF2', // brand blue — our system
  win: '#16A062', // green — a genuine win
  baseline: '#AAB0B8', // gray — baselines
  loss: '#D64545', // red — failed / underperformed
  ink: '#1F2937',
  muted: '#949CA8',
  grid: '#EDEFF2',
}

// 1 — 2022 bear-market replay (gold GC=F). Pre-cutoff → no LLM look-ahead.
export const bearCagr = {
  title: '2022 bear market — the committee protected capital',
  takeaway:
    'When gold fell through 2022, the committee stayed +1.95% while buy-and-hold turned negative and trend/regime rules lost 6%.',
  caveat: 'Walk-forward replay on GC=F, 2022 (pre-training-cutoff, no look-ahead). n=251 trading days.',
  source: 'experiments/ta-analysts/baselines/gold_fourth_arm_result.json',
  metric: 'CAGR (%)',
  data: [
    { name: 'Committee', value: 1.95, kind: 'win' },
    { name: 'Buy & hold', value: -0.43, kind: 'baseline' },
    { name: '200-DMA trend', value: -6.46, kind: 'baseline' },
    { name: 'Regime rule', value: -5.7, kind: 'baseline' },
  ] as const,
}

// 2 — risk-adjusted return across three regimes (committee vs buy-and-hold).
export const regimeSharpe = {
  title: 'Risk-adjusted return across three regimes',
  takeaway:
    'The committee leads in the 2022 bear and edges ahead in the bull — and, honestly, trails buy-and-hold in the sharp 2020 V-shaped crash.',
  caveat:
    '† 2024–26 bull carries LLM training-data look-ahead (upper-bound only). * 2020 / 2022 are look-ahead-clean. Sharpe ratio, GC=F.',
  source: 'experiments/ta-analysts/baselines/gold_fourth_arm_result.json',
  metric: 'Sharpe',
  data: [
    { regime: '2022 bear *', committee: 0.2, buyhold: 0.05 },
    { regime: '2020 crash *', committee: 0.73, buyhold: 1.13 },
    { regime: '2024–26 bull †', committee: 1.82, buyhold: 1.74 },
  ] as const,
}

// 3 — TradingAgents-style analyst agents vs a naive-majority baseline. 0/3 passed.
export const analystGate = {
  title: 'We stress-tested the TradingAgents analyst playbook',
  takeaway:
    'Three analyst agents — fundamental, news, sentiment — all failed our pre-registered gate. A naive "always the majority direction" baseline beat every one.',
  caveat:
    '30-day directional hit-rate, Wilson 95% CI, n=244/analyst. A single-sided bull window makes the ~73% "always bullish" baseline a high bar by design.',
  source: 'docs/wiki/16-ta-analysts-experiment.md',
  metric: '30-day directional hit-rate (%)',
  data: [
    { name: 'Fundamental', analyst: 50.3, baseline: 70.7 },
    { name: 'News', analyst: 57.4, baseline: 73.0 },
    { name: 'Sentiment', analyst: 64.7, baseline: 73.1 },
  ] as const,
}

// 4 — cross-model validation. Only 1 of 9 cells ever passed → not a signal.
export const crossModel = {
  title: 'Cross-model validation — one lucky cell isn’t a signal',
  takeaway:
    'Across windows × models, exactly one analyst cell ever cleared the gate. We require replication before believing a result — 孤证不立.',
  caveat: 'Gate = Wilson CI lower bound above both the naive baseline and the mechanical mapping.',
  source: 'docs/wiki/16-ta-analysts-experiment.md',
  cols: ['Fundamental', 'Sentiment', 'News'],
  rows: [
    { label: '2024–26 · mimo-flash', cells: [50.3, 64.7, 57.4], pass: [false, false, false] },
    { label: '2024–26 · deepseek-r', cells: [28.8, 58.2, 59.3], pass: [false, false, false] },
    { label: '2022 bear · mimo-flash', cells: [74.3, 48.3, 50.9], pass: [true, false, false] },
  ],
}
