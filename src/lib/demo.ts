import { useStore, type Phase } from './store'

export function applyPhase(phase: Phase) {
  const s = useStore.getState()
  if (s.phase === phase) return
  s.setPhase(phase)
  switch (phase) {
    case 'calm':
      s.pushToast({ title: '今日は晴れ', body: '次の台風まで、新規マッチングはお休みです。', tone: 'wind', to: '/home' })
      break
    case 'approach':
      s.pushToast({ title: '台風25号が接近しています', body: '今夜21時からマッチングイベントを開催予定。参加予約を受付中。', tone: 'love', to: '/home' })
      break
    case 'storm':
      s.pushToast({ title: 'イベント開始', body: '台風25号が沖縄本島に上陸。同じ嵐の下に1,284人がいます。', tone: 'love', to: '/home' })
      break
    case 'passed':
      s.pushToast({ title: '台風25号が通過しました', body: 'おつかれさまでした。嵐が過ぎても、恋は続く。', tone: 'sun', to: '/passed' })
      break
  }
}

export function toggleBlackout() {
  const s = useStore.getState()
  const next = !s.blackout
  s.setBlackout(next)
  if (next) {
    s.pushToast({ title: '那覇市で停電が発生', body: 'ろうそくモードに切り替わりました。充電は大切に。', tone: 'sun' })
  } else {
    s.pushToast({ title: '電気が復旧しました', body: 'ろうそくは安全に消しましょう。', tone: 'wind' })
  }
}
