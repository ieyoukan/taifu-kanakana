export type Gender = 'female' | 'male' | 'any'

export type Partner = {
  id: string
  name: string
  age: number
  gender: Exclude<Gender, 'any'>
  city: string
  avatar: string
  photo: string
  status: string[]
  bio: string
  hobbies: string[]
  stormStyle: string[]
  oneLiner: string
  wind: number
}

export const AVATARS = [
  'sanpin', 'goya', 'shisa', 'taco', 'yoko', 'mimi', 'ren', 'kai', 'nana', 'sora', 'umi', 'hana', 'rin', 'koa', 'yuna', 'taku', 'moe',
] as const

export const avatarUrl = (seed: string) => `/avatars/${seed}.svg`

export const EVENT = {
  typhoon: '台風25号',
  area: '沖縄本島地方',
  warning: '暴風警報',
  startAt: '21:00',
}

export const PARTNERS: Partner[] = [
  {
    id: 'sanpin',
    name: 'さんぴん茶',
    age: 23,
    gender: 'female',
    city: '浦添市',
    avatar: 'nana',
    photo: '/img/portrait-f.jpg',
    status: ['停電中', '暇すぎる'],
    bio: '停電したので、ろうそくの火を見つめています。',
    hobbies: ['映画', 'カフェ巡り', '海'],
    stormStyle: ['ろうそく', '映画', '寝る'],
    oneLiner: 'ろうそく仲間、募集中。',
    wind: 28,
  },
  {
    id: 'yojo',
    name: '養生テープ王子',
    age: 25,
    gender: 'male',
    city: '名護市',
    avatar: 'kai',
    photo: '/img/portrait-m.jpg',
    status: ['窓の養生済み', 'でーじ風強い'],
    bio: '窓ガラスの養生だけは誰にも負けません。',
    hobbies: ['ドライブ', 'サウナ', '釣り'],
    stormStyle: ['窓の養生', 'ゲーム', 'ポーク卵'],
    oneLiner: '米字貼りは基本。',
    wind: 34,
  },
  {
    id: 'zouri',
    name: '島ぞうり行方不明',
    age: 22,
    gender: 'female',
    city: '宜野湾市',
    avatar: 'hana',
    photo: '/img/portrait-f2.jpg',
    status: ['ベランダ片付け完了', '暇'],
    bio: 'ベランダの島ぞうりが旅に出ました。',
    hobbies: ['音楽', 'ゲーム', '沖縄そば'],
    stormStyle: ['ゲーム', 'ポーク卵', '寝る'],
    oneLiner: '島ぞうりの行方を一緒に考えてほしい。',
    wind: 31,
  },
  {
    id: 'pork',
    name: 'ポーク缶マスター',
    age: 27,
    gender: 'male',
    city: '沖縄市',
    avatar: 'taku',
    photo: '/img/portrait-m2.jpg',
    status: ['備蓄は完璧', '映画中'],
    bio: 'ポーク缶を12個備蓄しました。多すぎた。',
    hobbies: ['料理', '映画', 'キャンプ'],
    stormStyle: ['ポーク卵', '映画', '窓の養生'],
    oneLiner: 'ポーク缶、分けます。',
    wind: 30,
  },
]

export const NICKNAMES = [
  'ゴーヤー侍', 'さんぴん茶', '停電のプロ', '養生テープ王子', '島ぞうり行方不明', 'ポーク缶マスター', 'シーサーの右', 'サーターアンダギー',
  'ガジュマルの精', '雨戸ガタガタ', 'スーパー全滅', 'ろうそくの人', 'ベランダ片付け係', 'ちゅらさん', 'でーじ暇', 'なんくるないさ',
  'てぃーだ', 'シークヮーサー', 'ちんすこう', '58号線', 'ゆいレール運休', '暴風警報待ち', 'ちばりよー',
]

export const HOBBIES = ['映画', '音楽', 'ゲーム', 'カフェ巡り', '海', 'ドライブ', '料理', '読書', 'サウナ', '釣り', '沖縄そば', 'キャンプ', 'アニメ', '筋トレ', '写真', 'エイサー']

export const STORM_STYLES = ['寝る', '映画', 'ゲーム', 'ポーク卵', '窓の養生', 'ろうそく', '読書', '片付け', 'ずっとスマホ', '備蓄チェック', '三線']

export type Stamp = {
  id: string
  label: string
  sub: string
  icon: 'zapOff' | 'flame' | 'wind' | 'basket' | 'bed' | 'film' | 'siren' | 'home' | 'sandal' | 'noodles' | 'smile'
  tone: 'love' | 'sea' | 'sun' | 'mist'
}

export const STAMPS: Stamp[] = [
  { id: 'blackout', label: '停電した', sub: 'ろうそく点けた', icon: 'zapOff', tone: 'sun' },
  { id: 'candle', label: 'ろうそく点灯', sub: 'ちょっとロマンチック', icon: 'flame', tone: 'sun' },
  { id: 'wind', label: 'でーじ風強い', sub: '家が鳴ってる', icon: 'wind', tone: 'sea' },
  { id: 'warning', label: '暴風警報出た', sub: '休み確定', icon: 'siren', tone: 'love' },
  { id: 'konbini', label: 'スーパー全滅', sub: 'パン棚が空', icon: 'basket', tone: 'mist' },
  { id: 'hima', label: '暇すぎる', sub: '誰か話そう', icon: 'bed', tone: 'love' },
  { id: 'movie', label: '映画見てる', sub: '何見てる？', icon: 'film', tone: 'sea' },
  { id: 'sandal', label: '島ぞうり飛んだ', sub: '旅に出ました', icon: 'sandal', tone: 'love' },
  { id: 'pork', label: 'ポーク卵作った', sub: '台風の定番', icon: 'noodles', tone: 'sun' },
  { id: 'nankuru', label: 'なんくるないさ', sub: 'だいじょうぶ', icon: 'smile', tone: 'sea' },
  { id: 'safe', label: '安全な場所にいる', sub: '家でおとなしく', icon: 'home', tone: 'sea' },
]

export const FEED_SEED = [
  { city: '那覇市', text: '暴風警報きた。休み確定。でーじ嬉しいけど、することがない。', likes: 203 },
  { city: '浦添市', text: 'うち停電した。ろうそくの火見てたら急に寂しくなった。', likes: 132 },
  { city: '宜野湾市', text: 'ベランダの島ぞうりが旅に出ました。見かけたら教えてください。', likes: 211 },
  { city: '那覇市', text: 'スーパーのパン棚、見事に空。さんぴん茶だけ残ってた。', likes: 88 },
  { city: '沖縄市', text: 'ガジュマルがめっちゃ踊ってる', likes: 67 },
  { city: '名護市', text: '養生テープ米字貼りした。これで安心して寝れる', likes: 29 },
  { city: 'うるま市', text: '暇すぎて部屋の模様替え始めた', likes: 54 },
  { city: '那覇市', text: 'ゆいレール止まった。バスも全線運休。今日は誰とも会えないと思ってた', likes: 96 },
  { city: '糸満市', text: 'ポーク卵おにぎり3個目', likes: 76 },
  { city: '豊見城市', text: '雨戸がガタガタ言ってて怖いので誰か話して', likes: 97 },
  { city: '南城市', text: '台風の日に聴く曲、募集', likes: 41 },
]

export const FEED_LIVE = [
  { city: '那覇市', text: '風の音がライブ会場' },
  { city: '浦添市', text: '停電2時間目。スマホの充電が恋より大事になってきた' },
  { city: '沖縄市', text: '雨戸の隙間から見える空、緑っぽくて不気味' },
  { city: '宜野湾市', text: '隣の家のバケツが回転しながら飛んでった' },
  { city: '名護市', text: 'さっきマッチした人、同じ映画見てた。奇跡' },
  { city: 'うるま市', text: '冷蔵庫開けられないので心細い' },
  { city: '那覇市', text: '台風の目に入った。静かすぎて逆に怖い' },
  { city: '糸満市', text: '誰かポーク缶の美味しい食べ方教えて' },
  { city: '豊見城市', text: '58号線、車が1台も走ってない' },
  { city: '南城市', text: 'なんくるないさって言いながら窓押さえてる' },
]

export type ScriptStep = {
  partner: string[]
  suggestions: string[]
}

export const OPENERS = [
  'こっちは風ヤバいけど、そっち大丈夫？',
  '停電してない？',
  '暇すぎて誰かと話したかった',
]

export const SCRIPTS: Record<string, ScriptStep[]> = {
  sanpin: [
    {
      partner: ['大丈夫じゃない、停電してる', 'ろうそく点けて、火を見つめてるところ'],
      suggestions: ['ろうそくあるの偉い', 'うちは電気まだ生きてる', '火を見つめるの、わかる'],
    },
    {
      partner: ['備蓄だけは得意なんです', 'ポーク缶も12個ある。多すぎた', '台風の日って、何してる？'],
      suggestions: ['映画見てる', '寝てた', 'ずっとスマホ'],
    },
    {
      partner: ['え、同じ', 'さっきまで海の映画見てたんだけど、停電で止まった', '外も海みたいになってるのに'],
      suggestions: ['続き、台風が過ぎたら見れるね', 'それは不憫すぎる', '海、好きなの？'],
    },
    {
      partner: ['うん、晴れたら海行きたい', '台風の後の海、でーじきれいなの知ってる？', '空気が全部洗われた感じになる'],
      suggestions: ['知らなかった、見てみたい', 'それ、一緒に見に行きたい', '台風の後って意外といいね'],
    },
    {
      partner: ['だからよー', 'じゃあ、嵐が過ぎたらってことで', 'この会話、停電のおかげだね'],
      suggestions: ['台風に感謝する日が来るとは', 'ろうそく仲間になれてよかった'],
    },
  ],
  yojo: [
    {
      partner: ['窓は養生したから無敵', '米字貼りって知ってる？'],
      suggestions: ['知らない、教えて', '養生テープ王子すぎる', 'うちは何もしてない'],
    },
    {
      partner: ['テープを米の字に貼ると割れにくくなるらしい', '効果があるかは正直わからない', '台風の日、何してる？'],
      suggestions: ['映画見てる', 'ゲームしてる', 'ずっとスマホ'],
    },
    {
      partner: ['いいね、俺はポーク卵作ってた', '台風の日はポーク卵。これは法律', 'そっちは停電してない？'],
      suggestions: ['まだ生きてる', 'さっき一瞬消えた', 'ポーク卵は法律、わかる'],
    },
    {
      partner: ['台風の後って、空気がきれいになるの好きなんだよね', '晴れたら北部までドライブ行きたい'],
      suggestions: ['海中道路いいね', '台風の後って意外といいね', '海沿いのドライブいいね'],
    },
    {
      partner: ['だからよー', 'じゃあ、嵐が過ぎたらってことで', 'この会話、台風のおかげだな'],
      suggestions: ['台風に感謝する日が来るとは', '養生テープ、今度教えて'],
    },
  ],
}

export const FALLBACK_SCRIPT: ScriptStep[] = [
  {
    partner: ['こっちも風すごい', '家が鳴ってる'],
    suggestions: ['うちも鳴ってる', '停電してない？', '何してる？'],
  },
  {
    partner: ['暇すぎて部屋の片付け始めた', '台風の日って何してる？'],
    suggestions: ['映画見てる', '寝てた', 'ずっとスマホ'],
  },
  {
    partner: ['いいね', '台風の後って空気きれいになるよね', '晴れたらどこか行きたい'],
    suggestions: ['海見に行きたい', '台風の後って意外といいね', 'カフェ行きたい'],
  },
  {
    partner: ['だからよー', 'じゃあ、嵐が過ぎたらってことで'],
    suggestions: ['台風に感謝する日が来るとは', '話せてよかった'],
  },
]

export const STAMP_REPLIES: Record<string, string[]> = {
  blackout: ['えっ、うちも停電してる', 'ろうそく仲間だね'],
  candle: ['ろうそくの火って落ち着くよね', 'ちょっとロマンチック'],
  wind: ['こっちも家が鳴ってる', '飛ばされないでね'],
  warning: ['休み確定おめでとう', 'でも暇だよね、だからこうして話してる'],
  konbini: ['パン棚ガラガラだったよね', 'さんぴん茶だけ残ってた'],
  hima: ['わかる、暇すぎる', 'だから今話せてるんだけどね'],
  movie: ['何見てるの？', '停電で止まらないことを祈る'],
  sandal: ['島ぞうり、旅に出たんだ', 'うちのバケツも旅に出た'],
  pork: ['台風の日はポーク卵、法律', 'うらやましい'],
  nankuru: ['なんくるないさ', 'それが一番'],
  safe: ['それが一番', '安全第一で話そう'],
}

export const DATE_SPOTS = [
  {
    id: 'aquarium',
    name: '美ら海水族館',
    place: '本部町',
    photo: '/img/aquarium.jpg',
    note: '台風直後は海が荒れるので屋内へ。ジンベエザメは台風を知らない。',
    coupon: '台風明けクーポン 入館 10% OFF',
    sponsor: 'スポンサー提携（例）',
  },
  {
    id: 'senaga',
    name: '瀬長島ウミカジテラス',
    place: '豊見城市',
    photo: '/img/beach.jpg',
    note: '空気が全部洗われた日の海は、一年で一番きれい。',
    coupon: 'テラスのカフェ ドリンク1杯無料',
    sponsor: 'スポンサー提携（例）',
  },
  {
    id: 'nanjo',
    name: '海の見えるカフェ',
    place: '南城市',
    photo: '/img/cove.jpg',
    note: '台風の話で2時間は持つ。たぶん。',
    coupon: 'ケーキセット 15% OFF',
    sponsor: 'スポンサー提携（例）',
  },
]

export const PAST_STORMS = [
  { name: '台風11号', date: '2026.08.12', talked: 3, continued: 1 },
  { name: '台風6号', date: '2026.07.03', talked: 2, continued: 0 },
]
