import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FEED_SEED, type Gender } from './data'

export type Phase = 'calm' | 'approach' | 'storm' | 'passed'

export type Msg = {
  id: string
  from: 'me' | 'partner' | 'system'
  kind: 'text' | 'stamp' | 'topic' | 'continue' | 'continued'
  text: string
  stampId?: string
  at: number
}

export type Profile = {
  nickname: string
  avatar: string
  city: string
  age: number
  hobbies: string[]
  stormStyle: string[]
  pref: Gender
  purpose: string
  verified: boolean
}

export type FeedItem = { id: string; city: string; text: string; likes: number; at: number; mine?: boolean; liked?: boolean }

export type Toast = { id: string; title: string; body: string; tone?: 'love' | 'wind' | 'sun' | 'mist'; to?: string }

export const uid = () => Math.random().toString(36).slice(2, 10)

type State = {
  profile: Profile | null
  phase: Phase
  blackout: boolean
  reserved: boolean
  joined: boolean
  safetyAck: boolean
  passedSeen: boolean
  messages: Record<string, Msg[]>
  step: Record<string, number>
  likedByMe: string[]
  continued: string[]
  met: string[]
  feed: FeedItem[]
  toasts: Toast[]
  dateProposed: Record<string, string>
  revealed: Record<string, boolean>

  setProfile: (p: Profile) => void
  setPhase: (p: Phase) => void
  setBlackout: (b: boolean) => void
  reserve: () => void
  join: () => void
  ackSafety: () => void
  markPassedSeen: () => void
  addMessage: (pid: string, m: Omit<Msg, 'id' | 'at'>) => void
  setStep: (pid: string, s: number) => void
  like: (pid: string) => void
  markContinued: (pid: string) => void
  addMet: (pid: string) => void
  addFeed: (f: Omit<FeedItem, 'id' | 'at'>) => void
  likeFeed: (id: string) => void
  pushToast: (t: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void
  proposeDate: (pid: string, spot: string) => void
  reveal: (pid: string) => void
  reset: () => void
}

const seedFeed = (): FeedItem[] =>
  FEED_SEED.map((f, i) => ({ ...f, id: `seed-${i}`, at: Date.now() - (i + 1) * 4 * 60 * 1000 }))

const initial = {
  profile: null,
  phase: 'approach' as Phase,
  blackout: false,
  reserved: false,
  joined: false,
  safetyAck: false,
  passedSeen: false,
  messages: {},
  step: {},
  likedByMe: [],
  continued: [],
  met: [],
  feed: seedFeed(),
  toasts: [],
  dateProposed: {},
  revealed: {},
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      ...initial,
      setProfile: (profile) => set({ profile }),
      setPhase: (phase) =>
        set((s) => ({
          phase,
          blackout: phase === 'storm' ? s.blackout : false,
          passedSeen: phase === 'passed' ? s.passedSeen : false,
        })),
      setBlackout: (blackout) => set({ blackout }),
      reserve: () => set({ reserved: true }),
      join: () => set({ joined: true }),
      ackSafety: () => set({ safetyAck: true }),
      markPassedSeen: () => set({ passedSeen: true }),
      addMessage: (pid, m) =>
        set((s) => ({
          messages: { ...s.messages, [pid]: [...(s.messages[pid] ?? []), { ...m, id: uid(), at: Date.now() }] },
        })),
      setStep: (pid, n) => set((s) => ({ step: { ...s.step, [pid]: n } })),
      like: (pid) => set((s) => ({ likedByMe: s.likedByMe.includes(pid) ? s.likedByMe : [...s.likedByMe, pid] })),
      markContinued: (pid) => set((s) => ({ continued: s.continued.includes(pid) ? s.continued : [...s.continued, pid] })),
      addMet: (pid) => set((s) => ({ met: s.met.includes(pid) ? s.met : [...s.met, pid] })),
      addFeed: (f) => set((s) => ({ feed: [{ ...f, id: uid(), at: Date.now() }, ...s.feed].slice(0, 60) })),
      likeFeed: (id) =>
        set((s) => ({
          feed: s.feed.map((f) => (f.id === id ? { ...f, likes: f.liked ? f.likes - 1 : f.likes + 1, liked: !f.liked } : f)),
        })),
      pushToast: (t) => set((s) => ({ toasts: [...s.toasts, { ...t, id: uid() }].slice(-3) })),
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
      proposeDate: (pid, spot) => set((s) => ({ dateProposed: { ...s.dateProposed, [pid]: spot } })),
      reveal: (pid) => set((s) => ({ revealed: { ...s.revealed, [pid]: true } })),
      reset: () => set({ ...initial, feed: seedFeed() }),
    }),
    {
      name: 'taifu-kanakana-v1',
      partialize: (s) => ({
        profile: s.profile,
        phase: s.phase,
        blackout: s.blackout,
        reserved: s.reserved,
        joined: s.joined,
        safetyAck: s.safetyAck,
        passedSeen: s.passedSeen,
        messages: s.messages,
        step: s.step,
        likedByMe: s.likedByMe,
        continued: s.continued,
        met: s.met,
        feed: s.feed,
        dateProposed: s.dateProposed,
        revealed: s.revealed,
      }),
    },
  ),
)

export type Weather = {
  name: string
  pressure: number
  wind: number
  rain: number
  index: number
  label: string
  caption: string
  people: number
}

export const weatherFor = (phase: Phase): Weather => {
  switch (phase) {
    case 'calm':
      return { name: '晴れ', pressure: 1012, wind: 4, rain: 0, index: 8, label: 'おやすみ中', caption: '次の台風まで、新規マッチングはお休み', people: 0 }
    case 'approach':
      return { name: '台風25号 接近中', pressure: 985, wind: 18, rain: 12, index: 46, label: '予報あり', caption: '今夜21時、イベント開始予定', people: 638 }
    case 'storm':
      return { name: '台風25号 直撃中', pressure: 952, wind: 42, rain: 68, index: 98, label: '出会い指数 MAX', caption: '低気圧ほど、心の距離は近づく（当社調べ）', people: 1284 }
    case 'passed':
      return { name: '台風25号 通過', pressure: 1004, wind: 9, rain: 0, index: 20, label: '通過しました', caption: '嵐が過ぎても、恋は続く', people: 0 }
  }
}
