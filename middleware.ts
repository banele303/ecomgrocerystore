import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the origin header
  const origin = request.headers.get('origin') || ''
  
  // Clone the response headers
  const headers = new Headers(request.headers)
  
  // Update the x-forwarded-host to match the origin for development environments
  if (process.env.NODE_ENV === 'development') {
    const url = new URL(origin)
    headers.set('x-forwarded-host', url.host)
  }

  // Create a new request with updated headers
  const newRequest = new Request(request.url, {
    method: request.method,
    headers: headers,
    body: request.body,
    cache: request.cache,
    credentials: request.credentials,
    integrity: request.integrity,
    mode: request.mode,
    redirect: request.redirect,
  })

  return NextResponse.next({
    request: newRequest,
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}