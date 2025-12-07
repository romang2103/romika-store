import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  // Add other public routes here (about, contact, etc.)
];

// Define routes that require authentication
const AUTH_REQUIRED_ROUTES = [
  '/checkout',
  '/user',
  // Add other user routes here
];

// Define admin-only routes
const ADMIN_ROUTES = [
  '/admin',
  '/dashboard',
  '/products', // Products management is admin-only
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );
}

function requiresAuth(pathname: string): boolean {
  return AUTH_REQUIRED_ROUTES.some(route =>
    pathname.startsWith(route)
  );
}

function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some(route =>
    pathname.startsWith(route)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth cookies
  const sessionId = request.cookies.get('sessionId')?.value;
  const authenticated = request.cookies.get('authenticated')?.value === 'true';
  const role = request.cookies.get('role')?.value;

  const isAuthRoute = pathname === '/login' || pathname === '/signup';

  // If user is authenticated and tries to access auth routes, redirect to home
  if (authenticated && isAuthRoute) {
    const redirectUrl = role === 'admin' ? '/dashboard' : '/';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Allow public routes
  if (isPublicRoute(pathname) && !isAuthRoute) {
    return NextResponse.next();
  }

  // Check admin routes - require both authentication and admin role
  if (isAdminRoute(pathname)) {
    if (!authenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Check routes that require authentication (like checkout, user profile)
  if (requiresAuth(pathname)) {
    if (!authenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 