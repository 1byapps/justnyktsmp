import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith('/giris') || pathname.startsWith('/kayit') || pathname.startsWith('/sifremi-unuttum');
  
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/panel', request.url));
  }

  const isProtected = pathname.startsWith('/panel') || pathname.startsWith('/destek');
  const isAdmin = pathname.startsWith('/admin');

  if ((isProtected || isAdmin) && !session) {
    return NextResponse.redirect(new URL('/giris', request.url));
  }

  if (isAdmin) {
    const roles = (session?.user as any)?.roles || [];
    if (!roles.includes('admin') && !roles.includes('yonetici')) {
      return NextResponse.redirect(new URL('/panel', request.url));
    }
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
