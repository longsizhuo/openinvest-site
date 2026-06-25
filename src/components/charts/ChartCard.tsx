import type { ReactNode } from 'react'

export function ChartCard({
  title,
  takeaway,
  caveat,
  source,
  children,
}: {
  title: string
  takeaway: string
  caveat?: string
  source: string
  children: ReactNode
}) {
  return (
    <div className="glass-card flex flex-col p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{takeaway}</p>
      <div className="mt-5 h-64 w-full">{children}</div>
      {caveat && <p className="mt-4 text-xs leading-relaxed text-disabled">{caveat}</p>}
      <p className="mt-1 font-mono text-[11px] text-disabled">{source}</p>
    </div>
  )
}

export default ChartCard
