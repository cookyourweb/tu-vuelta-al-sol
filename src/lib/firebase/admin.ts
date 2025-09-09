// Firebase Admin SDK for server-side operations
import admin from 'firebase-admin';
import { getFirebaseAdminConfig } from './config';

// Global variable to cache the initialized admin instance
let firebaseAdmin: admin.app.App | null = null;

// Initialize Firebase Admin only once
const initializeFirebaseAdmin = (): admin.app.App => {
  if (firebaseAdmin) {
    return firebaseAdmin;
  }

  if (!admin.apps.length) {
    try {
      const serviceAccount = getFirebaseAdminConfig();
      
      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as any),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
      });
      
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Firebase Admin:', error);
      throw error;
    }
  } else {
    firebaseAdmin = admin.apps[0];
  }
  
  return firebaseAdmin!;
};

// Export a function that ensures initialization
export const getFirebaseAdmin = (): admin.app.App => {
  return initializeFirebaseAdmin();
};

// Default export for backward compatibility
const defaultExport = getFirebaseAdmin();
export default defaultExport;