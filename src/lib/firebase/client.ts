// Client-side Firebase configuration
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFirebaseConfig } from './config';

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
    console.error('Failed to initialize Firebase client:', error);
    // Don't throw here to prevent app from crashing
    // The app can still function without Firebase in some cases
  }
}

export { app, auth, db };
