import { motion } from 'motion/react'
import { useEffect, useId, useMemo, useState } from 'react'
import type { Phase } from '../lib/store'
import { cn } from './ui'

function spiralPath(cx: number, cy: number, rMax: number, offset: number, turns = 1.5, rMin = 0.08) {
  const maxT = turns * Math.PI * 2
  const b = 0.24
  const a = rMax / Math.exp(b * maxT)
  const pts: string[] = []
  const steps = 72
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * maxT
    const r = Math.max(a * Math.exp(b * t), rMax * rMin)
    const x = cx + r * Math.cos(t + offset)
    const y = cy + r * Math.sin(t + offset)
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`)
  }
  return pts.join(' ')
}

export function TyphoonSpiral({ size = 240, className, speed = 18, intensity = 1, tint = '#ffffff' }: { size?: number; className?: string; speed?: number; intensity?: number; tint?: string }) {
  const c = size / 2
  const arms = useMemo(() => [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((o) => spiralPath(c, c, c * 0.95, o)), [c])
  const id = useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id={`cloud-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={tint} stopOpacity={0.55 * intensity} />
          <stop offset="45%" stopColor={tint} stopOpacity={0.22 * intensity} />
          <stop offset="100%" stopColor={tint} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`eye-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0B0F2B" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#0B0F2B" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0B0F2B" stopOpacity="0" />
        </radialGradient>
        <filter id={`blur-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={size * 0.035} />
        </filter>
      </defs>
      <circle cx={c} cy={c} r={c} fill={`url(#cloud-${id})`} />
      <g style={{ transformOrigin: `${c}px ${c}px`, animation: `spin ${speed}s linear infinite reverse` }}>
        {arms.map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke={tint} strokeOpacity={0.5 * intensity} strokeWidth={size * 0.075} strokeLinecap="round" filter={`url(#blur-${id})`} />
            <path d={d} fill="none" stroke={tint} strokeOpacity={0.85 * intensity} strokeWidth={size * 0.012} strokeLinecap="round" />
          </g>
        ))}
      </g>
      <circle cx={c} cy={c} r={size * 0.09} fill={`url(#eye-${id})`} />
    </svg>
  )
}

export function Logo({ size = 72, className, animate }: { size?: number; className?: string; animate?: boolean }) {
  const c = 50
  const uid = useId().replace(/:/g, '')
  const arms = useMemo(() => [0, Math.PI].map((o) => spiralPath(c, c, 46, o, 1.1, 0.42)), [])
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`logo-g-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF5C8A" />
          <stop offset="1" stopColor="#FF84A6" />
        </linearGradient>
        <linearGradient id={`logo-w-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#19B5C9" />
          <stop offset="1" stopColor="#7DDCE6" />
        </linearGradient>
      </defs>
      <g style={animate ? { transformOrigin: '50px 50px', animation: 'spin 14s linear infinite reverse' } : undefined}>
        {arms.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke={`url(#logo-w-${uid})`}
            strokeWidth="6"
            strokeLinecap="round"
            initial={animate ? { pathLength: 0, opacity: 0 } : undefined}
            animate={animate ? { pathLength: 1, opacity: 1 } : undefined}
            transition={{ duration: 1.4, delay: 0.2 + i * 0.15, ease: 'easeOut' }}
          />
        ))}
      </g>
      <motion.path
        d="M50 36c6-7 17-6 20 2 3 9-8 18-20 28-12-10-23-19-20-28 3-8 14-9 20-2z"
        fill={`url(#logo-g-${uid})`}
        initial={animate ? { scale: 0, opacity: 0 } : undefined}
        animate={animate ? { scale: [0, 1.15, 1], opacity: 1 } : undefined}
        transition={{ duration: 0.7, delay: 1.2, ease: 'easeOut' }}
        style={{ transformOrigin: '50px 50px' }}
      />
    </svg>
  )
}

export function Wordmark({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <span className={cn('font-display font-bold tracking-tight text-ink', className)} style={{ fontSize: size, lineHeight: 1 }}>
      taifu<span className="text-love-500">kanakana</span>
    </span>
  )
}

const ISLAND = 'M138 280 L124 268 L116 250 L116 232 L122 214 L130 200 L140 186 L148 172 L156 158 L166 142 L172 126 L166 108 L152 100 L144 90 L154 80 L170 82 L182 92 L192 78 L204 60 L216 42 L228 26 L236 34 L230 56 L220 78 L212 100 L204 122 L198 142 L190 158 L194 170 L206 176 L200 186 L184 184 L176 196 L172 214 L168 232 L160 250 L150 266 Z'

function seeded(n: number) {
  let s = n
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

const SPINE: Array<[number, number]> = [[128, 238], [148, 204], [172, 166], [194, 132], [204, 100], [214, 70], [222, 46]]

function spinePoints(count: number) {
  const rnd = seeded(7)
  const pts: Array<[number, number]> = []
  for (let i = 0; i < count; i++) {
    const t = rnd() * (SPINE.length - 1)
    const i0 = Math.floor(t)
    const f = t - i0
    const p0 = SPINE[i0]
    const p1 = SPINE[Math.min(i0 + 1, SPINE.length - 1)]
    const x = p0[0] + (p1[0] - p0[0]) * f + (rnd() - 0.5) * 16
    const y = p0[1] + (p1[1] - p0[1]) * f + (rnd() - 0.5) * 16
    pts.push([x, y])
  }
  return pts
}

const TYPHOON_POS: Record<Phase, { x: number; y: number; s: number; o: number }> = {
  calm: { x: 330, y: 330, s: 0.6, o: 0 },
  approach: { x: 292, y: 250, s: 0.8, o: 0.9 },
  storm: { x: 170, y: 128, s: 1.25, o: 1 },
  passed: { x: 30, y: 20, s: 0.7, o: 0.45 },
}

export function RadarMap({ phase, className, cityLabel = true }: { phase: Phase; className?: string; cityLabel?: boolean }) {
  const people = useMemo(() => spinePoints(26), [])
  const uid = useId().replace(/:/g, '')
  const tp = TYPHOON_POS[phase]
  const isStorm = phase === 'storm'
  return (
    <svg viewBox="0 0 320 300" className={cn('w-full h-auto', className)}>
      <defs>
        <radialGradient id={`radar-bg-${uid}`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#1E2656" />
          <stop offset="100%" stopColor="#0B0F2B" />
        </radialGradient>
        <linearGradient id={`island-g-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3B4A8C" />
          <stop offset="1" stopColor="#2B356F" />
        </linearGradient>
        <linearGradient id={`sweep-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3FC7D6" stopOpacity="0" />
          <stop offset="1" stopColor="#3FC7D6" stopOpacity="0.35" />
        </linearGradient>
        <clipPath id={`radar-clip-${uid}`}>
          <rect width="320" height="300" rx="24" />
        </clipPath>
      </defs>
      <g clipPath={`url(#radar-clip-${uid})`}>
        <rect width="320" height="300" fill={`url(#radar-bg-${uid})`} />
        {[50, 100, 150, 200].map((r) => (
          <circle key={r} cx="160" cy="150" r={r} fill="none" stroke="#ffffff" strokeOpacity="0.07" />
        ))}
        <line x1="160" y1="0" x2="160" y2="300" stroke="#fff" strokeOpacity="0.05" />
        <line x1="0" y1="150" x2="320" y2="150" stroke="#fff" strokeOpacity="0.05" />
        <g style={{ transformOrigin: '160px 150px', animation: 'spin 6s linear infinite' }}>
          <path d="M160 150 L160 -60 A210 210 0 0 1 285 -20 Z" fill={`url(#sweep-${uid})`} />
        </g>
        <g transform="translate(-45 12) scale(1.2 0.72)">
          <path d={ISLAND} fill={`url(#island-g-${uid})`} stroke="#7DDCE6" strokeOpacity="0.5" strokeWidth="1.2" />
          {(isStorm || phase === 'approach') &&
            people.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={isStorm ? 2.2 : 1.6} fill={isStorm ? '#7DDCE6' : '#9AA1BA'} style={{ animation: `pulseSoft ${1.6 + (i % 5) * 0.4}s ease-in-out infinite`, animationDelay: `${(i % 7) * 0.2}s` }} />
            ))}
        </g>
        <circle cx="125" cy="65" r="5" fill="#35418F" stroke="#7DDCE6" strokeOpacity="0.5" />
        <circle cx="51" cy="172" r="7" fill="#35418F" stroke="#7DDCE6" strokeOpacity="0.5" />
        <circle cx="70" cy="189" r="3.5" fill="#35418F" stroke="#7DDCE6" strokeOpacity="0.5" />
        <circle cx="80" cy="194" r="2.5" fill="#35418F" stroke="#7DDCE6" strokeOpacity="0.5" />
        <circle cx="202" cy="152" r="3" fill="#35418F" stroke="#7DDCE6" strokeOpacity="0.5" />
        {cityLabel && (
          <g fontSize="10" fontWeight="700" fill="#D7DBEA" fontFamily="inherit">
            <text x="92" y="189" textAnchor="end">那覇</text>
            <text x="186" y="82">名護</text>
            <text x="178" y="157">沖縄市</text>
          </g>
        )}
        <g>
          <circle cx="106" cy="185" r="10" fill="#FF5C8A" fillOpacity="0.25" className="animate-ping" style={{ transformOrigin: '106px 185px' }} />
          <circle cx="106" cy="185" r="4.5" fill="#FF5C8A" stroke="#fff" strokeWidth="1.5" />
        </g>
        <g
          style={{
            transform: `translate(${tp.x - 160}px, ${tp.y - 150}px) scale(${tp.s})`,
            transformOrigin: '160px 150px',
            transformBox: 'view-box',
            opacity: tp.o,
            transition: 'transform 1.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 1.8s ease',
          }}
        >
          <g transform="translate(40 30)">
            <TyphoonSpiral size={240} speed={isStorm ? 12 : 20} intensity={isStorm ? 1 : 0.8} />
          </g>
        </g>
      </g>
    </svg>
  )
}

export function PressureGauge({ index, pressure, className }: { index: number; pressure: number; className?: string }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setV(index), 60)
    return () => clearTimeout(t)
  }, [index])
  const uid = useId().replace(/:/g, '')
  const r = 70
  const cx = 90
  const cy = 86
  const start = Math.PI
  const arc = (from: number, to: number) => {
    const x1 = cx + r * Math.cos(from)
    const y1 = cy + r * Math.sin(from)
    const x2 = cx + r * Math.cos(to)
    const y2 = cy + r * Math.sin(to)
    return `M${x1} ${y1} A${r} ${r} 0 ${to - from > Math.PI ? 1 : 0} 1 ${x2} ${y2}`
  }
  return (
    <div className={cn('relative', className)}>
      <svg viewBox="0 0 180 100" className="w-full h-auto">
        <defs>
          <linearGradient id={`gauge-g-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#19B5C9" />
            <stop offset="0.55" stopColor="#FFAD33" />
            <stop offset="1" stopColor="#FF5C8A" />
          </linearGradient>
        </defs>
        <path d={arc(start, Math.PI * 2)} fill="none" stroke="#1C2340" strokeOpacity="0.08" strokeWidth="12" strokeLinecap="round" />
        <motion.path d={arc(start, Math.PI * 2)} fill="none" stroke={`url(#gauge-g-${uid})`} strokeWidth="12" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: v / 100 }} transition={{ duration: 1.4, ease: 'easeOut' }} />
        <g style={{ transform: `rotate(${(v / 100) * 180}deg)`, transformOrigin: `${cx}px ${cy}px`, transformBox: 'view-box', transition: 'transform 1.4s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
          <circle cx={cx - r} cy={cy} r="7" fill="#fff" stroke="#FF5C8A" strokeWidth="4" />
        </g>
        <text x="20" y="98" fontSize="9" fill="#9AA1BA" fontWeight="700">1013hPa</text>
        <text x="160" y="98" fontSize="9" fill="#9AA1BA" fontWeight="700" textAnchor="end">940hPa</text>
      </svg>
      <div className="absolute left-0 right-0 top-[42%] text-center">
        <div className="font-display font-bold text-[36px] leading-none text-ink">
          {v}
          <span className="text-base text-muted">%</span>
        </div>
        <div className="text-[11px] text-muted font-bold mt-1">出会い指数 · {pressure}hPa</div>
      </div>
    </div>
  )
}

export function RainLayer({ strength = 1 }: { strength?: number }) {
  return <div className="absolute inset-0 rain-layer z-20" style={{ opacity: 0.6 * strength }} />
}

export function PhotoBg({ src, overlay = 'from-night-900/40 via-night-900/70 to-night-900', className, position = 'center' }: { src: string; overlay?: string; className?: string; position?: string }) {
  return (
    <div className={cn('absolute inset-0', className)}>
      <img src={src} alt="" className="w-full h-full object-cover" style={{ objectPosition: position }} draggable={false} />
      <div className={cn('absolute inset-0 bg-gradient-to-b', overlay)} />
    </div>
  )
}
