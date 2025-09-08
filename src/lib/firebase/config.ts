// src/lib/firebase/config.ts Firebase configuration functions for Next.js

// Client-side Firebase config
export const getFirebaseConfig = () => {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
};

// Server-side Firebase Admin config
export const getFirebaseAdminConfig = () => {
  return {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`,
  };
};

// Validate Firebase configuration
export const validateFirebaseConfig = () => {
  const config = getFirebaseConfig();
  
  const missingVars = [];
  if (!config.apiKey) missingVars.push('NEXT_PUBLIC_FIREBASE_API_KEY');
  if (!config.authDomain) missingVars.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
  if (!config.projectId) missingVars.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  if (!config.storageBucket) missingVars.push('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
  if (!config.messagingSenderId) missingVars.push('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
  if (!config.appId) missingVars.push('NEXT_PUBLIC_FIREBASE_APP_ID');

  if (missingVars.length > 0) {
    console.warn('Missing Firebase client environment variables:', missingVars);
    // Solo lanzar error en producción
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing Firebase client environment variables: ${missingVars.join(', ')}`);
    }
  }
};

// También exportar la configuración directa para compatibilidad
export const firebaseConfig = getFirebaseConfig();