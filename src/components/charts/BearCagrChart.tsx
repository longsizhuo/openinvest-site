import { Bar, BarChart, Cell, LabelList, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { bearCagr, palette } from '../../data/experiments'

export function BearCagrChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={[...bearCagr.data]} margin={{ top: 18, right: 8, bottom: 0, left: -10 }}>
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: palette.muted }} axisLine={false} tickLine={false} interval={0} />
        <YAxis tick={{ fontSize: 11, fill: palette.muted }} axisLine={false} tickLine={false} unit="%" />
        <ReferenceLine y={0} stroke={palette.muted} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={false}>
          {bearCagr.data.map((d, i) => (
            <Cell key={i} fill={d.kind === 'win' ? palette.win : palette.baseline} />
          ))}
          <LabelList
            dataKey="value"
            position="top"
            formatter={(v) => `${v}%`}
            style={{ fill: palette.ink, fontSize: 12, fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default BearCagrChart
