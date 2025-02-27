import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/signup');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isUserRoute = request.nextUrl.pathname.startsWith('/user');
  
  const authenticated = request.cookies.get('authenticated')?.value === 'true';
  const role = request.cookies.get('role')?.value;
  const sessionId = request.cookies.get('sessionId')?.value;

  // Redirect to login if no session exists
  if (!sessionId && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users away from auth routes
  if (authenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Handle admin routes
  if (isAdminRoute && role !== 'admin') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Handle user routes
  if (isUserRoute && !authenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/user/:path*',
    '/login',
    '/signup',
    // '/checkout'
  ],
}; 