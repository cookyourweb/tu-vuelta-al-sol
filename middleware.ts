import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Only run middleware for API routes that need authentication
  const { pathname } = request.nextUrl;

  // Skip static assets
  if (pathname.includes('.') || pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }

  // Skip public pages and non-API routes
  if (!pathname.startsWith('/api/') ||
      pathname.startsWith('/api/checkout') ||
      pathname.startsWith('/api/webhook') ||
      pathname.startsWith('/api/auth') ||
      pathname.startsWith('/api/prokerala') ||
      pathname.startsWith('/api/geocode') ||
      pathname.startsWith('/api/reverse-geocode')) {
    return NextResponse.next();
  }

  // For protected routes, let them handle their own auth
  // This minimizes middleware complexity and avoids invocation failures
  return NextResponse.next();
}

// Very minimal config to avoid path resolution issues
export const config = {
  matcher: ['/api/:path*'],
};
