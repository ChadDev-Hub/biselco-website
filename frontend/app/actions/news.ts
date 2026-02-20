"use server"
import { cookies } from "next/headers"
const baseUrl = process.env.BASESERVERURL



// SERVER ACTION WITH AUTO REFRESH TOKEN 
export const serverFetchAutoRefresh = async (url: string, method: string, body?: BodyInit, headers?: HeadersInit) => {
    // Check if Access Token is expired
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value
    const refreshToken = cookieStore.get('refresh_token')?.value
    if (!accessToken) {
        const refreshRes = await fetch(`${baseUrl}/v1/auth/token/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refresh_token: refreshToken
            })
        })
        const reFreshData = await refreshRes.json()
        if (!refreshRes.ok) {
            return {
                status: refreshRes.status,
                error: reFreshData.detail
            }
        }
        const newAccessToken = reFreshData.access_token
        cookieStore.set('access_token', newAccessToken)

        // Fetch DATA WITH NEW ACCESS TOKEN
        const res = await fetch(url, {
            method: method,
            headers: {
                ...headers,
                'Authorization': `Bearer ${newAccessToken}`
            },
            body: body
        })
        const data = await res.json()
        if (!res.ok) {
            return {
                status: res.status,
                error: data.detail
            }
        }
        return {
            status: res.status,
            detail: data.detail
        }
    }

    if (accessToken){
        // IF THERE'S VALID ACCESS TOKEN THEN FETCH
    const res = await fetch(url, {
        method: method,
        headers: {
            ...headers,
            'Authorization': `Bearer ${accessToken}`
        },
        body: body
    })
    const data = await res.json()
    if (!res.ok) {
        return {
            status: res.status,
            error: data.detail
        }
    }
    return {
        status: res.status,
        detail: data.detail
    }}
}   

// POST NEWS
export const PostNews = async(form: FormData) => {
    const data = await serverFetchAutoRefresh(
        `${baseUrl}/v1/news/create`,
        "POST",
        form
    )
    return data
}