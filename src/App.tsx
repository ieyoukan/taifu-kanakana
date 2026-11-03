import { useEffect, type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { PhoneFrame } from './components/frame'
import { Toasts } from './components/chrome'
import { useStore } from './lib/store'
import { FEED_LIVE } from './lib/data'
import Splash from './screens/Splash'
import Onboarding from './screens/Onboarding'
import Signup from './screens/Signup'
import Home from './screens/Home'
import Feed from './screens/Feed'
import Match from './screens/Match'
import Chat from './screens/Chat'
import Continued from './screens/Continued'
import Talks from './screens/Talks'
import Me from './screens/Me'
import Passed from './screens/Passed'
import DatePlan from './screens/DatePlan'

function Guard({ children }: { children: ReactNode }) {
  const profile = useStore((s) => s.profile)
  if (!profile) return <Navigate to="/" replace />
  return <>{children}</>
}

function LiveFeed() {
  const phase = useStore((s) => s.phase)
  const addFeed = useStore((s) => s.addFeed)
  useEffect(() => {
    if (phase !== 'storm') return
    let i = Math.floor(Math.random() * FEED_LIVE.length)
    const id = setInterval(() => {
      const f = FEED_LIVE[i % FEED_LIVE.length]
      addFeed({ ...f, likes: Math.floor(Math.random() * 40) })
      i++
    }, 7000)
    return () => clearInterval(id)
  }, [phase, addFeed])
  return null
}

export default function App() {
  const location = useLocation()
  return (
    <PhoneFrame>
      <LiveFeed />
      <Toasts />
      <motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.22 }} className="h-full">
        <Routes location={location}>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Guard><Home /></Guard>} />
          <Route path="/feed" element={<Guard><Feed /></Guard>} />
          <Route path="/match" element={<Guard><Match /></Guard>} />
          <Route path="/chat/:id" element={<Guard><Chat /></Guard>} />
          <Route path="/continued/:id" element={<Guard><Continued /></Guard>} />
          <Route path="/talks" element={<Guard><Talks /></Guard>} />
          <Route path="/me" element={<Guard><Me /></Guard>} />
          <Route path="/passed" element={<Guard><Passed /></Guard>} />
          <Route path="/date/:id" element={<Guard><DatePlan /></Guard>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </PhoneFrame>
  )
}
