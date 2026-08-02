import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const baseUrl = process.env.BASESERVERURL;

  // 1. If no access token but we have a refresh token, try to rotate
  if (!accessToken && refreshToken) {
    const response = await fetch(
      `${baseUrl}/v1/auth/token/refresh_access_token`,
      {
        method: "GET",
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
      
      },
    );

    if (response.ok) {
      // 2. Create the response and SET the new cookies
      const res = NextResponse.redirect(request.url);
      const setCookie = response.headers.get("set-cookie");
      if (setCookie) {
        res.headers.append("set-cookie", setCookie);
      }
      console.log("Incoming access:", request.cookies.get("access_token")?.value);
      return res;
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
