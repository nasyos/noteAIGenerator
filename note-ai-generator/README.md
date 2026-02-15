# AI Content Creator

AIコンテンツクリエイター - EXTOOL株式会社

## 概要

Claude AIを使用して、高品質なコンテンツを自動生成するツールです。トピックの提案から、記事企画、執筆まで一気通貫で自動化し、コンテンツ制作の時間を大幅に短縮します。

## 機能

### 🎯 トピック管理
- AIによる自動トピック生成（20-30件）
- 優先度・カテゴリ別管理
- ステータス管理（利用可能/選択中/使用済み）

### 📝 記事企画
- トピックから企画書を自動生成
- 3パターンのタイトル案
- リード文と記事構成の自動作成
- 目標文字数の設定

### 📚 記事執筆
- 企画書から完全な記事を自動生成（2,500-3,000字）
- マークダウンエディタ/プレビュー機能
- クリップボードへのコピー機能
- note URLの管理

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS 4
- **UI**: shadcn/ui
- **データベース**: Supabase
- **AI**: Claude Sonnet 4 (Anthropic API)

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`env.example` を `.env.local` にコピーして、必要な値を設定してください。

```bash
cp env.example .env.local
```

以下の環境変数を設定：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Anthropic Claude API
ANTHROPIC_API_KEY=your-anthropic-api-key

# Base URL (for API calls in SSR)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Basic Authentication (Production only)
AUTH_USERNAME=admin
AUTH_PASSWORD=your-secure-password-here
```

### 3. Supabaseのセットアップ

Supabaseプロジェクトで以下のテーブルを作成してください：

#### topics テーブル
```sql
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_name TEXT NOT NULL,
  category TEXT NOT NULL,
  priority INTEGER NOT NULL,
  keywords TEXT,
  target_audience TEXT,
  angle TEXT,
  status TEXT NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### article_plans テーブル
```sql
CREATE TABLE article_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  title_options TEXT[] NOT NULL,
  selected_title TEXT,
  lead TEXT,
  structure JSONB NOT NULL,
  target_length INTEGER NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### articles テーブル
```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES article_plans(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  content_html TEXT,
  word_count INTEGER,
  status TEXT NOT NULL DEFAULT 'draft',
  note_url TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### generation_logs テーブル
```sql
CREATE TABLE generation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage TEXT NOT NULL,
  reference_id UUID,
  prompt_used TEXT,
  tokens_used INTEGER,
  generation_time_ms INTEGER,
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 使い方

### 1. トピック生成
1. ダッシュボードから「トピック生成」をクリック
2. 生成するトピック数を指定（10-30件）
3. AIがトピックを自動生成

### 2. 企画作成
1. 「記事企画」→「企画を作成」をクリック
2. 利用可能なトピックから選択
3. AIが企画書を自動生成

### 3. 記事執筆
1. 「記事一覧」→「記事を作成」をクリック
2. 企画書を選択
3. AIが完全な記事を自動生成
4. 編集・プレビューで内容を確認
5. コピーしてnoteに貼り付け

## セキュリティ

### Basic認証（本番環境）

本番環境では自動的にBasic認証が有効になります。環境変数で認証情報を設定してください：

- `AUTH_USERNAME`: ユーザー名（デフォルト: admin）
- `AUTH_PASSWORD`: パスワード（必ず変更してください）

開発環境（`NODE_ENV=development`）では認証はスキップされます。

### 推奨事項

1. **強力なパスワード**: 最低12文字以上のランダムな文字列を使用
2. **Supabase RLS**: Row Level Securityを有効化（データベース保護）
3. **Claude APIキー**: 定期的にローテーション
4. **アクセスログ**: 定期的に確認

## ディレクトリ構造

```
note-ai-generator/
├── app/
│   ├── api/              # APIルート
│   │   ├── topics/       # トピックAPI
│   │   │   ├── route.ts           # GET, POST
│   │   │   ├── [id]/route.ts     # GET, PATCH, DELETE
│   │   │   └── generate/route.ts  # POST (AI生成)
│   │   ├── plans/        # 企画API
│   │   │   ├── route.ts           # GET
│   │   │   ├── [id]/route.ts     # GET, PATCH, DELETE
│   │   │   └── generate/route.ts  # POST (AI生成)
│   │   └── articles/     # 記事API
│   │       ├── route.ts           # GET
│   │       ├── [id]/route.ts     # GET, PATCH, DELETE
│   │       └── generate/route.ts # POST (AI生成)
│   ├── topics/           # トピック画面
│   │   ├── page.tsx              # 一覧
│   │   └── generate/page.tsx     # 生成
│   ├── plans/            # 企画画面
│   │   ├── page.tsx              # 一覧
│   │   ├── create/page.tsx       # 作成
│   │   └── [id]/page.tsx         # 詳細
│   ├── articles/         # 記事画面
│   │   ├── page.tsx              # 一覧
│   │   ├── create/page.tsx       # 作成
│   │   └── [id]/page.tsx         # 詳細・編集
│   ├── page.tsx          # ダッシュボード
│   ├── layout.tsx         # ルートレイアウト
│   └── globals.css        # グローバルスタイル
├── components/
│   ├── layout/           # レイアウトコンポーネント
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   ├── topic/            # トピックコンポーネント
│   │   └── TopicTable.tsx
│   ├── article/          # 記事コンポーネント
│   │   ├── MarkdownEditor.tsx
│   │   ├── MarkdownPreview.tsx
│   │   └── CopyButton.tsx
│   └── ui/               # shadcn/ui コンポーネント
├── lib/
│   ├── supabase.ts       # Supabaseクライアント
│   ├── claude.ts         # Claude APIクライアント
│   └── prompts/          # プロンプトテンプレート
│       ├── topic-generation.ts
│       ├── plan-generation.ts
│       └── article-generation.ts
├── types/
│   └── database.ts       # TypeScript型定義
├── middleware.ts         # Basic認証ミドルウェア
└── package.json
```

## 設計書

### 1. アーキテクチャ概要

本システムは、**Next.js 16 App Router**をベースとした**サーバーレスアーキテクチャ**で構築されています。

```
┌─────────────────────────────────────────────────────────┐
│                     クライアント（ブラウザ）                │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Vercel Edge Network (CDN)                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Edge Middleware (Basic認証)              │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js Server Components                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  ページ      │  │  API Routes  │  │  Middleware  │ │
│  │  (SSR/SSG)   │  │  (Serverless)│  │  (Edge)      │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└────────────────────┬──────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                          ▼
┌──────────────┐          ┌──────────────┐
│  Supabase   │          │  Anthropic   │
│  (PostgreSQL)│          │  Claude API  │
└──────────────┘          └──────────────┘
```

### 2. システム構成

#### 2.1 フロントエンド層

- **Next.js 16 App Router**: サーバーコンポーネントとクライアントコンポーネントのハイブリッド
- **shadcn/ui**: 再利用可能なUIコンポーネントライブラリ
- **Tailwind CSS 4**: ユーティリティファーストのCSSフレームワーク
- **React Markdown**: マークダウンのレンダリング

#### 2.2 バックエンド層

- **Next.js API Routes**: Serverless Functionsとして実行
- **Supabase**: PostgreSQLデータベース + リアルタイム機能
- **Anthropic Claude API**: AIコンテンツ生成

#### 2.3 インフラストラクチャ

- **Vercel**: ホスティング + Edge Network
- **Vercel Edge Middleware**: Basic認証（CDNレベルで実行）
- **Supabase Cloud**: マネージドPostgreSQL

### 3. データフロー

#### 3.1 トピック生成フロー

```
1. ユーザーが「トピック生成」をクリック
   ↓
2. クライアント: POST /api/topics/generate
   ↓
3. API Route: Claude APIを呼び出し（プロンプト送信）
   ↓
4. Claude API: JSON形式でトピック配列を返却
   ↓
5. API Route: Supabaseにトピックを一括保存
   ↓
6. API Route: 生成ログを記録
   ↓
7. クライアント: 結果を表示、トピック一覧へリダイレクト
```

#### 3.2 企画作成フロー

```
1. ユーザーがトピックを選択
   ↓
2. クライアント: POST /api/plans/generate
   ↓
3. API Route: 選択されたトピック情報を取得
   ↓
4. API Route: Claude APIに企画生成プロンプトを送信
   ↓
5. Claude API: 企画書（タイトル案、リード、構成）を返却
   ↓
6. API Route: Supabaseに企画を保存、トピックステータスを更新
   ↓
7. クライアント: 企画詳細ページへリダイレクト
```

#### 3.3 記事生成フロー

```
1. ユーザーが企画を選択
   ↓
2. クライアント: POST /api/articles/generate
   ↓
3. API Route: 企画情報とトピック情報を取得
   ↓
4. API Route: Claude APIに記事生成プロンプトを送信
   ↓
5. Claude API: 完全な記事（マークダウン形式）を返却
   ↓
6. API Route: マークダウンを整形、Supabaseに保存
   ↓
7. クライアント: 記事編集ページへリダイレクト
```

### 4. データベース設計

#### 4.1 ER図（テキスト表現）

```
topics (トピック)
├── id (PK)
├── topic_name
├── category
├── priority
├── keywords
├── target_audience
├── angle
├── status (available/selected/used)
└── created_at, updated_at
    │
    │ 1:N
    ▼
article_plans (企画)
├── id (PK)
├── topic_id (FK → topics.id)
├── title_options (TEXT[])
├── selected_title
├── lead
├── structure (JSONB)
├── target_length
├── notes
├── status (draft/approved/archived)
└── created_at, updated_at
    │
    │ 1:N
    ▼
articles (記事)
├── id (PK)
├── plan_id (FK → article_plans.id)
├── title
├── content_markdown
├── content_html
├── word_count
├── status (draft/reviewed/published)
├── note_url
├── published_at
└── created_at, updated_at

generation_logs (生成ログ)
├── id (PK)
├── stage (topic/plan/article)
├── reference_id (FK → 各テーブル.id)
├── prompt_used
├── tokens_used
├── generation_time_ms
├── success
├── error_message
└── created_at
```

#### 4.2 テーブル詳細

**topics**
- トピック候補を管理
- `status`で利用可能/選択中/使用済みを管理
- `priority`で重要度を数値化（1-10）

**article_plans**
- 記事企画書を管理
- `title_options`は配列型（3パターン）
- `structure`はJSONB型（セクション配列）

**articles**
- 完成した記事を管理
- `content_markdown`にマークダウン形式で保存
- `note_url`で公開先URLを記録

**generation_logs**
- AI生成の実行ログを記録
- トークン使用量、実行時間を追跡
- エラー発生時も記録

### 5. API設計

#### 5.1 RESTful API エンドポイント

| メソッド | エンドポイント | 説明 | 認証 |
|---|---|---|---|
| GET | `/api/topics` | トピック一覧取得 | 不要 |
| POST | `/api/topics` | トピック作成（手動） | 不要 |
| GET | `/api/topics/[id]` | トピック詳細取得 | 不要 |
| PATCH | `/api/topics/[id]` | トピック更新 | 不要 |
| DELETE | `/api/topics/[id]` | トピック削除 | 不要 |
| POST | `/api/topics/generate` | AIトピック生成 | 不要 |
| GET | `/api/plans` | 企画一覧取得 | 不要 |
| GET | `/api/plans/[id]` | 企画詳細取得 | 不要 |
| PATCH | `/api/plans/[id]` | 企画更新 | 不要 |
| DELETE | `/api/plans/[id]` | 企画削除 | 不要 |
| POST | `/api/plans/generate` | AI企画生成 | 不要 |
| GET | `/api/articles` | 記事一覧取得 | 不要 |
| GET | `/api/articles/[id]` | 記事詳細取得 | 不要 |
| PATCH | `/api/articles/[id]` | 記事更新 | 不要 |
| DELETE | `/api/articles/[id]` | 記事削除 | 不要 |
| POST | `/api/articles/generate` | AI記事生成 | 不要 |

**注意**: 現在はBasic認証のみで、API個別の認証は実装していません。必要に応じて追加可能です。

#### 5.2 リクエスト/レスポンス例

**POST /api/topics/generate**
```json
// Request
{
  "count": 20,
  "categories": ["業務効率化", "顧客対応・マーケティング"]
}

// Response
{
  "topics": [
    {
      "id": "uuid",
      "topic_name": "AIを活用した営業効率化",
      "category": "業務効率化",
      "priority": 8,
      ...
    }
  ],
  "meta": {
    "count": 20,
    "tokens": 3500,
    "generationTime": 45000
  }
}
```

### 6. 認証・セキュリティ設計

#### 6.1 Basic認証（本番環境）

**実装方式**: Vercel Edge Middleware

**動作フロー**:
```
1. ユーザーがサイトにアクセス
   ↓
2. Edge Middlewareがリクエストをインターセプト
   ↓
3. Authorizationヘッダーをチェック
   ↓
4. 未認証 → 401レスポンス + WWW-Authenticateヘッダー
   ↓
5. ブラウザがBasic認証ダイアログを表示
   ↓
6. ユーザーが認証情報を入力
   ↓
7. 認証成功 → リクエストを通過
```

**設定場所**:
- ファイル: `middleware.ts`
- 環境変数: `AUTH_USERNAME`, `AUTH_PASSWORD` (Vercel)

**特徴**:
- ✅ Edge Networkレベルで実行（超高速）
- ✅ 開発環境では自動スキップ
- ✅ Serverless Function実行前にブロック（コスト削減）
- ✅ 無料プランで利用可能

#### 6.2 セキュリティ考慮事項

1. **環境変数の保護**
   - `.env.local`はGitにコミットしない
   - Vercelの環境変数は暗号化保存

2. **Supabase Row Level Security (RLS)**
   - 現在は開発用に全許可
   - 本番環境では適切なポリシーを設定推奨

3. **APIキーの管理**
   - Claude APIキーは環境変数で管理
   - 定期的なローテーション推奨

4. **HTTPS強制**
   - Vercelが自動的にHTTPSを提供

### 7. デプロイメント構成

#### 7.1 Vercel設定

**Framework Preset**: Next.js

**Root Directory**:**: `note-ai-generator`

**Build Command**: `npm run build` (自動検出)

**Output Directory**: `.next` (自動検出)

**環境変数**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`
- `AUTH_USERNAME` (本番環境のみ)
- `AUTH_PASSWORD` (本番環境のみ)

#### 7.2 デプロイフロー

```
1. GitHubにプッシュ
   ↓
2. Vercelが自動検出
   ↓
3. Root Directory (note-ai-generator) でビルド実行
   ↓
4. Next.jsビルド（TypeScriptコンパイル、最適化）
   ↓
5. Edge MiddlewareをEdge Networkにデプロイ
   ↓
6. Serverless Functionsをデプロイ
   ↓
7. 静的アセットをCDNに配置
   ↓
8. デプロイ完了
```

#### 7.3 パフォーマンス最適化

1. **Server Components**
   - データ取得はサーバー側で実行
   - クライアントバンドルサイズを削減

2. **Dynamic Rendering**
   - `export const dynamic = 'force-dynamic'`で静的生成を回避
   - 常に最新データを表示

3. **Edge Middleware**
   - CDNレベルで認証処理
   - レイテンシー最小化

4. **Supabase接続プール**
   - Supabaseクライアントはシングルトン
   - 接続を効率的に再利用

### 8. 主要コンポーネント設計

#### 8.1 サーバーコンポーネント

- `app/page.tsx`: ダッシュボード（統計取得）
- `app/topics/page.tsx`: トピック一覧（Supabase直接クエリ）
- `app/plans/page.tsx`: 企画一覧（Supabase直接クエリ）
- `app/articles/page.tsx`: 記事一覧（Supabase直接クエリ）

**特徴**: ビルド時にAPIを呼ばず、Supabaseに直接接続

#### 8.2 クライアントコンポーネント

- `app/topics/generate/page.tsx`: トピック生成UI
- `app/plans/create/page.tsx`: 企画作成UI
- `app/articles/create/page.tsx`: 記事作成UI
- `app/articles/[id]/page.tsx`: 記事編集UI

**特徴**: インタラクティブな操作、API呼び出し

#### 8.3 共通コンポーネント

- `components/layout/Layout.tsx`: 共通レイアウト
- `components/topic/TopicTable.tsx`: トピック一覧テーブル
- `components/article/MarkdownEditor.tsx`: マークダウンエディタ
- `components/article/MarkdownPreview.tsx`: マークダウンプレビュー

### 9. エラーハンドリング

#### 9.1 APIエラーハンドリング

- **Claude APIエラー**: エラーログを記録、ユーザーに分かりやすいメッセージを表示
- **Supabaseエラー**: コンソールログ、適切なHTTPステータスコードを返却
- **バリデーションエラー**: 400 Bad Requestで詳細を返却

#### 9.2 フロントエンドエラーハンドリング

- **try-catch**: 非同期処理をラップ
- **エラー表示**: Cardコンポーネントで視覚的に表示
- **フォールバック**: データ取得失敗時は空配列を表示

### 10. ログ・モニタリング

#### 10.1 生成ログ

`generation_logs`テーブルに以下を記録:
- 生成ステージ（topic/plan/article）
- 使用トークン数
- 実行時間
- 成功/失敗
- エラーメッセージ

#### 10.2 Vercelログ

- **Build Logs**: ビルド時のエラー
- **Runtime Logs**: 実行時のエラー
- **Function Logs**: Serverless Functionの実行ログ

### 11. 今後の拡張性

#### 11.1 認証機能の拡張

- Supabase Auth統合（ユーザー管理）
- ロールベースアクセス制御（RBAC）
- セッション管理

#### 11.2 機能拡張

- 記事のバージョン管理
- コメント機能
- 公開スケジュール機能
- 分析ダッシュボード

#### 11.3 パフォーマンス改善

- キャッシング戦略の導入
- 画像最適化
- インクリメンタル静的再生成（ISR）

## ライセンス

Private - EXTOOL株式会社

## サポート

問題が発生した場合は、開発チームにお問い合わせください。
