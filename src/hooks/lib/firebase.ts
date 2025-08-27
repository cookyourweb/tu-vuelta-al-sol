import { app, auth, db } from '../../lib/firebase/client';
import { validateFirebaseConfig } from '../../lib/firebase/config';

// Validate Firebase configuration
validateFirebaseConfig();

export { app, auth, db };
