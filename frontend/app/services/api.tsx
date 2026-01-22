"use server"

import { cookies } from "next/headers"

// GET LANDING PAGE DATA
const baseUrl = process.env.BASESERVERURL
export async function getLandingPageData() {
    const res = await fetch("http://127.0.0.1:8000/", {
        method: "GET",
        cache: "no-store",
    })
    const data = await res.json()
    return data
}


export async function loginfortoken(formdata: FormData) {
    const res = await fetch(`${baseUrl}/auth/token`, {
        method: "POST",
        body: formdata,
        credentials: "include"
    })
    console.log(res)
    const data = await res.json()
    if (!res.ok) {
        return {
            error: data.detail
        }
    }
    
    // (await cookies()).set("access_token", data.access_token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    //     sameSite: "lax",
    //     maxAge: 60 * 15,
    //     path: "/",
    // })
    return {
        success: true
    }
}

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
    (await cookies()).set("access_token", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 15,
        path: "/",
    })
    return {
        success: true
    }
}