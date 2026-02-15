'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { MarkdownEditor } from '@/components/article/MarkdownEditor';
import { MarkdownPreview } from '@/components/article/MarkdownPreview';
import { CopyButton } from '@/components/article/CopyButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function ArticleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [noteUrl, setNoteUrl] = useState('');

  useEffect(() => {
    fetchArticle();
  }, []);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/articles/${params.id}`);
      if (!response.ok) throw new Error('記事の取得に失敗しました');
      const data = await response.json();
      setArticle(data);
      setEditedContent(data.content_markdown);
      setEditedTitle(data.title);
      setNoteUrl(data.note_url || '');
    } catch (error) {
      console.error('Failed to fetch article:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/articles/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editedTitle,
          content_markdown: editedContent,
          note_url: noteUrl || null,
        }),
      });

      if (!response.ok) throw new Error('保存に失敗しました');
      const updatedArticle = await response.json();
      setArticle(updatedArticle);
      alert('保存しました');
    } catch (error) {
      console.error('Failed to save article:', error);
      alert('保存に失敗しました');
    } finally {
      setIsSaving(false);
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

  if (!article) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">記事が見つかりません</p>
          <Link href="/articles">
            <Button variant="outline">記事一覧に戻る</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <Link href="/articles">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              記事一覧に戻る
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <CopyButton text={editedContent} />
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  保存
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 基本情報 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge>
                  {article.status === 'draft' && '下書き'}
                  {article.status === 'reviewed' && 'レビュー済み'}
                  {article.status === 'published' && '公開済み'}
                </Badge>
                {article.word_count && (
                  <Badge variant="outline">
                    {article.word_count.toLocaleString()}字
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="noteUrl">note URL（公開後に入力）</Label>
              <Input
                id="noteUrl"
                value={noteUrl}
                onChange={(e) => setNoteUrl(e.target.value)}
                placeholder="https://note.com/..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">作成日時</p>
                <p className="font-medium">
                  {format(new Date(article.created_at), 'yyyy/MM/dd HH:mm', {
                    locale: ja,
                  })}
                </p>
              </div>
              {article.published_at && (
                <div>
                  <p className="text-gray-600">公開日時</p>
                  <p className="font-medium">
                    {format(
                      new Date(article.published_at),
                      'yyyy/MM/dd HH:mm',
                      { locale: ja }
                    )}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 記事編集エリア */}
        <Card>
          <CardHeader>
            <CardTitle>記事内容</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="edit" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit">編集</TabsTrigger>
                <TabsTrigger value="preview">プレビュー</TabsTrigger>
              </TabsList>
              <TabsContent value="edit" className="mt-4">
                <MarkdownEditor
                  value={editedContent}
                  onChange={setEditedContent}
                />
              </TabsContent>
              <TabsContent value="preview" className="mt-4">
                <div className="border rounded-lg p-6 bg-white min-h-[600px]">
                  <MarkdownPreview content={editedContent} />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 使用方法のヒント */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">💡 使い方のヒント</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-800 space-y-2">
            <p>1. 「編集」タブで記事内容を確認・修正できます</p>
            <p>2. 「プレビュー」タブで実際の表示を確認できます</p>
            <p>3. 「コピー」ボタンでマークダウンをクリップボードにコピーし、noteに貼り付けられます</p>
            <p>4. noteに公開したら、URLを入力して「保存」してください</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
