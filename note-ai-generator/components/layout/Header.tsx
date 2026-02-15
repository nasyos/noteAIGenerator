import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">NA</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Note AI Generator
            </span>
          </Link>
          <div className="text-sm text-gray-600">
            EXTOOL株式会社
          </div>
        </div>
      </div>
    </header>
  );
}
