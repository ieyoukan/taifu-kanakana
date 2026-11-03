// まるっこアバター：パーツを組み合わせる着せかえ式。収益化はパーツ単位で行う。
export type Tier = 'free' | 'plus' | 'coin' | 'limited' | 'collab'
export type Slot = 'body' | 'eyes' | 'mouth' | 'head' | 'item' | 'bg' | 'fx'
export type AvatarConfig = Record<Slot, string>

export type Part = { id: string; slot: Slot; name: string; tier: Tier; price?: number; note?: string }

export const SLOTS: Array<{ id: Slot; label: string }> = [
  { id: 'body', label: 'からだ' },
  { id: 'eyes', label: 'め' },
  { id: 'mouth', label: 'くち' },
  { id: 'head', label: 'あたま' },
  { id: 'item', label: 'もちもの' },
  { id: 'bg', label: 'はいけい' },
  { id: 'fx', label: 'エフェクト' },
]

export const TIER_LABEL: Record<Tier, string> = {
  free: '無料',
  plus: '嵐プラス',
  coin: 'コイン',
  limited: '台風限定',
  collab: 'コラボ',
}

// 上から下へのグラデーション
export const BODY_COLORS: Record<string, string[]> = {
  pink: ['#FFC6D7', '#FF7FA8'],
  peach: ['#FFD9B8', '#FF9A5C'],
  lemon: ['#FFF3B0', '#FFC93C'],
  mint: ['#C4F7E0', '#3FCF9A'],
  sky: ['#CDEEFF', '#4BB3F5'],
  lilac: ['#E6DAFF', '#9C7BFF'],
  coral: ['#FFCFC8', '#FF6B6B'],
  milk: ['#FFFFFF', '#E6DDD2'],
  sunset: ['#FFE08A', '#FF8FA8', '#A97BFF'],
  churaumi: ['#B8F6FF', '#2BC4E0', '#2F6FE0'],
  rainbow: ['#FF8FA8', '#FFD25C', '#6BE0A8', '#6CC8FF', '#B79BFF'],
  gold: ['#FFF6C2', '#FFC93C', '#E8921A'],
}

export const BG_COLORS: Record<string, string> = {
  cream: '#FFF1E6',
  sakura: '#FFE3EC',
  sora: '#DDF1FF',
  mintbg: '#DDF7EC',
  lemonbg: '#FFF6CF',
}

export const PARTS: Part[] = [
  { slot: 'body', id: 'pink', name: 'もも', tier: 'free' },
  { slot: 'body', id: 'peach', name: 'みかん', tier: 'free' },
  { slot: 'body', id: 'lemon', name: 'レモン', tier: 'free' },
  { slot: 'body', id: 'mint', name: 'ミント', tier: 'free' },
  { slot: 'body', id: 'sky', name: 'そら', tier: 'free' },
  { slot: 'body', id: 'lilac', name: 'ラベンダー', tier: 'free' },
  { slot: 'body', id: 'coral', name: 'さんご', tier: 'free' },
  { slot: 'body', id: 'milk', name: 'ミルク', tier: 'free' },
  { slot: 'body', id: 'sunset', name: 'ゆうやけ', tier: 'coin', price: 120 },
  { slot: 'body', id: 'churaumi', name: 'ちゅら海', tier: 'plus' },
  { slot: 'body', id: 'rainbow', name: '台風のあとの虹', tier: 'coin', price: 200 },
  { slot: 'body', id: 'gold', name: 'ゴールド', tier: 'coin', price: 480 },

  { slot: 'eyes', id: 'dot', name: 'まる', tier: 'free' },
  { slot: 'eyes', id: 'sparkle', name: 'キラキラ', tier: 'free' },
  { slot: 'eyes', id: 'happy', name: 'にっこり', tier: 'free' },
  { slot: 'eyes', id: 'wink', name: 'ウインク', tier: 'free' },
  { slot: 'eyes', id: 'sleepy', name: 'ねむい', tier: 'free' },
  { slot: 'eyes', id: 'heart', name: 'ハート', tier: 'plus' },
  { slot: 'eyes', id: 'star', name: 'ほし', tier: 'coin', price: 100 },

  { slot: 'mouth', id: 'smile', name: 'にこ', tier: 'free' },
  { slot: 'mouth', id: 'open', name: 'わーい', tier: 'free' },
  { slot: 'mouth', id: 'cat', name: 'ねこ', tier: 'free' },
  { slot: 'mouth', id: 'o', name: 'おっ', tier: 'free' },
  { slot: 'mouth', id: 'tongue', name: 'てへ', tier: 'free' },

  { slot: 'head', id: 'none', name: 'なし', tier: 'free' },
  { slot: 'head', id: 'sprout', name: 'ふたば', tier: 'free' },
  { slot: 'head', id: 'ribbon', name: 'リボン', tier: 'free' },
  { slot: 'head', id: 'hibiscus', name: 'ハイビスカス', tier: 'free' },
  { slot: 'head', id: 'cap', name: 'キャップ', tier: 'free' },
  { slot: 'head', id: 'hood', name: 'レインコート', tier: 'limited', price: 150, note: '台風25号の間だけ' },
  { slot: 'head', id: 'shisa', name: 'シーサー', tier: 'coin', price: 240 },
  { slot: 'head', id: 'crown', name: 'おうかん', tier: 'plus' },
  { slot: 'head', id: 'jinbei', name: 'ジンベエ帽', tier: 'collab', note: '水族館コラボ' },

  { slot: 'item', id: 'none', name: 'なし', tier: 'free' },
  { slot: 'item', id: 'umbrella', name: 'かさ', tier: 'free' },
  { slot: 'item', id: 'candle', name: 'ろうそく', tier: 'free' },
  { slot: 'item', id: 'sanpin', name: 'さんぴん茶', tier: 'free' },
  { slot: 'item', id: 'pork', name: 'ポーク缶', tier: 'coin', price: 80 },
  { slot: 'item', id: 'balloon', name: 'ハートふうせん', tier: 'plus' },

  { slot: 'bg', id: 'cream', name: 'クリーム', tier: 'free' },
  { slot: 'bg', id: 'sakura', name: 'さくら', tier: 'free' },
  { slot: 'bg', id: 'sora', name: 'そら', tier: 'free' },
  { slot: 'bg', id: 'mintbg', name: 'ミント', tier: 'free' },
  { slot: 'bg', id: 'lemonbg', name: 'レモン', tier: 'free' },
  { slot: 'bg', id: 'umi', name: 'うみ', tier: 'coin', price: 100 },
  { slot: 'bg', id: 'yuyake', name: 'ゆうやけ', tier: 'coin', price: 120 },
  { slot: 'bg', id: 'stars', name: 'ほしぞら', tier: 'plus' },
  { slot: 'bg', id: 'storm', name: 'たいふう', tier: 'limited', price: 100, note: '台風25号の間だけ' },

  { slot: 'fx', id: 'none', name: 'なし', tier: 'free' },
  { slot: 'fx', id: 'sparkle', name: 'キラキラ', tier: 'plus' },
  { slot: 'fx', id: 'hearts', name: 'ハート', tier: 'coin', price: 150 },
  { slot: 'fx', id: 'ring', name: 'にじのわ', tier: 'coin', price: 200 },
  { slot: 'fx', id: 'thunder', name: 'かみなり', tier: 'limited', price: 120, note: '台風25号の間だけ' },
]

export const partKey = (p: Pick<Part, 'slot' | 'id'>) => `${p.slot}:${p.id}`
export const partsBySlot = (slot: Slot) => PARTS.filter((p) => p.slot === slot)
export const partOf = (slot: Slot, id: string) => PARTS.find((p) => p.slot === slot && p.id === id)

export type Access = { owned: string[]; plus: boolean }
export const isUnlocked = (p: Part, a: Access) => p.tier === 'free' || (p.tier === 'plus' && a.plus) || a.owned.includes(partKey(p))
export const lockedIn = (cfg: AvatarConfig, a: Access) =>
  SLOTS.map((s) => partOf(s.id, cfg[s.id])).filter((p): p is Part => !!p && !isUnlocked(p, a))

export const DEFAULT_AVATAR: AvatarConfig = { body: 'pink', eyes: 'dot', mouth: 'smile', head: 'sprout', item: 'none', bg: 'cream', fx: 'none' }

// 相手のアバター（課金パーツも使っている = 見せることで欲しくなる）
const PRESETS: Record<string, AvatarConfig> = {
  nana: { body: 'pink', eyes: 'sparkle', mouth: 'smile', head: 'hibiscus', item: 'candle', bg: 'sakura', fx: 'sparkle' },
  kai: { body: 'sky', eyes: 'happy', mouth: 'open', head: 'cap', item: 'umbrella', bg: 'sora', fx: 'none' },
  hana: { body: 'lemon', eyes: 'wink', mouth: 'tongue', head: 'ribbon', item: 'none', bg: 'yuyake', fx: 'none' },
  taku: { body: 'peach', eyes: 'dot', mouth: 'cat', head: 'shisa', item: 'pork', bg: 'cream', fx: 'none' },
}

function rng(seed: string) {
  let h = 2166136261
  for (const c of seed) {
    h ^= c.charCodeAt(0)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0
    h = Math.imul(h ^ (h >>> 13), 3266489909) >>> 0
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

const pick = <T,>(xs: T[], r: () => number) => xs[Math.floor(r() * xs.length)]

export function randomAvatar(seed: string, opts: { freeOnly?: boolean } = {}): AvatarConfig {
  const r = rng(seed)
  const choose = (slot: Slot) => {
    const all = partsBySlot(slot)
    const free = all.filter((p) => p.tier === 'free')
    const pool = opts.freeOnly || r() > 0.22 ? free : all
    return pick(pool, r).id
  }
  return { body: choose('body'), eyes: choose('eyes'), mouth: choose('mouth'), head: choose('head'), item: choose('item'), bg: choose('bg'), fx: opts.freeOnly ? 'none' : r() > 0.8 ? choose('fx') : 'none' }
}

export const presetFor = (seed: string): AvatarConfig => PRESETS[seed] ?? randomAvatar(seed)

export const COIN_PACKS = [
  { coins: 100, price: '¥120' },
  { coins: 550, price: '¥600', bonus: '+50 おまけ' },
  { coins: 1200, price: '¥1,200', bonus: '+200 おまけ' },
]
