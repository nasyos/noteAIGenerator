'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { Loader2, BookOpen, AlertCircle } from 'lucide-react';

function ArticleCreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planIdFromQuery = searchParams.get('planId');

  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    planIdFromQuery || ''
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans?status=draft');
      if (!response.ok) throw new Error('企画の取得に失敗しました');
      const data = await response.json();
      setPlans(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedPlanId) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/articles/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId: selectedPlanId }),
      });

      if (!response.ok) {
        throw new Error('記事の生成に失敗しました');
      }

      const data = await response.json();
      router.push(`/articles/${data.article.id}`);
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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">記事作成</h1>
          <p className="text-gray-600 mt-2">
            企画書を選択して記事を生成します
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

        {/* 企画選択 */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: 企画書を選択</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {plans.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  利用可能な企画がありません
                </p>
                <Button onClick={() => router.push('/plans/create')}>
                  企画を作成
                </Button>
              </div>
            ) : (
              <>
                <Select
                  value={selectedPlanId}
                  onValueChange={setSelectedPlanId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="企画を選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.selected_title || plan.title_options[0]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedPlanId && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    {(() => {
                      const plan = plans.find((p) => p.id === selectedPlanId);
                      return (
                        <div className="space-y-2">
                          <p className="font-medium">
                            {plan?.selected_title || plan?.title_options[0]}
                          </p>
                          <p className="text-sm text-gray-600">{plan?.lead}</p>
                          <p className="text-xs text-gray-500">
                            目標文字数: {plan?.target_length.toLocaleString()}字
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* 生成ボタン */}
        {selectedPlanId && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: 記事を生成</CardTitle>
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
                    <BookOpen className="mr-2 h-5 w-5" />
                    記事を生成
                  </>
                )}
              </Button>
              {isGenerating && (
                <p className="text-sm text-gray-500 text-center mt-4">
                  通常40〜90秒程度かかります
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* 生成中の説明 */}
        {isGenerating && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4 text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    AIが記事を執筆しています
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    2,500〜3,000字程度の記事を生成中
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

export default function ArticleCreatePage() {
  return (
    <Suspense
      fallback={
        <Layout>
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </Layout>
      }
    >
      <ArticleCreateContent />
    </Suspense>
  );
}
