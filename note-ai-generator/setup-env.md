# 環境変数設定ガイド

`.env.local` ファイルに以下の内容を設定してください：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://mijrjmdmzaigppuibszk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1panJqbWRtemFpZ3BwdWlic3prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwODY4NTAsImV4cCI6MjA4NjY2Mjg1MH0.54v_aV8UM2RxGw1brRTU2jXFRy8DAad7PPSBxVQYUEc

# Anthropic Claude API
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Base URL (for API calls in SSR)
NEXT_PUBLIC_BASE_URL=http://localhost:3001
```

## 設定後の手順

1. `.env.local` ファイルを保存
2. 開発サーバーを再起動: `npm run dev`
3. ブラウザで http://localhost:3001 を開く
4. トピック生成を試す: http://localhost:3001/topics/generate
