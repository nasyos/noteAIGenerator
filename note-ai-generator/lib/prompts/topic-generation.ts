export const TOPIC_CATEGORIES = [
  '業務効率化（営業、経理、人事、総務など）',
  '顧客対応・マーケティング',
  'データ分析・意思決定支援',
  '開発・エンジニアリング',
  'クリエイティブ制作',
  '組織運営・ナレッジマネジメント',
] as const;

export type TopicCategory = (typeof TOPIC_CATEGORIES)[number];

export function generateTopicPrompt(
  count: number,
  categories?: string[]
): string {
  const categorySection =
    categories && categories.length > 0
      ? `## カテゴリ指定
以下の指定カテゴリに絞ってトピックを提案してください：
${categories.map((c) => `- ${c}`).join('\n')}
`
      : `## 多様性の確保
以下のカテゴリからバランスよく選定してください：
${TOPIC_CATEGORIES.map((c) => `- ${c}`).join('\n')}
`;

  return `
【AI業務改善トピック調査】

企業が関心を持つAI活用トピックを${count}件提案してください。

## 条件
- 対象: 中小企業〜中堅企業（50-300名規模）
- 業界: IT/Web中心、製造業・サービス業も含む
- トレンド: 2025年の実践的なテーマ
- 競合: ニッチで需要のあるトピック優先
- 具体性: 抽象的すぎず、実装イメージが湧くテーマ

${categorySection}

## 出力形式
以下のJSON配列で出力してください：

[
  {
    "name": "トピック名（30字以内、具体的に）",
    "category": "カテゴリ名",
    "priority": 優先度（1-10の数値、需要と競合の少なさを考慮）,
    "keywords": "関連キーワード（カンマ区切り、3-5個）",
    "targetAudience": "想定読者層（役職・部門など）",
    "angle": "記事の切り口・アプローチ（50字以内）"
  }
]

必ず${count}件のトピックをJSON配列で出力してください。
他の説明は不要です。JSONのみを出力してください。
  `.trim();
}
