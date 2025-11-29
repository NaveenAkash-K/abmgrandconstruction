import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for admin pages
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check for authentication token (implement your auth logic here)
    const token = request.cookies.get('admin-token');

    if (!token) {
      // Redirect to login page if not authenticated
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};