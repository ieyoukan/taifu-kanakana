import { useEffect } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { Sun, Heart, ZapOff, MessageCircle, Users } from 'lucide-react'
import { Avatar, Button, Screen, Tag } from '../components/ui'
import { PhotoBg } from '../components/visuals'
import { useStore } from '../lib/store'
import { PARTNERS, EVENT } from '../lib/data'

export default function Passed() {
  const nav = useNavigate()
  const met = useStore((s) => s.met)
  const continued = useStore((s) => s.continued)
  const markPassedSeen = useStore((s) => s.markPassedSeen)
  useEffect(() => markPassedSeen(), [markPassedSeen])
  const partners = continued.map((id) => PARTNERS.find((p) => p.id === id)!).filter(Boolean)

  const stats = [
    { Icon: Users, v: '3,412', unit: '組', label: 'この台風で出会った' },
    { Icon: ZapOff, v: '12,803', unit: '回', label: '停電スタンプ' },
    { Icon: MessageCircle, v: '「暇」', unit: '', label: '最も使われた言葉' },
    { Icon: Heart, v: String(met.length), unit: '人', label: `あなたが話した · 継続 ${continued.length}` },
  ]

  return (
    <Screen>
      <div className="relative h-[46%] shrink-0 overflow-hidden text-white">
        <PhotoBg src="/img/beach.jpg" overlay="from-night-900/45 via-night-900/15 to-cream" position="center 72%" />
        <motion.div className="absolute inset-0" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 2.4, delay: 0.6 }}>
          <PhotoBg src="/img/storm.jpg" overlay="from-night-900/55 via-night-900/30 to-cream" />
        </motion.div>
        <div className="relative h-full flex flex-col justify-end px-6 pb-6" style={{ paddingTop: 'var(--sat)' }}>
          <motion.div initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <Tag dark tone="sea">
              <Sun size={12} /> {EVENT.area} {EVENT.warning} 解除
            </Tag>
            <h1 className="mt-3 text-[34px] font-black leading-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)]">
              {EVENT.typhoon}、通過。
            </h1>
            <div className="text-[15px] font-bold text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">おつかれさまでした。</div>
          </motion.div>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 -mt-2 pb-6">
        <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="grid grid-cols-2 gap-2">
          {stats.map(({ Icon, v, unit, label }) => (
            <div key={label} className="rounded-[22px] bg-white border border-line p-3.5 shadow-soft">
              <Icon size={16} className="text-love-500" />
              <div className="mt-1.5 font-display font-bold text-[22px] leading-none text-ink">
                {v}
                <span className="text-xs text-muted font-sans ml-0.5">{unit}</span>
              </div>
              <div className="text-[11px] text-muted mt-1">{label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.95 }} className="mt-4">
          {partners.length > 0 ? (
            <div className="rounded-[26px] bg-gradient-to-b from-love-100 to-white border border-love-200 p-4 shadow-soft">
              <div className="text-[11px] font-bold text-love-600">嵐が過ぎても、恋は続く。</div>
              {partners.map((p) => (
                <div key={p.id} className="mt-3 flex items-center gap-3">
                  <Avatar seed={p.avatar} size={56} ring="love" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold">{p.name}</div>
                    <div className="text-[11px] text-muted">
                      {p.city} · {EVENT.typhoon}で出会った · つながったまま
                    </div>
                  </div>
                </div>
              ))}
              <Button size="lg" full className="mt-4" onClick={() => nav(`/date/${partners[0].id}`)} icon={<Sun size={18} />}>
                晴れた日に会う
              </Button>
              <div className="text-center text-[11px] text-muted mt-2">天候と交通が落ち着いてから。初回は公共の場所で。</div>
            </div>
          ) : (
            <div className="rounded-[26px] bg-white border border-line p-5 text-center shadow-soft">
              <div className="font-bold">今回は、誰ともつながりませんでした</div>
              <div className="text-xs text-muted mt-1 leading-relaxed">嵐の記録は残ります。次の台風で、また。</div>
              <Button className="mt-4" onClick={() => nav('/home')}>
                ホームへ
              </Button>
            </div>
          )}
        </motion.div>
        <div className="text-center mt-4">
          <button onClick={() => nav('/home')} className="text-xs font-bold text-muted">
            ホームに戻る
          </button>
        </div>
      </div>
    </Screen>
  )
}
