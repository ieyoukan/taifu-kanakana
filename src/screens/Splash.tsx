import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { Button, Screen } from '../components/ui'
import { Logo, PhotoBg, RainLayer, Wordmark } from '../components/visuals'
import { useStore } from '../lib/store'

export default function Splash() {
  const nav = useNavigate()
  const profile = useStore((s) => s.profile)
  return (
    <Screen dark bg={<><PhotoBg src="/img/storm2.jpg" overlay="from-night-900/30 via-night-900/60 to-night-900" /><RainLayer strength={0.7} /></>}>
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} className="relative">
          <div className="absolute inset-0 rounded-full bg-love-500/40 blur-3xl scale-150" />
          <Logo size={128} animate />
        </motion.div>
        <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.5, duration: 0.6 }} className="mt-6">
          <Wordmark size={40} className="text-white" />
        </motion.div>
        <motion.h1 initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.8, duration: 0.6 }} className="mt-6 text-[28px] font-black leading-tight text-balance">
          台風の日、恋がかなう。
        </motion.h1>
        <motion.p initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 2.1, duration: 0.6 }} className="mt-2 text-love-300 font-bold">
          嵐が過ぎても、恋は続く。
        </motion.p>
      </div>
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 2.3, duration: 0.6 }} className="px-6 pb-10 flex flex-col gap-3" style={{ paddingBottom: 'calc(var(--sab) + 40px)' }}>
        {profile ? (
          <>
            <Button size="lg" full onClick={() => nav('/home')}>
              つづきから（{profile.nickname}）
            </Button>
            <Button variant="ghost" full onClick={() => nav('/onboarding')}>
              はじめから見る
            </Button>
          </>
        ) : (
          <>
            <Button size="lg" full onClick={() => nav('/onboarding')}>
              はじめる
            </Button>
            <Button variant="ghost" full onClick={() => nav('/signup')}>
              ログイン
            </Button>
          </>
        )}
        <div className="text-center text-[11px] text-white/50">18歳以上 · 沖縄県限定ベータ · 位置情報は市町村単位でのみ使用</div>
      </motion.div>
    </Screen>
  )
}
