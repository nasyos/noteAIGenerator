import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 開発環境ではスキップ
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  // Basic認証のチェック
  const basicAuth = request.headers.get('authorization');
  const url = request.nextUrl;

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    const validUser = process.env.AUTH_USERNAME || 'admin';
    const validPassword = process.env.AUTH_PASSWORD || 'change-this-password';

    if (user === validUser && pwd === validPassword) {
      return NextResponse.next();
    }
  }

  url.pathname = '/api/auth';

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * すべてのパスに適用（API, static files除く）
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
