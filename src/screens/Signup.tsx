import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { Dices, ScanLine, CheckCircle2, MapPin, ShieldCheck } from 'lucide-react'
import { Avatar, Button, Card, Chip, Screen, TopBar, cn } from '../components/ui'
import { HOBBIES, NICKNAMES, STORM_STYLES, EVENT } from '../lib/data'
import { DEFAULT_AVATAR, partsBySlot, randomAvatar, BODY_COLORS, type AvatarConfig, type Slot } from '../lib/avatar'
import { useStore } from '../lib/store'
import type { Gender } from '../lib/data'

const STEPS = ['年齢確認', 'ニックネーム', '好きなこと', '恋愛の希望', '現在地']

const inputCls = 'w-full h-14 rounded-2xl bg-white border border-line-2 px-4 text-ink font-bold outline-none focus:border-love-400 focus:ring-4 focus:ring-love-100 placeholder:text-muted-2 placeholder:font-normal'

export default function Signup() {
  const nav = useNavigate()
  const existing = useStore((s) => s.profile)
  const setProfile = useStore((s) => s.setProfile)
  const pushToast = useStore((s) => s.pushToast)

  const [step, setStep] = useState(0)
  const [year, setYear] = useState(existing ? String(2026 - existing.age) : '')
  const [scan, setScan] = useState<'idle' | 'scanning' | 'done'>(existing?.verified ? 'done' : 'idle')
  const [nickname, setNickname] = useState(existing?.nickname ?? '')
  const [avatar, setAvatar] = useState<AvatarConfig>(existing?.avatar ?? DEFAULT_AVATAR)
  const [hobbies, setHobbies] = useState<string[]>(existing?.hobbies ?? [])
  const [styles, setStyles] = useState<string[]>(existing?.stormStyle ?? [])
  const [pref, setPref] = useState<Gender>(existing?.pref ?? 'any')
  const [purpose, setPurpose] = useState(existing?.purpose ?? '')
  const [loc, setLoc] = useState<'idle' | 'locating' | 'done'>('idle')

  const age = year ? 2026 - Number(year) : 0
  const adult = age >= 18 && age < 100

  useEffect(() => {
    if (scan !== 'scanning') return
    const t = setTimeout(() => setScan('done'), 2200)
    return () => clearTimeout(t)
  }, [scan])

  useEffect(() => {
    if (loc !== 'locating') return
    const t = setTimeout(() => setLoc('done'), 2000)
    return () => clearTimeout(t)
  }, [loc])

  const toggle = (list: string[], set: (v: string[]) => void, v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

  const canNext = [adult && scan === 'done', nickname.trim().length > 0, hobbies.length > 0 && styles.length > 0, purpose !== '', loc === 'done'][step]

  const finish = () => {
    setProfile({ nickname: nickname.trim(), avatar, city: '那覇市', age, hobbies, stormStyle: styles, pref, purpose, verified: true })
    pushToast({ title: `ようこそ、${nickname.trim()}さん`, body: `${EVENT.typhoon}が接近中。${EVENT.warning}の発表と同時にイベントを開始します。`, tone: 'love' })
    nav('/home')
  }

  return (
    <Screen>
      <TopBar back title={<span className="text-muted text-sm">{STEPS[step]} · {step + 1}/{STEPS.length}</span>} onBack={() => (step > 0 ? setStep(step - 1) : nav(-1))} />
      <div className="px-5 pt-1">
        <div className="flex gap-1.5">
          {STEPS.map((_, k) => (
            <span key={k} className={cn('h-1 flex-1 rounded-full transition-all', k <= step ? 'bg-love-500' : 'bg-line-2')} />
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-6 pb-6">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -24, opacity: 0 }} transition={{ duration: 0.22 }}>
            {step === 0 && (
              <div>
                <h2 className="text-[26px] font-black leading-tight">まず、年齢の確認から。</h2>
                <p className="mt-2 text-muted text-sm leading-relaxed">台風かなかなは18歳以上の方だけが使えます。18歳未満の方は、台風の日は宿題をしましょう。</p>
                <label className="block mt-6 text-xs font-bold text-muted">生まれた年</label>
                <input value={year} onChange={(e) => setYear(e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" placeholder="2003" className={cn(inputCls, 'mt-2 text-xl')} />
                {year.length === 4 && !adult && <div className="mt-2 text-love-600 text-xs font-bold">宿題、がんばってください。</div>}
                <Card className="mt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sea-100 text-sea-600 flex items-center justify-center">
                      <ShieldCheck size={22} />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm">本人確認</div>
                      <div className="text-xs text-muted">運転免許証・マイナンバーカードなどで年齢と本人を確認します</div>
                    </div>
                  </div>
                  <div className="relative mt-4 h-28 rounded-2xl bg-cream-2 border border-line overflow-hidden flex items-center justify-center">
                    <svg viewBox="0 0 160 100" className="h-20">
                      <rect x="4" y="10" width="152" height="80" rx="10" fill="#fff" stroke="#19B5C9" strokeOpacity="0.6" />
                      <circle cx="40" cy="48" r="16" fill="#E3F7F9" />
                      <rect x="66" y="34" width="70" height="7" rx="3.5" fill="#EFE7E3" />
                      <rect x="66" y="48" width="50" height="7" rx="3.5" fill="#EFE7E3" />
                      <rect x="66" y="62" width="60" height="7" rx="3.5" fill="#EFE7E3" />
                    </svg>
                    {scan === 'scanning' && <motion.div className="absolute left-0 right-0 h-0.5 bg-sea-500 shadow-[0_0_16px_#19B5C9]" initial={{ top: 0 }} animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 2.2, ease: 'easeInOut' }} />}
                    {scan === 'done' && (
                      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center gap-2 text-sea-600 font-bold">
                        <CheckCircle2 size={22} /> 確認できました（18歳以上）
                      </motion.div>
                    )}
                  </div>
                  {scan !== 'done' && (
                    <Button variant="sea" full className="mt-3" icon={<ScanLine size={18} />} onClick={() => setScan('scanning')} disabled={scan === 'scanning' || !adult}>
                      {scan === 'scanning' ? 'スキャン中…' : '身分証をスキャン'}
                    </Button>
                  )}
                </Card>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-[26px] font-black leading-tight">嵐の中での、名前と顔。</h2>
                <p className="mt-2 text-muted text-sm leading-relaxed">本名も写真もいりません。台風っぽい名前と、まるっこアバターで。</p>
                <div className="mt-6 flex gap-2">
                  <input value={nickname} onChange={(e) => setNickname(e.target.value.slice(0, 12))} placeholder="ニックネーム" className={cn(inputCls, 'flex-1 text-lg')} />
                  <button onClick={() => setNickname(NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)])} className="w-14 h-14 rounded-2xl bg-sun-100 border border-sun-200 flex items-center justify-center text-sun-600 active:scale-95" aria-label="おまかせ">
                    <Dices size={24} />
                  </button>
                </div>
                <div className="mt-1.5 text-[11px] text-muted">サイコロで「台風っぽい名前」をおまかせ</div>
                <div className="mt-6 rounded-[28px] bg-gradient-to-b from-love-100 via-sun-100/60 to-white border border-line p-4 flex items-center gap-4">
                  <Avatar config={avatar} size={104} animated className="shadow-card rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-lg truncate">{nickname || 'ニックネーム'}</div>
                    <div className="text-xs text-muted">那覇市 · {age}歳 · 匿名で表示</div>
                    <button onClick={() => setAvatar(randomAvatar(`${Date.now()}`, { freeOnly: true }))} className="mt-2 h-8 px-3 rounded-full bg-white border border-line text-[12px] font-bold text-ink-2 inline-flex items-center gap-1 active:scale-95">
                      <Dices size={14} className="text-sun-600" /> おまかせ
                    </button>
                  </div>
                </div>
                <div className="mt-5 text-xs font-bold text-muted">いろ</div>
                <div className="mt-2 flex gap-2.5 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
                  {partsBySlot('body')
                    .filter((p) => p.tier === 'free')
                    .map((p) => {
                      const st = BODY_COLORS[p.id]
                      return (
                        <button key={p.id} onClick={() => setAvatar({ ...avatar, body: p.id })} aria-label={p.name} className={cn('shrink-0 w-11 h-11 rounded-full border-[3px] transition-transform active:scale-90', avatar.body === p.id ? 'border-ink scale-105' : 'border-white shadow-soft')} style={{ background: `linear-gradient(160deg, ${st.join(', ')})` }} />
                      )
                    })}
                </div>
                {(['eyes', 'head', 'item'] as Slot[]).map((slot) => (
                  <div key={slot}>
                    <div className="mt-4 text-xs font-bold text-muted">{{ eyes: 'かお', head: 'あたま', item: 'もちもの' }[slot as 'eyes' | 'head' | 'item']}</div>
                    <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
                      {partsBySlot(slot)
                        .filter((p) => p.tier === 'free')
                        .map((p) => (
                          <button key={p.id} onClick={() => setAvatar({ ...avatar, [slot]: p.id })} className={cn('shrink-0 rounded-full transition-transform active:scale-95', avatar[slot] === p.id ? 'ring-[3px] ring-love-500' : 'opacity-85')}>
                            <Avatar config={{ ...avatar, [slot]: p.id }} size={56} />
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
                <div className="mt-4 rounded-2xl bg-sun-100 border border-sun-200 px-3 py-2.5 text-[12px] text-ink-2 leading-relaxed">
                  もっと可愛いパーツ（ゴールド・おうかん・台風限定のレインコートなど）は、あとで「着せかえ」から手に入ります。
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-[26px] font-black leading-tight">好きなこと、台風の過ごし方。</h2>
                <p className="mt-2 text-muted text-sm leading-relaxed">共通点があると、会話のきっかけになります。</p>
                <div className="mt-6 text-xs font-bold text-muted">趣味</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {HOBBIES.map((h) => (
                    <Chip key={h} active={hobbies.includes(h)} onClick={() => toggle(hobbies, setHobbies, h)}>
                      {h}
                    </Chip>
                  ))}
                </div>
                <div className="mt-6 text-xs font-bold text-muted">台風の日、何してる？</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {STORM_STYLES.map((h) => (
                    <Chip key={h} tone="sea" active={styles.includes(h)} onClick={() => toggle(styles, setStyles, h)}>
                      {h}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-[26px] font-black leading-tight">嵐の中で、探したいのは。</h2>
                <p className="mt-2 text-muted text-sm leading-relaxed">恋愛を意識しすぎなくて大丈夫。暇つぶしからでも始められます。</p>
                <div className="mt-6 text-xs font-bold text-muted">気になる相手</div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(
                    [
                      ['female', '女性'],
                      ['male', '男性'],
                      ['any', 'どちらでも'],
                    ] as Array<[Gender, string]>
                  ).map(([v, l]) => (
                    <button key={v} onClick={() => setPref(v)} className={cn('h-12 rounded-2xl font-bold text-sm border transition-all active:scale-95', pref === v ? 'bg-love-500 border-love-500 text-white' : 'bg-white border-line-2 text-ink-2')}>
                      {l}
                    </button>
                  ))}
                </div>
                <div className="mt-6 text-xs font-bold text-muted">目的</div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[
                    ['話し相手', '嵐の夜の暇つぶし'],
                    ['友達', '台風仲間がほしい'],
                    ['恋人', '嵐が過ぎても続く関係'],
                    ['まだわからない', '話してから決める'],
                  ].map(([l, sub]) => (
                    <button key={l} onClick={() => setPurpose(l)} className={cn('p-3 rounded-2xl text-left border transition-all active:scale-95', purpose === l ? 'bg-love-100 border-love-400 text-ink' : 'bg-white border-line-2 text-ink-2')}>
                      <div className="font-bold text-sm">{l}</div>
                      <div className="text-[11px] text-muted mt-0.5">{sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-[26px] font-black leading-tight">いま、どの嵐の下にいる？</h2>
                <p className="mt-2 text-muted text-sm leading-relaxed">現在地から、地域と台風の状況を確認します。相手に見えるのは市町村名だけです。</p>
                <div className="mt-8 relative h-52 rounded-[28px] bg-sea-100 border border-sea-200 overflow-hidden flex items-center justify-center">
                  {[0, 1, 2].map((k) => (
                    <motion.span
                      key={k}
                      className="absolute w-24 h-24 rounded-full border-2 border-sea-400"
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={loc === 'locating' ? { scale: [0.4, 2.4], opacity: [0.8, 0] } : { scale: 0.4, opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity, delay: k * 0.6, ease: 'easeOut' }}
                    />
                  ))}
                  <motion.div animate={loc === 'done' ? { scale: 1.1 } : { scale: 1 }} className={cn('w-16 h-16 rounded-full flex items-center justify-center', loc === 'done' ? 'bg-love-500 text-white shadow-glow-love' : 'bg-white text-sea-500 shadow-soft')}>
                    <MapPin size={30} />
                  </motion.div>
                  {loc === 'done' && (
                    <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white p-3 text-center shadow-soft">
                      <div className="font-bold">沖縄県 那覇市 を検出しました</div>
                      <div className="text-[11px] text-muted mt-0.5">{EVENT.typhoon}の対象地域です · 位置は市町村単位で保存</div>
                    </motion.div>
                  )}
                </div>
                {loc !== 'done' && (
                  <Button variant="sea" full className="mt-4" onClick={() => setLoc('locating')} disabled={loc === 'locating'}>
                    {loc === 'locating' ? '確認中…' : '位置情報を許可する'}
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="px-5 pt-2 bg-cream" style={{ paddingBottom: 'calc(var(--sab) + 16px)' }}>
        <Button size="lg" full disabled={!canNext} onClick={() => (step < 4 ? setStep(step + 1) : finish())}>
          {step < 4 ? 'つぎへ' : '嵐の下へ'}
        </Button>
      </div>
    </Screen>
  )
}
