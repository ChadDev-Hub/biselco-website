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

export async function getNewsPage(){
    const cookieHeader = (await cookies()).toString();
    const res = await fetch(`${baseUrl}/news/`,
        {
            method: "GET",
            cache: "no-store",
            credentials:"include",
            headers:{
                "Cookie": cookieHeader
            }
        }
    )
    const data = await res.json()
    if (!res.ok){
        return{
            error: true
        }
    }
    return data
}





export async function logout(){
    (await cookies()).delete("access_token")
<<<<<<< HEAD
=======
}


export async function PostNews(form:FormData){
    const cookieHeader = (await cookies()).toString();
    const res = await fetch(`${baseUrl}/news/create`,
        {
            method: "POST",
            body: form,
            credentials: "include",
            headers:{
                "Cookie": cookieHeader
            }
        }
    )
    const data = await res.json()
    if (!res.ok){
        return{
            error: true
        }
    }
    return data
>>>>>>> c18c9ea4afe98a60fc56bb6b6a63110dd0735ee5
}