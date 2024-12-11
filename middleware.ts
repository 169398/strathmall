import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Get referral code from URL params
  const searchParams = request.nextUrl.searchParams;
  const referralCode = searchParams.get('ref');
  
  if (referralCode) {
    // Store referral code in a secure HTTP-only cookie
    response.cookies.set('referral_code', referralCode, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 // 1 hour expiry
    });
  }
  
  return response;
}

export const config = {
  matcher: [
    '/sign-up',
    '/api/auth/callback/:path*',
    '/api/auth/signin/:path*'
  ],
};
