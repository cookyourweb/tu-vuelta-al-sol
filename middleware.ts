import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🚫 BLOCK all protected routes by default for security
  // ⛔ API routes require authentication, so return 401
  if (pathname.startsWith('/api/interpretations') ||
      pathname.startsWith('/api/astrology') ||
      pathname.startsWith('/api/charts') ||
      pathname.startsWith('/api/users') ||
      pathname.startsWith('/api/birth-data') ||
      pathname.startsWith('/api/pdf') ||
      pathname.startsWith('/api/cache')) {

    // 🚫 Return 401 Unauthorized for all protected routes
    // ⚡ Routes now handle their own authentication internally
    // 🔒 This prevents unauthorized access while avoiding middleware failures
    return NextResponse.json({
      success: false,
      error: 'Authentication required'
    }, { status: 401 });
  }

  // ✅ Allow all other requests (static assets, public pages, etc)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
