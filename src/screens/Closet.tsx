import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Crown, Coins, Sparkles, Lock, Check, Ticket, Tornado, Shuffle, Undo2 } from 'lucide-react'
import { Avatar, Button, Screen, Sheet, Tag, TopBar, cn } from '../components/ui'
import { useStore } from '../lib/store'
import { COIN_PACKS, SLOTS, TIER_LABEL, isUnlocked, lockedIn, partKey, partsBySlot, randomAvatar, type Part, type Slot, type AvatarConfig } from '../lib/avatar'
import { EVENT } from '../lib/data'

export function CoinPill({ onClick }: { onClick?: () => void }) {
  const coins = useStore((s) => s.coins)
  return (
    <button onClick={onClick} className="h-9 pl-2 pr-3 rounded-full bg-sun-100 border border-sun-200 flex items-center gap-1.5 text-[13px] font-bold text-ink active:scale-95">
      <span className="w-6 h-6 rounded-full bg-gradient-to-b from-sun-300 to-sun-500 text-white flex items-center justify-center">
        <Coins size={13} />
      </span>
      <span className="font-display">{coins.toLocaleString()}</span>
    </button>
  )
}

function TierBadge({ part, unlocked }: { part: Part; unlocked: boolean }) {
  if (part.tier === 'free') return <span className="text-[10px] text-muted-2 font-bold">無料</span>
  if (unlocked) return (
    <span className="text-[10px] text-sea-600 font-bold inline-flex items-center gap-0.5">
      <Check size={11} /> 所持
    </span>
  )
  if (part.tier === 'plus') return (
    <span className="text-[10px] font-bold inline-flex items-center gap-0.5 text-[#8A5CFF]">
      <Crown size={11} /> プラス
    </span>
  )
  if (part.tier === 'collab') return (
    <span className="text-[10px] font-bold inline-flex items-center gap-0.5 text-sea-600">
      <Ticket size={11} /> コラボ
    </span>
  )
  return (
    <span className={cn('text-[10px] font-bold inline-flex items-center gap-0.5', part.tier === 'limited' ? 'text-love-600' : 'text-sun-600')}>
      <Coins size={11} /> {part.price}
    </span>
  )
}

export default function Closet() {
  const profile = useStore((s) => s.profile)
  const coins = useStore((s) => s.coins)
  const owned = useStore((s) => s.owned)
  const plus = useStore((s) => s.plus)
  const phase = useStore((s) => s.phase)
  const { setAvatar, spendCoins, addCoins, grant, joinPlus, pushToast } = useStore.getState()

  const [draft, setDraft] = useState<AvatarConfig>(profile!.avatar)
  const [slot, setSlot] = useState<Slot>('body')
  const [buyOpen, setBuyOpen] = useState(false)
  const [coinOpen, setCoinOpen] = useState(false)
  const [paying, setPaying] = useState<number | null>(null)
  const [pop, setPop] = useState(0)

  const access = { owned, plus }
  const locked = lockedIn(draft, access)
  const eventOn = phase === 'approach' || phase === 'storm'
  const coinParts = locked.filter((p) => p.tier === 'coin' || (p.tier === 'limited' && eventOn))
  const coinTotal = coinParts.reduce((a, p) => a + (p.price ?? 0), 0)
  const plusParts = locked.filter((p) => p.tier === 'plus')
  const collabParts = locked.filter((p) => p.tier === 'collab')
  const expiredLimited = locked.filter((p) => p.tier === 'limited' && !eventOn)
  const changed = JSON.stringify(draft) !== JSON.stringify(profile!.avatar)

  const save = () => {
    setAvatar(draft)
    setPop((n) => n + 1)
    pushToast({ title: '新しいアバターになりました', body: 'マッチング画面とトークに反映されます。', tone: 'love' })
  }

  const finishIfDone = () => {
    const s = useStore.getState()
    if (lockedIn(draft, { owned: s.owned, plus: s.plus }).length === 0) {
      setBuyOpen(false)
      save()
    }
  }

  const buyPack = (i: number) => {
    setPaying(i)
    window.setTimeout(() => {
      const pack = COIN_PACKS[i]
      const bonus = i === 1 ? 50 : i === 2 ? 200 : 0
      addCoins(pack.coins + bonus)
      setPaying(null)
      setCoinOpen(false)
      pushToast({ title: `${(pack.coins + bonus).toLocaleString()}コインを購入しました`, body: 'モックのため実際の課金は発生しません。', tone: 'sun' })
    }, 1300)
  }

  const items = partsBySlot(slot)

  return (
    <Screen>
      <TopBar back title="着せかえ" right={<CoinPill onClick={() => setCoinOpen(true)} />} />

      <div className="px-4 pt-2 shrink-0">
        <div className="relative rounded-[28px] overflow-hidden border border-line bg-gradient-to-br from-love-100 via-sun-100 to-sea-100 p-4 flex items-center gap-4">
          <motion.div key={pop} initial={{ scale: 0.85 }} animate={{ scale: [0.85, 1.08, 1] }} transition={{ duration: 0.5 }}>
            <Avatar config={draft} size={132} animated className="shadow-card rounded-full" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="font-black text-lg truncate">{profile!.nickname}</div>
            <div className="text-[11px] text-muted">マッチング・トークで相手に見えるアバター</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {locked.length > 0 ? (
                <Tag tone="love">
                  <Lock size={10} /> 試着中 {locked.length}
                </Tag>
              ) : changed ? (
                <Tag tone="sea">未保存</Tag>
              ) : (
                <Tag tone="mist">保存済み</Tag>
              )}
              {plus && (
                <Tag tone="mist" className="!text-[#8A5CFF]">
                  <Crown size={10} /> 嵐プラス
                </Tag>
              )}
            </div>
            <div className="mt-2 flex gap-1.5">
              <button onClick={() => setDraft(randomAvatar(`${Date.now()}`))} className="h-8 px-2.5 rounded-full bg-white/80 border border-line text-[11px] font-bold text-ink-2 inline-flex items-center gap-1 active:scale-95">
                <Shuffle size={12} /> おまかせ
              </button>
              <button onClick={() => setDraft(profile!.avatar)} disabled={!changed} className="h-8 px-2.5 rounded-full bg-white/80 border border-line text-[11px] font-bold text-ink-2 inline-flex items-center gap-1 active:scale-95 disabled:opacity-40">
                <Undo2 size={12} /> もどす
              </button>
            </div>
          </div>
        </div>

        <button onClick={() => setSlot('head')} className={cn('mt-2 w-full rounded-2xl px-3 py-2.5 flex items-center gap-2 text-left', eventOn ? 'bg-night-900 text-white' : 'bg-ink/5 text-ink-2')}>
          <Tornado size={16} className={eventOn ? 'text-sun-300' : 'text-muted'} />
          <div className="flex-1 text-[12px] font-bold leading-tight">
            {eventOn ? `${EVENT.typhoon}限定アイテム配信中` : '台風限定アイテムは、次の台風で'}
            <div className={cn('text-[10px] font-normal', eventOn ? 'text-white/60' : 'text-muted')}>レインコート・たいふう背景・かみなり — 台風が過ぎると入手できません</div>
          </div>
          {eventOn && <Tag dark tone="love">期間限定</Tag>}
        </button>

        <div className="mt-3 flex gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4">
          {SLOTS.map((s) => (
            <button key={s.id} onClick={() => setSlot(s.id)} className={cn('shrink-0 h-9 px-4 rounded-full text-[13px] font-bold border transition-all', slot === s.id ? 'bg-ink text-white border-ink' : 'bg-white text-ink-2 border-line-2')}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 pt-3 pb-4">
        <div className="grid grid-cols-3 gap-2.5">
          {items.map((p) => {
            const unlocked = isUnlocked(p, access)
            const selected = draft[slot] === p.id
            const unavailable = p.tier === 'limited' && !eventOn && !unlocked
            return (
              <motion.button
                key={p.id}
                layout
                onClick={() => setDraft({ ...draft, [slot]: p.id })}
                className={cn('relative rounded-[20px] bg-white border p-2 pb-2.5 flex flex-col items-center gap-1 transition-all active:scale-95', selected ? 'border-love-400 ring-4 ring-love-100' : 'border-line')}
              >
                {p.tier === 'limited' && <span className="absolute top-1.5 left-1.5 z-10 text-[9px] font-bold text-white bg-love-500 rounded-full px-1.5 py-0.5">限定</span>}
                {p.tier === 'collab' && <span className="absolute top-1.5 left-1.5 z-10 text-[9px] font-bold text-white bg-sea-500 rounded-full px-1.5 py-0.5">コラボ</span>}
                {!unlocked && (
                  <span className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-ink/70 text-white flex items-center justify-center">
                    <Lock size={10} />
                  </span>
                )}
                <div className={cn(unavailable && 'grayscale opacity-60')}>
                  <Avatar config={{ ...draft, [slot]: p.id }} size={76} />
                </div>
                <div className="text-[12px] font-bold leading-tight text-center">{p.name}</div>
                <TierBadge part={p} unlocked={unlocked} />
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="shrink-0 bg-white border-t border-line px-4 pt-3" style={{ paddingBottom: 'calc(var(--sab) + 12px)' }}>
        {locked.length > 0 ? (
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-muted">試着中のアイテム</div>
              <div className="font-bold text-[13px] truncate">{locked.map((p) => p.name).join('・')}</div>
            </div>
            <Button onClick={() => setBuyOpen(true)} icon={<Sparkles size={16} />}>
              手に入れる
            </Button>
          </div>
        ) : (
          <Button full size="lg" disabled={!changed} onClick={save}>
            {changed ? 'このアバターにする' : '保存済み'}
          </Button>
        )}
      </div>

      <Sheet open={buyOpen} onClose={() => setBuyOpen(false)} title="試着中のアイテムを手に入れる">
        <div className="flex items-center gap-3 mb-3">
          <Avatar config={draft} size={64} animated />
          <div className="flex flex-wrap gap-1.5">
            {locked.map((p) => (
              <Tag key={partKey(p)} tone={p.tier === 'limited' ? 'love' : p.tier === 'plus' ? 'mist' : p.tier === 'collab' ? 'sea' : 'sun'}>
                {p.name} · {TIER_LABEL[p.tier]}
              </Tag>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {coinParts.length > 0 && (
            <div className="rounded-2xl border border-sun-200 bg-sun-100/60 p-3">
              <div className="flex items-center justify-between text-[13px] font-bold">
                <span>{coinParts.map((p) => p.name).join('・')}</span>
                <span className="inline-flex items-center gap-1 font-display">
                  <Coins size={14} className="text-sun-600" /> {coinTotal}
                </span>
              </div>
              <div className="text-[11px] text-muted mt-0.5">所持 {coins.toLocaleString()} コイン{coins < coinTotal ? ` · あと ${coinTotal - coins} 足りません` : ''}</div>
              {coins >= coinTotal ? (
                <Button
                  full
                  variant="sun"
                  className="mt-2"
                  onClick={() => {
                    spendCoins(coinTotal, coinParts.map(partKey))
                    finishIfDone()
                  }}
                >
                  {coinTotal}コインで購入
                </Button>
              ) : (
                <Button full variant="sun" className="mt-2" onClick={() => setCoinOpen(true)}>
                  コインを買う
                </Button>
              )}
            </div>
          )}
          {plusParts.length > 0 && (
            <div className="rounded-2xl p-3 text-white bg-gradient-to-br from-night-900 to-[#5A3FC0]">
              <div className="flex items-center gap-1.5 font-bold text-[13px]">
                <Crown size={15} className="text-sun-300" /> 嵐プラスで使い放題
                <span className="ml-auto font-display">
                  ¥480<span className="text-[10px] text-white/60">/月</span>
                </span>
              </div>
              <div className="text-[11px] text-white/70 mt-0.5">{plusParts.map((p) => p.name).join('・')} ほか、プラス限定パーツがすべて使えます</div>
              <Button
                full
                variant="white"
                className="mt-2"
                onClick={() => {
                  joinPlus()
                  pushToast({ title: '嵐プラスに加入しました', body: 'モックのため実際の課金は発生しません。', tone: 'love' })
                  finishIfDone()
                }}
              >
                嵐プラスに加入する
              </Button>
            </div>
          )}
          {collabParts.length > 0 && (
            <div className="rounded-2xl border border-sea-200 bg-sea-100/60 p-3">
              <div className="font-bold text-[13px] flex items-center gap-1.5">
                <Ticket size={15} className="text-sea-600" /> 水族館コラボ
              </div>
              <div className="text-[11px] text-muted mt-0.5">台風明けデートで水族館クーポンを使うと、ふたりともジンベエ帽がもらえます（スポンサー連動の例）</div>
              <Button
                full
                variant="sea"
                className="mt-2"
                onClick={() => {
                  grant(collabParts.map(partKey))
                  finishIfDone()
                }}
              >
                クーポンで受け取る（デモ）
              </Button>
            </div>
          )}
          {expiredLimited.length > 0 && (
            <div className="rounded-2xl border border-line bg-cream-2 p-3 text-[12px] text-ink-2 leading-relaxed">
              <span className="font-bold">{expiredLimited.map((p) => p.name).join('・')}</span> は台風イベント中だけ手に入る限定アイテムです。次の台風を待ちましょう。
            </div>
          )}
        </div>
      </Sheet>

      <Sheet open={coinOpen} onClose={() => setCoinOpen(false)} title="コインを買う">
        <div className="flex flex-col gap-2">
          {COIN_PACKS.map((p, i) => (
            <button key={p.coins} onClick={() => buyPack(i)} disabled={paying !== null} className="w-full rounded-2xl border border-line bg-cream p-3 flex items-center gap-3 active:scale-[0.99] disabled:opacity-60">
              <span className="w-10 h-10 rounded-full bg-gradient-to-b from-sun-300 to-sun-500 text-white flex items-center justify-center">
                <Coins size={20} />
              </span>
              <div className="flex-1 text-left">
                <div className="font-display font-bold text-lg leading-tight">{p.coins.toLocaleString()} コイン</div>
                {p.bonus && <div className="text-[11px] text-love-600 font-bold">{p.bonus}</div>}
              </div>
              <span className="h-9 px-4 rounded-full bg-ink text-white text-sm font-bold flex items-center">
                <AnimatePresence mode="wait">
                  {paying === i ? (
                    <motion.span key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      処理中…
                    </motion.span>
                  ) : (
                    <motion.span key="n">{p.price}</motion.span>
                  )}
                </AnimatePresence>
              </span>
            </button>
          ))}
        </div>
        <div className="text-[11px] text-muted mt-3 text-center">モックのため実際の課金は発生しません</div>
      </Sheet>
    </Screen>
  )
}
