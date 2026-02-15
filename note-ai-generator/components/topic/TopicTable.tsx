'use client';

import { Topic } from '@/types/database';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface TopicTableProps {
  topics: Topic[];
  onSelectTopic?: (topicId: string) => void;
  selectedTopicId?: string | null;
}

export function TopicTable({
  topics,
  onSelectTopic,
  selectedTopicId,
}: TopicTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="default">利用可能</Badge>;
      case 'selected':
        return <Badge variant="secondary">選択中</Badge>;
      case 'used':
        return <Badge variant="outline">使用済み</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'text-red-600 font-bold';
    if (priority >= 5) return 'text-orange-600 font-semibold';
    return 'text-gray-600';
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">優先度</TableHead>
            <TableHead>トピック名</TableHead>
            <TableHead>カテゴリ</TableHead>
            <TableHead>キーワード</TableHead>
            <TableHead>ステータス</TableHead>
            <TableHead>作成日</TableHead>
            <TableHead className="w-[100px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topics.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                トピックがありません
              </TableCell>
            </TableRow>
          ) : (
            topics.map((topic) => (
              <TableRow
                key={topic.id}
                className={
                  selectedTopicId === topic.id ? 'bg-blue-50' : ''
                }
              >
                <TableCell>
                  <span className={getPriorityColor(topic.priority)}>
                    {topic.priority}
                  </span>
                </TableCell>
                <TableCell className="font-medium">
                  {topic.topic_name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{topic.category}</Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {topic.keywords}
                </TableCell>
                <TableCell>{getStatusBadge(topic.status)}</TableCell>
                <TableCell className="text-sm text-gray-500">
                  {format(new Date(topic.created_at), 'yyyy/MM/dd', {
                    locale: ja,
                  })}
                </TableCell>
                <TableCell>
                  {onSelectTopic && topic.status === 'available' && (
                    <Button
                      size="sm"
                      variant={
                        selectedTopicId === topic.id ? 'default' : 'outline'
                      }
                      onClick={() => onSelectTopic(topic.id)}
                    >
                      {selectedTopicId === topic.id ? '選択中' : '選択'}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
