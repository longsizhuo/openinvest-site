import { motion } from 'motion/react'

// Flat technical diagram (light theme) of the 4-role committee:
// Macro / Quant / Risk -> Round-2 cross-challenge -> CIO -> verdict.
// Style per spec: rounded rects, 2px strokes, pastel fills, thin connectors,
// a small token dot travelling each connector to show data flow.

const INK = '#1F2937'
const MUTED = '#949CA8'
const LINE = '#C5CBD3'

function Node({
  x,
  y,
  w = 190,
  h = 66,
  fill,
  stroke,
  title,
  sub,
}: {
  x: number
  y: number
  w?: number
  h?: number
  fill: string
  stroke: string
  title: string
  sub: string
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={13} fill={fill} stroke={stroke} strokeWidth={2} />
      <text x={x + 16} y={y + 27} fontSize={15} fontWeight={700} fill={INK}>
        {title}
      </text>
      <text x={x + 16} y={y + 47} fontSize={11.5} fill={MUTED}>
        {sub}
      </text>
    </g>
  )
}

function Token({ x1, y1, x2, y2, delay }: { x1: number; y1: number; x2: number; y2: number; delay: number }) {
  return (
    <motion.circle
      r={4}
      fill="#2E6FF2"
      initial={{ cx: x1, cy: y1, opacity: 0 }}
      animate={{ cx: [x1, x2], cy: [y1, y2], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay, repeatDelay: 0.6 }}
    />
  )
}

export default function CommitteeFlow() {
  return (
    <svg viewBox="0 0 920 350" className="h-auto w-full" role="img" aria-label="Four-role committee flow diagram">
      <defs>
        <marker id="arrow" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={LINE} />
        </marker>
        <marker id="arrowDash" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#8468E0" />
        </marker>
      </defs>

      {/* connectors: inputs -> CIO */}
      <line x1={220} y1={57} x2={430} y2={168} stroke={LINE} strokeWidth={2} markerEnd="url(#arrow)" />
      <line x1={220} y1={180} x2={430} y2={180} stroke={LINE} strokeWidth={2} markerEnd="url(#arrow)" />
      <line x1={220} y1={303} x2={430} y2={192} stroke={LINE} strokeWidth={2} markerEnd="url(#arrow)" />
      {/* CIO -> verdict */}
      <line x1={620} y1={180} x2={700} y2={180} stroke={LINE} strokeWidth={2} markerEnd="url(#arrow)" />
      {/* Round 2: Quant <-> Risk cross-challenge (dashed, both ends) */}
      <line
        x1={125}
        y1={213}
        x2={125}
        y2={270}
        stroke="#8468E0"
        strokeWidth={2}
        strokeDasharray="5 4"
        markerStart="url(#arrowDash)"
        markerEnd="url(#arrowDash)"
      />
      <text x={140} y={245} fontSize={11} fontWeight={600} fill="#8468E0">
        Round 2
      </text>

      {/* travelling tokens */}
      <Token x1={220} y1={57} x2={430} y2={168} delay={0} />
      <Token x1={220} y1={180} x2={430} y2={180} delay={0.5} />
      <Token x1={220} y1={303} x2={430} y2={192} delay={1} />

      {/* input nodes */}
      <Node x={30} y={24} fill="#E9F0FF" stroke="#2E6FF2" title="Macro Strategist" sub="VIX · rates · FX" />
      <Node x={30} y={147} fill="#E9F0FF" stroke="#2E6FF2" title="Quant Analyst" sub="technicals · blind to holdings" />
      <Node x={30} y={270} fill="#DFF4E9" stroke="#16A062" title="Risk Officer" sub="concentration · tail risk" />

      {/* CIO (glowing) */}
      <motion.rect
        x={430}
        y={140}
        width={190}
        height={80}
        rx={14}
        fill="none"
        stroke="#8468E0"
        strokeWidth={2}
        animate={{ opacity: [0.25, 0.7, 0.25] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <rect x={430} y={140} width={190} height={80} rx={14} fill="#EEE9FF" stroke="#8468E0" strokeWidth={2} />
      <text x={446} y={176} fontSize={18} fontWeight={700} fill={INK}>
        CIO
      </text>
      <text x={446} y={198} fontSize={11.5} fill={MUTED}>
        synthesizes · confidence
      </text>

      {/* verdict pill */}
      <rect x={700} y={158} width={196} height={46} rx={23} fill="#DFF4E9" stroke="#16A062" strokeWidth={2} />
      <text x={798} y={186} fontSize={14} fontWeight={700} fill="#16A062" textAnchor="middle">
        BUY · HOLD · SELL
      </text>
    </svg>
  )
}
