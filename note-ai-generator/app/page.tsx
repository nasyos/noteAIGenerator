import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Lightbulb, FileText, BookOpen, TrendingUp, Sparkles, Zap, Target } from 'lucide-react';

async function getDashboardStats() {
  // 本番環境では実際のAPIから取得
  // 今はモックデータ
  return {
    totalTopics: 0,
    availableTopics: 0,
    totalPlans: 0,
    totalArticles: 0,
  };
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <Layout>
      <div className="space-y-8">
        {/* ヒーローセクション */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            AI コンテンツクリエイター
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AIの力で、アイデアから完成記事まで。<br />
            高品質なコンテンツを短時間で自動生成するツールです。
          </p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                トピック総数
              </CardTitle>
              <Lightbulb className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalTopics}</div>
              <p className="text-xs text-gray-500 mt-1">
                利用可能: {stats.availableTopics}件
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                記事企画
              </CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalPlans}</div>
              <p className="text-xs text-gray-500 mt-1">作成済み企画書</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                完成記事
              </CardTitle>
              <BookOpen className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.totalArticles}</div>
              <p className="text-xs text-gray-500 mt-1">生成済みコンテンツ</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                今月の生成数
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">0</div>
              <p className="text-xs text-gray-500 mt-1">コンテンツ/月</p>
            </CardContent>
          </Card>
        </div>

        {/* クイックアクション */}
        <Card className="border-2 border-blue-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <CardTitle>クイックスタート</CardTitle>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              3ステップでコンテンツを作成できます
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/topics/generate" className="group">
                <Button className="w-full h-auto py-6 flex flex-col items-center gap-2" size="lg">
                  <Lightbulb className="h-6 w-6" />
                  <div>
                    <div className="font-bold">トピック生成</div>
                    <div className="text-xs font-normal opacity-90">AIがアイデアを提案</div>
                  </div>
                </Button>
              </Link>
              <Link href="/plans/create" className="group">
                <Button className="w-full h-auto py-6 flex flex-col items-center gap-2" size="lg" variant="outline">
                  <FileText className="h-6 w-6" />
                  <div>
                    <div className="font-bold">企画作成</div>
                    <div className="text-xs font-normal opacity-90">構成を自動生成</div>
                  </div>
                </Button>
              </Link>
              <Link href="/articles/create" className="group">
                <Button className="w-full h-auto py-6 flex flex-col items-center gap-2" size="lg" variant="outline">
                  <BookOpen className="h-6 w-6" />
                  <div>
                    <div className="font-bold">記事執筆</div>
                    <div className="text-xs font-normal opacity-90">完成記事を生成</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* ワークフロー説明 */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <CardTitle>コンテンツ作成の流れ</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center space-y-2">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <p className="text-sm font-bold text-gray-900">トピック生成</p>
                <p className="text-xs text-gray-600 text-center max-w-[120px]">
                  AIがカテゴリ別に<br />多数のアイデアを提案
                </p>
              </div>
              <div className="h-1 flex-1 bg-gradient-to-r from-blue-300 to-green-300 mx-4 rounded" />
              <div className="flex flex-col items-center space-y-2">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <p className="text-sm font-bold text-gray-900">企画作成</p>
                <p className="text-xs text-gray-600 text-center max-w-[120px]">
                  タイトル案と<br />記事構成を自動生成
                </p>
              </div>
              <div className="h-1 flex-1 bg-gradient-to-r from-green-300 to-purple-300 mx-4 rounded" />
              <div className="flex flex-col items-center space-y-2">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <p className="text-sm font-bold text-gray-900">記事執筆</p>
                <p className="text-xs text-gray-600 text-center max-w-[120px]">
                  2,500-3,000字の<br />完成記事を生成
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 特徴 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                AI自動生成
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Claude AI（Sonnet 4）を使用した高品質なコンテンツ生成。人間が書いたような自然な文章を作成します。
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                時間短縮
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                通常数時間かかる記事作成を数分に短縮。アイデア出しから完成まで一気通貫で自動化します。
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                カスタマイズ可能
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                カテゴリ指定、構成編集、記事の手直しなど、柔軟にカスタマイズできます。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
