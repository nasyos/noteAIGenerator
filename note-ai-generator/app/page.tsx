import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Lightbulb, FileText, BookOpen, TrendingUp } from 'lucide-react';

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="text-gray-600 mt-2">
            Note記事生成システムの概要
          </p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                トピック総数
              </CardTitle>
              <Lightbulb className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTopics}</div>
              <p className="text-xs text-gray-500 mt-1">
                利用可能: {stats.availableTopics}件
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                記事企画
              </CardTitle>
              <FileText className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPlans}</div>
              <p className="text-xs text-gray-500 mt-1">作成済み企画書</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                記事総数
              </CardTitle>
              <BookOpen className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalArticles}</div>
              <p className="text-xs text-gray-500 mt-1">生成済み記事</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                今月の生成数
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500 mt-1">記事/月</p>
            </CardContent>
          </Card>
        </div>

        {/* クイックアクション */}
        <Card>
          <CardHeader>
            <CardTitle>クイックアクション</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/topics/generate">
                <Button className="w-full" size="lg">
                  <Lightbulb className="mr-2 h-5 w-5" />
                  トピック生成
                </Button>
              </Link>
              <Link href="/plans">
                <Button className="w-full" size="lg" variant="outline">
                  <FileText className="mr-2 h-5 w-5" />
                  企画を作成
                </Button>
              </Link>
              <Link href="/articles">
                <Button className="w-full" size="lg" variant="outline">
                  <BookOpen className="mr-2 h-5 w-5" />
                  記事一覧
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* ワークフロー説明 */}
        <Card>
          <CardHeader>
            <CardTitle>記事生成の流れ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <p className="text-sm font-medium">トピック生成</p>
                <p className="text-xs text-gray-500 text-center">
                  AIがトピックを<br />20-30件提案
                </p>
              </div>
              <div className="h-0.5 flex-1 bg-gray-200 mx-4" />
              <div className="flex flex-col items-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <p className="text-sm font-medium">企画作成</p>
                <p className="text-xs text-gray-500 text-center">
                  トピックから<br />記事構成を生成
                </p>
              </div>
              <div className="h-0.5 flex-1 bg-gray-200 mx-4" />
              <div className="flex flex-col items-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <p className="text-sm font-medium">記事執筆</p>
                <p className="text-xs text-gray-500 text-center">
                  企画書から<br />完成記事を生成
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
