"use server"
const baseUrl = process.env.BASESERVERURL
import { cookies } from "next/headers"

// SIGNUP ACTION
export const Signup = async (formdata: FormData) => {
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


// LOG IN ACTION
export const Login = async (formdata: FormData) => {
    const data = formdata
    const res = await fetch(`${baseUrl}/auth/login`,
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



// LOUTOUT

export const Logout = async () => {
    const cookieStore = await cookies()
    cookieStore.delete('access_token')
    cookieStore.delete('refresh_token')
}