import { NextResponse } from 'next/server';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, verifyIdToken } from 'firebase-admin/auth';
import { initializeApp as initializeAdminApp } from 'firebase-admin/app';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

// Firebase client config (from .env)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// Initialize Firebase client app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Initialize Firebase Admin SDK (requires service account credentials)
if (!getApps().length) {
  initializeAdminApp({
    credential: applicationDefault(),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });
}

// Handle OPTIONS request (CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(request) {
  try {
    // Extract Firebase ID token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse(JSON.stringify({ error: 'No token provided' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const idToken = authHeader.split('Bearer ')[1];

    // Verify the Firebase ID token
    const decodedToken = await verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Fetch user data from Firestore to check role
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists() || userDoc.data().role !== 'admin') {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized: Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Fetch users from Firestore
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);

    const users = [];
    usersSnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    return new NextResponse(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    let status = 500;
    let errorMessage = 'Failed to fetch users';

    if (error.code === 'auth/id-token-expired') {
      status = 401;
      errorMessage = 'Token expired. Please sign in again.';
    } else if (error.code === 'auth/invalid-id-token') {
      status = 401;
      errorMessage = 'Invalid token.';
    }

    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}