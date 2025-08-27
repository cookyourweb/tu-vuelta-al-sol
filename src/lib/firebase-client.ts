// lib/firebase-client.ts
// Client-side Firebase configuration with environment variable validation

import { app, auth, db } from './firebase/client';
import { validateFirebaseConfig } from './firebase/config';

// Validate Firebase configuration
validateFirebaseConfig();

export { app, auth, db };
