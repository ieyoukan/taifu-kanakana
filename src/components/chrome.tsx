import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Tornado, Radio, MessageCircleHeart, UserRound, ZapOff, Flame, Wind, ShoppingBasket, BedDouble, Clapperboard, Siren, House, Footprints, UtensilsCrossed, Smile } from 'lucide-react'
import { useStore } from '../lib/store'
import type { Stamp } from '../lib/data'
import { Logo } from './visuals'
import { cn } from './ui'

const TABS = [
  { to: '/home', label: 'ホーム', Icon: Tornado },
  { to: '/feed', label: '実況', Icon: Radio },
  { to: '/talks', label: 'トーク', Icon: MessageCircleHeart },
  { to: '/me', label: 'マイページ', Icon: UserRound },
]

export function BottomNav() {
  const continued = useStore((s) => s.continued)
  return (
    <div className="absolute left-0 right-0 bottom-0 z-30" style={{ paddingBottom: 'var(--sab)' }}>
      <nav className="bg-white/92 backdrop-blur-xl border-t border-line h-[64px] flex items-stretch justify-around px-2 shadow-nav">
        {TABS.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} className="flex-1 flex flex-col items-center justify-center gap-1 relative">
            {({ isActive }) => (
              <>
                <span className={cn('relative transition-colors', isActive ? 'text-love-500' : 'text-muted-2')}>
                  <Icon size={24} strokeWidth={isActive ? 2.4 : 2} />
                  {to === '/talks' && continued.length > 0 && <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-love-500 ring-2 ring-white" />}
                </span>
                <span className={cn('text-[10px] font-bold transition-colors', isActive ? 'text-love-600' : 'text-muted-2')}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export function Toasts() {
  const toasts = useStore((s) => s.toasts)
  const dismiss = useStore((s) => s.dismissToast)
  const nav = useNavigate()
  useEffect(() => {
    if (!toasts.length) return
    const t = setTimeout(() => dismiss(toasts[0].id), 5200)
    return () => clearTimeout(t)
  }, [toasts, dismiss])
  return (
    <div className="absolute left-3 right-3 top-2 z-[60] flex flex-col gap-2 pointer-events-none" style={{ paddingTop: 'var(--sat)' }}>
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            initial={{ y: -80, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -60, opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={() => {
              dismiss(t.id)
              if (t.to) nav(t.to)
            }}
            className="pointer-events-auto text-left w-full rounded-[22px] bg-white/95 backdrop-blur-xl text-ink p-3 pr-4 flex items-start gap-3 shadow-card border border-line"
          >
            <div className="w-10 h-10 rounded-[12px] bg-cream flex items-center justify-center shrink-0 border border-line">
              <Logo size={26} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="font-bold text-[13px] truncate">{t.title}</div>
                <div className="text-[10px] text-muted shrink-0">今</div>
              </div>
              <div className="text-[12px] text-ink-2 leading-snug mt-0.5">{t.body}</div>
            </div>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )
}

const ICONS = { zapOff: ZapOff, flame: Flame, wind: Wind, basket: ShoppingBasket, bed: BedDouble, film: Clapperboard, siren: Siren, home: House, sandal: Footprints, noodles: UtensilsCrossed, smile: Smile }

export function StampIcon({ stamp, size = 22, className }: { stamp: Stamp; size?: number; className?: string }) {
  const Icon = ICONS[stamp.icon]
  const tones = { love: 'bg-love-100 text-love-600', sea: 'bg-sea-100 text-sea-600', sun: 'bg-sun-100 text-sun-600', mist: 'bg-ink/6 text-ink-2' }
  return (
    <span className={cn('inline-flex items-center justify-center rounded-2xl shrink-0', tones[stamp.tone], className)} style={{ width: size * 2, height: size * 2 }}>
      <Icon size={size} strokeWidth={2.2} />
    </span>
  )
}
