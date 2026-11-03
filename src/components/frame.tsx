import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Sun, CloudRainWind, Tornado, Rainbow, ZapOff, RotateCcw, SlidersHorizontal, X, Signal, Wifi, BatteryFull } from 'lucide-react'
import { useStore, type Phase } from '../lib/store'
import { applyPhase, toggleBlackout } from '../lib/demo'
import { cn } from './ui'
import { Logo, Wordmark } from './visuals'

const PHASES: Array<{ id: Phase; label: string; sub: string; Icon: typeof Sun }> = [
  { id: 'calm', label: '晴れ', sub: '通常時', Icon: Sun },
  { id: 'approach', label: '接近', sub: '予報・予約', Icon: CloudRainWind },
  { id: 'storm', label: '直撃', sub: '暴風警報', Icon: Tornado },
  { id: 'passed', label: '通過', sub: '嵐のあと', Icon: Rainbow },
]

function RemoteBody({ onClose, light }: { onClose?: () => void; light?: boolean }) {
  const phase = useStore((s) => s.phase)
  const blackout = useStore((s) => s.blackout)
  const reset = useStore((s) => s.reset)
  const nav = useNavigate()
  const idle = light ? 'bg-ink/5 border-line-2 text-ink-2' : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className={cn('font-display font-bold tracking-widest text-[11px]', light ? 'text-sea-600' : 'text-sea-300')}>DEMO</div>
          <div className="font-bold text-sm">台風の状況を切り替える</div>
        </div>
        {onClose && (
          <button onClick={onClose} className={cn('w-9 h-9 rounded-full flex items-center justify-center', light ? 'bg-ink/5' : 'bg-white/10')}>
            <X size={16} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {PHASES.map(({ id, label, sub, Icon }) => {
          const active = phase === id
          return (
            <button
              key={id}
              onClick={() => {
                applyPhase(id)
                onClose?.()
              }}
              className={cn('rounded-2xl p-2.5 text-left transition-all active:scale-95 border', active ? 'bg-love-500 border-love-400 text-white shadow-glow-love' : idle)}
            >
              <Icon size={18} />
              <div className="font-bold text-[12px] mt-1.5 leading-tight">{label}</div>
              <div className={cn('text-[9px] leading-tight mt-0.5', active ? 'text-white/80' : 'opacity-60')}>{sub}</div>
            </button>
          )
        })}
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <button
          onClick={() => {
            toggleBlackout()
            onClose?.()
          }}
          disabled={phase !== 'storm'}
          className={cn('rounded-2xl p-2.5 flex items-center gap-2 border transition-all active:scale-95 disabled:opacity-35', blackout ? 'bg-sun-400 text-ink border-sun-400' : idle)}
        >
          <ZapOff size={16} />
          <div className="text-left">
            <div className="font-bold text-[12px] leading-tight">{blackout ? '停電中（復旧）' : '停電させる'}</div>
            <div className="text-[9px] opacity-70 leading-tight">ろうそくモード</div>
          </div>
        </button>
        <button
          onClick={() => {
            reset()
            localStorage.removeItem('taifu-kanakana-v2')
            nav('/')
            onClose?.()
          }}
          className={cn('rounded-2xl p-2.5 flex items-center gap-2 border active:scale-95', idle)}
        >
          <RotateCcw size={16} />
          <div className="text-left">
            <div className="font-bold text-[12px] leading-tight">最初から</div>
            <div className="text-[9px] opacity-70 leading-tight">データをリセット</div>
          </div>
        </button>
      </div>
    </div>
  )
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative min-h-dvh w-full bg-night-950 md:flex md:items-center md:justify-center md:gap-10 lg:gap-16 md:p-8">
      <div className="hidden md:block absolute inset-0 overflow-hidden">
        <img src="/img/storm2.jpg" alt="" className="w-full h-full object-cover opacity-50 scale-105" />
        <div className="absolute inset-0 bg-gradient-to-br from-night-950/80 via-night-900/70 to-night-950/95" />
      </div>

      <div className="hidden lg:flex relative z-10 flex-col max-w-[360px] text-white">
        <div className="flex items-center gap-3">
          <Logo size={44} />
          <Wordmark size={30} className="text-white" />
        </div>
        <h1 className="mt-8 text-[40px] leading-[1.15] font-black text-balance">
          台風の日、<br />恋がかなう。
        </h1>
        <p className="mt-4 text-white/70 leading-relaxed text-[15px]">
          暴風警報で外に出られない日に、同じ嵐の下にいる人と匿名でつながる、沖縄発の期間限定マッチングアプリ。
        </p>
        <p className="mt-3 text-love-300 font-bold">嵐が過ぎても、恋は続く。</p>
        <div className="mt-10 text-[11px] text-white/50 leading-relaxed">
          これは事業案のモックです。スマホで開くと全画面で動きます。PCでは右のリモコンで台風の状況を切り替えられます。
        </div>
      </div>

      <div className="relative z-10 w-full h-dvh md:w-[390px] md:h-[844px] md:max-h-[calc(100dvh-64px)] md:rounded-[54px] md:border-[10px] md:border-[#15172a] md:shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] overflow-hidden bg-cream md:ring-1 md:ring-white/10">
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-3 w-[110px] h-[30px] rounded-full bg-[#0a0b14] z-[70]" />
        <div className="hidden md:flex absolute top-0 inset-x-0 h-[46px] z-[69] items-center justify-between px-7 pt-2 text-[14px] font-bold pointer-events-none mix-blend-difference text-white">
          <span className="font-display">21:04</span>
          <span className="flex items-center gap-1.5">
            <Signal size={15} />
            <Wifi size={15} />
            <BatteryFull size={18} />
          </span>
        </div>
        <div className="hidden md:block absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[5px] rounded-full bg-current opacity-40 z-[69] mix-blend-difference text-white pointer-events-none" />
        {children}
        <button
          onClick={() => setOpen(true)}
          aria-label="デモ操作"
          className="md:hidden absolute right-0 top-[14%] z-[65] h-12 w-6 rounded-l-xl bg-ink/60 backdrop-blur text-white/80 flex items-center justify-center"
        >
          <SlidersHorizontal size={14} />
        </button>
        <AnimatePresence>
          {open && (
            <>
              <motion.div className="md:hidden absolute inset-0 z-[66] bg-ink/45" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
              <motion.div
                className="md:hidden absolute left-0 right-0 bottom-0 z-[67] rounded-t-[28px] bg-white text-ink p-4 shadow-card"
                style={{ paddingBottom: 'calc(var(--sab) + 20px)' }}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              >
                <div className="mx-auto w-10 h-1.5 rounded-full bg-line-2 mb-4" />
                <RemoteBody light onClose={() => setOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="hidden md:block relative z-10 w-[300px] text-white">
        <div className="glass-dark rounded-[28px] p-4 shadow-card">
          <RemoteBody />
        </div>
        <div className="mt-3 text-[11px] text-white/50 leading-relaxed px-1">
          発表の流れ: 晴れ → 接近（通知・予約）→ 直撃でマッチング → 停電 → 通過してデートへ
        </div>
      </div>
    </div>
  )
}
