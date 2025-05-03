# Album - フォトアルバム共有アプリ

アルバムは、友人や家族と簡単に写真を共有できる Web アプリケーションです。共有ルームを作成し、そのルーム内でアルバムを作成して写真を整理することができます。

## 主な機能

- **ユーザー認証**: 安全なアカウント作成とログイン機能
- **共有ルーム**: 友人や家族との共有スペースを作成
- **アルバム管理**: 共有ルーム内で複数のアルバムを作成・管理
- **写真アップロード**: 写真を簡単にアップロードして共有
- **レスポンシブデザイン**: スマートフォンからデスクトップまであらゆるデバイスで最適表示

## 技術スタック

- **フレームワーク**: [Next.js](https://nextjs.org/) (App Router)
- **認証**: [Firebase Authentication](https://firebase.google.com/products/auth)
- **ストレージ**: [Firebase Storage](https://firebase.google.com/products/storage)
- **データベース**: [Firebase Firestore](https://firebase.google.com/products/firestore)
- **スタイリング**: [Tailwind CSS](https://tailwindcss.com)
- **フォーム管理**: [React Hook Form](https://react-hook-form.com/)
- **バリデーション**: [Zod](https://github.com/colinhacks/zod)
- **状態管理**: [Zustand](https://github.com/pmndrs/zustand)

## ローカル環境での実行方法

1. リポジトリをクローンする

```bash
git clone https://github.com/yourusername/album.git
cd album
```

2. 依存パッケージをインストールする

```bash
npm install
```

3. 開発サーバーを起動する

```bash
npm run dev
```

4. ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスする

## Firebase 設定

このアプリケーションを実行するには、Firebase プロジェクトの設定が必要です。

1. [Firebase Console](https://console.firebase.google.com/) で新しいプロジェクトを作成
2. Authentication、Firestore、Storage を有効化
3. プロジェクトのルートに `.env.local` ファイルを作成し、以下の Firebase 設定を追加:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## デプロイ

このアプリケーションは [Vercel](https://vercel.com) にデプロイすることができます。最も簡単な方法は以下の通りです：

1. Vercel アカウントを作成し、GitHub リポジトリと連携する
2. Vercel ダッシュボードからプロジェクトをインポート
3. 環境変数（Firebase の設定など）を設定
4. デプロイボタンをクリック

これにより自動的にビルドとデプロイが行われます。また、GitHub リポジトリへのプッシュ時に自動デプロイするよう設定することもできます。

## 開発者向け情報

- コードフォーマット: `npm run format`
- 型チェック: `npm run typecheck`

## ライセンス

MIT
