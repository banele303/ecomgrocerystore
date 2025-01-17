import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the header from the incoming request
  const requestHeaders = new Headers(request.headers);
  const hostname = request.headers.get('host');

  // Add the headers we need
  requestHeaders.set('x-forwarded-host', hostname || '');
  requestHeaders.set('origin', hostname || '');

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: '/:path*',
};