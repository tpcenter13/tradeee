import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK
const adminApp = initializeApp({
  credential: cert({
    projectId: "tradeconnect-3c728",
    clientEmail: "firebase-adminsdk-lhbor@tradeconnect-3c728.iam.gserviceaccount.com",
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  databaseURL: "https://tradeconnect-3c728-default-rtdb.asia-southeast1.firebasedatabase.app"
});

export const adminAuth = getAuth(adminApp);