"use server"

import { cookies } from "next/headers"


const baseUrl = process.env.BASESERVERURL


// GET NEWS PAGE DATA
export async function getNewsPage() {
    const cookie = await cookies()
    const accessToken = cookie.get("access_token")?.value
    const res = await fetch(
        `${baseUrl}/v1/news/`,{
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }
    )
    const data = await res.json()
    if (!res.ok){
        return { 
            status: res.status,
            data: data.detail
        }
    }
    return {
        status: res.status,
        data: data
    }
}





// GET STATS FOR COMPLAINTS DASHBOARD
export const GetComplaintStats = async () => {
    const res = await fetch(`${baseUrl}/v1/complaints/stats`, {
        method: "GET"
    })
    const data = await res.json()
    if (!res.ok){
        return {
            status: res.status,
            data: data.detail
        }
    }
    
    return {
        status: res.status,
        data: data
    }
};

// GET TOP 10 COMPLAINTS
export const GetTopComplaints = async () => {
    const res = await fetch(`${baseUrl}/v1/complaints/top`, {
        method: "GET"
    })
    const data = await res.json()
    if (!res.ok){
        return {
            status: res.status,
            data: data.detail
        }
    }
   
    return {
        status: res.status,
        data: data
    }
};


// COMPLAINTS OVERTIME
export const GetComplaintOvertime = async () => {
    const res = await fetch(`${baseUrl}/v1/complaints/overtime`, {
        method: "GET"
    })
    const data = await res.json()
    if (!res.ok){
        return {
            status: res.status,
            data: data.detail
        }
    }
   
    return {
        status: res.status,
        data: data
    }
};




// AGMA REGISTERED
export const GetAgmaRegistered = async (id: string) => {
    const params = new URLSearchParams();
    params.set("id",id.toString())
    const res = await fetch(`${baseUrl}/v1/agma/registered?${params?.toString()}`, {
        method: "GET"
    })
    const data = await res.json()
    if (!res.ok){
        return {
            status: res.status,
            data: data.detail
        }
    }
    return {
        status: res.status,
        data: data
    }
}











