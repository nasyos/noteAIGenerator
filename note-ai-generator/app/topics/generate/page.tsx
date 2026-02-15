'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { Loader2, Lightbulb, CheckCircle2, Check } from 'lucide-react';
import { TOPIC_CATEGORIES } from '@/lib/prompts/topic-generation';

export default function TopicGeneratePage() {
  const router = useRouter();
  const [countInput, setCountInput] = useState('20');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const selectAllCategories = () => {
    if (selectedCategories.length === TOPIC_CATEGORIES.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([...TOPIC_CATEGORIES]);
    }
  };

  const handleGenerate = async () => {
    const count = parseInt(countInput);
    if (isNaN(count) || count < 1 || count > 50) {
      setError('生成数は1〜50の範囲で入力してください');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/topics/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          count,
          categories:
            selectedCategories.length > 0 ? selectedCategories : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('トピック生成に失敗しました');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">トピック生成</h1>
          <p className="text-gray-600 mt-2">
            AIが記事のトピック候補を自動生成します
          </p>
        </div>

        {/* 生成フォーム */}
        <Card>
          <CardHeader>
            <CardTitle>生成設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 生成数 */}
            <div className="space-y-2">
              <Label htmlFor="count">生成するトピック数</Label>
              <Input
                id="count"
                type="number"
                min={1}
                max={50}
                value={countInput}
                onChange={(e) => setCountInput(e.target.value)}
                disabled={isGenerating}
              />
              <p className="text-sm text-gray-500">
                1〜50件の範囲で指定してください
              </p>
            </div>

            {/* カテゴリ選択 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>カテゴリ指定（任意）</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={selectAllCategories}
                  disabled={isGenerating}
                >
                  {selectedCategories.length === TOPIC_CATEGORIES.length
                    ? 'すべて解除'
                    : 'すべて選択'}
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                未選択の場合、すべてのカテゴリからバランスよく生成されます
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {TOPIC_CATEGORIES.map((category) => {
                  const isSelected = selectedCategories.includes(category);
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      disabled={isGenerating}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 text-left text-sm transition-colors ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      } ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div
                        className={`flex-shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300'
                        }`}
                      >
                        {isSelected && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="font-medium">{category}</span>
                    </button>
                  );
                })}
              </div>
              {selectedCategories.length > 0 && (
                <p className="text-sm text-blue-600">
                  {selectedCategories.length}件のカテゴリを選択中
                </p>
              )}
            </div>

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
                  <Lightbulb className="mr-2 h-5 w-5" />
                  トピックを生成
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* エラー表示 */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* 結果表示 */}
        {result && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                生成完了
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">生成数</p>
                  <p className="text-2xl font-bold text-green-700">
                    {result.meta.count}件
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">トークン使用量</p>
                  <p className="text-2xl font-bold text-green-700">
                    {result.meta.tokens.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">生成時間</p>
                  <p className="text-2xl font-bold text-green-700">
                    {(result.meta.generationTime / 1000).toFixed(1)}秒
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => router.push('/topics')}
                  className="flex-1"
                >
                  トピック一覧を確認
                </Button>
                <Button
                  onClick={() => router.push('/plans/create')}
                  variant="outline"
                  className="flex-1"
                >
                  企画作成へ
                </Button>
              </div>
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
                    AIがトピックを生成しています
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    通常30〜60秒程度かかります
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
