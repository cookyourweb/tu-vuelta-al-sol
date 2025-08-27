import { NextResponse } from 'next/server';

export async function GET() {
  const firebaseVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY'
  ];

  const envStatus = firebaseVars.reduce((acc, varName) => {
    const value = process.env[varName];
    acc[varName] = {
      exists: !!value,
      length: value?.length || 0,
      preview: value ? value.substring(0, 8) + '...' : 'UNDEFINED',
      value: value // Show full value for debugging
    };
    return acc;
  }, {} as Record<string, any>);

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    firebaseEnvironmentVariables: envStatus,
    allFirebaseVars: Object.keys(process.env).filter(key =>
      key.includes('FIREBASE')
    )
  });
}
