import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'zh'

const STR = {
  en: {
    nav: { why: 'Why', evidence: 'Evidence', install: 'Install', github: 'Star on GitHub' },
    hero: {
      tagline: 'Self-hosted AI investment committee',
      subtitle:
        'Four independent LLM roles challenge each other and a CIO synthesizes one verdict — the decision stays yours.',
      scroll: 'scroll',
    },
    install: {
      copy: 'Copy',
      copied: 'Copied',
      claude: 'Then say “set up invest” to onboard. No API key needed (Coordinator path).',
      codex: 'agentskills.io standard — point any agent at the skill dir via CLAUDE_SKILLS_DIR.',
      github: 'Manual install. The backend self-bootstraps (uv sync) on first run.',
    },
    why: {
      eyebrow: 'Why OpenInvest',
      title: 'Most “AI trading” demos quote returns. We measure what can actually be tested.',
      lead: 'At a Sharpe around 1, proving skill from returns takes decades (t = SR·√T). So instead of selling untestable P&L, OpenInvest grades calibration — and rejects the parts that don’t hold up.',
      points: [
        {
          k: 'Calibration-first',
          v: 'After band calibration (γ=1.1), P10–P90 coverage moves into the pre-registered [75%, 85%] band: 76/72/69% → 80/76/74% across 30/60/90-day horizons.',
        },
        {
          k: 'We reject what fails',
          v: 'TradingAgents-style analyst agents scored 50.3 / 57.4 / 64.7% on 30-day direction — all below the 71–73% naive baseline. 0 of 3 passed the pre-registered gate.',
        },
        {
          k: 'Honest about small samples',
          v: 'At effective n=1, probability-band coverage collapses to 42%. We suppress single-sample point estimates instead of dressing them up as precision.',
        },
        {
          k: 'Calibrated, not overconfident',
          v: 'Raw LLM confidence clusters at 0.60 (median, n≈2,100). We correct that bias before any verdict reaches you.',
        },
      ],
      committeeCaption: 'Three analysts argue from different evidence, cross-challenge in round 2, and a CIO synthesizes one verdict.',
    },
    evidence: {
      eyebrow: 'Evidence',
      title: 'Calibration-first, on real data — wins and honest losses',
      lead: 'Figures are recomputed from the public research archive. Look-ahead-prone windows are flagged; we show where the committee trails, not just where it leads.',
      defensiveTitle: 'The defensive edge',
      figuresTitle: 'Calibration & rigor',
      charts: {
        bear: {
          title: '2022 bear market — the committee protected capital',
          takeaway:
            'When gold fell through 2022, the committee stayed +1.95% while buy-and-hold turned negative and trend / regime rules lost ~6%.',
          caveat: 'Walk-forward replay on GC=F, 2022 (pre-training-cutoff, no look-ahead). n=251 trading days.',
        },
        regime: {
          title: 'Risk-adjusted return across three regimes',
          takeaway:
            'The committee leads in the 2022 bear and edges ahead in the bull — and, honestly, trails buy-and-hold in the sharp 2020 V-shaped crash.',
          caveat: '† 2024–26 bull carries LLM look-ahead (upper-bound only). * 2020 / 2022 are clean. Sharpe ratio, GC=F.',
        },
      },
    },
    footer: {
      eyebrow: 'Get started',
      title: 'Install in one line',
      lead: 'The plugin ships only the agent skill layer — the backend self-bootstraps (git clone + uv sync) on first call. No API key on the Coordinator path.',
      github: 'GitHub',
      docs: 'Docs & wiki',
      license: 'MIT License',
      disclaimer:
        'LLM-driven decision support — not investment advice. The system never auto-trades; the internal ledger is a local record and connects to no real payment or brokerage. Published hit-rate is ~25% directional / 84% HOLD — this tool won’t make you rich, it makes the decision process transparent. Past performance does not predict future returns.',
    },
  },
  zh: {
    nav: { why: '为什么', evidence: '实证', install: '安装', github: 'GitHub 点星' },
    hero: {
      tagline: '自部署的 AI 投资委员会',
      subtitle: '四个独立 LLM 角色互相 challenge，CIO 综合出唯一 verdict —— 决策权归你。',
      scroll: '向下滚动',
    },
    install: {
      copy: '复制',
      copied: '已复制',
      claude: '装完对 Claude 说"帮我初始化 invest"。Coordinator 路径不需要 API key。',
      codex: 'agentskills.io 开放标准 —— 任意 agent 用 CLAUDE_SKILLS_DIR 指到 skill 目录。',
      github: '手动安装。后端在首次运行时自举（uv sync）。',
    },
    why: {
      eyebrow: '为什么选 OpenInvest',
      title: '多数"AI 炒股"demo 拿收益率说事。我们只衡量真正测得动的东西。',
      lead: '在 Sharpe≈1 时，用收益率证明"有本事"要几十年（t = SR·√T）。所以 OpenInvest 不卖测不动的 P&L，而是评估校准 —— 并把站不住脚的部分剔掉。',
      points: [
        {
          k: '校准优先',
          v: '带宽校准（γ=1.1）后，P10–P90 覆盖率落入预注册的 [75%, 85%] 区间：30/60/90 天分别 76/72/69% → 80/76/74%。',
        },
        {
          k: '不行的就砍掉',
          v: 'TradingAgents 式分析师 30 天方向命中 50.3 / 57.4 / 64.7%，全都低于 71–73% 的朴素基线 —— 预注册 Gate 三个 0 个过线。',
        },
        {
          k: '对小样本诚实',
          v: '有效样本 n=1 时，概率带覆盖率塌到 42%。我们直接屏蔽单样本点估计，而不是把它包装成"精确"。',
        },
        {
          k: '校准过，不是过度自信',
          v: '原始 LLM 置信度中位数堆在 0.60（n≈2100）。在任何 verdict 到你手里之前，我们先纠正这个偏差。',
        },
      ],
      committeeCaption: '三个分析师从不同证据出发各自论证，第二轮交叉质疑，CIO 综合出唯一 verdict。',
    },
    evidence: {
      eyebrow: '实证',
      title: '校准优先，用真实数据说话 —— 有胜绩，也有诚实的失败',
      lead: '图表全部重算自公开研究档案。可能含 lookahead 的窗口已标注；我们也展示委员会跑输的情况，而不只是赢的。',
      defensiveTitle: '防御性优势',
      figuresTitle: '校准与严谨性',
      charts: {
        bear: {
          title: '2022 熊市 —— 委员会守住了本金',
          takeaway: '2022 年金价下行时，委员会保持 +1.95%，而买入持有转负、趋势/regime 规则亏约 6%。',
          caveat: 'GC=F 2022 walk-forward 回放（训练截止前，无 lookahead）。n=251 个交易日。',
        },
        regime: {
          title: '跨三种市况的风险调整收益',
          takeaway: '委员会在 2022 熊市领先、牛市略胜 —— 也诚实地说，在 2020 急速 V 型反弹里跑输买入持有。',
          caveat: '† 2024–26 牛市含 LLM lookahead（仅上限）。* 2020/2022 干净。Sharpe，GC=F。',
        },
      },
    },
    footer: {
      eyebrow: '开始使用',
      title: '一行命令装好',
      lead: 'plugin 只带 agent skill 层 —— 后端在首次调用时自举（git clone + uv sync）。Coordinator 路径不需要 API key。',
      github: 'GitHub',
      docs: '文档 & wiki',
      license: 'MIT 协议',
      disclaimer:
        'LLM 驱动的决策辅助 —— 不构成投资建议。系统不会自动下单；内部账本是本地记录，不连接任何真实支付或券商。公开命中率约 25% 方向 / 84% HOLD —— 这工具不会让你致富，它只是把决策过程透明化。过去表现不预示未来收益。',
    },
  },
}

export type Strings = (typeof STR)['en']

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Strings }>({
  lang: 'en',
  setLang: () => {},
  t: STR.en,
})

function detect(): Lang {
  const saved = localStorage.getItem('oi-lang')
  if (saved === 'en' || saved === 'zh') return saved
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')
  useEffect(() => setLangState(detect()), [])
  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('oi-lang', l)
    document.documentElement.lang = l
  }
  const value = useMemo(() => ({ lang, setLang, t: STR[lang] }), [lang])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useI18n = () => useContext(Ctx)
