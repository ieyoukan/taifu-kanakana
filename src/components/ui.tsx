import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { presetFor, type AvatarConfig } from '../lib/avatar'
import { MaruAvatar } from './MaruAvatar'

export function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ')
}

export type Tone = 'love' | 'sea' | 'sun' | 'mist'

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'sun' | 'sea' | 'danger' | 'dark' | 'white'
  size?: 'sm' | 'md' | 'lg'
  full?: boolean
  icon?: ReactNode
}

export function Button({ variant = 'primary', size = 'md', full, icon, className, children, ...rest }: BtnProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-bold rounded-full transition-all active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none select-none'
  const sizes = { sm: 'h-9 px-4 text-sm', md: 'h-12 px-6 text-[15px]', lg: 'h-14 px-8 text-base' }
  const variants = {
    primary: 'text-white bg-gradient-to-r from-love-500 to-love-400 shadow-glow-love',
    secondary: 'text-ink bg-ink/6 border border-line-2',
    ghost: 'text-muted',
    sun: 'text-ink bg-gradient-to-r from-sun-400 to-sun-300',
    sea: 'text-white bg-gradient-to-r from-sea-500 to-sea-400 shadow-glow-sea',
    danger: 'text-love-600 bg-love-100 border border-love-200',
    dark: 'text-white bg-ink',
    white: 'text-ink bg-white shadow-card',
  }
  return (
    <button className={cn(base, sizes[size], variants[variant], full && 'w-full', className)} {...rest}>
      {icon}
      {children}
    </button>
  )
}

export function Chip({ active, onClick, children, tone = 'love', className }: { active?: boolean; onClick?: () => void; children: ReactNode; tone?: Tone; className?: string }) {
  const tones = {
    love: 'bg-love-500 text-white border-love-500',
    sea: 'bg-sea-500 text-white border-sea-500',
    sun: 'bg-sun-400 text-ink border-sun-400',
    mist: 'bg-ink text-white border-ink',
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-9 px-4 rounded-full text-sm font-bold border transition-all active:scale-95 whitespace-nowrap',
        active ? tones[tone] : 'border-line-2 bg-white text-ink-2',
        !onClick && 'pointer-events-none',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function Tag({ children, tone = 'mist', className, dark }: { children: ReactNode; tone?: Tone | 'night'; className?: string; dark?: boolean }) {
  const light = {
    love: 'bg-love-100 text-love-600 border-love-200',
    sea: 'bg-sea-100 text-sea-600 border-sea-200',
    sun: 'bg-sun-100 text-sun-600 border-sun-200',
    mist: 'bg-ink/5 text-ink-2 border-line-2',
    night: 'bg-ink text-white border-ink',
  }
  const onDark = {
    love: 'bg-love-500/20 text-love-300 border-love-500/30',
    sea: 'bg-sea-500/20 text-sea-300 border-sea-500/30',
    sun: 'bg-sun-500/20 text-sun-300 border-sun-500/30',
    mist: 'bg-white/10 text-white border-white/15',
    night: 'bg-night-900/70 text-white border-white/10',
  }
  return <span className={cn('inline-flex items-center gap-1 h-6 px-2.5 rounded-full text-[11px] font-bold border whitespace-nowrap', dark ? onDark[tone] : light[tone], className)}>{children}</span>
}

export function Avatar({ seed, config, size = 48, ring, className, glow, animated }: { seed?: string; config?: AvatarConfig; size?: number; ring?: Tone | 'white'; className?: string; glow?: boolean; animated?: boolean }) {
  const rings = { love: 'ring-love-500', sea: 'ring-sea-500', sun: 'ring-sun-400', mist: 'ring-line-2', white: 'ring-white' }
  const cfg = config ?? presetFor(seed ?? 'guest')
  return (
    <div className={cn('rounded-full shrink-0', ring && `ring-[3px] ${rings[ring]}`, glow && 'shadow-glow-love', className)} style={{ width: size, height: size }}>
      <MaruAvatar config={cfg} size={size} animated={animated} className="block" />
    </div>
  )
}

export function TopBar({ title, back, right, transparent, onBack, dark }: { title?: ReactNode; back?: boolean; right?: ReactNode; transparent?: boolean; onBack?: () => void; dark?: boolean }) {
  const nav = useNavigate()
  return (
    <div className={cn('sticky top-0 z-30 flex items-center h-14 px-2 gap-1 shrink-0', !transparent && (dark ? 'glass-dark text-white' : 'glass text-ink'))} style={{ paddingTop: 'var(--sat)', height: 'calc(56px + var(--sat))' }}>
      {back ? (
        <button onClick={onBack ?? (() => nav(-1))} className={cn('w-11 h-11 rounded-full flex items-center justify-center active:scale-95', dark ? 'text-white' : 'text-ink')}>
          <ChevronLeft size={26} />
        </button>
      ) : (
        <div className="w-3" />
      )}
      <div className="flex-1 min-w-0 font-bold text-[15px] truncate">{title}</div>
      <div className="flex items-center gap-1 pr-1">{right}</div>
    </div>
  )
}

export function Sheet({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: ReactNode; title?: string }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="absolute inset-0 z-40 bg-ink/45" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="absolute left-0 right-0 bottom-0 z-50 rounded-t-[28px] bg-white text-ink p-5 shadow-card"
            style={{ paddingBottom: 'calc(var(--sab) + 24px)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
          >
            <div className="mx-auto w-10 h-1.5 rounded-full bg-line-2 mb-4" />
            {title && (
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-base">{title}</div>
                <button onClick={onClose} className="w-9 h-9 rounded-full bg-ink/5 flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function Card({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={cn('rounded-[24px] bg-white border border-line p-4 shadow-soft', onClick && 'cursor-pointer active:scale-[0.99] transition-transform', className)}>
      {children}
    </div>
  )
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-end justify-between px-1 mb-2 mt-6">
      <div className="font-black text-[16px] text-ink">{children}</div>
      {right && <div className="text-xs text-muted font-bold">{right}</div>}
    </div>
  )
}

export function Screen({ children, className, bg, dark }: { children: ReactNode; className?: string; bg?: ReactNode; dark?: boolean }) {
  return (
    <div className={cn('relative h-full w-full flex flex-col overflow-hidden', dark ? 'bg-night-900 text-white' : 'bg-cream text-ink', className)}>
      {bg}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col">{children}</div>
    </div>
  )
}

export function ScrollArea({ children, className, nav }: { children: ReactNode; className?: string; nav?: boolean }) {
  return (
    <div className={cn('flex-1 min-h-0 overflow-y-auto no-scrollbar', className)} style={{ paddingBottom: nav ? 'calc(100px + var(--sab))' : undefined }}>
      {children}
    </div>
  )
}

export function Dot({ tone = 'love', pulse }: { tone?: Tone; pulse?: boolean }) {
  const c = { love: 'bg-love-500', sea: 'bg-sea-500', sun: 'bg-sun-500', mist: 'bg-muted-2' }
  return (
    <span className="relative inline-flex w-2.5 h-2.5">
      {pulse && <span className={cn('absolute inset-0 rounded-full opacity-60 animate-ping', c[tone])} />}
      <span className={cn('relative rounded-full w-2.5 h-2.5', c[tone])} />
    </span>
  )
}

export function SafeTop({ className }: { className?: string }) {
  return <div className={className} style={{ height: 'var(--sat)' }} />
}
