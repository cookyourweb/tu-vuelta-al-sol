import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🔒 CHECK AUTHENTICATION for protected routes ONLY
  // ⚠️ NOTE: /api/birth-data and /api/users are excluded because they handle their own userId validation
  if (pathname.startsWith('/api/interpretations') ||
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

  // ✅ Allow all other requests (including /api/birth-data, /api/users, /api/charts, /api/astrology)
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
