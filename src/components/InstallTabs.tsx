import { useState } from 'react'
import { INSTALL_TABS } from '../data/site'

export default function InstallTabs() {
  const [active, setActive] = useState(INSTALL_TABS[0].id)
  const [copied, setCopied] = useState(false)
  const tab = INSTALL_TABS.find((t) => t.id === active) ?? INSTALL_TABS[0]

  async function copy() {
    try {
      await navigator.clipboard.writeText(tab.commands.join('\n'))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] text-left shadow-2xl shadow-black/30 backdrop-blur-sm">
      {/* tab bar + copy */}
      <div className="flex flex-wrap items-center gap-1 border-b border-white/10 px-2 py-2" role="tablist" aria-label="Install method">
        {INSTALL_TABS.map((t) => {
          const on = t.id === active
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={on}
              onClick={() => {
                setActive(t.id)
                setCopied(false)
              }}
              className={
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ' +
                (on ? 'bg-brand text-white' : 'text-white/55 hover:bg-white/5 hover:text-white/90')
              }
            >
              {t.label}
            </button>
          )
        })}
        <button
          onClick={copy}
          className="ml-auto rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/80 transition-colors hover:bg-white/10"
          aria-label="Copy install command"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* command body */}
      <div className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed text-white/90">
        {tab.commands.map((c, i) => (
          <div key={i} className="whitespace-pre">
            <span className="select-none text-brand/70">$ </span>
            {c}
          </div>
        ))}
      </div>

      {tab.note && <p className="border-t border-white/10 px-4 py-2.5 text-xs text-white/45">{tab.note}</p>}
    </div>
  )
}
