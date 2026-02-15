import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { callClaudeForJSON } from '@/lib/claude';
import { generateTopicPrompt } from '@/lib/prompts/topic-generation';
import { TopicGenerationResponse } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const count = body.count || 20;
    const categories: string[] | undefined = body.categories;

    // プロンプト生成
    const prompt = generateTopicPrompt(count, categories);

    // Claude APIを呼び出し
    const startTime = Date.now();
    const { data: topics, tokens } = await callClaudeForJSON<TopicGenerationResponse[]>(prompt, 8000);
    const generationTime = Date.now() - startTime;

    // Supabaseに保存
    const topicsToInsert = topics.map((topic) => ({
      topic_name: topic.name,
      category: topic.category,
      priority: topic.priority,
      keywords: topic.keywords,
      target_audience: topic.targetAudience,
      angle: topic.angle,
      status: 'available' as const,
    }));

    const { data: insertedTopics, error: insertError } = await supabase
      .from('topics')
      .insert(topicsToInsert)
      .select();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save topics to database' },
        { status: 500 }
      );
    }

    // 生成ログを記録
    await supabase.from('generation_logs').insert({
      stage: 'topic',
      reference_id: null,
      prompt_used: prompt,
      tokens_used: tokens,
      generation_time_ms: generationTime,
      success: true,
    });

    return NextResponse.json({
      topics: insertedTopics,
      meta: {
        count: insertedTopics?.length || 0,
        tokens,
        generationTime,
      },
    });
  } catch (error: any) {
    console.error('Topic generation error:', error);

    // エラーログを記録
    await supabase.from('generation_logs').insert({
      stage: 'topic',
      reference_id: null,
      success: false,
      error_message: error.message,
    });

    return NextResponse.json(
      { error: error.message || 'Failed to generate topics' },
      { status: 500 }
    );
  }
}
