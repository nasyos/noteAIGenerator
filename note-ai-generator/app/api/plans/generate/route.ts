import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { callClaudeForJSON } from '@/lib/claude';
import { generatePlanPrompt } from '@/lib/prompts/plan-generation';
import { PlanGenerationResponse, Topic } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topicId } = body;

    if (!topicId) {
      return NextResponse.json(
        { error: 'topicId is required' },
        { status: 400 }
      );
    }

    // トピック情報を取得
    const { data: topic, error: topicError } = await supabase
      .from('topics')
      .select('*')
      .eq('id', topicId)
      .single();

    if (topicError || !topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    // プロンプト生成
    const prompt = generatePlanPrompt(topic as Topic);

    // Claude APIを呼び出し
    const startTime = Date.now();
    const { data: planData, tokens } = await callClaudeForJSON<PlanGenerationResponse>(prompt, 6000);
    const generationTime = Date.now() - startTime;

    // Supabaseに保存
    const { data: insertedPlan, error: insertError } = await supabase
      .from('article_plans')
      .insert({
        topic_id: topicId,
        title_options: planData.titleOptions,
        selected_title: planData.titleOptions[0], // デフォルトで1つ目を選択
        lead: planData.lead,
        structure: planData.structure,
        target_length: planData.targetLength,
        status: 'draft',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save plan to database' },
        { status: 500 }
      );
    }

    // トピックのステータスを更新
    await supabase
      .from('topics')
      .update({ status: 'used' })
      .eq('id', topicId);

    // 生成ログを記録
    await supabase.from('generation_logs').insert({
      stage: 'plan',
      reference_id: insertedPlan.id,
      prompt_used: prompt,
      tokens_used: tokens,
      generation_time_ms: generationTime,
      success: true,
    });

    return NextResponse.json({
      plan: insertedPlan,
      meta: {
        tokens,
        generationTime,
      },
    });
  } catch (error: any) {
    console.error('Plan generation error:', error);

    // エラーログを記録
    await supabase.from('generation_logs').insert({
      stage: 'plan',
      success: false,
      error_message: error.message,
    });

    return NextResponse.json(
      { error: error.message || 'Failed to generate plan' },
      { status: 500 }
    );
  }
}
