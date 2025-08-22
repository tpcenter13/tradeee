import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get the token and email from cookies
  const token = request.cookies.get('token')?.value;
  const userEmail = request.cookies.get('userEmail')?.value;

  // Public routes that don't require authentication
  const publicPaths = ['/login', '/signup', '/forgot'];
  if (publicPaths.some(path => pathname.startsWith(path))) {
    // If user is already logged in and tries to access login/signup, redirect to appropriate dashboard
    if (token) {
      if (userEmail === 'admintradeconnecta@gmail.com') {
        return NextResponse.redirect(new URL('/dashboard/admin', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard/user', request.url));
      }
    }
    return NextResponse.next();
  }

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check admin routes
  const isAdminRoute = pathname.startsWith('/dashboard/admin');
  const isAdminUser = userEmail === 'admintradeconnecta@gmail.com';

  if (isAdminRoute && !isAdminUser) {
    // If non-admin tries to access admin route, redirect to user dashboard
    return NextResponse.redirect(new URL('/dashboard/user', request.url));
  }

  if (!isAdminRoute && pathname.startsWith('/dashboard/user') && isAdminUser) {
    // If admin tries to access user dashboard, redirect to admin dashboard
    return NextResponse.redirect(new URL('/dashboard/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/forgot'
  ]
};
