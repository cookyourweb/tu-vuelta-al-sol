import type { NextRequest } from 'next/server';
import admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';

// Initialize Firebase Admin if not already done
if (!admin.apps.length) {
  admin.initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const auth = admin.auth();

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for non-API routes and static files
  if (!pathname.startsWith('/api/') ||
      pathname.includes('.') ||
      pathname.includes('auth') ||
      pathname.includes('checkout')) {
    return;
  }

  // Allow GET requests for interpretations (they use query params for auth)
  if (pathname.startsWith('/api/interpretations/save') && request.method === 'GET') {
    return; // Allow GET requests to pass through
  }

  // Protected API routes
  if (pathname.startsWith('/api/interpretations') ||
      pathname.startsWith('/api/astrology') ||
      pathname.startsWith('/api/charts') ||
      pathname.startsWith('/api/users')) {

    try {
      // Try to get token from authorization header
      const authHeader = request.headers.get('authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // For production, try to get token from cookies or query params
        const token = request.cookies.get('token')?.value ||
                     request.nextUrl.searchParams.get('token');

        if (!token) {
          // Return JSON error instead of redirect for API routes
          return new Response(JSON.stringify({
            error: 'Unauthorized - No authentication token provided'
          }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Verify Firebase token
        await auth.verifyIdToken(token);
      } else {
        // Bearer token authentication
        const token = authHeader.substring(7);
        await auth.verifyIdToken(token);
      }
    } catch (error) {
      console.error('Auth middleware error:', error);
      return new Response(JSON.stringify({
        error: 'Authentication failed - Invalid token'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth (authentication endpoints)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
