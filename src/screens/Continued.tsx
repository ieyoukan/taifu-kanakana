import { motion } from 'motion/react'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar, Button, Screen } from '../components/ui'
import { Logo, PhotoBg } from '../components/visuals'
import { useStore } from '../lib/store'
import { PARTNERS, EVENT } from '../lib/data'

export default function Continued() {
  const { id = '' } = useParams()
  const nav = useNavigate()
  const partner = PARTNERS.find((p) => p.id === id) ?? PARTNERS[0]
  const profile = useStore((s) => s.profile)
  return (
    <Screen dark>
      <PhotoBg src="/img/beach.jpg" overlay="from-sea-500/10 via-night-900/30 to-night-900/90" />
      <motion.div className="absolute inset-0" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 2.2, delay: 0.9, ease: 'easeInOut' }}>
        <PhotoBg src="/img/storm2.jpg" overlay="from-night-900/40 via-night-900/50 to-night-900/90" />
      </motion.div>
      <motion.div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-night-950 to-night-900/80" initial={{ x: 0 }} animate={{ x: '-100%' }} transition={{ duration: 1.8, delay: 0.8, ease: [0.7, 0, 0.3, 1] }} />
      <motion.div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-night-950 to-night-900/80" initial={{ x: 0 }} animate={{ x: '100%' }} transition={{ duration: 1.8, delay: 0.8, ease: [0.7, 0, 0.3, 1] }} />

      <div className="relative flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="flex items-center justify-center gap-0">
          <motion.div initial={{ x: -90, opacity: 0 }} animate={{ x: 10, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.3 }}>
            {profile && <Avatar config={profile.avatar} size={96} ring="white" animated />}
          </motion.div>
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.3, 1], opacity: 1 }} transition={{ duration: 0.7, delay: 1.3 }} className="relative z-10 -mx-2">
            <div className="absolute inset-0 rounded-full bg-love-500/50 blur-2xl scale-150" />
            <div className="relative w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-card">
              <Logo size={40} />
            </div>
          </motion.div>
          <motion.div initial={{ x: 90, opacity: 0 }} animate={{ x: -10, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.3 }}>
            <Avatar seed={partner.avatar} size={96} ring="white" animated />
          </motion.div>
        </div>
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.8, duration: 0.6 }}>
          <div className="mt-8 text-sea-300 font-bold text-xs tracking-widest">継続マッチング成立</div>
          <h2 className="mt-2 text-[30px] font-black leading-tight">嵐が過ぎても、<br />話は続きます。</h2>
          <p className="mt-4 text-[14px] text-white/80 leading-relaxed">
            お互いが「続けたい」を選びました。{EVENT.typhoon}が通過しても、{partner.name}さんとのトークは残ります。
          </p>
        </motion.div>
      </div>
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 2.4, duration: 0.6 }} className="relative px-6 flex flex-col gap-2" style={{ paddingBottom: 'calc(var(--sab) + 32px)' }}>
        <Button size="lg" full variant="white" onClick={() => nav(`/chat/${partner.id}`)}>
          トークに戻る
        </Button>
        <Button variant="ghost" full className="text-white/70" onClick={() => nav('/home')}>
          ホームへ
        </Button>
      </motion.div>
    </Screen>
  )
}
