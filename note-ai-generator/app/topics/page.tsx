import { Layout } from '@/components/layout/Layout';
import { TopicTable } from '@/components/topic/TopicTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Plus, Lightbulb } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function getTopics() {
  try {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Failed to fetch topics:', error);
    return [];
  }
}

export default async function TopicsPage() {
  const topics = await getTopics();

  return (
    <Layout>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">トピック管理</h1>
            <p className="text-gray-600 mt-2">
              記事のトピック候補を管理します
            </p>
          </div>
          <Link href="/topics/generate">
            <Button size="lg">
              <Lightbulb className="mr-2 h-5 w-5" />
              トピック生成
            </Button>
          </Link>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                総トピック数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topics.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                利用可能
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {topics.filter((t: any) => t.status === 'available').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                使用済み
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-400">
                {topics.filter((t: any) => t.status === 'used').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* トピック一覧 */}
        <Card>
          <CardHeader>
            <CardTitle>トピック一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <TopicTable topics={topics} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
