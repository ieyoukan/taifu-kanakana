import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { X, MapPin, Sparkles } from 'lucide-react'
import { Avatar, Button, Screen, Tag, cn } from '../components/ui'
import { RainLayer, TyphoonSpiral } from '../components/visuals'
import { useStore } from '../lib/store'
import { AVATARS, PARTNERS, EVENT } from '../lib/data'

const CAPTIONS = ['同じ嵐の下から探しています…', '那覇市の近くで 412人がオンライン', '停電中の人を優先中…', '台風の目に入りました']

export default function Match() {
  const nav = useNavigate()
  const profile = useStore((s) => s.profile)
  const met = useStore((s) => s.met)
  const addMet = useStore((s) => s.addMet)
  const [state, setState] = useState<'search' | 'found'>('search')
  const [cap, setCap] = useState(0)
  const [cursor, setCursor] = useState(0)
  const timers = useRef<number[]>([])

  const pool = useMemo(() => {
    const base = PARTNERS.filter((p) => !profile || profile.pref === 'any' || p.gender === profile.pref)
    const list = base.length ? base : PARTNERS
    const fresh = list.filter((p) => !met.includes(p.id))
    return [...fresh, ...list.filter((p) => met.includes(p.id))]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.pref])

  const partner = pool[cursor % pool.length]

  useEffect(() => {
    if (state !== 'search') return
    setCap(0)
    const t = [
      window.setTimeout(() => setCap(1), 1100),
      window.setTimeout(() => setCap(2), 2200),
      window.setTimeout(() => setCap(3), 3200),
      window.setTimeout(() => {
        setState('found')
        addMet(partner.id)
      }, 3900),
    ]
    timers.current = t
    return () => t.forEach(clearTimeout)
  }, [state, cursor, partner.id, addMet])

  const orbit = AVATARS.filter((a) => a !== profile?.avatar).slice(0, 8)
  const common = useMemo(() => {
    if (!profile) return []
    return [...profile.hobbies.filter((h) => partner.hobbies.includes(h)), ...profile.stormStyle.filter((h) => partner.stormStyle.includes(h))]
  }, [profile, partner])

  return (
    <Screen dark bg={<RainLayer strength={state === 'search' ? 0.6 : 0.3} />}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div animate={{ scale: state === 'found' ? 1.6 : 1, opacity: state === 'found' ? 0.35 : 0.8 }} transition={{ duration: 1.2 }}>
          <TyphoonSpiral size={440} speed={state === 'search' ? 10 : 24} intensity={0.9} />
        </motion.div>
      </div>
      <div className="flex items-center justify-between px-3 h-14 shrink-0" style={{ marginTop: 'var(--sat)' }}>
        <button onClick={() => nav('/home')} className="w-11 h-11 rounded-full glass-dark flex items-center justify-center text-white" aria-label="閉じる">
          <X size={20} />
        </button>
        <Tag dark tone="love">
          {EVENT.typhoon} · ランダム1対1
        </Tag>
        <div className="w-11" />
      </div>

      <div className="relative flex-1 min-h-0 flex flex-col items-center justify-center px-5">
        <AnimatePresence mode="wait">
          {state === 'search' ? (
            <motion.div key="search" className="flex flex-col items-center" exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }}>
              <div className="relative w-[300px] h-[300px] flex items-center justify-center">
                <motion.div className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}>
                  {orbit.map((a, i) => (
                    <div key={a} className="absolute left-1/2 top-1/2 -ml-6 -mt-6" style={{ transform: `rotate(${i * 45}deg) translateY(-128px)` }}>
                      <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 }}>
                        <Avatar seed={a} size={48} className="ring-2 ring-white/30" />
                      </motion.div>
                    </div>
                  ))}
                </motion.div>
                <motion.div className="absolute w-44 h-44 rounded-full border border-white/15" animate={{ scale: [1, 1.5], opacity: [0.6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }} />
                {profile && <Avatar seed={profile.avatar} size={88} ring="love" glow />}
              </div>
              <motion.div key={cap} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center">
                <div className="font-bold text-lg">{CAPTIONS[cap]}</div>
                <div className="text-[12px] text-white/60 mt-1">本名や正確な位置は共有されません</div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key={`found-${partner.id}`} initial={{ opacity: 0, scale: 0.86, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }} className="w-full">
              <div className="text-center mb-3">
                <Tag dark tone="sea">
                  <Sparkles size={12} /> 台風の目で出会いました
                </Tag>
              </div>
              <div className="rounded-[30px] bg-white text-ink p-5 shadow-card">
                <div className="flex flex-col items-center text-center">
                  <Avatar seed={partner.avatar} size={104} ring="love" />
                  <div className="mt-3 font-black text-[22px] leading-tight">{partner.name}</div>
                  <div className="text-xs text-muted mt-1 flex items-center gap-1">
                    <MapPin size={12} className="text-love-500" /> {partner.city} · {partner.age}歳 · 風速 {partner.wind}m/s
                  </div>
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {partner.status.map((s) => (
                      <Tag key={s} tone={s.includes('停電') ? 'sun' : 'sea'}>
                        {s}
                      </Tag>
                    ))}
                  </div>
                  <p className="mt-4 text-[14px] leading-relaxed text-ink-2">「{partner.bio}」</p>
                </div>
                <div className="mt-4 rounded-2xl bg-cream-2 border border-line p-3">
                  <div className="text-[11px] font-bold text-muted">ふたりの共通点</div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {(common.length ? common : ['台風で暇']).map((c) => (
                      <Tag key={c} tone="love">
                        {c}
                      </Tag>
                    ))}
                    <Tag tone="mist">同じ{EVENT.typhoon}の中</Tag>
                  </div>
                </div>
                <Button size="lg" full className="mt-4" onClick={() => nav(`/chat/${partner.id}`)}>
                  話してみる
                </Button>
                <Button
                  variant="ghost"
                  full
                  className="mt-1"
                  onClick={() => {
                    setCursor((c) => c + 1)
                    setState('search')
                  }}
                >
                  別の人と
                </Button>
              </div>
              <div className={cn('text-center text-[11px] text-white/60 mt-3')}>プロフィールは匿名。表示されるのはニックネームと市町村だけです。</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div style={{ height: 'var(--sab)' }} />
    </Screen>
  )
}
