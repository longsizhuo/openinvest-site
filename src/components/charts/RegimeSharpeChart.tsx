import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { palette, regimeSharpe } from '../../data/experiments'

export default function RegimeSharpeChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={[...regimeSharpe.data]} margin={{ top: 16, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid vertical={false} stroke={palette.grid} />
        <XAxis dataKey="regime" tick={{ fontSize: 12, fill: palette.muted }} axisLine={false} tickLine={false} interval={0} />
        <YAxis tick={{ fontSize: 11, fill: palette.muted }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: 'rgba(0,0,0,0.03)' }}
          contentStyle={{ borderRadius: 12, border: `1px solid ${palette.grid}`, fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar name="Committee" dataKey="committee" fill={palette.committee} radius={[5, 5, 0, 0]} isAnimationActive={false} />
        <Bar name="Buy & hold" dataKey="buyhold" fill={palette.baseline} radius={[5, 5, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  )
}
