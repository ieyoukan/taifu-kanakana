import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ChevronRight, Tornado } from 'lucide-react'
import { Avatar, Button, Screen, ScrollArea, Tag } from '../components/ui'
import { BottomNav } from '../components/chrome'
import { useStore } from '../lib/store'
import { PARTNERS, EVENT } from '../lib/data'
import { BlackoutOverlay } from './Home'

export default function Talks() {
  const nav = useNavigate()
  const met = useStore((s) => s.met)
  const continued = useStore((s) => s.continued)
  const messages = useStore((s) => s.messages)
  const phase = useStore((s) => s.phase)
  const blackout = useStore((s) => s.blackout)
  const ids = [...continued, ...met.filter((m) => !continued.includes(m))]
  const list = ids.map((id) => PARTNERS.find((p) => p.id === id)!).filter(Boolean)

  return (
    <Screen>
      {blackout && <BlackoutOverlay />}
      <div className="px-4 h-14 flex items-center justify-between shrink-0" style={{ marginTop: 'var(--sat)' }}>
        <div>
          <div className="font-black text-lg leading-tight">トーク</div>
          <div className="text-[11px] text-muted">継続マッチングした相手とは、嵐のあとも話せます</div>
        </div>
      </div>
      <ScrollArea nav className="px-4 pt-1">
        {list.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center px-6">
            <div className="w-20 h-20 rounded-full bg-love-100 text-love-500 flex items-center justify-center">
              <Tornado size={36} />
            </div>
            <div className="mt-5 font-black text-lg">まだ誰とも話していません</div>
            <div className="mt-2 text-sm text-muted leading-relaxed">{phase === 'storm' ? '台風の目で、同じ嵐の下にいる誰かと出会いましょう。' : '次の台風のイベントで、出会いが始まります。'}</div>
            <Button className="mt-6" onClick={() => nav('/home')}>
              ホームへ
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {list.map((p, i) => {
              const msgs = (messages[p.id] ?? []).filter((m) => m.from !== 'system')
              const last = msgs[msgs.length - 1]
              const isCont = continued.includes(p.id)
              const expired = !isCont && phase === 'passed'
              return (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => nav(isCont && phase === 'passed' ? `/date/${p.id}` : `/chat/${p.id}`)}
                  className="w-full text-left rounded-[22px] bg-white border border-line p-3 flex items-center gap-3 shadow-soft active:scale-[0.99]"
                >
                  <Avatar seed={p.avatar} size={56} ring={isCont ? 'love' : undefined} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-bold truncate">{p.name}</div>
                      {isCont ? <Tag tone="love">継続中</Tag> : expired ? <Tag tone="mist">イベント終了</Tag> : <Tag tone="sea">イベント中</Tag>}
                    </div>
                    <div className="text-[12px] text-ink-2 truncate mt-0.5">{last ? (last.kind === 'stamp' ? `スタンプ: ${last.text}` : last.text) : p.oneLiner}</div>
                    <div className="text-[10px] text-muted mt-0.5">
                      {p.city} · {EVENT.typhoon}で出会った
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-muted-2" />
                </motion.button>
              )
            })}
          </div>
        )}
      </ScrollArea>
      <BottomNav />
    </Screen>
  )
}
