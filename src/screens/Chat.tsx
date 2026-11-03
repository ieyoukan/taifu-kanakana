import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useNavigate, useParams } from 'react-router-dom'
import { MoreHorizontal, Send, Sticker, Wind, Heart, Flag, Ban, MapPin, Sun, Flame, Lightbulb } from 'lucide-react'
import { Avatar, Button, Screen, Sheet, Tag, TopBar, cn } from '../components/ui'
import { PhotoBg, RainLayer } from '../components/visuals'
import { StampIcon } from '../components/chrome'
import { useStore, type Msg } from '../lib/store'
import { PARTNERS, SCRIPTS, FALLBACK_SCRIPT, OPENERS, STAMPS, STAMP_REPLIES, EVENT } from '../lib/data'

const EMPTY: Msg[] = []

function Typing({ dark }: { dark: boolean }) {
  return (
    <div className={cn('inline-flex items-center gap-1 h-9 px-4 rounded-[20px] rounded-bl-md', dark ? 'glass-dark' : 'bg-white border border-line')}>
      {[0, 1, 2].map((i) => (
        <motion.span key={i} className={cn('w-1.5 h-1.5 rounded-full', dark ? 'bg-white/70' : 'bg-muted-2')} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />
      ))}
    </div>
  )
}

export default function Chat() {
  const { id = '' } = useParams()
  const nav = useNavigate()
  const partner = PARTNERS.find((p) => p.id === id) ?? PARTNERS[0]
  const profile = useStore((s) => s.profile)
  const messages = useStore((s) => s.messages[partner.id] ?? EMPTY)
  const step = useStore((s) => s.step[partner.id] ?? 0)
  const blackout = useStore((s) => s.blackout)
  const phase = useStore((s) => s.phase)
  const continued = useStore((s) => s.continued.includes(partner.id))
  const liked = useStore((s) => s.likedByMe.includes(partner.id))
  const script = SCRIPTS[partner.id] ?? FALLBACK_SCRIPT

  const [typing, setTyping] = useState(false)
  const [text, setText] = useState('')
  const [stampOpen, setStampOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const timers = useRef<number[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const prevBlackout = useRef(blackout)

  const later = (fn: () => void, ms: number) => {
    const t = window.setTimeout(fn, ms)
    timers.current.push(t)
  }
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const add = (m: Omit<Msg, 'id' | 'at'>) => useStore.getState().addMessage(partner.id, m)

  useEffect(() => {
    if ((useStore.getState().messages[partner.id] ?? EMPTY).length > 0) return
    add({ from: 'system', kind: 'text', text: `同じ${EVENT.typhoon}を経験中のふたりです。本名や正確な位置は共有されません。` })
    add({ from: 'system', kind: 'topic', text: `いま、${partner.city}は風速${partner.wind}m/s。「飛ばされそう」から話してみよう` })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partner.id])

  useEffect(() => {
    if (prevBlackout.current === blackout) return
    prevBlackout.current = blackout
    if (blackout) {
      add({ from: 'system', kind: 'text', text: `${profile?.city ?? '那覇市'}で停電が発生。ろうそくモードに切り替えました。` })
      later(() => {
        setTyping(true)
        later(() => {
          setTyping(false)
          add({ from: 'partner', kind: 'text', text: 'え、そっち停電した？ ろうそく仲間だ' })
        }, 1400)
      }, 800)
    } else {
      add({ from: 'system', kind: 'text', text: '電気が復旧しました。' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blackout])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length, typing])

  const hasContinuePrompt = messages.some((m) => m.kind === 'continue')
  const ended = phase === 'passed' && !continued

  const suggestions = useMemo(() => {
    if (typing || ended) return []
    if (step === 0) return OPENERS
    if (step - 1 < script.length) return script[step - 1].suggestions
    return []
  }, [step, typing, script, ended])

  const partnerSay = (lines: string[], after?: () => void) => {
    let delay = 500
    lines.forEach((line, i) => {
      later(() => setTyping(true), delay)
      delay += 700 + Math.min(line.length * 45, 1400)
      later(() => {
        setTyping(false)
        add({ from: 'partner', kind: 'text', text: line })
        if (i === lines.length - 1) after?.()
      }, delay)
      delay += 350
    })
  }

  const sendTurn = (t: string) => {
    if (!t.trim()) return
    add({ from: 'me', kind: 'text', text: t.trim() })
    setText('')
    const k = step
    useStore.getState().setStep(partner.id, step + 1)
    if (k < script.length) {
      partnerSay(script[k].partner, () => {
        if (k === script.length - 1 && !hasContinuePrompt && !continued) {
          later(() => add({ from: 'system', kind: 'continue', text: '話していて楽しい？ 嵐が過ぎても、話を続けますか？' }), 1200)
        }
      })
    } else if (!continued) {
      partnerSay([['だからよー', 'わかる', 'それな', 'うん、話してて楽しい'][Math.floor(Math.random() * 4)]])
    } else {
      partnerSay([['晴れたら会おうね', 'だからよー', '台風、ありがとうだね'][Math.floor(Math.random() * 3)]])
    }
  }

  const sendStamp = (sid: string) => {
    const st = STAMPS.find((s) => s.id === sid)!
    add({ from: 'me', kind: 'stamp', text: st.label, stampId: st.id })
    setStampOpen(false)
    if (st.id === 'blackout' && !blackout) {
      later(() => useStore.getState().setBlackout(true), 600)
      return
    }
    partnerSay(STAMP_REPLIES[st.id] ?? ['だからよー'])
  }

  const onContinue = () => {
    useStore.getState().like(partner.id)
    add({ from: 'me', kind: 'text', text: '嵐が過ぎても、続けたい' })
    later(() => setTyping(true), 700)
    later(() => {
      setTyping(false)
      add({ from: 'system', kind: 'continued', text: `${partner.name}さんも「続けたい」を選びました` })
      useStore.getState().markContinued(partner.id)
      later(() => nav(`/continued/${partner.id}`), 900)
    }, 2300)
  }

  const dk = blackout

  return (
    <Screen dark={dk} bg={dk ? <><PhotoBg src="/img/candle.jpg" overlay="from-night-950/70 via-night-950/55 to-night-950/85" position="center 70%" /><div className="absolute inset-0 animate-flicker" style={{ background: 'radial-gradient(ellipse at 50% 90%, rgba(255,173,51,0.28), transparent 60%)' }} /></> : phase === 'storm' ? <RainLayer strength={0.15} /> : undefined}>
      <TopBar
        back
        dark={dk}
        onBack={() => nav(-1)}
        title={
          <div className="flex items-center gap-2.5">
            <Avatar seed={partner.avatar} size={36} ring={continued ? 'love' : undefined} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="truncate">{partner.name}</span>
                {continued && <Tag tone="love" dark={dk}>継続中</Tag>}
              </div>
              <div className={cn('text-[10px] font-normal flex items-center gap-1', dk ? 'text-white/60' : 'text-muted')}>
                <MapPin size={10} /> {partner.city} · {dk ? 'ろうそくの灯りで会話中' : `同じ${EVENT.typhoon}の中`}
              </div>
            </div>
          </div>
        }
        right={
          <button onClick={() => setMenuOpen(true)} className={cn('w-11 h-11 rounded-full flex items-center justify-center', dk ? 'text-white' : 'text-ink')} aria-label="メニュー">
            <MoreHorizontal size={22} />
          </button>
        }
      />

      {phase === 'storm' && (
        <div className={cn('mx-4 mt-2 rounded-2xl px-3 py-2 flex items-center gap-2 text-[11px] font-bold', dk ? 'glass-dark text-white/85' : 'bg-night-900 text-white')}>
          <Wind size={14} className="text-sea-300" />
          <span>
            {profile?.city ?? '那覇市'} 42m/s
          </span>
          <span className="opacity-50">↔</span>
          <span>
            {partner.city} {partner.wind}m/s
          </span>
          <span className="ml-auto opacity-70">{dk ? <Flame size={13} className="inline text-sun-300" /> : 'ふたりとも嵐の中'}</span>
        </div>
      )}
      {phase === 'passed' && continued && (
        <div className="mx-4 mt-2 rounded-2xl bg-sun-100 border border-sun-200 px-3 py-2.5 flex items-center gap-2">
          <Sun size={16} className="text-sun-600" />
          <div className="flex-1 text-[12px] font-bold text-ink">台風が通過しました。晴れた日に会いませんか？</div>
          <Button size="sm" variant="sun" onClick={() => nav(`/date/${partner.id}`)}>
            計画する
          </Button>
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 py-3">
        <div className="flex flex-col gap-2.5">
          {messages.map((m) => {
            if (m.from === 'system') {
              if (m.kind === 'topic')
                return (
                  <div key={m.id} className={cn('mx-auto max-w-[88%] rounded-2xl p-3 text-center', dk ? 'glass-dark' : 'bg-sea-100 border border-sea-200')}>
                    <div className={cn('text-[10px] font-bold flex items-center justify-center gap-1', dk ? 'text-sea-300' : 'text-sea-600')}>
                      <Lightbulb size={11} /> 会話のきっかけ
                    </div>
                    <div className="text-[12px] mt-1 leading-snug">{m.text}</div>
                  </div>
                )
              if (m.kind === 'continue')
                return (
                  <motion.div key={m.id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={cn('mx-auto w-full rounded-[22px] p-4 text-center', dk ? 'glass-dark' : 'bg-white border border-love-200 shadow-soft')}>
                    <div className="mx-auto w-11 h-11 rounded-full bg-love-100 text-love-500 flex items-center justify-center">
                      <Heart size={22} fill="currentColor" />
                    </div>
                    <div className="mt-2 font-bold text-[14px]">{m.text}</div>
                    <div className={cn('text-[11px] mt-1', dk ? 'text-white/60' : 'text-muted')}>お互いが選ぶと、{EVENT.typhoon}が過ぎてもトークが残ります</div>
                    <Button full className="mt-3" onClick={onContinue} disabled={liked}>
                      {liked ? '「続けたい」を送りました' : '嵐が過ぎても、続けたい'}
                    </Button>
                  </motion.div>
                )
              if (m.kind === 'continued')
                return (
                  <div key={m.id} className="mx-auto rounded-full bg-love-500 text-white text-[12px] font-bold px-4 py-1.5 flex items-center gap-1.5">
                    <Heart size={12} fill="currentColor" /> {m.text}
                  </div>
                )
              return (
                <div key={m.id} className={cn('mx-auto max-w-[90%] text-center text-[11px] leading-snug px-3 py-1.5 rounded-full', dk ? 'text-white/60 bg-white/5' : 'text-muted bg-ink/5')}>
                  {m.text}
                </div>
              )
            }
            const mine = m.from === 'me'
            if (m.kind === 'stamp') {
              const st = STAMPS.find((s) => s.id === m.stampId)!
              return (
                <motion.div key={m.id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                  <div className={cn('rounded-[22px] p-3 flex items-center gap-3 w-[200px]', dk ? 'glass-dark' : 'bg-white border border-line shadow-soft')}>
                    <StampIcon stamp={st} size={24} />
                    <div>
                      <div className="font-bold text-[14px] leading-tight">{st.label}</div>
                      <div className={cn('text-[11px]', dk ? 'text-white/60' : 'text-muted')}>{st.sub}</div>
                    </div>
                  </div>
                </motion.div>
              )
            }
            return (
              <motion.div key={m.id} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={cn('flex items-end gap-2', mine ? 'justify-end' : 'justify-start')}>
                {!mine && <Avatar seed={partner.avatar} size={26} />}
                <div
                  className={cn(
                    'max-w-[76%] px-4 py-2.5 text-[14px] leading-relaxed rounded-[20px]',
                    mine ? (dk ? 'bg-gradient-to-br from-sun-300 to-sun-400 text-ink rounded-br-md' : 'bg-gradient-to-br from-love-500 to-love-400 text-white rounded-br-md') : dk ? 'glass-dark text-white rounded-bl-md' : 'bg-white border border-line text-ink rounded-bl-md shadow-soft',
                  )}
                >
                  {m.text}
                </div>
              </motion.div>
            )
          })}
          {typing && (
            <div className="flex items-end gap-2">
              <Avatar seed={partner.avatar} size={26} />
              <Typing dark={dk} />
            </div>
          )}
          <div ref={bottomRef} className="h-1" />
        </div>
      </div>

      <div className={cn('shrink-0', dk ? 'glass-dark' : 'bg-white border-t border-line')} style={{ paddingBottom: 'var(--sab)' }}>
        {ended ? (
          <div className={cn('px-5 py-4 text-center text-[12px] leading-relaxed', dk ? 'text-white/60' : 'text-muted')}>
            {EVENT.typhoon}のイベントは終了しました。継続マッチングした相手とだけ、トークを続けられます。
          </div>
        ) : (
          <>
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-2 overflow-x-auto no-scrollbar px-4 pt-3">
                  {suggestions.map((s) => (
                    <button key={s} onClick={() => sendTurn(s)} className={cn('shrink-0 h-9 px-3.5 rounded-full text-[13px] font-bold border active:scale-95', dk ? 'border-sun-300/50 text-sun-200 bg-white/5' : 'border-love-300 text-love-600 bg-love-100/60')}>
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-center gap-2 px-3 py-2.5">
              <button onClick={() => setStampOpen(true)} className={cn('w-11 h-11 rounded-full flex items-center justify-center shrink-0', dk ? 'bg-white/10 text-sun-300' : 'bg-cream-2 text-love-500 border border-line')} aria-label="スタンプ">
                <Sticker size={22} />
              </button>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendTurn(text)}
                placeholder="メッセージ"
                className={cn('flex-1 min-w-0 h-11 rounded-full px-4 outline-none text-base', dk ? 'bg-white/10 text-white placeholder:text-white/40' : 'bg-cream-2 border border-line text-ink placeholder:text-muted-2')}
              />
              <button onClick={() => sendTurn(text)} className={cn('w-11 h-11 rounded-full flex items-center justify-center shrink-0 active:scale-95', text.trim() ? (dk ? 'bg-sun-400 text-ink' : 'bg-love-500 text-white') : dk ? 'bg-white/10 text-white/40' : 'bg-ink/5 text-muted-2')} aria-label="送信">
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>

      <Sheet open={stampOpen} onClose={() => setStampOpen(false)} title="いまの状況スタンプ">
        <div className="grid grid-cols-3 gap-2">
          {STAMPS.map((st) => (
            <button key={st.id} onClick={() => sendStamp(st.id)} className="rounded-2xl border border-line bg-cream p-2.5 flex flex-col items-center gap-1.5 active:scale-95">
              <StampIcon stamp={st} size={20} />
              <div className="font-bold text-[12px] leading-tight text-center">{st.label}</div>
            </button>
          ))}
        </div>
        <div className="text-[11px] text-muted mt-3 text-center">「停電した」を送ると、ふたりのチャットがろうそくモードになります</div>
      </Sheet>

      <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} title={partner.name}>
        <div className="flex flex-col gap-1">
          {[
            [MapPin, '相手に見えている情報', 'ニックネーム・市町村・スタンプだけ'],
            [Flag, '通報する', '不審な勧誘・不適切な発言など'],
            [Ban, 'ブロックする', '今後この相手とはマッチングしません'],
          ].map(([Icon, t, sub]) => {
            const I = Icon as typeof Flag
            return (
              <button key={t as string} onClick={() => setMenuOpen(false)} className="w-full text-left flex items-center gap-3 p-3 rounded-2xl active:bg-ink/5">
                <div className="w-10 h-10 rounded-xl bg-cream-2 border border-line flex items-center justify-center text-ink-2">
                  <I size={18} />
                </div>
                <div>
                  <div className="font-bold text-sm">{t as string}</div>
                  <div className="text-[11px] text-muted">{sub as string}</div>
                </div>
              </button>
            )
          })}
          <Button variant="danger" full className="mt-2" onClick={() => nav('/home')}>
            会話を終了する
          </Button>
        </div>
      </Sheet>
    </Screen>
  )
}
