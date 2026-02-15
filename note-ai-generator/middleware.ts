import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 開発環境ではスキップ
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  // Basic認証のチェック
  const basicAuth = request.headers.get('authorization');

  if (basicAuth) {
    try {
      const authValue = basicAuth.split(' ')[1];
      // Edge環境ではatobが使えないため、手動でデコード
      const decoded = Buffer.from(authValue, 'base64').toString('utf-8');
      const [user, pwd] = decoded.split(':');

      const validUser = process.env.AUTH_USERNAME || 'admin';
      const validPassword = process.env.AUTH_PASSWORD || 'change-this-password';

      if (user === validUser && pwd === validPassword) {
        return NextResponse.next();
      }
    } catch (error) {
      // 認証エラー時はそのまま401を返す
    }
  }

  // 認証が必要な場合は401を返す
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  matcher: [
    /*
     * すべてのパスに適用（API, static files除く）
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
