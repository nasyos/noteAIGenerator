import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

async function getPlan(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/plans/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch plan:', error);
    return null;
  }
}

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan = await getPlan(id);

  if (!plan) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">企画が見つかりません</p>
          <Link href="/plans">
            <Button variant="outline">企画一覧に戻る</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <Link href="/plans">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              企画一覧に戻る
            </Button>
          </Link>
          <Link href={`/articles/create?planId=${plan.id}`}>
            <Button size="lg">
              <FileText className="mr-2 h-5 w-5" />
              この企画で記事を執筆
            </Button>
          </Link>
        </div>

        {/* 基本情報 */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <Badge className="mb-2">
                  {plan.status === 'draft' && '下書き'}
                  {plan.status === 'approved' && '承認済み'}
                  {plan.status === 'archived' && 'アーカイブ'}
                </Badge>
                <CardTitle className="text-2xl">企画詳細</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">元トピック</p>
              <p className="font-medium">
                {plan.topics?.topic_name || '削除済み'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">作成日時</p>
              <p className="font-medium">
                {format(new Date(plan.created_at), 'yyyy年MM月dd日 HH:mm', {
                  locale: ja,
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">目標文字数</p>
              <p className="font-medium">{plan.target_length.toLocaleString()}字</p>
            </div>
          </CardContent>
        </Card>

        {/* タイトル案 */}
        <Card>
          <CardHeader>
            <CardTitle>タイトル案</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {plan.title_options.map((title: string, index: number) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  title === plan.selected_title
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-600">
                      案{index + 1}
                    </span>
                    <p className="font-medium mt-1">{title}</p>
                  </div>
                  {title === plan.selected_title && (
                    <Badge variant="default">選択中</Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* リード文 */}
        <Card>
          <CardHeader>
            <CardTitle>リード文</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{plan.lead}</p>
          </CardContent>
        </Card>

        {/* 記事構成 */}
        <Card>
          <CardHeader>
            <CardTitle>記事構成</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {plan.structure.map((section: any, index: number) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-gray-50"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">
                    {index + 1}. {section.heading}
                  </h3>
                  {section.estimatedLength && (
                    <Badge variant="outline">
                      約{section.estimatedLength}字
                    </Badge>
                  )}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* メモ */}
        {plan.notes && (
          <Card>
            <CardHeader>
              <CardTitle>メモ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{plan.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
