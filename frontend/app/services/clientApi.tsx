"use client"

// LOGIN
export async function loginfortoken(formdata: FormData, baseurl?: string) {
    console.log(baseurl)
    const res = await fetch(`${baseurl}/v1/auth/token`, {
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


// LOGOUT
export async function Logout(baseurl?: string) {
    const res = await fetch(`${baseurl}/v1/auth/logout`, {
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