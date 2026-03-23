"use server";
import { cookies } from "next/headers";
// SERVER ACTION WITH AUTO REFRESH TOKEN
const baseUrl = process.env.BASESERVERURL;

export const serverFetchAutoRefresh = async (
  url: string,
  method: string,
  body?: BodyInit,
  headers?: HeadersInit,
  cache: RequestCache = "no-store",
) => {
  // Check if Access Token is expired
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;
  if (!accessToken) {
    const refreshRes = await fetch(`${baseUrl}/v1/auth/token/refresh`, {
      method: "POST",
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });
    const reFreshData = await refreshRes.json();
    if (!refreshRes.ok) {
      return {
        status: refreshRes.status,
        data: reFreshData.detail,
      };
    }
    const newAccessToken = reFreshData.access_token;
    cookieStore.set("access_token", newAccessToken);

    // Fetch DATA WITH NEW ACCESS TOKEN
    const res = await fetch(url, {
      method: method,
      cache: cache,
      headers: {
        ...headers,
        Authorization: `Bearer ${newAccessToken}`,
      },
      body: body,
    });
    const contenType = res.headers.get("content-type");
    if (contenType?.includes("application/json")) {
      const data = await res.json();
      if (!res.ok) {
        return {
          status: res.status,
          data: data.detail,
        };
      }
      return {
        status: res.status,
        data: data,
      };
    } else {
      const data = await res.blob();
      if (!res.ok) {
            return {
                status: res.status,
                data: data
            }
        }
        return {
            status: res.status,
            data : data
        }
    }
  }

  if (accessToken) {
    // IF THERE'S VALID ACCESS TOKEN THEN FETCH
    const res = await fetch(url, {
      method: method,
      cache: cache,
      headers: {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
      },
      body: body,
    });
    if (res.headers.get("content-type")?.includes("application/json")) {
      const data = await res.json();
      if (!res.ok) {
        return {
          status: res.status,
          data: data.detail,
        };
      }
      return {
        status: res.status,
        data: data,
      };
    } else {
      const data = await res.blob();
      if (!res.ok) {
            return {
                status: res.status,
                data: data
            }
        }
        return {
            status: res.status,
            data : data
        }
    }
  }
};
