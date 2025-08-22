import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { app } from './firebase-admin-config'; // Dapat may Firebase Admin SDK ka na

export async function middleware(request) {
  // 1. Kunin ang token mula sa cookies
  const token = request.cookies.get('firebaseToken')?.value;

  let user = null;
  if (token) {
    try {
      // 2. I-verify ang token gamit ang Firebase ADMIN SDK (hindi Client SDK!)
      const decodedToken = await getAuth(app).verifyIdToken(token);
      user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
      };
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }

  const pathname = request.nextUrl.pathname;

  // 3. Protected Routes Check
  if (['/dashboard', '/admin'].some(route => pathname.startsWith(route)) && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. Admin Routes Check
  if (pathname.startsWith('/admin') && user?.email !== 'admintradeconnecta@gmail.com') {
    return NextResponse.redirect(new URL('/dashboard/user', request.url));
  }

  // 5. Redirect kung naka-login na pero nasa auth page (e.g., /login)
  if (['/login', '/signup'].includes(pathname) && user) {
    return NextResponse.redirect(new URL('/dashboard/user', request.url));
  }

  return NextResponse.next();
}