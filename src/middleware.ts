import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAdvertiserStatus } from './lib/auth';

const ADVERTISER_ONLY_ROUTES = ['/ad-dashboard', '/create-cp', '/campaign-stats'];
const NON_ADVERTISER_ROUTES = ['/pre-ad'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow access to the home page without wallet connection
  if (pathname === '/') {
    return NextResponse.next();
  }

  const walletAddress = request.cookies.get('walletAddress')?.value;

  // Redirect to home page if wallet is not connected
  if (!walletAddress) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // For advertiser-only and non-advertiser routes, perform additional checks
  if (ADVERTISER_ONLY_ROUTES.includes(pathname) || NON_ADVERTISER_ROUTES.includes(pathname)) {
    try {
      const isAdvertiser = await checkAdvertiserStatus(walletAddress);

      if (ADVERTISER_ONLY_ROUTES.includes(pathname) && !isAdvertiser) {
        return NextResponse.redirect(new URL('/pre-ad', request.url));
      }

      if (NON_ADVERTISER_ROUTES.includes(pathname) && isAdvertiser) {
        return NextResponse.redirect(new URL('/ad-dashboard', request.url));
      }
    } catch (error) {
      console.error('Error checking advertiser status:', error);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};