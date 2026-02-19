"use server"
import { cookies } from "next/headers"
const baseUrl = process.env.BASESERVERURL

// SERVER FETCH WITH AUTO REFRESH

export async function serverFetchAutoRefresh(
  url: string,
  method: string,
  body?: BodyInit | null,
  headers: Record<string, string> = {}
) {
  const cookieStore = await cookies()
  let accessToken = null
  const access_token = cookieStore.get("access_token")?.value
  if (access_token) {
    accessToken = access_token
  }

  const refreshToken = cookieStore.get("refresh_token")?.value
  // Serialize body safely
  let requestBody: BodyInit | undefined = undefined

  if (body) {
    if (
      typeof body === "object" &&
      !(body instanceof FormData) &&
      !(body instanceof URLSearchParams)
    ) {
      requestBody = JSON.stringify(body)
      headers["Content-Type"] = "application/json"
    } else {
      requestBody = body
    }
  }

  // -----------------------
  // First Attempt
  // -----------------------
  let response = await fetch(url, {
    method,
    body: requestBody,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}` || "",
      ...headers,
    },
  })

  // -----------------------
  // If Unauthorized → Refresh
  // -----------------------
  if (response.status === 401 && refreshToken) {
    // Refresh token
    const refreshRes = await fetch(`${baseUrl}/v1/auth/token/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `refresh_token=${refreshToken}`
      },
    })
    const newAccessToken = refreshRes.headers.get("Set-Cookie")
      ?.split(";")[0]
      ?.split("=")[1]

    
    accessToken = newAccessToken
    
    // Retry original request with new token
    response = await fetch(url, {
      method,
      body: requestBody,
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...headers,
      },
    })
  }

  const data = await response.json().catch(() => null)

  return {
    status: response.status,
    detail: data?.detail ?? data,
  }
}


//  GET CURRENT USER
export async function getCurrentUser() {
    const cookieHeader = (await cookies()).toString();
    const data = await serverFetchAutoRefresh(
        `${baseUrl}/v1/auth/user/me`,
        "GET",
        undefined,
        {
            "Cookie": cookieHeader
        }
    )
    console.log(data.status)
    return data
}


// GET LANDING PAGE DATA

export async function getLandingPageData() {
    const res = await fetch(`${baseUrl}/v1/`, {
        method: "GET",
        cache: "no-store",

    })
    const data = await res.json()
    return data
}



// GET NEWS PAGE DATA
export async function getNewsPage() {
    const cookieHeader = (await cookies()).toString();
    const data = await serverFetchAutoRefresh(
        `${baseUrl}/v1/news/`,
        "GET",
        undefined,
        {
            "Cookie": cookieHeader
        }
    )
    return data
}


// POST NEWS
export async function PostNews(form: FormData) {
    const cookieHeader = (await cookies()).toString();
    const data = await serverFetchAutoRefresh(
        `${baseUrl}/v1/news/create`,
        "POST",
        form,
        {
            "Cookie": cookieHeader
        }
    )
    return data
}

// GET ALL COMPLAINTS 
export async function GetAllComplaints() {
    const cookieHeader = (await cookies()).toString();
    const data = await serverFetchAutoRefresh(
        `${baseUrl}/v1/complaints/all`,
        "GET",
        undefined,
        {
            "Cookie": cookieHeader
        }
    )
    return data
}


// GET COMPLAINTS ON SEPECIFIC USER 

export async function UserComplaints() {
    const cookieHeader = (await cookies()).toString();
    const data = await serverFetchAutoRefresh(
        `${baseUrl}/v1/complaints/`,
        "GET",
        undefined,
        {
            "Cookie": cookieHeader
        }
    )
    return data
}


// GET COMPLAINT STATUS NAME
export async function ComplaintStatusName() {
    const cookieHeader = (await cookies()).toString();
    const data = await serverFetchAutoRefresh(
        `${baseUrl}/v1/complaints/status/name`,
        "GET",
        undefined,
        {
            "Cookie": cookieHeader
        }
    )
    return data
}


// POST COMPLAINTS
export async function PostComplaints(form: FormData) {
    const cookieHeader = (await cookies()).toString();
    const data = await serverFetchAutoRefresh(
        `${baseUrl}/v1/complaints/create`,
        "POST",
        form,
        {
            "Cookie": cookieHeader
        }
    )
    return data
}


// DELETE COMPLAINT
export async function DeleteComplaint(id: number) {
    const cookieHeader = (await cookies()).toString();
    const data = await serverFetchAutoRefresh(
        `${baseUrl}/v1/complaints/delete/${id}`,
        "DELETE",
        undefined,
        {
            "Cookie": cookieHeader
        }
    )
    return data
}

// UPDATE COMPLAINT STATUS
export async function UpdateComplaintStatus(complaint_id: number, status_name: string, user_id: number) {
    const cookieHeader = (await cookies()).toString();
    const data = await serverFetchAutoRefresh(
        `${baseUrl}/v1/complaints/update/status/${complaint_id}`,
        "PUT",
        JSON.stringify({
            status_name: status_name,
            user_id: user_id
        }),
        {
            "Cookie": cookieHeader,
            "content-type": "application/json"
        }
    )
    return data
}

// DELETE COMPLAINT STATUS
export async function DeleteComplaintStatus(complaint_id: number, status_name: string, user_id: number) {
    const cookieHeader = (await cookies()).toString();
    const data = await serverFetchAutoRefresh(
        `${baseUrl}/v1/complaints/delete/status/${complaint_id}`,
        "DELETE",
        JSON.stringify({
            status_name: status_name,
            user_id: user_id
        }),
        {
            "Cookie": cookieHeader,
            "content-type": "application/json"
        }
    )
    return data
}