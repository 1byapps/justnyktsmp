import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for NextAuth v5 session cookie in edge runtime without heavy node libraries
  const sessionToken =
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value ||
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value;

  const hasSession = Boolean(sessionToken);

  const isAuthPage =
    pathname.startsWith('/giris') ||
    pathname.startsWith('/kayit') ||
    pathname.startsWith('/sifremi-unuttum');

  if (isAuthPage && hasSession) {
    return NextResponse.redirect(new URL('/panel', request.url));
  }

  const isProtected = pathname.startsWith('/panel') || pathname.startsWith('/destek');
  const isAdmin = pathname.startsWith('/admin');

  if ((isProtected || isAdmin) && !hasSession) {
    const loginUrl = new URL('/giris', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
