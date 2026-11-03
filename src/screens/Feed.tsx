import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Send, Heart } from 'lucide-react'
import { Screen, ScrollArea, Tag, Dot, cn } from '../components/ui'
import { BottomNav } from '../components/chrome'
import { useStore, weatherFor } from '../lib/store'
import { BlackoutOverlay } from './Home'

function ago(at: number) {
  const m = Math.max(0, Math.round((Date.now() - at) / 60000))
  if (m < 1) return 'たった今'
  if (m < 60) return `${m}分前`
  return `${Math.floor(m / 60)}時間前`
}

export default function Feed() {
  const feed = useStore((s) => s.feed)
  const addFeed = useStore((s) => s.addFeed)
  const likeFeed = useStore((s) => s.likeFeed)
  const phase = useStore((s) => s.phase)
  const blackout = useStore((s) => s.blackout)
  const profile = useStore((s) => s.profile)
  const [text, setText] = useState('')
  const w = weatherFor(phase)
  const live = phase === 'storm'

  const post = () => {
    if (!text.trim()) return
    addFeed({ city: profile?.city ?? '那覇市', text: text.trim(), likes: 0, mine: true })
    setText('')
  }

  return (
    <Screen>
      {blackout && <BlackoutOverlay />}
      <div className="px-4 h-14 flex items-center justify-between shrink-0" style={{ marginTop: 'var(--sat)' }}>
        <div>
          <div className="font-black text-lg leading-tight">みんなの実況</div>
          <div className="text-[11px] text-muted">沖縄本島 · 匿名 · {w.name}</div>
        </div>
        <Tag tone={live ? 'love' : 'mist'}>
          <Dot tone={live ? 'love' : 'mist'} pulse={live} /> {live ? 'LIVE' : '静か'}
        </Tag>
      </div>
      <ScrollArea className="px-4 pt-1" nav>
        <div className="flex flex-col gap-2 pb-20">
          <AnimatePresence initial={false}>
            {feed.map((f) => (
              <motion.div key={f.id} layout initial={{ opacity: 0, y: -16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={cn('rounded-[22px] bg-white border border-line p-3.5 shadow-soft', f.mine && 'border-love-300')}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-sea-100 flex items-center justify-center text-[10px] font-bold text-sea-600">{f.city.slice(0, 2)}</div>
                  <div className="text-[11px] font-bold text-ink-2">
                    {f.mine ? `${profile?.nickname ?? 'あなた'} · ` : ''}
                    {f.city}
                  </div>
                  <div className="text-[10px] text-muted-2 ml-auto">{ago(f.at)}</div>
                </div>
                <div className="mt-2 text-[14px] leading-relaxed">{f.text}</div>
                <button onClick={() => likeFeed(f.id)} className={cn('mt-2 inline-flex items-center gap-1 h-8 px-3 rounded-full text-[12px] font-bold border transition-all active:scale-95', f.liked ? 'bg-love-500 border-love-500 text-white' : 'border-line-2 text-ink-2 bg-white')}>
                  <Heart size={13} fill={f.liked ? 'currentColor' : 'none'} /> だからよー {f.likes}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
      <div className="absolute left-0 right-0 z-30 px-4" style={{ bottom: 'calc(var(--sab) + 76px)' }}>
        <div className="bg-white rounded-full h-12 flex items-center pl-4 pr-1.5 gap-2 shadow-card border border-line">
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && post()} placeholder="いまの状況を実況（匿名）" className="flex-1 min-w-0 bg-transparent outline-none text-base placeholder:text-muted-2" />
          <button onClick={post} className="w-9 h-9 rounded-full bg-love-500 text-white flex items-center justify-center active:scale-95 shrink-0" aria-label="投稿">
            <Send size={16} />
          </button>
        </div>
      </div>
      <BottomNav />
    </Screen>
  )
}
