import type { ReactNode } from 'react'

export default function ChartCard({
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
    <div className="flex flex-col rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{takeaway}</p>
      <div className="mt-5 h-64 w-full">{children}</div>
      {caveat && <p className="mt-4 text-xs leading-relaxed text-disabled">{caveat}</p>}
      <p className="mt-1 font-mono text-[11px] text-disabled">{source}</p>
    </div>
  )
}
