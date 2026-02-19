"use server";
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
const baseUrl = process.env.BASESERVERURL


// SIGNUP ACTION
const Signup = async (formdata: FormData) => {
    const data = formdata
    const res = await fetch(`${baseUrl}/auth/signup`,
        {
            method: "POST",
            body: data
        }
    )
    const results = await res.json()
    if (!res.ok) {
        return {
            error: results.detail
        }
    }
    return results

}




const  refToken = async(baseUrl?: string) => {
    const cookieStore =  await cookies()
    const refreshTOken = cookieStore.get("refresh_token")?.value
    const res = await fetch(`${baseUrl}/v1/auth/token/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `refresh_token=${refreshTOken}`
        },
    })
    const cookieHeader = res.headers.get("Set-Cookie")
    console.log(cookieHeader)
    return NextResponse.json({ status: res.status })
}
export { Signup, refToken};