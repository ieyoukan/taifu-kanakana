import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { Button, Screen, cn } from '../components/ui'
import { PhotoBg, RainLayer } from '../components/visuals'

const SLIDES = [
  {
    photo: '/img/rain.jpg',
    kicker: '前味',
    title: '台風の日は、暇で、ちょっと不安。',
    body: '学校も仕事も休み。外には出られない。風の音だけがやけに大きい。そんな日が、沖縄には年に何度もある。',
    rain: true,
  },
  {
    photo: '/img/storm2.jpg',
    kicker: '中味',
    title: '同じ嵐の下に、誰かがいる。',
    body: '現在地をもとに、同じ台風を経験している人とだけ、匿名でつながる。本名も、正確な位置も、いらない。',
    rain: true,
  },
  {
    photo: '/img/beach.jpg',
    kicker: '後味',
    title: '嵐が過ぎても、恋は続く。',
    body: 'お互いが望めば、台風のあともつながったまま。晴れた日に、はじめて会う。「あの台風がなかったら、出会ってなかったね。」',
    rain: false,
  },
]

export default function Onboarding() {
  const [i, setI] = useState(0)
  const nav = useNavigate()
  const s = SLIDES[i]
  const last = i === SLIDES.length - 1
  return (
    <Screen dark>
      <AnimatePresence mode="sync">
        <motion.div key={i} className="absolute inset-0" initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
          <PhotoBg src={s.photo} overlay="from-night-900/10 via-night-900/55 to-night-900" />
          {s.rain && <RainLayer strength={0.6} />}
        </motion.div>
      </AnimatePresence>
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex justify-end p-4" style={{ paddingTop: 'calc(var(--sat) + 16px)' }}>
          <button onClick={() => nav('/signup')} className="text-sm font-bold text-white/70 px-3 py-1.5 rounded-full glass-dark text-white">
            スキップ
          </button>
        </div>
        <div className="flex-1" />
        <motion.div
          key={`t-${i}`}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="px-7"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60 && !last) setI(i + 1)
            if (info.offset.x > 60 && i > 0) setI(i - 1)
          }}
        >
          <div className="text-sea-300 font-bold text-xs tracking-widest">{s.kicker}</div>
          <h2 className="mt-2 text-[30px] font-black leading-[1.25] text-balance">{s.title}</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/80">{s.body}</p>
        </motion.div>
        <div className="px-7 pt-8 pb-10 flex items-center gap-4" style={{ paddingBottom: 'calc(var(--sab) + 36px)' }}>
          <div className="flex gap-1.5 flex-1">
            {SLIDES.map((_, k) => (
              <span key={k} className={cn('h-1.5 rounded-full transition-all', k === i ? 'w-7 bg-love-400' : 'w-1.5 bg-white/30')} />
            ))}
          </div>
          <Button size="lg" onClick={() => (last ? nav('/signup') : setI(i + 1))} className="min-w-[160px]">
            {last ? 'プロフィールを作る' : 'つぎへ'}
          </Button>
        </div>
      </div>
    </Screen>
  )
}
