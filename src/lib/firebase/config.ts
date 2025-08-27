// Firebase configuration and validation utilities

/**
 * Validate Firebase environment variables
 * @throws Error if required variables are missing
 */
export const validateFirebaseConfig = (): void => {
  // Skip validation on client-side to prevent errors
  if (typeof window !== 'undefined') {
    return;
  }

  const requiredClientVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'
  ];

  const missingClientVars = requiredClientVars.filter(varName => {
    const value = process.env[varName];
    return value === undefined || value === '';
  });

  if (missingClientVars.length > 0) {
    console.error('Missing Firebase client environment variables:', missingClientVars);
    // Don't throw for client-side to prevent app crashes
  }

  // Server-side validation (only throws in server context)
  const requiredServerVars = [
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_PROJECT_ID'
  ];

  const missingServerVars = requiredServerVars.filter(varName => {
    const value = process.env[varName];
    return value === undefined || value === '';
  });

  if (missingServerVars.length > 0) {
    throw new Error(`Missing Firebase server environment variables: ${missingServerVars.join(', ')}`);
  }
};

/**
 * Get Firebase configuration for client-side use
 */
export const getFirebaseConfig = () => {
  // Validate but don't throw for client-side
  try {
    validateFirebaseConfig();
  } catch (error) {
    console.warn('Firebase configuration validation warning:', error);
  }

  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  };
};

/**
 * Get Firebase Admin configuration for server-side use
 */
export const getFirebaseAdminConfig = () => {
  validateFirebaseConfig();

  return {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };
};
