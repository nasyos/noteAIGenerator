import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { callClaudeForJSON } from '@/lib/claude';
import { generateArticlePrompt } from '@/lib/prompts/article-generation';
import { ArticleGenerationResponse, ArticlePlan, Topic } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json(
        { error: 'planId is required' },
        { status: 400 }
      );
    }

    // 企画情報を取得
    const { data: plan, error: planError } = await supabase
      .from('article_plans')
      .select('*, topics(*)')
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // プロンプト生成
    const prompt = generateArticlePrompt(
      plan as ArticlePlan,
      plan.topics as Topic | null
    );

    // Claude APIを呼び出し
    const startTime = Date.now();
    const { data: articleData, tokens } = await callClaudeForJSON<ArticleGenerationResponse>(prompt, 8000);
    const generationTime = Date.now() - startTime;

    // マークダウン本文を構築
    const contentMarkdown = articleData.sections
      .map((section) => `## ${section.heading}\n\n${section.content}`)
      .join('\n\n');

    const fullContent = `# ${articleData.title}\n\n${contentMarkdown}\n\n## まとめ\n\n${articleData.summary}\n\n${articleData.cta}`;

    // 文字数をカウント
    const wordCount = fullContent.length;

    // Supabaseに保存
    const { data: insertedArticle, error: insertError } = await supabase
      .from('articles')
      .insert({
        plan_id: planId,
        title: articleData.title,
        content_markdown: fullContent,
        word_count: wordCount,
        status: 'draft',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save article to database' },
        { status: 500 }
      );
    }

    // 企画のステータスを更新
    await supabase
      .from('article_plans')
      .update({ status: 'approved' })
      .eq('id', planId);

    // 生成ログを記録
    await supabase.from('generation_logs').insert({
      stage: 'article',
      reference_id: insertedArticle.id,
      prompt_used: prompt,
      tokens_used: tokens,
      generation_time_ms: generationTime,
      success: true,
    });

    return NextResponse.json({
      article: insertedArticle,
      meta: {
        tokens,
        generationTime,
        wordCount,
      },
    });
  } catch (error: any) {
    console.error('Article generation error:', error);

    // エラーログを記録
    await supabase.from('generation_logs').insert({
      stage: 'article',
      success: false,
      error_message: error.message,
    });

    return NextResponse.json(
      { error: error.message || 'Failed to generate article' },
      { status: 500 }
    );
  }
}
