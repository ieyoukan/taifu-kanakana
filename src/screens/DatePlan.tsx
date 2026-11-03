import { useState } from 'react'
import { motion } from 'motion/react'
import { useNavigate, useParams } from 'react-router-dom'
import { Sun, Waves, TrainFront, Eye, MapPin, Ticket, Check, ShieldCheck } from 'lucide-react'
import { Avatar, Button, Screen, ScrollArea, SectionTitle, Tag, TopBar, cn } from '../components/ui'
import { useStore } from '../lib/store'
import { DATE_SPOTS, PARTNERS, EVENT } from '../lib/data'

const SLOTS = ['土曜 午後', '日曜 午前', '来週のどこか']

export default function DatePlan() {
  const { id = '' } = useParams()
  const nav = useNavigate()
  const partner = PARTNERS.find((p) => p.id === id) ?? PARTNERS[0]
  const revealed = useStore((s) => !!s.revealed[partner.id])
  const reveal = useStore((s) => s.reveal)
  const spot = useStore((s) => s.dateProposed[partner.id] ?? null)
  const proposeDate = useStore((s) => s.proposeDate)
  const pushToast = useStore((s) => s.pushToast)
  const [slot, setSlot] = useState(SLOTS[0])
  const [pending, setPending] = useState(false)

  const propose = (sid: string) => {
    proposeDate(partner.id, sid)
    setPending(true)
    const name = DATE_SPOTS.find((d) => d.id === sid)!.name
    window.setTimeout(() => {
      pushToast({ title: `${partner.name}さんからの返事`, body: `いいね、${slot}に${name}行こう。台風、ありがとうだね。`, tone: 'love' })
      setPending(false)
    }, 2200)
  }
  const proposed = spot !== null

  return (
    <Screen>
      <TopBar back title="台風明けデート" onBack={() => nav(-1)} />
      <ScrollArea className="px-4 pb-8">
        <div className="mt-2 rounded-2xl bg-sea-100 border border-sea-200 px-3 py-2.5 flex items-center gap-3 text-[12px] font-bold text-ink-2">
          <Sun size={16} className="text-sun-600" /> 晴れ 29°C
          <span className="flex items-center gap-1 text-muted">
            <Waves size={14} /> 波はまだ高め
          </span>
          <span className="flex items-center gap-1 text-muted">
            <TrainFront size={14} /> ゆいレール再開
          </span>
        </div>

        <div className="mt-3 relative rounded-[28px] overflow-hidden shadow-card bg-night-900 h-[340px]">
          <motion.img src={partner.photo} alt="" className="absolute inset-0 w-full h-full object-cover" initial={false} animate={{ filter: revealed ? 'blur(0px)' : 'blur(22px)', scale: revealed ? 1 : 1.1 }} transition={{ duration: 1.4, ease: 'easeOut' }} draggable={false} />
          <div className="absolute inset-0 bg-gradient-to-t from-night-900/85 via-transparent to-transparent" />
          {!revealed && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-8 pb-14 text-white">
              <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                <Eye size={26} />
              </div>
              <div className="mt-3 font-bold">嵐が過ぎたので、お互いの写真が見られます</div>
              <div className="text-[11px] text-white/70 mt-1">継続マッチングが成立した相手にだけ公開されます</div>
              <Button variant="white" className="mt-4" onClick={() => reveal(partner.id)}>
                写真を見る
              </Button>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 p-4 text-white flex items-end gap-3 pointer-events-none">
            <Avatar seed={partner.avatar} size={44} ring="white" />
            <div className="flex-1">
              <div className="font-black text-lg leading-tight flex items-center gap-2">
                {partner.name} <Tag dark tone="love">継続中</Tag>
              </div>
              <div className="text-[11px] text-white/75 flex items-center gap-1">
                <MapPin size={11} /> {partner.city} · {partner.age}歳 · {EVENT.typhoon}で出会った
              </div>
            </div>
          </div>
        </div>

        <SectionTitle right="ふたりの空き">いつ会う？</SectionTitle>
        <div className="flex gap-2">
          {SLOTS.map((s) => (
            <button key={s} onClick={() => setSlot(s)} className={cn('h-10 px-4 rounded-full text-sm font-bold border transition-all active:scale-95', slot === s ? 'bg-ink text-white border-ink' : 'bg-white border-line-2 text-ink-2')}>
              {s}
            </button>
          ))}
        </div>

        <SectionTitle right="スポンサー提携スポット">台風明けのデート案</SectionTitle>
        <div className="flex flex-col gap-3">
          {DATE_SPOTS.map((d, i) => {
            const chosen = spot === d.id
            return (
              <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className={cn('rounded-[26px] overflow-hidden bg-white border shadow-soft', chosen ? 'border-love-400 ring-4 ring-love-100' : 'border-line')}>
                <div className="relative h-36">
                  <img src={d.photo} alt="" className="w-full h-full object-cover" draggable={false} />
                  <div className="absolute top-3 left-3">
                    <Tag dark tone="sun">
                      <Ticket size={11} /> {d.coupon}
                    </Tag>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-black text-[16px]">{d.name}</div>
                    <div className="text-[11px] text-muted font-bold flex items-center gap-1">
                      <MapPin size={11} /> {d.place}
                    </div>
                  </div>
                  <div className="text-[12px] text-ink-2 mt-1 leading-relaxed">{d.note}</div>
                  <div className="text-[10px] text-muted-2 mt-1">{d.sponsor}</div>
                  <Button full className="mt-3" variant={chosen ? 'secondary' : 'primary'} disabled={proposed && !chosen} onClick={() => propose(d.id)} icon={chosen ? <Check size={18} /> : undefined}>
                    {chosen ? (pending ? '提案中…' : `${slot}に決定`) : 'ここに誘う'}
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-4 rounded-[20px] bg-cream-2 border border-line p-3 flex items-start gap-3">
          <ShieldCheck size={18} className="text-sea-600 shrink-0 mt-0.5" />
          <div className="text-[11px] text-ink-2 leading-relaxed">天候や交通が落ち着いてから会いましょう。初回は人の多い公共の場所で。住所や連絡先の交換はアプリの外では慎重に。</div>
        </div>
      </ScrollArea>
    </Screen>
  )
}
