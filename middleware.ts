import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - unauthorized (the unauthorized page itself)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|unauthorized).*)',
  ],
};

export function middleware(req: NextRequest) {
  const country = req.headers.get('x-vercel-ip-country');

  // Allow access if in development mode or if the country is Benin (BJ)
  if (process.env.NODE_ENV === 'development' || country === 'BJ') {
    return NextResponse.next();
  }

  // Redirect to an unauthorized page for other countries
  const url = req.nextUrl.clone();
  url.pathname = '/unauthorized';
  return NextResponse.redirect(url);
}