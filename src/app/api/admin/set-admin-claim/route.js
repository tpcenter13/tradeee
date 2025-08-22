import { adminAuth } from '@/lib/firebase-admin-config';
import { getAuth } from 'firebase/auth';
import { NextResponse } from 'next/server';

// This is a protected API route that can only be called by server-side code
export async function POST(request) {
  try {
    const { uid, isAdmin } = await request.json();
    
    if (!uid) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Set custom claims
    await adminAuth.setCustomUserClaims(uid, { admin: isAdmin !== false });
    
    return NextResponse.json({
      success: true,
      message: `Successfully ${isAdmin ? 'granted' : 'revoked'} admin privileges`
    });
    
  } catch (error) {
    console.error('Error setting admin claim:', error);
    return NextResponse.json(
      { error: 'Failed to update admin status' },
      { status: 500 }
    );
  }
}
