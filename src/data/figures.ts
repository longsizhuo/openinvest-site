// Research figures recomputed from the public openinvest-research-archive.
// Served from public/figures (base '/'). Captions are bilingual.
export type Figure = { src: string; en: string; zh: string }

export const FIGURES: Figure[] = [
  {
    src: '/figures/figure1_mechanisms.png',
    en: 'Where multi-agent value actually comes from — three mechanisms: independent information sources, de-correlated sampling + aggregation, and deterministic guardrails.',
    zh: '多智能体价值的三个真实来源：独立信息源、去相关采样＋聚合、确定性护栏。',
  },
  {
    src: '/figures/figure2_verifiability.png',
    en: 'Why returns are untestable: t = SR·√T. At Sharpe ≈ 1 you need decades to prove skill — so we grade calibration, not P&L.',
    zh: '为什么收益率测不动：t = SR·√T。Sharpe≈1 要几十年才能证明"有本事"——所以我们评估校准，而不是 P&L。',
  },
  {
    src: '/figures/figure6_coverage_by_window.png',
    en: 'Band calibration (γ=1.1) lifts P10–P90 coverage into the pre-registered [75%, 85%] band at every horizon.',
    zh: '带宽校准（γ=1.1）把 P10–P90 覆盖率在每个时间尺度都抬进预注册的 [75%, 85%] 区间。',
  },
  {
    src: '/figures/table2_calibration.png',
    en: 'Pre-registered out-of-sample acceptance: the calibration layer lifts coverage into [75,85]% and improves Brier at every horizon (fit 2007–17, OOS 2018–26).',
    zh: '预注册样本外验收：校准层把覆盖率抬进 [75,85]%、各时间尺度 Brier 全部改善（拟合 2007–17，样本外 2018–26）。',
  },
  {
    src: '/figures/figure7_confidence_distribution.png',
    en: 'Raw LLM confidence clusters at 0.60 (median, n ≈ 2,100) — the overconfidence we correct for.',
    zh: '原始 LLM 置信度中位数堆在 0.60（n≈2100）——这就是我们纠正的过度自信。',
  },
  {
    src: '/figures/figure4_spurious_precision.png',
    en: 'Spurious precision: at effective n=1, probability-band coverage collapses to 42%. We suppress single-sample estimates.',
    zh: '伪精确：有效样本 n=1 时，概率带覆盖率塌到 42%。我们屏蔽单样本点估计。',
  },
  {
    src: '/figures/figure3_era_regime_heatmap.png',
    en: 'Coverage across eras × regimes — solid except documented thin-data cells (e.g. gold 2007–09 downtrend-90d, n=14).',
    zh: '时代 × regime 覆盖率——除已标注的稀疏数据格（如金 2007–09 downtrend-90d，n=14）外都稳。',
  },
  {
    src: '/figures/figure5_brier_by_era.png',
    en: 'Conditional vs unconditional Brier by era — gold bear conditional 0.356 / unconditional 0.333.',
    zh: '各时代条件 vs 无条件 Brier——金熊条件 0.356 / 无条件 0.333。',
  },
  {
    src: '/figures/table1_frameworks.png',
    en: 'How OpenInvest compares to other multi-agent trading frameworks.',
    zh: 'OpenInvest 与其他多智能体交易框架的对比。',
  },
  {
    src: '/figures/table3_fivestage.png',
    en: 'The five-stage evaluation protocol behind every claim.',
    zh: '支撑每条结论的五阶段评估流程。',
  },
]
