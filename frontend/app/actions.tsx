"use server";
import { NextResponse } from "next/server";
const baseUrl = process.env.BASESERVERURL
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

const Login = async (formdata: FormData) => {
    const body = new URLSearchParams({
        username: formdata.get("username") as string,
        password: formdata.get("password") as string
    }).toString();

    const fres = await fetch(`${baseUrl}/auth/token`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: body,
            credentials: "include"
        }
    )
    const data = await fres.json()
    if (!fres.ok) {
        return { error: data.detail }
    }
    const nres = NextResponse.json({
        message: "Token stored"
    })
    nres.cookies.set("access_token", data.access_token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    })
    return nres
}

export { Signup, Login };