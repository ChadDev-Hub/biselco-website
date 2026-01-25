"use client"
const baseUrl = process.env.BASESERVERURL


// LOGIN
export async function loginfortoken(formdata: FormData, baseurl?: string) {
    const res = await fetch(`${baseurl}/auth/token`, {
        method: "POST",
        body: formdata,
        credentials: "include"
    })
    const data = await res.json()
    if (!res.ok) {
        return {
            error: data.detail
        }
    }
    return {
        success: true
    }
}

// REFRESH TOKEN
export async function refreshToken() {
    const res = await fetch(`${baseUrl}/auth/token/refresh`, {
        method: "POST",
        credentials: "include"
    })
    const data = await res.json()
    if (!res.ok) {
        return {
            error: data.detail
        }
    }
    return {
        success: true
    }
}


// LOGOUT
export async function Logout(baseurl?: string) {
    const res = await fetch(`${baseurl}/auth/logout`, {
        method: "POST",
        credentials: "include"
    })
    const data = await res.json()
    if (!res.ok) {
        return {
            error: true
        }
    }
    return data
}