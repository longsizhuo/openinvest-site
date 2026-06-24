import { useState } from 'react'
import { INSTALL_TABS } from '../data/site'
import { useI18n } from '../i18n'

export default function InstallTabs() {
  const { t } = useI18n()
  const [active, setActive] = useState(INSTALL_TABS[0].id)
  const [copied, setCopied] = useState(false)
  const tab = INSTALL_TABS.find((x) => x.id === active) ?? INSTALL_TABS[0]
  const note = (t.install as Record<string, string>)[tab.id]

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
    <div className="glass-card w-full max-w-2xl overflow-hidden text-left">
      {/* tab bar + copy */}
      <div className="flex flex-wrap items-center gap-1 border-b border-ink/10 px-2 py-2" role="tablist" aria-label="Install method">
        {INSTALL_TABS.map((x) => {
          const on = x.id === active
          return (
            <button
              key={x.id}
              role="tab"
              aria-selected={on}
              onClick={() => {
                setActive(x.id)
                setCopied(false)
              }}
              className={
                'px-3 py-1.5 text-sm font-medium transition-colors ' +
                (on ? 'bg-brand text-white' : 'text-ink/55 hover:bg-ink/5 hover:text-ink')
              }
            >
              {x.label}
            </button>
          )
        })}
        <button
          onClick={copy}
          className="ml-auto border border-ink/15 bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink/70 transition-colors hover:bg-ink/10"
          aria-label="Copy install command"
        >
          {copied ? t.install.copied : t.install.copy}
        </button>
      </div>

      {/* command body */}
      <div className="overflow-x-auto bg-ink/[0.06] px-4 py-4 font-mono text-[13px] leading-relaxed text-ink">
        {tab.commands.map((c, i) => (
          <div key={i} className="whitespace-pre">
            <span className="select-none text-brand">$ </span>
            {c}
          </div>
        ))}
      </div>

      {note && <p className="px-4 py-2.5 text-xs text-ink/55">{note}</p>}
    </div>
  )
}
