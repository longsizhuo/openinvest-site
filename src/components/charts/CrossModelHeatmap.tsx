import { Fragment } from 'react'
import { crossModel, palette } from '../../data/experiments'

export function CrossModelHeatmap() {
  return (
    <div className="flex h-full w-full flex-col justify-center">
      <div
        className="grid items-stretch gap-1.5"
        style={{ gridTemplateColumns: `1.5fr repeat(${crossModel.cols.length}, 1fr)` }}
      >
        <div />
        {crossModel.cols.map((c) => (
          <div key={c} className="pb-1 text-center text-xs font-semibold text-muted">
            {c}
          </div>
        ))}

        {crossModel.rows.map((row, ri) => (
          <Fragment key={ri}>
            <div className="flex items-center pr-2 text-right font-mono text-[11px] leading-tight text-muted">
              {row.label}
            </div>
            {row.cells.map((v, ci) => {
              const pass = row.pass[ci]
              return (
                <div
                  key={ci}
                  className="flex flex-col items-center justify-center py-3 text-sm font-bold"
                  style={{
                    background: pass ? palette.win + '1f' : '#F4F5F7',
                    color: pass ? palette.win : palette.muted,
                    border: `1px solid ${pass ? palette.win : palette.grid}`,
                  }}
                >
                  <span>{v}%</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide">
                    {pass ? 'pass' : 'fail'}
                  </span>
                </div>
              )
            })}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default CrossModelHeatmap
