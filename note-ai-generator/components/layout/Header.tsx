import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">
                AI Content Creator
              </span>
              <span className="text-xs text-gray-500">
                コンテンツクリエイター
              </span>
            </div>
          </Link>
          <div className="text-sm text-gray-600">
            EXTOOL株式会社
          </div>
        </div>
      </div>
    </header>
  );
}
