import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Plus, BookOpen, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function getArticles() {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*, article_plans(*, topics(*))')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return [];
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">下書き</Badge>;
      case 'reviewed':
        return <Badge variant="default">レビュー済み</Badge>;
      case 'published':
        return <Badge className="bg-green-600">公開済み</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">記事一覧</h1>
            <p className="text-gray-600 mt-2">
              生成された記事を管理します
            </p>
          </div>
          <Link href="/articles/create">
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              記事を作成
            </Button>
          </Link>
        </div>

        {/* 記事一覧 */}
        <div className="grid grid-cols-1 gap-6">
          {articles.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">記事がありません</p>
                <Link href="/articles/create">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    最初の記事を作成
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            articles.map((article: any) => (
              <Card key={article.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusBadge(article.status)}
                        {article.word_count && (
                          <Badge variant="outline">
                            {article.word_count.toLocaleString()}字
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">
                        {article.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <p>
                        作成日:{' '}
                        {format(new Date(article.created_at), 'yyyy/MM/dd', {
                          locale: ja,
                        })}
                      </p>
                      {article.published_at && (
                        <p>
                          公開日:{' '}
                          {format(
                            new Date(article.published_at),
                            'yyyy/MM/dd',
                            { locale: ja }
                          )}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/articles/${article.id}`}>
                        <Button variant="outline">詳細</Button>
                      </Link>
                      {article.note_url && (
                        <a
                          href={article.note_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            noteで見る
                          </Button>
                        </a>
                      )}
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
