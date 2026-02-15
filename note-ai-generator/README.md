# Note AI Generator

AI業務改善記事の自動生成システム - EXTOOL株式会社

## 概要

Claude AIを使用して、企業向けのAI活用記事を自動生成するシステムです。トピックの提案から、記事企画、執筆まで一気通貫で自動化します。

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
│   ├── topics/           # トピック画面
│   ├── plans/            # 企画画面
│   ├── articles/         # 記事画面
│   └── page.tsx          # ダッシュボード
├── components/
│   ├── layout/           # レイアウトコンポーネント
│   ├── topic/            # トピックコンポーネント
│   ├── article/          # 記事コンポーネント
│   └── ui/               # shadcn/ui コンポーネント
├── lib/
│   ├── supabase.ts       # Supabaseクライアント
│   ├── claude.ts         # Claude APIクライアント
│   └── prompts/          # プロンプトテンプレート
└── types/
    └── database.ts       # TypeScript型定義
```

## ライセンス

Private - EXTOOL株式会社

## サポート

問題が発生した場合は、開発チームにお問い合わせください。
