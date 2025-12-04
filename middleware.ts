import type { NextRequest } from 'next/server';
import * as admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';

// Lazy-initialized Firebase Admin
let firebaseApp: admin.app.App | null = null;
let auth: admin.auth.Auth | null = null;

function initializeFirebase() {
  if (!firebaseApp) {
    // Check environment variables first
    if (!process.env.FIREBASE_PROJECT_ID ||
        !process.env.FIREBASE_CLIENT_EMAIL ||
        !process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error('Firebase environment variables not configured');
    }

    try {
      firebaseApp = admin.initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
      auth = firebaseApp.auth();
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      throw new Error('Failed to initialize Firebase');
    }
  }
  return auth as admin.auth.Auth;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and assets
  if (pathname.includes('.') ||
      pathname.startsWith('/favicon.ico') ||
      pathname.startsWith('/_next/')) {
    return;
  }

  // Skip authentication for public API endpoints
  if (pathname.startsWith('/api/checkout') ||
      pathname.startsWith('/api/webhook') ||
      pathname.startsWith('/api/auth') ||
      pathname.startsWith('/api/prokerala') ||
      pathname.startsWith('/api/geocode') ||
      pathname.startsWith('/api/reverse-geocode')) {
    return;
  }

  // Check Firebase configuration once at the beginning
  if (!process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY) {
    console.error('Firebase environment variables not configured');
    // In production, return error instead of skipping auth
    return new Response(JSON.stringify({
      error: 'Server configuration error - Firebase not properly configured',
      code: 'FIREBASE_CONFIG_ERROR'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Protected API routes that require authentication
  if (pathname.startsWith('/api/interpretations') ||
      pathname.startsWith('/api/astrology') ||
      pathname.startsWith('/api/charts') ||
      pathname.startsWith('/api/users') ||
      pathname.startsWith('/api/birth-data') ||
      pathname.startsWith('/api/pdf') ||
      pathname.startsWith('/api/cache')) {

    try {
      // Always try Bearer token first
      const authHeader = request.headers.get('authorization');
      let token: string | null = null;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else {
        // Fallback to cookie or query param
        token = request.cookies.get('token')?.value ||
               request.nextUrl.searchParams.get('token') || null;
      }

      if (!token) {
        return new Response(JSON.stringify({
          error: 'Unauthorized - No authentication token provided'
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Verify Firebase token
      const authInstance = initializeFirebase();
      await authInstance.verifyIdToken(token);

    } catch (error) {
      console.error('Auth middleware error:', error);
      return new Response(JSON.stringify({
        error: 'Authentication failed - Invalid token',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
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
