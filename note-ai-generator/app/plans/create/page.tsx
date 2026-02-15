'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { TopicTable } from '@/components/topic/TopicTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Loader2, FileText, AlertCircle } from 'lucide-react';
import { Topic } from '@/types/database';

export default function PlanCreatePage() {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await fetch('/api/topics?status=available');
      if (!response.ok) throw new Error('トピックの取得に失敗しました');
      const data = await response.json();
      setTopics(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTopicId) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/plans/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topicId: selectedTopicId }),
      });

      if (!response.ok) {
        throw new Error('企画書の生成に失敗しました');
      }

      const data = await response.json();
      router.push(`/plans/${data.plan.id}`);
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">企画作成</h1>
          <p className="text-gray-600 mt-2">
            トピックを選択して記事企画書を生成します
          </p>
        </div>

        {/* エラー表示 */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* トピック選択 */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: トピックを選択</CardTitle>
          </CardHeader>
          <CardContent>
            {topics.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  利用可能なトピックがありません
                </p>
                <Button onClick={() => router.push('/topics/generate')}>
                  トピックを生成
                </Button>
              </div>
            ) : (
              <TopicTable
                topics={topics}
                onSelectTopic={setSelectedTopicId}
                selectedTopicId={selectedTopicId}
              />
            )}
          </CardContent>
        </Card>

        {/* 生成ボタン */}
        {selectedTopicId && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: 企画書を生成</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                size="lg"
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-5 w-5" />
                    企画書を生成
                  </>
                )}
              </Button>
              {isGenerating && (
                <p className="text-sm text-gray-500 text-center mt-4">
                  通常20〜40秒程度かかります
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
