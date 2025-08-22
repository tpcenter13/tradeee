import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let adminApp;
let adminAuth;

if (process.env.NODE_ENV !== 'production') {
  // Initialize Firebase Admin SDK in development or server runtime
  const requiredEnvVars = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  };

  // Check for required environment variables
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }

  adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
  adminAuth = getAuth(adminApp);
} else {
  // Mock for build time (NODE_ENV=production)
  adminApp = {};
  adminAuth = {
    setCustomUserClaims: async (uid, claims) => {
      console.log(`Mock setCustomUserClaims called during build for UID: ${uid}, claims:`, claims);
      return Promise.resolve();
    },
  };
}

export { adminApp, adminAuth }; // Fix: Export 'adminApp' instead of 'app'