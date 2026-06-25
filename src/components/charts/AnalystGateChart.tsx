import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { analystGate, palette } from '../../data/experiments'

export function AnalystGateChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={[...analystGate.data]} margin={{ top: 16, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid vertical={false} stroke={palette.grid} />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: palette.muted }} axisLine={false} tickLine={false} interval={0} />
        <YAxis tick={{ fontSize: 11, fill: palette.muted }} axisLine={false} tickLine={false} domain={[0, 80]} unit="%" />
        <Tooltip
          cursor={{ fill: 'rgba(0,0,0,0.03)' }}
          contentStyle={{ borderRadius: 0, border: `1px solid ${palette.grid}`, fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar name="Analyst agent" dataKey="analyst" fill={palette.loss} isAnimationActive={false} />
        <Bar name="Naive baseline" dataKey="baseline" fill={palette.baseline} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default AnalystGateChart
