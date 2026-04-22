"use server"

import { cookies } from "next/headers"


const baseUrl = process.env.BASESERVERURL

//  GET CURRENT USER
export async function getCurrentUser() {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("access_token")?.value
    const res = await fetch(`${baseUrl}/v1/auth/user/me`,{
        method: "GET",
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    })
    const data = await res.json()
    if (!res.ok){
        return { 
            status: res.status,
            error: data.detail
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
            data: data.detail
        }
    }
    return {
        status: res.status,
        data: data
    }
}



// GET ALL COMPLAINTS 
export async function GetAllComplaints(page?:number, q?:string|number|boolean) {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("access_token")?.value
    const params = new URLSearchParams();
    if(page){
        params.set("page", page.toString())
    }
    if(q){
        params.set("q", q.toString())
    }
     const url = `${baseUrl}/v1/complaints/all${
        params.toString() ? `?${params.toString()}` : ""
    }`;
    const res = await fetch(
        `${url}`,{
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
            cache: "no-store"
        }
    )
    const data = await res.json()
    if(!res.ok){
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
            data: data.detail
        }
    }
    return {
        status: res.status,
        data: data
    }
}


// GET COMPLAINT STATUS NAME
export async function ComplaintStatusName() {
    const res = await fetch(
        `${baseUrl}/v1/complaints/status/name`,
        {
            method: "GET",
            next: {revalidate: 300}
        }
    )
    const data = await res.json()
    if (!res.ok) {
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


// VERIFY CONSUMER
export const queryConsumer = async(query?:string)=>{

    const url = query? `${baseUrl}/v1/consumers/?consumer=${query}`:`${baseUrl}/v1/consumers/`
    const res = await fetch(url,{
        next: { revalidate: 300 },
        method:"GET"})
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



//  GET CHANGE METER DATA
export const GetChangeMeter = async (page?:number,query?: string) => {
    const url = query ? `${baseUrl}/v1/change_meter/?q=${query}` : page ? `${baseUrl}/v1/change_meter/?page=${page}` : `${baseUrl}/v1/change_meter/`;
    const res = await fetch(url, {
        method: "GET"
    })
    const data = await res.json()
    if (!res.ok){
        return {
            status: res.status,
            data: data.detail
        }
    }
    await new Promise((resolve)=>setTimeout(resolve,3000))
    return {
        status: res.status,
        data: data
    }
};


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


// NEW CONNECTION
export const GetNewConnection = async (page?:number) => {
    const params = new URLSearchParams();
    
    if(page){
        params.set("page",page.toString())
    }
    console.log(params.toString())
    const res = await fetch(`${baseUrl}/v1/new_connection/?${params?.toString()}`, {
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