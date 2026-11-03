import { useNavigate } from 'react-router-dom'
import { MapPin, Pencil, Lock, Eye, Sparkles, Flame, Tornado, LogOut, ChevronRight } from 'lucide-react'
import { Avatar, Button, Card, Chip, Screen, ScrollArea, SectionTitle, Tag } from '../components/ui'
import { BottomNav } from '../components/chrome'
import { useStore } from '../lib/store'
import { PAST_STORMS, EVENT } from '../lib/data'
import { BlackoutOverlay } from './Home'

export default function Me() {
  const nav = useNavigate()
  const profile = useStore((s) => s.profile)
  const met = useStore((s) => s.met)
  const continued = useStore((s) => s.continued)
  const blackout = useStore((s) => s.blackout)
  const reset = useStore((s) => s.reset)
  if (!profile) return null

  return (
    <Screen>
      {blackout && <BlackoutOverlay />}
      <div className="px-4 h-14 flex items-center justify-between shrink-0" style={{ marginTop: 'var(--sat)' }}>
        <div className="font-black text-lg">マイページ</div>
        <button onClick={() => nav('/signup')} className="h-9 px-3 rounded-full bg-white border border-line text-[12px] font-bold flex items-center gap-1 text-ink-2">
          <Pencil size={13} /> 編集
        </button>
      </div>
      <ScrollArea nav className="px-4 pt-1">
        <Card className="flex items-center gap-4">
          <Avatar seed={profile.avatar} size={76} ring="love" />
          <div className="flex-1 min-w-0">
            <div className="font-black text-lg leading-tight">{profile.nickname}</div>
            <div className="text-xs text-muted mt-1 flex items-center gap-1">
              <MapPin size={12} className="text-love-500" /> 沖縄県 {profile.city} · {profile.age}歳
            </div>
            <div className="mt-2 flex gap-1.5 flex-wrap">
              <Tag tone="sea">本人確認済み</Tag>
              <Tag tone="love">{profile.purpose}</Tag>
            </div>
          </div>
        </Card>

        <SectionTitle>台風の日、何してる？</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {profile.stormStyle.map((s) => (
            <Chip key={s} tone="sea" active>
              {s}
            </Chip>
          ))}
          {profile.hobbies.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>

        <SectionTitle right="イベントごとの記録">嵐の記録</SectionTitle>
        <Card className="p-2">
          {[{ name: EVENT.typhoon, date: '2026.11.03', talked: met.length, continued: continued.length, now: true }, ...PAST_STORMS].map((s) => (
            <div key={s.name} className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-2xl bg-night-900 text-sea-300 flex items-center justify-center">
                <Tornado size={20} />
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm flex items-center gap-2">
                  {s.name}
                  {'now' in s && s.now && <Tag tone="love">今回</Tag>}
                </div>
                <div className="text-[11px] text-muted">{s.date}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">
                  {s.talked}人<span className="text-[10px] text-muted font-normal">と話した</span>
                </div>
                <div className="text-[11px] text-love-600 font-bold">継続 {s.continued}</div>
              </div>
            </div>
          ))}
        </Card>

        <SectionTitle>プライバシーと安全</SectionTitle>
        <Card className="p-2">
          {[
            [Lock, '位置情報', '市町村単位でのみ共有（変更不可）'],
            [Eye, '写真の公開', '継続マッチング成立後のみ'],
            [Lock, '本名', '非公開'],
          ].map(([Icon, t, sub]) => {
            const I = Icon as typeof Lock
            return (
              <div key={t as string} className="flex items-center gap-3 p-2">
                <div className="w-9 h-9 rounded-xl bg-sea-100 text-sea-600 flex items-center justify-center">
                  <I size={17} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">{t as string}</div>
                  <div className="text-[11px] text-muted">{sub as string}</div>
                </div>
                <div className="w-11 h-7 rounded-full bg-sea-500 relative">
                  <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white" />
                </div>
              </div>
            )
          })}
          <button className="w-full flex items-center gap-3 p-2 text-left">
            <div className="w-9 h-9 rounded-xl bg-love-100 text-love-600 flex items-center justify-center">
              <Flame size={17} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm">ブロック・通報した相手</div>
              <div className="text-[11px] text-muted">0人</div>
            </div>
            <ChevronRight size={16} className="text-muted-2" />
          </button>
        </Card>

        <SectionTitle right="検討中">嵐プラス</SectionTitle>
        <div className="rounded-[24px] p-4 bg-gradient-to-br from-night-900 to-night-700 text-white shadow-card">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-sun-300" />
            <div className="font-black">嵐プラス</div>
            <div className="ml-auto font-display font-bold">
              ¥480<span className="text-[10px] text-white/60">/月</span>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-1.5 text-[12px] text-white/85">
            <div>· 台風の目チケット：マッチング待ちを優先</div>
            <div>· ろうそく・雷のチャット装飾</div>
            <div>· 嵐の記録を無制限に保存</div>
            <div>· 台風明けデートのクーポン</div>
          </div>
          <Button variant="sun" size="sm" className="mt-4">
            くわしく見る
          </Button>
        </div>

        <button
          onClick={() => {
            reset()
            localStorage.removeItem('taifu-kanakana-v1')
            nav('/')
          }}
          className="mt-6 mb-2 mx-auto flex items-center gap-1.5 text-xs text-muted font-bold"
        >
          <LogOut size={14} /> ログアウト
        </button>
      </ScrollArea>
      <BottomNav />
    </Screen>
  )
}
