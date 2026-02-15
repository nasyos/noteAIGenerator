import { ArticlePlan, Topic } from '@/types/database';

export function generateArticlePrompt(
  plan: ArticlePlan,
  topic: Topic | null
): string {
  const topicInfo = topic
    ? `
## 元トピック情報
- トピック: ${topic.topic_name}
- カテゴリ: ${topic.category}
- キーワード: ${topic.keywords}
`
    : '';

  return `
【AI業務改善note記事執筆】

あなたはEXTOOL株式会社の代表として、企業向けの実践的なAI活用記事を執筆します。

${topicInfo}

## 企画書
### タイトル
${plan.selected_title || plan.title_options[0]}

### リード文
${plan.lead}

### 記事構成
${plan.structure
  .map(
    (section, index) => `
${index + 1}. ${section.heading}
   要点: ${section.content}
   推定文字数: ${section.estimatedLength || '未定'}字
`
  )
  .join('\n')}

### 目標文字数
${plan.target_length}字

## 執筆要件

### トーン・文体
- ターゲット: 経営者・事業責任者・マネージャー層
- トーン: 実践的で誠実、説教臭くない
- 文体: です・ます調
- 専門用語: 必要に応じて解説を加える

### 必須要素
✓ 具体的な事例・シチュエーション（2-3個）
✓ 実践的なアクションステップ
✓ 数字・データ（可能な範囲で）
✓ よくある失敗パターン
✓ 費用感・工数感の目安

### 禁止事項
✗ EXTOOL株式会社の露骨な売り込み
✗ 競合批判
✗ 誇大表現・断定的すぎる表現
✗ 抽象的な精神論のみ
✗ 専門用語の羅列

### マークダウン形式
- 見出し: ## を使用（h2レベル）
- 強調: **太字** を適宜使用
- リスト: - または 1. を使用
- コードブロック: 必要に応じて \`\`\` で囲む

## 出力形式
以下のJSON形式で出力してください：

{
  "title": "記事タイトル",
  "sections": [
    {
      "heading": "見出し",
      "content": "本文（マークダウン形式）"
    }
  ],
  "summary": "まとめ（150-200字）",
  "cta": "行動喚起（50-80字）"
}

記事本文は、上記の企画書の構成に従って執筆してください。
各セクションのcontentフィールドには、マークダウン形式で本文を記述してください。

必ずJSON形式のみで出力してください。他の説明は不要です。
  `.trim();
}
