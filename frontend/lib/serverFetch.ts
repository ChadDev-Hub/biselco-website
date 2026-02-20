"use server"
import { cookies } from "next/headers"
const baseUrl = process.env.BASESERVERURL

//  GET CURRENT USER
export async function getCurrentUser() {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("access_token")?.value
    const res = await fetch(`${baseUrl}/v1/auth/user/me`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    })
    const data = await res.json()
    if (!res.ok){
        return { 
            status: res.status,
            error: data
        }
    }
    return {
        status: res.status,
        detail: data
    }
};


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
    const cookieStore = await cookies()
    const access_token = cookieStore.get("access_token")?.value
    const res = await fetch(
        `${baseUrl}/v1/news/`,{
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        }
    )
    const data = await res.json()
    if (!res.ok){
        return { 
            status: res.status,
            error: data.detail
        }
    }
    return data
}



// GET ALL COMPLAINTS 
export async function GetAllComplaints() {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("access_token")?.value

    const res = await fetch(
        `${baseUrl}/v1/complaints/all`,{
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }
    )
    const data = await res.json()
    if(!res.ok){
        return {
            status: res.status,
            error: data.detail
        }
    }
    return data.detail
}


// GET COMPLAINTS ON SEPECIFIC USER 

export async function UserComplaints() {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("access_token")?.value

    const res = await fetch(
        `${baseUrl}/v1/complaints/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }
    )
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


// GET COMPLAINT STATUS NAME
export async function ComplaintStatusName() {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("access_token")?.value

    const res = await fetch(
        `${baseUrl}/v1/complaints/status/name`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }
    )
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