// lib/firebase-client.ts
// Client-side Firebase configuration with environment variable validation

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Validate that required environment variables are available
const validateFirebaseConfig = () => {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  const missingVars = requiredVars.filter(varName => {
    const value = process.env[varName];
    return value === undefined || value === '';
  });

  if (missingVars.length > 0) {
    console.error('Missing Firebase environment variables:', missingVars);
    throw new Error(`Missing required Firebase configuration: ${missingVars.join(', ')}`);
  }
};

// Get Firebase configuration for client-side use
const getFirebaseConfig = () => {
  validateFirebaseConfig();
  
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  };
};

// Initialize Firebase only on client-side
let app: any = null;
let auth: any = null;
let db: any = null;

if (typeof window !== 'undefined') {
  try {
    const firebaseConfig = getFirebaseConfig();
    app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);

    // Set auth persistence to local
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error('Error setting auth persistence:', error);
    });
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
}

export { app, auth, db };
