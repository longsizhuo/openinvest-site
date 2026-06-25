import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useI18n } from '../i18n'
import { calibrationMath, palette } from '../data/experiments'
import { DOCS_INDEX } from '../data/docsIndex'

export function ResearchMethodology() {
  const { t, lang } = useI18n()
  const m = t.methodology

  // State for Dreaming stages
  const [activeDreamStage, setActiveDreamStage] = useState<'light' | 'rem' | 'deep'>('light')

  // State for Path shapes
  const [activePathShape, setActivePathShape] = useState<0 | 1 | 2 | 3>(0)

  // State for Document browser
  const [selectedDoc, setSelectedDoc] = useState<{ category: 'wiki' | 'adr'; slug: string }>({
    category: 'wiki',
    slug: '01-architecture',
  })
  const [docBody, setDocBody] = useState<string>('')
  const [docLoading, setDocLoading] = useState<boolean>(false)

  // Fetch document contents
  useEffect(() => {
    setDocLoading(true)
    const folder = selectedDoc.category === 'wiki' ? 'wiki' : 'wiki/adr'
    fetch(`/docs/${folder}/${selectedDoc.slug}.md`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load')
        return res.text()
      })
      .then((text) => {
        // Strip frontmatter from text
        const body = text.replace(/^---\s*\n(.*?)\n---\s*\n/s, '')
        setDocBody(body)
        setDocLoading(false)
      })
      .catch(() => {
        setDocBody('Failed to load document.')
        setDocLoading(false)
      })
  }, [selectedDoc])

  // Sleep stage details selector
  const dreamStages = [
    {
      id: 'light' as const,
      label: m.dreaming.light,
      desc: m.dreaming.lightDesc,
      color: '#2563EB',
      bg: '#EFF6FF',
      details: lang === 'zh'
        ? '在每日凌晨启动，读取昨日的所有 Verdict 和随后的市场实际波动，并在该日截断计算，为每条 Verdict 标注当日的真实 Market Regime（市况），输出 short-term-recall 临时文件。'
        : 'Starts at midnight. Reads all past verdicts and subsequent market price movements, tagging each with the true market regime on that decision day, generating short-term-recall files.'
    },
    {
      id: 'rem' as const,
      label: m.dreaming.rem,
      desc: m.dreaming.remDesc,
      color: '#8468E0',
      bg: '#F5F3FF',
      details: lang === 'zh'
        ? '眼动期按 (资产, 决议, 市况) 三元组进行桶聚合，统计 7d/30d 的命中率。此阶段引入“波动率感知阈值”计算 HOLD 的机会成本：如果市场超出正常波动而委员会依然 HOLD，将被判定为“踏空” (Caution) 并施以惩罚，避免系统走向极度保守。'
        : 'REM sleep groups data by (Asset, Verdict, Regime) to aggregate 7d/30d hit rates. A critical "volatility-aware threshold" (K_flat × ATR × √T) is applied to evaluate HOLD opportunity costs. Excess movement during a HOLD triggers a Caution penalty to combat LLM over-conservatism.'
    },
    {
      id: 'deep' as const,
      label: m.dreaming.deep,
      desc: m.dreaming.deepDesc,
      color: '#16A062',
      bg: '#ECFDF5',
      details: lang === 'zh'
        ? '经过严格的阈值门筛选（评分 ≥ 0.8 且样本量 ≥ 3），只有证据充足且重复发生的规律才会被提取，并固化为 Markdown 格式的长期 Insight（存入 memory/insights/ 文件夹）。这些规则会在下一次委员会运行前，自动作为 CIO 上下文注入。'
        : 'Applies a strict consolidation gate (Score ≥ 0.8 and Count ≥ 3). Only statistically significant, recurrent patterns are extracted and saved as persistent Markdown insights in memory/insights/. These are automatically injected into the CIO prompt in subsequent runs.'
    }
  ]

  // Render mock SVG charts for the 4 path shapes
  const renderPathChart = (shapeIndex: number) => {
    switch (shapeIndex) {
      case 0: // Dipped & Up
        return (
          <svg viewBox="0 0 300 160" className="h-full w-full font-mono text-[10px] text-gray-500">
            {/* Grid & Axes */}
            <line x1="30" y1="130" x2="280" y2="130" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="30" y1="20" x2="30" y2="130" stroke="#E5E7EB" strokeWidth="1" />
            {/* Zero Line */}
            <line x1="30" y1="80" x2="280" y2="80" stroke="#D1D5DB" strokeDasharray="3 3" />
            <text x="10" y="83" fill="#9CA3AF">0%</text>
            
            {/* ATR Limit Line (-1 ATR) */}
            <line x1="30" y1="110" x2="280" y2="110" stroke="#FCA5A5" strokeDasharray="2 2" />
            <text x="5" y="113" fill="#EF4444">-1 ATR</text>

            {/* Price Path */}
            <path
              d="M 30 80 Q 80 75 110 115 T 200 90 T 270 50"
              fill="none"
              stroke="#2563EB"
              strokeWidth="2"
            />
            {/* Markers */}
            <circle cx="110" cy="115" r="4" fill="#EF4444" />
            <text x="120" y="125" fill="#EF4444" fontWeight="600">Dip (-1.2 ATR)</text>
            
            <circle cx="270" cy="50" r="4" fill="#16A062" />
            <text x="220" y="42" fill="#16A062" fontWeight="600">End (+4.5%)</text>
          </svg>
        )
      case 1: // Direct Up
        return (
          <svg viewBox="0 0 300 160" className="h-full w-full font-mono text-[10px] text-gray-500">
            <line x1="30" y1="130" x2="280" y2="130" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="30" y1="20" x2="30" y2="130" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="30" y1="80" x2="280" y2="80" stroke="#D1D5DB" strokeDasharray="3 3" />
            <text x="10" y="83" fill="#9CA3AF">0%</text>
            
            <line x1="30" y1="110" x2="280" y2="110" stroke="#FCA5A5" strokeDasharray="2 2" />
            <text x="5" y="113" fill="#EF4444">-1 ATR</text>

            {/* Price Path */}
            <path
              d="M 30 80 Q 100 65 160 55 T 270 30"
              fill="none"
              stroke="#2563EB"
              strokeWidth="2"
            />
            <circle cx="270" cy="30" r="4" fill="#16A062" />
            <text x="210" y="24" fill="#16A062" fontWeight="600">End (+7.2%)</text>
            <text x="100" y="100" fill="#9CA3AF" fontStyle="italic">No deep pullback</text>
          </svg>
        )
      case 2: // Popped & Down
        return (
          <svg viewBox="0 0 300 160" className="h-full w-full font-mono text-[10px] text-gray-500">
            <line x1="30" y1="130" x2="280" y2="130" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="30" y1="20" x2="30" y2="130" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="30" y1="80" x2="280" y2="80" stroke="#D1D5DB" strokeDasharray="3 3" />
            <text x="10" y="83" fill="#9CA3AF">0%</text>
            
            {/* +1 ATR Line */}
            <line x1="30" y1="50" x2="280" y2="50" stroke="#86EFAC" strokeDasharray="2 2" />
            <text x="5" y="53" fill="#16A062">+1 ATR</text>

            {/* Price Path */}
            <path
              d="M 30 80 Q 90 40 140 45 T 220 95 T 270 110"
              fill="none"
              stroke="#2563EB"
              strokeWidth="2"
            />
            <circle cx="90" cy="40" r="4" fill="#16A062" />
            <text x="80" y="30" fill="#16A062" fontWeight="600">Peak (+2.1 ATR)</text>
            
            <circle cx="270" cy="110" r="4" fill="#D64545" />
            <text x="220" y="125" fill="#D64545" fontWeight="600">End (-3.8%)</text>
          </svg>
        )
      case 3: // Downward Slide
        return (
          <svg viewBox="0 0 300 160" className="h-full w-full font-mono text-[10px] text-gray-500">
            <line x1="30" y1="130" x2="280" y2="130" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="30" y1="20" x2="30" y2="130" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="30" y1="80" x2="280" y2="80" stroke="#D1D5DB" strokeDasharray="3 3" />
            <text x="10" y="83" fill="#9CA3AF">0%</text>
            
            <line x1="30" y1="50" x2="280" y2="50" stroke="#86EFAC" strokeDasharray="2 2" />
            <text x="5" y="53" fill="#16A062">+1 ATR</text>

            {/* Price Path */}
            <path
              d="M 30 80 Q 100 95 180 110 T 270 125"
              fill="none"
              stroke="#2563EB"
              strokeWidth="2"
            />
            <circle cx="270" cy="125" r="4" fill="#D64545" />
            <text x="210" y="140" fill="#D64545" fontWeight="600">End (-6.5%)</text>
            <text x="100" y="65" fill="#9CA3AF" fontStyle="italic">No upward bounce</text>
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <section id="methodology" className="border-t border-gray-200 bg-[#FFFFFF] px-6 py-28 text-gray-900">
      <div className="mx-auto max-w-5xl text-left">
        
        {/* Section Header */}
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
            {m.eyebrow}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            {m.title}
          </h2>
          <p className="mt-4 text-balance text-gray-600 sm:text-lg">
            {m.lead}
          </p>
        </header>

        {/* 1. Dreaming Section */}
        <div className="mt-20 border border-gray-200 bg-white p-6 md:p-8">
          <span className="font-mono text-xs text-brand uppercase tracking-wider font-semibold">System 01</span>
          <h3 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">{m.dreaming.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 max-w-3xl">{m.dreaming.desc}</p>
          
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {/* Interactive Sleep Stages Selectors */}
            {dreamStages.map((stage) => {
              const isActive = activeDreamStage === stage.id
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveDreamStage(stage.id)}
                  className={`flex flex-col text-left p-4 border transition-all ${
                    isActive
                      ? 'border-[#1F2937] bg-gray-50 shadow-md translate-y-[-2px]'
                      : 'border-gray-200 bg-white hover:border-gray-400'
                  }`}
                  style={{ borderLeftWidth: isActive ? '4px' : '1px' }}
                >
                  <span className="font-mono text-xs font-semibold uppercase" style={{ color: stage.color }}>
                    {stage.label}
                  </span>
                  <span className="mt-2 text-sm font-bold text-gray-900">{stage.desc}</span>
                </button>
              )
            })}
          </div>

          {/* Active Detail Display */}
          <div className="mt-6 border border-gray-200 bg-gray-50/50 p-5 min-h-[90px] flex items-center justify-between">
            <div className="flex-1">
              <span className="font-mono text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                {lang === 'zh' ? '当前阶段机制' : 'Stage Mechanism'}
              </span>
              <p className="mt-1 text-sm leading-relaxed text-gray-700">
                {dreamStages.find((s) => s.id === activeDreamStage)?.details}
              </p>
            </div>
            {/* Dotted path animation mock */}
            <div className="hidden sm:flex ml-8 items-center justify-center h-12 w-12 border border-dashed border-gray-300">
              <motion.div
                className="h-3 w-3"
                style={{
                  backgroundColor: dreamStages.find((s) => s.id === activeDreamStage)?.color ?? palette.committee
                }}
                animate={{
                  scale: [1, 1.4, 1],
                  rotate: [0, 90, 0]
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </div>

        {/* 2. Pathification Section */}
        <div className="mt-8 border border-gray-200 bg-white p-6 md:p-8">
          <span className="font-mono text-xs text-brand uppercase tracking-wider font-semibold">System 02</span>
          <h3 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">{m.path.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 max-w-3xl">{m.path.desc}</p>
          
          <div className="mt-8 grid gap-8 md:grid-cols-5">
            {/* Left side: Interactive Tab list */}
            <div className="flex flex-col gap-2 md:col-span-2">
              {m.path.types.map((type, idx) => {
                const isActive = activePathShape === idx
                return (
                  <button
                    key={idx}
                    onClick={() => setActivePathShape(idx as 0 | 1 | 2 | 3)}
                    className={`p-3 text-left border text-xs transition-all ${
                      isActive
                        ? 'border-gray-950 bg-gray-950 text-white font-semibold'
                        : 'border-gray-200 hover:border-gray-400 text-gray-700 bg-white'
                    }`}
                  >
                    <div className="font-bold">{type.k}</div>
                    <div className={`mt-1 text-[11px] leading-tight ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                      {type.v}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Right side: Mock Chart Display */}
            <div className="border border-gray-200 bg-gray-50/50 p-4 md:col-span-3 flex flex-col justify-between">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                <span className="font-mono text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                  {lang === 'zh' ? '90天前向路径仿真' : '90d Forward Path Simulation'}
                </span>
                <span className="font-mono text-[10px] font-semibold bg-gray-200 text-gray-700 px-2 py-0.5">
                  Regime-conditioned
                </span>
              </div>
              
              <div className="h-44 w-full flex items-center justify-center">
                {renderPathChart(activePathShape)}
              </div>
            </div>
          </div>

          <div className="mt-6 border-l-2 border-brand bg-[#F4F8FF] p-4 text-xs leading-relaxed text-gray-700">
            {m.path.rigor}
          </div>
        </div>

        {/* 3. Dual Execution Paths Section */}
        <div className="mt-8 border border-gray-200 bg-white p-6 md:p-8">
          <span className="font-mono text-xs text-brand uppercase tracking-wider font-semibold">System 03</span>
          <h3 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">{m.paths.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 max-w-3xl">{m.paths.desc}</p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Coordinator box */}
            <div className="border border-gray-200 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-brand rounded-full" />
                  <h4 className="font-bold text-gray-900 text-sm sm:text-base">{m.paths.coordinator}</h4>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-gray-600">
                  {m.paths.coordinatorDesc}
                </p>
              </div>
              <div className="mt-6 font-mono text-[10px] text-gray-400 border-t border-gray-100 pt-3">
                {lang === 'zh' ? '独立环境：subprocess 隔离 · 模型：Claude 4' : 'Sandbox: subprocess isolation · Model: Claude 4'}
              </div>
            </div>

            {/* Direct box */}
            <div className="border border-gray-200 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-purple-600 rounded-full" />
                  <h4 className="font-bold text-gray-900 text-sm sm:text-base">{m.paths.direct}</h4>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-gray-600">
                  {m.paths.directDesc}
                </p>
              </div>
              <div className="mt-6 font-mono text-[10px] text-gray-400 border-t border-gray-100 pt-3">
                {lang === 'zh' ? '线程池并发：ThreadPoolExecutor · 模型：DeepSeek-Chat' : 'Concurrency: ThreadPoolExecutor · Model: DeepSeek-Chat'}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bayesian & Prompt Optimization (Optuna + DSPy) */}
        <div className="mt-8 border border-gray-200 bg-white p-6 md:p-8">
          <span className="font-mono text-xs text-brand uppercase tracking-wider font-semibold">System 04</span>
          <h3 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">{m.optuna.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 max-w-3xl">{m.optuna.desc}</p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {/* Math Calibration */}
            <div className="md:col-span-1 border border-gray-200 bg-gray-50/50 p-5 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Calibration Formulas</span>
                <div className="mt-4 flex flex-col gap-4">
                  {calibrationMath.map((item, idx) => (
                    <div key={idx} className="border-b border-gray-200/60 pb-3 last:border-b-0">
                      <code className="font-mono text-sm font-semibold text-gray-900 block">{item.expr}</code>
                      <span className="font-mono text-[9px] text-gray-400 block mt-0.5">{item.sub}</span>
                      <p className="text-[11px] text-gray-600 mt-1 leading-normal">
                        {lang === 'zh' ? item.zh : item.en}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reward Box */}
            <div className="md:col-span-2 border border-gray-200 p-5 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Reward Signal</span>
                <div className="mt-3 font-mono text-xs border border-gray-200 bg-gray-50 p-3 text-gray-700 leading-relaxed">
                  {m.optuna.reward}
                </div>

                <div className="mt-4">
                  <span className="font-mono text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mb-2">
                    {lang === 'zh' ? '优化效果 (Reward)' : 'Optimization Impact (Reward)'}
                  </span>
                  {/* Progress visualization */}
                  <div className="flex flex-col gap-2 font-mono text-[10px]">
                    <div className="flex items-center justify-between">
                      <span>v0 Baseline (100% HOLD)</span>
                      <span>0.00</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100">
                      <div className="h-full bg-gray-300" style={{ width: '0.1%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <span>v1 Prompt (Cash Opportunity)</span>
                      <span className="text-brand font-bold">+0.398</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100">
                      <div className="h-full bg-brand" style={{ width: '80%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <span>Optuna Best / DSPy Optimized</span>
                      <span className="text-win font-bold">+0.422 (Dev accuracy +10pp)</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100">
                      <div className="h-full bg-win" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Placebos / Negative Results Panel (Intellectual Honesty) */}
          <div className="mt-6 border border-red-200 bg-red-50/40 p-5">
            <div className="flex items-start gap-3">
              <span className="font-bold text-red-600 text-lg leading-none">⚠️</span>
              <div>
                <h4 className="font-bold text-red-950 text-xs sm:text-sm uppercase tracking-wider">
                  {lang === 'zh' ? '学术严谨性与负面结论 (Placebo / Negative Results)' : 'Intellectual Honesty & Negative Findings'}
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-red-800">
                  {m.optuna.placebo}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Markdown DB & Concurrency Section */}
        <div className="mt-8 border border-gray-200 bg-white p-6 md:p-8">
          <span className="font-mono text-xs text-brand uppercase tracking-wider font-semibold">System 05</span>
          <h3 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">{m.markdown.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 max-w-3xl">{m.markdown.desc}</p>

          <div className="mt-8 grid gap-6 md:grid-cols-5">
            {/* Code editor view */}
            <div className="md:col-span-3 border border-gray-200 bg-gray-950 text-gray-300 font-mono text-[10.5px] p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-2 text-gray-500 text-[10px]">
                  <span>portfolio.md</span>
                  <span>YAML + GFM Markdown</span>
                </div>
                <div className="leading-normal">
                  <span className="text-gray-500">---</span><br />
                  <span className="text-blue-400">schema_version:</span> 2<br />
                  <span className="text-blue-400">cash:</span><br />
                  &nbsp;&nbsp;<span className="text-blue-400">CNY:</span> 50000<br />
                  <span className="text-blue-400">holdings:</span><br />
                  &nbsp;&nbsp;- <span className="text-blue-400">symbol:</span> NDQ.AX<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">units:</span> 50<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">avg_cost:</span> 38.50<br />
                  <span className="text-gray-500">---</span><br />
                  <br />
                  <span className="text-purple-400"># Current Holdings</span><br />
                  - CNY Cash: ¥50,000<br />
                  - NDQ.AX: 50 units @ A$38.50
                </div>
              </div>
              <div className="mt-4 border-t border-gray-800 pt-2 text-[9.5px] text-gray-500 text-right">
                Pydantic validation is run prior to atomic file writes
              </div>
            </div>

            {/* Concurrency detail */}
            <div className="md:col-span-2 border border-gray-200 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  {/* fcntl lock icon */}
                  <svg className="h-4 w-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="font-mono text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                    {lang === 'zh' ? '并发事务保证' : 'Concurrency Guarantees'}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-gray-600">
                  {m.markdown.lockDesc}
                </p>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-3">
                <span className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block">
                  {lang === 'zh' ? '压测表现 (0 lost updates)' : 'Stress Test (0 lost updates)'}
                </span>
                <div className="mt-1 font-mono text-[11px] text-win font-bold">
                  50 threads × cash +1 CNY = precise 50.00 CNY delta
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Official Reference Documentation */}
        <div className="mt-8 border border-gray-200 bg-white p-6 md:p-8">
          <span className="font-mono text-xs text-brand uppercase tracking-wider font-semibold">System 06</span>
          <h3 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">{m.docsTitle}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 max-w-3xl">{m.docsDesc}</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Left panel: Document list */}
            <div className="md:col-span-1 space-y-6 max-h-[500px] overflow-y-auto pr-2 border-r border-gray-200">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  {m.wikiHeading}
                </h4>
                <div className="flex flex-col gap-1">
                  {DOCS_INDEX.filter(d => d.category === 'wiki').map(doc => {
                    const isSelected = selectedDoc.category === 'wiki' && selectedDoc.slug === doc.slug
                    return (
                      <button
                        key={doc.slug}
                        onClick={() => setSelectedDoc({ category: 'wiki', slug: doc.slug })}
                        className={`text-left px-2 py-1.5 text-xs transition border-l-2 ${
                          isSelected
                            ? 'border-brand bg-gray-50 text-brand font-semibold'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                        title={doc.intent || doc.title}
                      >
                        <div className="truncate font-mono">{doc.slug}</div>
                        <div className="truncate text-[10px] text-gray-400 mt-0.5">{doc.title}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  {m.adrHeading}
                </h4>
                <div className="flex flex-col gap-1">
                  {DOCS_INDEX.filter(d => d.category === 'adr').map(doc => {
                    const isSelected = selectedDoc.category === 'adr' && selectedDoc.slug === doc.slug
                    return (
                      <button
                        key={doc.slug}
                        onClick={() => setSelectedDoc({ category: 'adr', slug: doc.slug })}
                        className={`text-left px-2 py-1.5 text-xs transition border-l-2 ${
                          isSelected
                            ? 'border-brand bg-gray-50 text-brand font-semibold'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                        title={doc.intent || doc.title}
                      >
                        <div className="truncate font-mono">{doc.slug}</div>
                        <div className="truncate text-[10px] text-gray-400 mt-0.5">{doc.title}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right panel: Content viewer */}
            <div className="md:col-span-3 min-h-[400px] max-h-[500px] overflow-y-auto border border-gray-200 bg-gray-50/20 p-6 flex flex-col">
              {docLoading ? (
                <div className="text-gray-400 text-xs flex items-center justify-center flex-1">
                  {lang === 'zh' ? '加载中...' : 'Loading...'}
                </div>
              ) : (
                <article className="prose max-w-none text-gray-800 text-xs">
                  {renderMarkdown(docBody)}
                </article>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

// Lightweight custom Markdown line renderer
function renderMarkdown(text: string) {
  const lines = text.split('\n')
  let inCodeBlock = false
  let codeBlockLines: string[] = []

  const elements: React.ReactNode[] = []

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx]

    // Code block detection
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        elements.push(
          <pre key={`code-${idx}`} className="font-mono text-[11px] bg-gray-950 text-gray-200 px-4 py-3 my-3 overflow-x-auto whitespace-pre">
            {codeBlockLines.join('\n')}
          </pre>
        )
        codeBlockLines = []
        inCodeBlock = false
      } else {
        // Start of code block
        inCodeBlock = true
      }
      continue
    }

    if (inCodeBlock) {
      codeBlockLines.push(line)
      continue
    }

    // Horizontal Rule
    if (line.trim() === '---' || line.trim() === '***') {
      elements.push(<hr key={idx} className="border-t border-gray-200 my-6" />)
      continue
    }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={idx} className="text-lg font-bold text-gray-900 mt-6 mb-3 border-b border-gray-200 pb-1">
          {line.slice(2)}
        </h1>
      )
      continue
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={idx} className="text-sm font-bold text-gray-900 mt-5 mb-2">
          {line.slice(3)}
        </h2>
      )
      continue
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={idx} className="text-xs font-bold text-gray-900 mt-4 mb-2">
          {line.slice(4)}
        </h3>
      )
      continue
    }

    // Blockquotes
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={idx} className="border-l-4 border-brand bg-gray-50 px-4 py-2 my-3 text-xs italic text-gray-500">
          {line.slice(2)}
        </blockquote>
      )
      continue
    }

    // Lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={idx} className="ml-5 list-disc text-xs text-gray-700 my-1">
          {line.slice(2)}
        </li>
      )
      continue
    }

    // Empty space
    if (line.trim() === '') {
      elements.push(<div key={idx} className="h-2" />)
      continue
    }

    // Standard paragraph
    elements.push(
      <p key={idx} className="text-xs text-gray-700 leading-relaxed my-2">
        {line}
      </p>
    )
  }

  return elements
}

export default ResearchMethodology
