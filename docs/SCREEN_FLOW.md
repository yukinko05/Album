# アルバムアプリの画面遷移図

このドキュメントでは、アルバムアプリケーションの画面遷移フローを説明します。

## 画面遷移図

```mermaid
flowchart TD
    Start([アクセス]) --> HomePage
    HomePage[トップページ] --> LoginPage[ログインページ]
    HomePage --> SignupPage[新規登録ページ]

    LoginPage --> groupsPage[共有グループ一覧]
    SignupPage --> groupsPage

    groupsPage --> CreategroupPage[グループ作成]
    groupsPage --> JoingroupPage[グループ参加]
    groupsPage --> groupDetailPage[グループ詳細]

    CreategroupPage --> groupDetailPage
    JoingroupPage --> groupDetailPage

    groupDetailPage --> CreateAlbumPage[アルバム作成]
    groupDetailPage --> AlbumDetailPage[アルバム詳細]

    CreateAlbumPage --> AlbumDetailPage

    groupsPage --> ProfilePage[プロフィール]

    style HomePage fill:#ffe0cc
    style LoginPage fill:#ffe0cc
    style SignupPage fill:#ffe0cc
    style groupsPage fill:#ffd1a3
    style CreategroupPage fill:#ffd1a3
    style JoingroupPage fill:#ffd1a3
    style groupDetailPage fill:#ffd1a3
    style CreateAlbumPage fill:#ffc78a
    style AlbumDetailPage fill:#ffc78a
    style ProfilePage fill:#ffd1a3
```

## 画面の説明

### 認証関連画面（薄いオレンジ）

- **トップページ**: アプリの入り口となるページ
- **ログインページ**: 既存ユーザーのログイン画面
- **新規登録ページ**: 新規ユーザー登録画面

### グループ関連画面（中間のオレンジ）

- **共有グループ一覧**: ユーザーが参加している共有グループの一覧
- **グループ作成**: 新しい共有グループを作成する画面
- **グループ参加**: 招待コードを使用して既存の共有グループに参加する画面
- **グループ詳細**: 特定の共有グループ内のアルバム一覧を表示する画面
- **プロフィール**: ユーザープロフィールの表示・編集画面

### アルバム関連画面（濃いオレンジ）

- **アルバム作成**: 共有グループ内に新しいアルバムを作成する画面
- **アルバム詳細**: アルバム内の写真一覧を表示する画面
