import { useId } from 'react'
import { BG_COLORS, BODY_COLORS, type AvatarConfig } from '../lib/avatar'

const INK = '#3A2E4F'
const MOCHI = 'M50 27 C69 27 82 41 82 60 C82 78 68 88 50 88 C32 88 18 78 18 60 C18 41 31 27 50 27 Z'

function heart(cx: number, cy: number, s: number) {
  return `M${cx} ${cy + s * 0.9} C${cx - s * 1.5} ${cy - s * 0.1} ${cx - s * 0.75} ${cy - s * 1.35} ${cx} ${cy - s * 0.45} C${cx + s * 0.75} ${cy - s * 1.35} ${cx + s * 1.5} ${cy - s * 0.1} ${cx} ${cy + s * 0.9} Z`
}

function star(cx: number, cy: number, r1: number, r2: number) {
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? r1 : r2
    const a = (Math.PI / 5) * i - Math.PI / 2
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`)
  }
  return `M${pts.join(' L')} Z`
}

function twinkle(cx: number, cy: number, r: number) {
  return `M${cx} ${cy - r} Q${cx} ${cy} ${cx + r} ${cy} Q${cx} ${cy} ${cx} ${cy + r} Q${cx} ${cy} ${cx - r} ${cy} Q${cx} ${cy} ${cx} ${cy - r} Z`
}

function bolt(x: number, y: number, s = 1) {
  return `M${x} ${y} l${-5 * s} ${9 * s} h${4 * s} l${-3 * s} ${9 * s} l${9 * s} ${-12 * s} h${-4.5 * s} l${3.5 * s} ${-6 * s} z`
}

function Eyes({ kind }: { kind: string }) {
  const L = 40
  const R = 60
  const Y = 57
  const dot = (x: number) => (
    <g key={x}>
      <ellipse cx={x} cy={Y} rx={3.8} ry={4.6} fill={INK} />
      <circle cx={x + 1.4} cy={Y - 1.8} r={1.4} fill="#fff" />
    </g>
  )
  const arc = (x: number, up = true) => <path key={x} d={up ? `M${x - 4.6} ${Y + 1} Q${x} ${Y - 4.8} ${x + 4.6} ${Y + 1}` : `M${x - 4.6} ${Y - 1} Q${x} ${Y + 3.6} ${x + 4.6} ${Y - 1}`} stroke={INK} strokeWidth={2.8} strokeLinecap="round" fill="none" />
  switch (kind) {
    case 'sparkle':
      return (
        <>
          {[L, R].map((x) => (
            <g key={x}>
              <ellipse cx={x} cy={Y} rx={4.7} ry={5.7} fill={INK} />
              <circle cx={x + 1.8} cy={Y - 2.2} r={2} fill="#fff" />
              <circle cx={x - 1.5} cy={Y + 2.3} r={1} fill="#fff" />
            </g>
          ))}
        </>
      )
    case 'happy':
      return <>{[L, R].map((x) => arc(x))}</>
    case 'sleepy':
      return <>{[L, R].map((x) => arc(x, false))}</>
    case 'wink':
      return (
        <>
          {dot(L)}
          {arc(R)}
        </>
      )
    case 'heart':
      return (
        <>
          {[L, R].map((x) => (
            <g key={x}>
              <path d={heart(x, Y, 4.6)} fill="#FF4D7E" />
              <circle cx={x - 1.8} cy={Y - 2.2} r={1.1} fill="#fff" opacity={0.9} />
            </g>
          ))}
        </>
      )
    case 'star':
      return (
        <>
          {[L, R].map((x) => (
            <path key={x} d={star(x, Y, 5.6, 2.6)} fill="#FFC93C" stroke="#E8921A" strokeWidth={1} strokeLinejoin="round" />
          ))}
        </>
      )
    default:
      return <>{[L, R].map((x) => dot(x))}</>
  }
}

function Mouth({ kind }: { kind: string }) {
  const s = { stroke: INK, strokeWidth: 2.4, strokeLinecap: 'round' as const, fill: 'none' }
  switch (kind) {
    case 'open':
      return (
        <g>
          <path d="M45 64.5 Q50 64 55 64.5 Q54.6 72 50 72 Q45.4 72 45 64.5 Z" fill={INK} />
          <ellipse cx={50} cy={69.8} rx={3} ry={1.8} fill="#FF7B9C" />
        </g>
      )
    case 'cat':
      return <path d="M44.6 65 Q47.3 68.6 50 65 Q52.7 68.6 55.4 65" {...s} />
    case 'o':
      return <ellipse cx={50} cy={67} rx={2.6} ry={3.1} fill={INK} />
    case 'tongue':
      return (
        <g>
          <path d="M48.3 67 Q50 72 52.6 67.3 Z" fill="#FF7B9C" />
          <path d="M45.5 65 Q50 69.2 54.5 65" {...s} />
        </g>
      )
    default:
      return <path d="M45.5 65 Q50 69.6 54.5 65" {...s} />
  }
}

function HeadBehind({ kind }: { kind: string }) {
  if (kind !== 'shisa') return null
  const curls: Array<[number, number, number]> = []
  for (let i = 0; i <= 8; i++) {
    const a = Math.PI * (1.05 + (i / 8) * 0.9)
    curls.push([50 + 34 * Math.cos(a), 58 + 32 * Math.sin(a), i % 2 ? 8 : 9])
  }
  return (
    <g>
      {curls.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill="#FF9A3C" />
          <path d={`M${x - r * 0.45} ${y} a${r * 0.45} ${r * 0.45} 0 1 1 ${r * 0.45} ${r * 0.45}`} stroke="#E0701A" strokeWidth={1.6} fill="none" strokeLinecap="round" />
        </g>
      ))}
    </g>
  )
}

function HeadFront({ kind }: { kind: string }) {
  switch (kind) {
    case 'sprout':
      return (
        <g>
          <path d="M50 28 Q50 21 51 17" stroke="#3FAE5B" strokeWidth={2.6} strokeLinecap="round" fill="none" />
          <path d="M51 18 C44 11 37 14 37 19 C42 22 48 21 51 18 Z" fill="#6BD17E" />
          <path d="M51 18 C56 9 65 10 66 15 C61 20 55 21 51 18 Z" fill="#4FC06A" />
        </g>
      )
    case 'ribbon':
      return (
        <g transform="rotate(18 67 30)">
          <path d="M67 31 C58 23 55 35 60 38 C62.5 38.5 65 35 67 31 Z" fill="#FF5C8A" />
          <path d="M67 31 C76 23 79 35 74 38 C71.5 38.5 69 35 67 31 Z" fill="#FF5C8A" />
          <circle cx={67} cy={31} r={2.8} fill="#E9456F" />
        </g>
      )
    case 'hibiscus': {
      const cx = 32
      const cy = 32
      return (
        <g>
          <path d={`M${cx + 2} ${cy + 3} C${cx + 12} ${cy + 2} ${cx + 14} ${cy + 10} ${cx + 9} ${cy + 12} C${cx + 6} ${cy + 8} ${cx + 4} ${cy + 6} ${cx + 2} ${cy + 3} Z`} fill="#3FAE5B" />
          {[0, 1, 2, 3, 4].map((i) => {
            const a = (Math.PI * 2 * i) / 5 - Math.PI / 2
            return <circle key={i} cx={cx + 5 * Math.cos(a)} cy={cy + 5 * Math.sin(a)} r={4.8} fill="#FF4D6A" />
          })}
          <circle cx={cx} cy={cy} r={2.6} fill="#FFD25C" />
          <path d={`M${cx} ${cy} L${cx + 6} ${cy - 6}`} stroke="#FFD25C" strokeWidth={1.4} strokeLinecap="round" />
        </g>
      )
    }
    case 'cap':
      return (
        <g>
          <path d="M23 43 C22 21 78 21 77 43 Q50 36 23 43 Z" fill="#2BB5C6" />
          <path d="M64 40.5 Q84 37 89 43.5 Q78 47.5 63 44.5 Z" fill="#1E93A3" />
          <circle cx={50} cy={23.5} r={2.3} fill="#1E93A3" />
          <path d="M37 31 Q50 26 63 31" stroke="#fff" strokeOpacity={0.5} strokeWidth={2} fill="none" strokeLinecap="round" />
        </g>
      )
    case 'hood':
      return (
        <g>
          <path d="M50 17 C75 17 88 38 87 62 L82 63 C82 41 69 27 50 27 C31 27 18 41 18 63 L13 62 C12 38 25 17 50 17 Z" fill="#FFD23F" stroke="#E8A91A" strokeWidth={1.4} />
          <path d="M50 17 C64 17 74 23 80 33" stroke="#fff" strokeOpacity={0.55} strokeWidth={2.4} fill="none" strokeLinecap="round" />
          <circle cx={19} cy={68} r={2} fill="#E8A91A" />
          <circle cx={81} cy={68} r={2} fill="#E8A91A" />
        </g>
      )
    case 'crown':
      return (
        <g>
          <path d="M35 28 L37 12 L44 20 L50 8 L56 20 L63 12 L65 28 Q50 24 35 28 Z" fill="#FFC93C" stroke="#E8921A" strokeWidth={1.4} strokeLinejoin="round" />
          <circle cx={50} cy={8} r={2.2} fill="#FF4D7E" />
          <circle cx={37} cy={12} r={1.8} fill="#4BB3F5" />
          <circle cx={63} cy={12} r={1.8} fill="#4BB3F5" />
          <circle cx={50} cy={22} r={2} fill="#FF4D7E" />
        </g>
      )
    case 'jinbei':
      return (
        <g>
          <path d="M50 23 L56 9 L61 24 Z" fill="#2F6FD6" />
          <path d="M22 45 C21 21 79 21 78 45 Q50 38 22 45 Z" fill="#2F6FD6" />
          {[
            [32, 34],
            [42, 28],
            [56, 29],
            [66, 35],
            [38, 39],
            [50, 35],
            [62, 40],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={1.6} fill="#fff" />
          ))}
          <path d="M22 45 Q50 38 78 45" stroke="#fff" strokeWidth={2} fill="none" />
        </g>
      )
    default:
      return null
  }
}

function Item({ kind, hand, shade }: { kind: string; hand: string; shade: string }) {
  if (kind === 'none') return null
  const Hand = <circle cx={78} cy={73} r={5} fill={hand} stroke={shade} strokeOpacity={0.5} strokeWidth={1} />
  switch (kind) {
    case 'umbrella':
      return (
        <g>
          <line x1={78} y1={74} x2={80} y2={44} stroke="#7A6A8E" strokeWidth={1.8} strokeLinecap="round" />
          <path d="M64 45 Q80 28 96 45 Q92 42 88 45 Q84 42 80 45 Q76 42 72 45 Q68 42 64 45 Z" fill="#FF5C8A" />
          <path d="M80 31 Q86 36 88 45 Q84 42 80 45 Z" fill="#FFD23F" />
          <path d="M80 31 Q72 36 72 45 Q68 42 64 45 Q70 34 80 31 Z" fill="#FF84A6" />
          {Hand}
        </g>
      )
    case 'candle':
      return (
        <g>
          <rect x={74} y={60} width={8} height={15} rx={2} fill="#FFF4DC" stroke="#E8C99A" strokeWidth={1} />
          <line x1={78} y1={60} x2={78} y2={57.5} stroke={INK} strokeWidth={1} />
          <g className="maru-flicker">
            <path d="M78 47 C82 52 82 56 78 58 C74 56 74 52 78 47 Z" fill="#FFB020" />
            <path d="M78 51 C80 54 80 56 78 57 C76 56 76 54 78 51 Z" fill="#FFE27A" />
          </g>
          <circle cx={78} cy={53} r={9} fill="#FFC85A" opacity={0.18} />
          {Hand}
        </g>
      )
    case 'sanpin':
      return (
        <g>
          <rect x={75} y={54} width={6} height={4} rx={1} fill="#2E9E5B" />
          <rect x={73} y={57} width={10} height={19} rx={3} fill="#A8E6B8" />
          <rect x={73} y={62} width={10} height={7} fill="#fff" opacity={0.85} />
          <circle cx={78} cy={65.5} r={1.8} fill="#2E9E5B" />
          {Hand}
        </g>
      )
    case 'pork':
      return (
        <g>
          <rect x={70.5} y={62} width={15} height={12} rx={2.5} fill="#2F5FD0" />
          <rect x={70.5} y={65.5} width={15} height={5} fill="#FFD23F" />
          <ellipse cx={78} cy={62} rx={7.5} ry={1.8} fill="#C9D3E8" />
          {Hand}
        </g>
      )
    case 'balloon':
      return (
        <g>
          <path d="M78 73 Q84 60 84 46" stroke="#9A8FB0" strokeWidth={1.2} fill="none" />
          <path d={heart(85, 37, 8)} fill="#FF4D7E" />
          <ellipse cx={81} cy={33} rx={2} ry={3} fill="#fff" opacity={0.6} transform="rotate(-30 81 33)" />
          {Hand}
        </g>
      )
    default:
      return null
  }
}

function Bg({ kind, id, url }: { kind: string; id: (k: string) => string; url: (k: string) => string }) {
  if (BG_COLORS[kind]) return <rect width={100} height={100} fill={BG_COLORS[kind]} />
  switch (kind) {
    case 'umi':
      return (
        <g>
          <defs>
            <linearGradient id={id('sky')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#BDEBFF" />
              <stop offset="1" stopColor="#EFFBFF" />
            </linearGradient>
          </defs>
          <rect width={100} height={100} fill={url('sky')} />
          <circle cx={80} cy={22} r={9} fill="#FFE27A" />
          <path d="M0 72 Q12.5 66 25 72 T50 72 T75 72 T100 72 V100 H0 Z" fill="#7DDCE6" />
          <path d="M0 82 Q12.5 76 25 82 T50 82 T75 82 T100 82 V100 H0 Z" fill="#3FC7D6" />
        </g>
      )
    case 'yuyake':
      return (
        <g>
          <defs>
            <linearGradient id={id('yu')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#C9A8FF" />
              <stop offset="0.5" stopColor="#FFB0C8" />
              <stop offset="1" stopColor="#FFE0A8" />
            </linearGradient>
          </defs>
          <rect width={100} height={100} fill={url('yu')} />
          <circle cx={50} cy={84} r={22} fill="#FFD27A" opacity={0.7} />
        </g>
      )
    case 'stars':
      return (
        <g>
          <defs>
            <linearGradient id={id('night')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2B2463" />
              <stop offset="1" stopColor="#5A4AB0" />
            </linearGradient>
          </defs>
          <rect width={100} height={100} fill={url('night')} />
          <path d="M82 13 a9 9 0 1 0 6 15 a7 7 0 1 1 -6 -15 Z" fill="#FFE27A" />
          {[
            [14, 18, 1.6],
            [30, 10, 1.1],
            [12, 46, 1.2],
            [88, 46, 1.4],
            [22, 78, 1],
            [84, 80, 1.2],
            [64, 10, 1],
          ].map(([x, y, r], i) => (
            <path key={i} d={twinkle(x, y, r * 2.6)} fill="#fff" className="maru-twinkle" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </g>
      )
    case 'storm':
      return (
        <g>
          <defs>
            <linearGradient id={id('st')} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#1B2350" />
              <stop offset="1" stopColor="#3B4A9C" />
            </linearGradient>
          </defs>
          <rect width={100} height={100} fill={url('st')} />
          <g className="maru-spin-slow" opacity={0.28}>
            <path d="M50 8 A42 42 0 0 1 92 50" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" />
            <path d="M50 92 A42 42 0 0 1 8 50" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" />
            <path d="M22 28 A34 34 0 0 1 60 17" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" />
            <path d="M78 72 A34 34 0 0 1 40 83" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" />
          </g>
          {[12, 30, 70, 88, 20, 80].map((x, i) => (
            <line key={i} x1={x} y1={i < 4 ? 10 + i * 6 : 60} x2={x - 4} y2={(i < 4 ? 10 + i * 6 : 60) + 10} stroke="#BFE9FF" strokeOpacity={0.5} strokeWidth={1.2} strokeLinecap="round" />
          ))}
        </g>
      )
    default:
      return <rect width={100} height={100} fill={BG_COLORS.cream} />
  }
}

function Fx({ kind, id, url }: { kind: string; id: (k: string) => string; url: (k: string) => string }) {
  switch (kind) {
    case 'sparkle':
      return (
        <g>
          {[
            [16, 26, 9],
            [84, 20, 6.5],
            [88, 62, 7],
            [12, 68, 5],
          ].map(([x, y, r], i) => (
            <path key={i} d={twinkle(x, y, r)} fill="#FFD84D" stroke="#E8921A" strokeWidth={1} className="maru-twinkle" style={{ animationDelay: `${i * 0.45}s` }} />
          ))}
        </g>
      )
    case 'hearts':
      return (
        <g>
          {[
            [13, 62, 5.2],
            [87, 56, 4.4],
            [18, 34, 3.8],
            [84, 30, 4.6],
          ].map(([x, y, s], i) => (
            <path key={i} d={heart(x, y, s)} fill="#FF4D7E" stroke="#fff" strokeWidth={1.2} className="maru-rise" style={{ animationDelay: `${i * 0.6}s` }} />
          ))}
        </g>
      )
    case 'ring':
      return (
        <g>
          <defs>
            <linearGradient id={id('ring')} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FF5C8A" />
              <stop offset="0.25" stopColor="#FFC93C" />
              <stop offset="0.5" stopColor="#3FCF9A" />
              <stop offset="0.75" stopColor="#4BB3F5" />
              <stop offset="1" stopColor="#9C7BFF" />
            </linearGradient>
          </defs>
          <g className="maru-spin">
            <circle cx={50} cy={50} r={47} fill="none" stroke={url('ring')} strokeWidth={5} />
          </g>
        </g>
      )
    case 'thunder':
      return (
        <g>
          <path d={bolt(17, 14, 1.6)} fill="#FFE14D" stroke="#9A5A00" strokeWidth={1.4} strokeLinejoin="round" className="maru-flash" />
          <path d={bolt(90, 24, 1.3)} fill="#FFE14D" stroke="#9A5A00" strokeWidth={1.4} strokeLinejoin="round" className="maru-flash" style={{ animationDelay: '0.7s' }} />
        </g>
      )
    default:
      return null
  }
}

export function MaruAvatar({ config, size = 48, animated = false, className }: { config: AvatarConfig; size?: number; animated?: boolean; className?: string }) {
  const raw = useId().replace(/:/g, '')
  const id = (k: string) => `${k}-${raw}`
  const url = (k: string) => `url(#${id(k)})`
  const stops = BODY_COLORS[config.body] ?? BODY_COLORS.pink
  const shade = stops[stops.length - 1]
  const hand = stops[Math.min(1, stops.length - 1)]
  const isGold = config.body === 'gold'
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      <defs>
        <linearGradient id={id('body')} x1="0.2" y1="0" x2="0.5" y2="1">
          {stops.map((c, i) => (
            <stop key={i} offset={stops.length === 1 ? 0 : i / (stops.length - 1)} stopColor={c} />
          ))}
        </linearGradient>
        <clipPath id={id('clip')}>
          <circle cx={50} cy={50} r={50} />
        </clipPath>
      </defs>
      <g clipPath={url('clip')}>
        <Bg kind={config.bg} id={id} url={url} />
        <g transform="translate(-5 -5.5) scale(1.1)">
        <g className={animated ? 'maru-bob' : undefined}>
          <ellipse cx={50} cy={92} rx={24} ry={3.6} fill="#1C2340" opacity={0.12} />
          <HeadBehind kind={config.head} />
          <ellipse cx={38} cy={87} rx={6.5} ry={3.8} fill={shade} />
          <ellipse cx={62} cy={87} rx={6.5} ry={3.8} fill={shade} />
          <path d={MOCHI} fill={url('body')} />
          <ellipse cx={35} cy={40} rx={7.5} ry={4.6} transform="rotate(-32 35 40)" fill="#fff" opacity={0.5} />
          <circle cx={44.5} cy={34.5} r={1.7} fill="#fff" opacity={0.6} />
          {isGold && <path d={twinkle(68, 44, 4)} fill="#fff" className="maru-twinkle" />}
          <ellipse cx={31.5} cy={64.5} rx={5} ry={3.2} fill="#FF6F9A" opacity={0.42} />
          <ellipse cx={68.5} cy={64.5} rx={5} ry={3.2} fill="#FF6F9A" opacity={0.42} />
          <g className={animated ? 'maru-blink' : undefined}>
            <Eyes kind={config.eyes} />
          </g>
          <Mouth kind={config.mouth} />
          <HeadFront kind={config.head} />
          <Item kind={config.item} hand={hand} shade={shade} />
        </g>
        </g>
        <Fx kind={config.fx} id={id} url={url} />
      </g>
    </svg>
  )
}
