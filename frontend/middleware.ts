import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  console.log(request)
  console.log(accessToken)
  console.log(refreshToken)

  const baseUrl = process.env.BASESERVERURL
  // 1. If no access token but we have a refresh token, try to rotate
  if (!accessToken && refreshToken) {
    const response = await fetch(`${baseUrl}/v1/auth/token/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    
    if (response.ok) {
      const { new_access_token } = await response.json();
      
      // 2. Create the response and SET the new cookie
      const res = NextResponse.next();
      res.cookies.set('access_token', new_access_token, {
        httpOnly: true,
        secure: true,
        maxAge: 60, // 15 minutes
      });
      return res;
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};