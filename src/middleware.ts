import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // If logged in and trying to access auth pages → send to dashboard
  if (
    token &&
    (
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') 
    )
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If NOT logged in and trying to access protected routes → send to home
  if (
    !token &&(url.pathname.startsWith('/dashboard'))
  ) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
  ],
};
