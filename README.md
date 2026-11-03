# taifu-kanakana（台風かなかな）

**台風の日、恋がかなう。嵐が過ぎても、恋は続く。**

台風などの悪天候で外出できない人たちが、同じ嵐の下にいる人と匿名でつながれる、沖縄発の期間限定マッチングアプリの **体験モック** です（事業案発表用）。バックエンドはなく、すべてブラウザ内で動きます。

- スマホで開くと全画面のアプリとして動作（ホーム画面に追加可）
- PCで開くと「スマホ枠 + デモ用リモコン」で発表しやすい表示
- データは `localStorage` に保存（リモコンの「最初から」でリセット）

## 体験の流れ

1. スプラッシュ → オンボーディング（前味・中味・後味）
2. プロフィール登録（年齢確認 → ニックネーム・アバター → 趣味 → 恋愛の希望 → 現在地＝市町村単位）
3. ホーム：沖縄本島の気象レーダー、暴風警報の状況、恋愛気圧計、みんなの実況
4. 台風直撃（暴風警報）でイベント開始 → 「台風の目で出会う」＝ランダム1対1マッチング
5. チャット：会話のきっかけ、状況スタンプ（停電でろうそくモード）、継続マッチング
6. 台風通過 → 嵐のあと → 写真の公開 → 台風明けデートの提案（スポンサースポット）

右端のハンドル（PCは右側パネル）で「晴れ / 接近 / 直撃 / 通過 / 停電」を切り替えられます。

## 開発

```bash
pnpm install
pnpm dev      # http://localhost:5173
pnpm build    # dist/
```

Vite + React + TypeScript + Tailwind CSS v4 + motion + zustand。写真は Unsplash / Pexels、アバターは DiceBear（lorelei）を同梱。

## デプロイ

- `Dockerfile`：静的ビルドを nginx で配信（`/healthz` あり）
- GitHub Actions が `ghcr.io/ieyoukan/taifu-kanakana` に push（`latest`, `v0.<sha>`, `sha-<sha>`）
- `charts/taifu-kanakana`：Helm chart（Deployment / Service / Ingress）
- 自宅クラスタでは `home-manifests` の Argo CD Application から参照
