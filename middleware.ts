// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') || '';
  const forwardedHost = request.headers.get('x-forwarded-host') || '';

  if (origin && forwardedHost && origin !== forwardedHost) {
    return new Response('Invalid Server Actions request.', {
      status: 400,
    });
  }

  return NextResponse.next();
}
