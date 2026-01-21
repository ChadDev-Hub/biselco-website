"use server";
import { NextResponse } from "next/server";
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

// LOGIN ACTION 
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
    
    if (!fres.ok) {
        const data = await fres.json()
        return { error: data.detail }
    }
    const data = await fres.json()
    return data
}

export { Signup, Login };