import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { Bell, MapPin, Wind, Gauge, CloudRain, ShieldAlert, ChevronRight, Flame, Sparkles, CalendarClock, Check, TrainFront, BusFront, School } from 'lucide-react'
import { Avatar, Button, Card, Dot, Screen, ScrollArea, SectionTitle, Sheet, Tag } from '../components/ui'
import { PressureGauge, RadarMap, RainLayer, Wordmark } from '../components/visuals'
import { BottomNav } from '../components/chrome'
import { useStore, weatherFor } from '../lib/store'
import { AVATARS, EVENT } from '../lib/data'

const REGIONS = [
  ['那覇市', 412],
  ['浦添市', 203],
  ['沖縄市', 188],
  ['宜野湾市', 141],
  ['名護市', 96],
  ['うるま市', 84],
] as const

function useCountdown(seed: number, running: boolean) {
  const [t, setT] = useState(seed)
  useEffect(() => {
    setT(seed)
    if (!running) return
    const id = setInterval(() => setT((x) => Math.max(0, x - 1)), 1000)
    return () => clearInterval(id)
  }, [running, seed])
  const h = Math.floor(t / 3600)
  const m = Math.floor((t % 3600) / 60)
  const s = t % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function BlackoutOverlay() {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      <div className="absolute inset-0 bg-[#3a2608]/55 mix-blend-multiply" />
      <div className="absolute inset-x-0 bottom-0 h-[70%] animate-flicker" style={{ background: 'radial-gradient(ellipse at 50% 110%, rgba(255,173,51,0.55), rgba(255,173,51,0.12) 45%, transparent 70%)' }} />
    </div>
  )
}

export default function Home() {
  const nav = useNavigate()
  const phase = useStore((s) => s.phase)
  const blackout = useStore((s) => s.blackout)
  const profile = useStore((s) => s.profile)
  const reserved = useStore((s) => s.reserved)
  const reserve = useStore((s) => s.reserve)
  const safetyAck = useStore((s) => s.safetyAck)
  const ackSafety = useStore((s) => s.ackSafety)
  const feed = useStore((s) => s.feed)
  const continued = useStore((s) => s.continued)
  const w = weatherFor(phase)
  const [wind, setWind] = useState(w.wind)
  const [safety, setSafety] = useState(false)
  const [locTip, setLocTip] = useState(false)
  const countdown = useCountdown(phase === 'approach' ? 5 * 3600 + 12 * 60 + 33 : 14 * 3600 + 32 * 60 + 10, phase === 'approach' || phase === 'storm')

  useEffect(() => {
    setWind(w.wind)
    if (phase !== 'storm') return
    const id = setInterval(() => setWind(w.wind + Math.round((Math.random() - 0.4) * 6)), 1800)
    return () => clearInterval(id)
  }, [phase, w.wind])

  const startMatch = () => {
    if (!safetyAck) setSafety(true)
    else nav('/match')
  }

  const isStorm = phase === 'storm'
  const stats = [
    { Icon: Gauge, label: '中心気圧', v: String(w.pressure), unit: 'hPa' },
    { Icon: Wind, label: '最大風速', v: String(wind), unit: 'm/s' },
    { Icon: CloudRain, label: '降水量', v: String(w.rain), unit: 'mm/h' },
  ]

  return (
    <Screen>
      {blackout && <BlackoutOverlay />}
      <div className="relative z-10 flex items-center justify-between px-4 h-14 shrink-0" style={{ marginTop: 'var(--sat)' }}>
        <div className="flex items-center gap-2">
          <Wordmark size={22} />
          <button onClick={() => setLocTip((v) => !v)} className="relative flex items-center gap-1 h-8 px-2.5 rounded-full bg-white border border-line text-[12px] font-bold text-ink-2">
            <MapPin size={13} className="text-love-500" />
            {profile?.city ?? '那覇市'}
            {locTip && <span className="absolute left-0 top-10 w-60 text-left rounded-xl bg-ink text-white p-2.5 text-[11px] font-normal leading-snug shadow-card z-20">相手に共有されるのは市町村名だけ。正確な位置や自宅は公開されません。</span>}
          </button>
        </div>
        <div className="flex items-center gap-2">
          {blackout && (
            <Tag tone="sun">
              <Flame size={11} /> 停電中
            </Tag>
          )}
          <button className="relative w-10 h-10 rounded-full bg-white border border-line flex items-center justify-center text-ink-2" aria-label="通知">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-love-500 ring-2 ring-white" />
          </button>
        </div>
      </div>

      <ScrollArea nav className="px-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-[28px] overflow-hidden shadow-card bg-night-900 text-white">
          <RadarMap phase={phase} />
          {isStorm && <RainLayer strength={0.5} />}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <Tag dark tone={isStorm ? 'love' : phase === 'approach' ? 'sun' : 'sea'}>
              <Dot tone={isStorm ? 'love' : phase === 'approach' ? 'sun' : 'sea'} pulse={isStorm} />
              {phase === 'calm' ? '台風なし' : phase === 'approach' ? `${EVENT.warning} 発表見込み` : isStorm ? `${EVENT.warning} 発表中` : `${EVENT.warning} 解除`}
            </Tag>
            <span className="text-[10px] text-white/60 font-bold">気象庁 台風情報をもとに（モック）</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-night-900 via-night-900/75 to-transparent">
            <div className="text-[11px] text-white/70 font-bold">{EVENT.area}</div>
            <div className="text-[22px] font-black leading-tight">{w.name}</div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {stats.map(({ Icon, label, v, unit }) => (
                <div key={label} className="rounded-2xl bg-white/10 border border-white/10 px-3 py-2">
                  <div className="flex items-center gap-1 text-[10px] text-white/70 font-bold">
                    <Icon size={11} /> {label}
                  </div>
                  <div className="font-display font-bold text-lg leading-tight">
                    {v}
                    <span className="text-[10px] text-white/60 ml-0.5">{unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {(isStorm || phase === 'approach') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="mt-3 flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
            {[
              [School, isStorm ? '学校・仕事 休み' : '休み見込み'],
              [TrainFront, isStorm ? 'ゆいレール 運休' : 'ゆいレール 運休予定'],
              [BusFront, isStorm ? 'バス 全線運休' : 'バス 運休予定'],
            ].map(([Icon, label]) => {
              const I = Icon as typeof School
              return (
                <span key={label as string} className="shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-white border border-line text-[12px] font-bold text-ink-2">
                  <I size={14} className={isStorm ? 'text-love-500' : 'text-sun-600'} /> {label as string}
                </span>
              )
            })}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          {phase === 'calm' && (
            <Card className="mt-3">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-sea-100 text-sea-600 flex items-center justify-center shrink-0">
                  <CalendarClock size={22} />
                </div>
                <div className="flex-1">
                  <div className="font-bold">次の台風を待っています</div>
                  <div className="text-xs text-muted mt-1 leading-relaxed">今日は晴れ。新規マッチングはお休み中です。台風を待つアプリは、たぶん世界初。</div>
                </div>
              </div>
              <Button full variant="secondary" className="mt-4" disabled>
                次の台風まで、おやすみ中
              </Button>
            </Card>
          )}
          {phase === 'approach' && (
            <Card className="mt-3 border-sun-200 bg-gradient-to-b from-sun-100/60 to-white">
              <div className="flex items-center justify-between">
                <Tag tone="sun">今夜 {EVENT.startAt} 開始見込み</Tag>
                <div className="text-[11px] text-muted font-bold">予約 638人</div>
              </div>
              <div className="mt-3 font-black text-lg leading-tight">{EVENT.typhoon} マッチングイベント</div>
              <div className="text-xs text-muted mt-1">{EVENT.area}に{EVENT.warning}が発表されたら、自動で開始 · あと</div>
              <div className="font-display font-bold text-[42px] leading-none mt-1 tracking-tight text-ink">{countdown}</div>
              <Button full variant={reserved ? 'secondary' : 'sun'} className="mt-4" onClick={reserve} icon={reserved ? <Check size={18} /> : <Sparkles size={18} />}>
                {reserved ? '予約済み · 開始時に通知します' : '参加を予約する'}
              </Button>
            </Card>
          )}
          {isStorm && (
            <Card className="mt-3 border-love-200 bg-gradient-to-b from-love-100/60 to-white">
              <div className="flex items-center justify-between">
                <Tag tone="love">
                  <Dot tone="love" pulse /> LIVE · イベント開催中
                </Tag>
                <div className="text-[11px] text-muted font-bold">通過まで {countdown}</div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex -space-x-3">
                  {AVATARS.slice(3, 8).map((a) => (
                    <Avatar key={a} seed={a} size={36} className="ring-2 ring-white" />
                  ))}
                </div>
                <div>
                  <div className="font-black text-lg leading-tight">
                    <span className="font-display text-love-600">{w.people.toLocaleString()}</span>人
                  </div>
                  <div className="text-xs text-muted">が、いま同じ嵐の下にいます</div>
                </div>
              </div>
              <Button size="lg" full className="mt-4" onClick={startMatch}>
                台風の目で出会う
              </Button>
              <div className="text-center text-[11px] text-muted mt-2">ランダムに1対1でつながります · いつでも終了できます</div>
            </Card>
          )}
          {phase === 'passed' && (
            <Card className="mt-3 border-sea-200 bg-gradient-to-b from-sea-100/70 to-white">
              <Tag tone="sea">{EVENT.warning} 解除 · 新規マッチング終了</Tag>
              <div className="mt-3 font-black text-lg leading-tight">{EVENT.typhoon}、通過。</div>
              <div className="text-xs text-muted mt-1 leading-relaxed">{continued.length > 0 ? `つながったままの相手が${continued.length}人います。晴れた日に、はじめて会いませんか。` : '次の台風で、また。'}</div>
              <Button size="lg" full variant="sea" className="mt-4" onClick={() => nav('/passed')} icon={<ChevronRight size={18} />}>
                台風のあとへ
              </Button>
            </Card>
          )}
        </motion.div>

        {(isStorm || phase === 'approach') && profile && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} onClick={() => nav('/closet')} className="mt-3 w-full text-left rounded-[24px] p-3 pr-4 flex items-center gap-3 bg-gradient-to-r from-night-900 to-night-700 text-white shadow-card active:scale-[0.99]">
            <Avatar config={{ ...profile.avatar, head: 'hood', bg: 'storm', fx: 'thunder' }} size={68} animated />
            <div className="flex-1 min-w-0">
              <Tag dark tone="love">{EVENT.typhoon}限定</Tag>
              <div className="font-black text-[15px] mt-1 leading-tight">レインコートとかみなり、配信中</div>
              <div className="text-[11px] text-white/60 mt-0.5">台風が過ぎると、もう手に入りません</div>
            </div>
            <ChevronRight size={18} className="text-white/60" />
          </motion.button>
        )}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <SectionTitle right={w.label}>恋愛気圧計</SectionTitle>
          <Card>
            <PressureGauge index={w.index} pressure={w.pressure} />
            <div className="text-center text-xs text-muted mt-1">{w.caption}</div>
          </Card>
        </motion.div>

        {(isStorm || phase === 'approach') && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
            <SectionTitle right={isStorm ? 'オンライン' : '予約中'}>市町村ごとの参加者</SectionTitle>
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
              {REGIONS.map(([c, n]) => (
                <div key={c} className="shrink-0 rounded-2xl bg-white border border-line px-3.5 py-2.5 shadow-soft">
                  <div className="text-[11px] text-muted font-bold">{c}</div>
                  <div className="font-display font-bold text-lg leading-tight text-ink">{isStorm ? n : Math.round(n * 0.5)}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
          <SectionTitle right={<button onClick={() => nav('/feed')} className="text-sea-600 font-bold">すべて見る</button>}>みんなの実況</SectionTitle>
          <Card className="p-2">
            {feed.slice(0, 3).map((f) => (
              <div key={f.id} className="flex items-start gap-3 p-2">
                <div className="w-8 h-8 rounded-full bg-sea-100 flex items-center justify-center text-[10px] font-bold text-sea-600 shrink-0">{f.city.slice(0, 2)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] leading-snug">{f.text}</div>
                  <div className="text-[10px] text-muted mt-0.5">
                    {f.city} · だからよー {f.likes}
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }} className="mt-3 mb-2">
          <div className="rounded-[20px] bg-love-100/60 border border-love-200 p-3 flex items-start gap-3">
            <ShieldAlert size={18} className="text-love-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-ink-2 leading-relaxed">避難指示が出た場合は安全確保を最優先に。台風かなかなは気象庁や自治体の公式情報、緊急連絡手段の代わりにはなりません。暴風の中での対面は推奨しません。</div>
          </div>
        </motion.div>
      </ScrollArea>

      <Sheet open={safety} onClose={() => setSafety(false)} title="はじめる前に">
        <div className="text-sm text-ink-2 leading-relaxed">
          いま、安全な場所にいますか？ 嵐の中でのマッチングは、家や避難先など安全な場所で楽しんでください。相手に自宅や正確な位置を伝える必要はありません。
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2">
          <Button
            size="lg"
            full
            onClick={() => {
              ackSafety()
              setSafety(false)
              nav('/match')
            }}
          >
            安全な場所にいます
          </Button>
          <Button variant="ghost" full onClick={() => setSafety(false)}>
            あとで
          </Button>
        </div>
      </Sheet>
      <BottomNav />
    </Screen>
  )
}
