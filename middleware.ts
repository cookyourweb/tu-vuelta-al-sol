import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🔒 CHECK AUTHENTICATION for protected routes
  // ⭕ Allow authenticated requests through, block unauthenticated ones
  if (pathname.startsWith('/api/interpretations') ||
      pathname.startsWith('/api/astrology') ||
      pathname.startsWith('/api/charts') ||
      pathname.startsWith('/api/users') ||
      pathname.startsWith('/api/birth-data') ||
      pathname.startsWith('/api/pdf') ||
      pathname.startsWith('/api/cache')) {

    // ✅ Check if request has authentication token
    const authHeader = request.headers.get('authorization');
    const hasBearerToken = authHeader?.startsWith('Bearer ');
    const hasTokenParam = request.nextUrl.searchParams.has('token');

    // 🟢 Allow through if has authentication
    if (hasBearerToken || hasTokenParam) {
      return NextResponse.next();
    }

    // 🚫 Block unauthenticated requests
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
