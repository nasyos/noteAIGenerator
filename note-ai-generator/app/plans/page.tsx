import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Plus, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

async function getPlans() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/plans`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Failed to fetch plans:', error);
    return [];
  }
}

export default async function PlansPage() {
  const plans = await getPlans();

  return (
    <Layout>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">記事企画</h1>
            <p className="text-gray-600 mt-2">
              記事の企画書を作成・管理します
            </p>
          </div>
          <Link href="/plans/create">
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              企画を作成
            </Button>
          </Link>
        </div>

        {/* 企画一覧 */}
        <div className="grid grid-cols-1 gap-6">
          {plans.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">企画書がありません</p>
                <Link href="/plans/create">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    最初の企画を作成
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            plans.map((plan: any) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {plan.selected_title || plan.title_options[0]}
                      </CardTitle>
                      <p className="text-sm text-gray-600">{plan.lead}</p>
                    </div>
                    <Badge>
                      {plan.status === 'draft' && '下書き'}
                      {plan.status === 'approved' && '承認済み'}
                      {plan.status === 'archived' && 'アーカイブ'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <p>
                        トピック: {plan.topics?.topic_name || '削除済み'}
                      </p>
                      <p>
                        作成日:{' '}
                        {format(new Date(plan.created_at), 'yyyy/MM/dd', {
                          locale: ja,
                        })}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/plans/${plan.id}`}>
                        <Button variant="outline">詳細</Button>
                      </Link>
                      <Link href={`/articles/create?planId=${plan.id}`}>
                        <Button>記事を執筆</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
