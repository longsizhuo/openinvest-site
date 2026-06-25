import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'zh'

const STR = {
  en: {
    nav: { why: 'Why', evidence: 'Evidence', methodology: 'Research', install: 'Install', github: 'Star on GitHub' },
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
      codex: 'Then enable “invest” in /plugins. Codex reads the same SKILL.md — or drop it into ~/.agents/skills.',
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
      analystTitle: 'Honest negatives — single analysts fail the gate',
      mathTitle: 'The calibration math',
      figuresTitle: 'Calibration & rigor',
      paperLink: 'Read the full paper (PDF)',
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
        analyst: {
          title: 'TradingAgents-style analysts vs a naive baseline',
          takeaway:
            'Fundamental, news and sentiment analysts all missed our pre-registered hit-rate gate — a naive “always-majority” baseline beat every one.',
          caveat: '30-day directional hit-rate, Wilson 95% CI, n≈244/analyst. The single-sided bull window makes the ~73% baseline a high bar by design.',
        },
        cross: {
          title: 'Cross-model validation — one lucky cell isn’t a signal',
          takeaway:
            'Across windows × models, exactly one analyst cell ever cleared the gate. We require replication before believing a result — 孤证不立.',
          caveat: 'Gate = Wilson CI lower bound above both the naive baseline and the mechanical mapping.',
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
    methodology: {
      eyebrow: 'Methodology & Deep Dive',
      title: 'Under the Hood: OpenInvest’s 5 Core Systems',
      lead: 'A rigorous walk-through of the architectural decisions, math, and validation results that power our calibrated committee.',
      dreaming: {
        title: '1. Dreaming: Sleep-Cycle Memory Integration',
        desc: 'To fix the LLM’s zero-session memory, a three-stage nightly job consolidates historical decisions. We apply volatility-aware opportunity cost thresholds to HOLD verdicts to counter over-conservatism.',
        light: 'Light Sleep',
        lightDesc: 'Ingest verdicts & tag daily regime',
        rem: 'REM Sleep',
        remDesc: 'Aggregate outcomes by asset × regime',
        deep: 'Deep Sleep',
        deepDesc: 'Consolidate via thresholds (score ≥ 0.8)'
      },
      path: {
        title: '2. Probability Table Pathification',
        desc: 'Instead of untestable point estimates, we query 20+ years of historical data for the active regime. Paths are sorted into 4 mutually-exclusive categories using volatility units.',
        types: [
          { k: 'Dipped & Up', v: 'Min ≤ -1 ATR & Return > 0. Pullback buy opportunity.' },
          { k: 'Direct Up', v: 'Min > -1 ATR & Return > 0. Waiting leads to FOMO.' },
          { k: 'Popped & Down', v: 'Max ≥ 1 ATR & Return ≤ 0. Sell into strength before drop.' },
          { k: 'Downward Slide', v: 'Max < 1 ATR & Return ≤ 0. Strict bearish trend.' }
        ],
        rigor: 'Rigorous Calibration: Conditional prior shrinkage (k=80) and band expansion (γ=1.1) ensure P10–P90 coverage lands in the pre-registered [75%, 85%] band.'
      },
      paths: {
        title: '3. Dual Execution Paths',
        desc: 'The same prompts run through two distinct implementations. Disagreements between Claude and DeepSeek are used as a model divergence validation signal rather than a bug.',
        coordinator: 'Coordinator Path (Claude Code)',
        coordinatorDesc: 'Local sandboxed subprocesses. Zero-cost execution powered by user subscription.',
        direct: 'Direct Path (FastAPI + DeepSeek)',
        directDesc: 'ThreadPool execution for cron-based automation and real-time live SSE stream.'
      },
      optuna: {
        title: '4. Bayesian Optimization & Negative Results',
        desc: 'We optimize prompts and allocation rules programmatically. Rather than hiding failed assumptions, we document them to ensure scientific integrity.',
        reward: 'Reward Function: Annualized Return - 0.5 × MaxDrawdown + 0.2 × (Sharpe - 1)',
        placebo: 'Intellectual Honesty: Optuna revealed that multi-round debate is a placebo (1 round = 3 rounds in performance). TradingAgents subagents also performed below naive baselines. Focus remains on calibrated CIO veto rights.'
      },
      markdown: {
        title: '5. Markdown DB & Concurrency Locks',
        desc: 'We use YAML frontmatter for schema validation (Pydantic) and the Markdown body for direct LLM ingestion. Atomic transactions are secured via fcntl file locks.',
        lockDesc: 'Fcntl read-modify-write (RMW) locking prevents race conditions between chat bots, schedulers, and APIs.'
      },
      docsTitle: '6. Official Reference Documentation',
      docsDesc: 'Browse and read the raw, unedited Markdown documentation and Architecture Decision Records (ADRs) directly from our codebase.',
      wikiHeading: 'Wiki Chapters',
      adrHeading: 'Design Decisions (ADR)'
    },
  },
  zh: {
    nav: { why: '为什么', evidence: '实证', methodology: '研究方法', install: '安装', github: 'GitHub 点星' },
    hero: {
      tagline: '自部署的 AI 投资委员会',
      subtitle: '四个独立 LLM 角色互相 challenge，CIO 综合出唯一 verdict —— 决策权归你。',
      scroll: '向下滚动',
    },
    install: {
      copy: '复制',
      copied: '已复制',
      claude: '装完对 Claude 说"帮我初始化 invest"。Coordinator 路径不需要 API key。',
      codex: '然后在 /plugins 里启用 "invest"。Codex 读同一份 SKILL.md —— 也可直接放进 ~/.agents/skills。',
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
      analystTitle: '诚实的负结果 —— 单分析师跑不过基率',
      mathTitle: '校准背后的数学',
      figuresTitle: '校准与严谨性',
      paperLink: '读完整论文（PDF）',
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
        analyst: {
          title: 'TradingAgents 式分析师 vs 朴素基线',
          takeaway:
            '基本面、新闻、情绪三个分析师全部没过我们的预注册命中率门 —— 一个"永远跟多数方向"的朴素基线把每个都打赢了。',
          caveat: '30 天方向命中率，Wilson 95% CI，n≈244/分析师。单边牛市窗口让 ~73% 的基线本就是高门槛。',
        },
        cross: {
          title: '跨模型验证 —— 一个走运的格子不算信号',
          takeaway:
            '跨窗口 × 模型，只有一个分析师格子过过门。我们要求可复现才相信结果 —— 孤证不立。',
          caveat: '门槛 = Wilson CI 下界同时高于朴素基线与机械映射。',
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
    methodology: {
      eyebrow: '方法论与技术深挖',
      title: '底层机制：OpenInvest 的五大核心设计',
      lead: '系统设计决策、校准数学和验证结果的完整梳理，用科学严谨支撑委员会决策。',
      dreaming: {
        title: '1. Dreaming 三阶段记忆整合',
        desc: '解决 LLM 无跨会话记忆的问题。每日凌晨通过三阶段整合，将历史判断转化为长期 Insight；对 HOLD 决议采用波动率感知阈值以捕捉机会成本。',
        light: '浅度睡眠 (Light)',
        lightDesc: '摄入昨日决议并标注当时市况',
        rem: '眼动期 (REM)',
        remDesc: '按资产×决议×市况聚合命中率',
        deep: '深度睡眠 (Deep)',
        deepDesc: '通过阈值门 (评分≥0.8) 固化为 Insight'
      },
      path: {
        title: '2. 概率表路径化与四类形状',
        desc: '不提供无法回测的点估计，而是拉取同市况下 20 多年的历史走势，以 Wilder ATR 波动率单位划分为四类完备且互斥的期前路径。',
        types: [
          { k: '先跌后涨 (Dipped & Up)', v: '途中跌幅≥1 ATR 且期末收涨。提供低吸接回机会。' },
          { k: '直接涨 (Direct Up)', v: '途中无显著回踩且期末收涨。空手等待回调将踏空。' },
          { k: '冲高回落 (Popped & Down)', v: '途中冲高≥1 ATR 且期末收跌。卖出离场的黄金时点。' },
          { k: '一路收跌 (Downward Slide)', v: '途中无冲高且期末收跌。单边下行行情。' }
        ],
        rigor: '严谨校准：通过小样本收缩 (k=80) 与置信带宽扩张 (γ=1.1) 修正覆盖率，确保 P10–P90 落在预注册的 [75%, 85%] 带宽内。'
      },
      paths: {
        title: '3. 双执行路径与模型比对',
        desc: '同一套提示词运行在两套完全不同的底层。Claude 与 DeepSeek 决议的分歧被视作模型偏差的检验信号，而非软件漏洞。',
        coordinator: 'Coordinator 路径 (Claude Code)',
        coordinatorDesc: '本地沙盒化子进程。利用用户已订阅的 Claude 4 额度，零 API 成本运行。',
        direct: 'Direct 路径 (FastAPI + DeepSeek)',
        directDesc: '线程池并发运行。支持无人值守的 cron 定时器和 Web 端 SSE 进度直播。',
      },
      optuna: {
        title: '4. Optuna/DSPy 优化与负结果严谨性',
        desc: '通过贝叶斯搜索与 DSPy 自举优化提示词，并对所有假设进行实测求证。我们如实公开负面结果，不作选择性叙事。',
        reward: 'Reward 函数：年化收益 - 0.5 × 最大回撤 + 0.2 × (Sharpe - 1)',
        placebo: '诚实的负结果：Optuna 证实多轮辩论为安慰剂（1 轮与 3 轮收益相同）；TradingAgents 风格分析师未过命中率 Gate。最终依赖 CIO 校准否决权。'
      },
      markdown: {
        title: '5. Markdown 数据库与并发事务锁',
        desc: '用 YAML frontmatter 做 Pydantic 强模式校验，Markdown 正文供 LLM 直接摄入，免去序列化开销。',
        lockDesc: '采用 fcntl 进程级文件锁实现 RMW（读-改-写）事务闭包，彻底防止机器人、Cron 和 Web API 踩踏。',
      },
      docsTitle: '6. 官方参考文档浏览器',
      docsDesc: '直接在线查阅我们代码库中完整、未删剪的官方设计文档与架构决策记录（ADR）。',
      wikiHeading: 'Wiki 章节',
      adrHeading: '设计决策记录 (ADR)'
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
