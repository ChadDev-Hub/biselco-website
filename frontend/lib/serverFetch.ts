"use server"

import { cookies } from "next/headers"


const baseUrl = process.env.BASESERVERURL

//  GET CURRENT USER
export async function getCurrentUser() {
    const cookie = await cookies()
    const accessToken = cookie.get("access_token")?.value
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



// GET ALL COMPLAINTS 
export async function GetAllComplaints(page?:number, q?:string|number|boolean) {
    const cookie = await cookies()
    const accessToken = cookie.get("access_token")?.value
    const params = new URLSearchParams();
    if(page){
        params.set("page", page.toString())
    }
    if(q){
        params.set("search", q.toString())
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
    const cookie = await cookies()
    const accessToken = cookie.get("access_token")?.value
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
            cache: "no-cache"
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
    const param = new URLSearchParams();
    if (query) param.set("consumer", query);
    const url = `${baseUrl}/v1/consumers/?${param.toString()}`;
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
export const GetChangeMeter = async (page?:number,search?:string) => {
    const cookie = await cookies()
    const access_token = cookie.get("access_token")?.value
    const params = new URLSearchParams();
    if (page) params.set("page", page.toString());
    if (search) params.set("search", search.toString());
    const url = `${baseUrl}/v1/change_meter/?${params.toString()}`;
    
    const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
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
    const res = await fetch(`${baseUrl}/v1/new_connection/?${params?.toString()}`, {
        method: "GET",
        cache: "no-cache"
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



export const GetNewConnectionStats = async () => {
    const res = await fetch(`${baseUrl}/v1/new_connection/stats`, {
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


//  GET TECHNICAL FORMS
export const GetTechnicalForms = async () => {
    const res = await fetch(`${baseUrl}/v1/technical_form/all`, {
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


export const GetAgmaEvents = async() => {
    const res = await fetch(`${baseUrl}/v1/events/agma/`, {
        method: "GET",
        cache: "no-store"
    })
    const data = await res.json()
    if (!res.ok){
        return {
            status: res.status,
            erorr: data.detail
        }
    }
    return {
        status: res.status,
        data: data 
    }
}

export const GetAgmaStats= async() => {
    const cookie = await cookies()
    const accessToken = cookie.get("access_token")?.value
    const res = await fetch(`${baseUrl}/v1/agma/stats`, {
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
            error: data.detail
        }
    }
    return {
        status: res.status,
        data: data
    }
}


export const GetAgmaTicketAll = async(
    page:string | string[] | undefined,
    year: string | string[] | undefined,
    barangay: string | string[] | undefined,
    search: string | string[] | undefined
)=>{
    const params =new URLSearchParams();
    const cookie = await cookies()
    const accessToken = cookie.get("access_token")?.value
    if(page){
        params.set("page", typeof page === "string" ? page : "");
    }
    if(year !== "All" && year){
        params.set("year", typeof year === "string" ? year : "");
    }
    if(barangay !== "All" && barangay){
        params.set("barangay", typeof barangay === "string" ? barangay : "");
    }
    if (search){
        params.set("search", typeof search === "string" ? search : "");
    }
    const res = await fetch(`${baseUrl}/v1/agma/registered/all?${params.toString()}`, {
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
            data: data.detail
        }
    }
    return {
        status: res.status,
        data: data
    }
}


export const GetAgmaFilters = async() => {
    const cookie = await cookies()
    const accessToken = cookie.get("access_token")?.value
    const res = await fetch(`${baseUrl}/v1/agma/registered/all/filters`, {
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
            data: data.detail
        }
    }
    return {
        status: res.status,
        data: data
    }
}

export const GetAgmaSetup = async() => {
    const cookie = await cookies()
    const accessToken = cookie.get("access_token")?.value
    const res = await fetch(`${baseUrl}/v1/agma/setup`, {
        method: "GET",
        cache:"no-store",
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
        data: data
    }
}

export const GetAgmaSchedules = async() => {
    const cookie = await cookies()
    const accessToken = cookie.get("access_token")?.value
    const res = await fetch(`${baseUrl}/v1/events/agma/schedules`,{
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
        data: data
    }
}

export const GetAgmaRegistrationSchedules= async () => {
    const data = await fetch(`${baseUrl}/v1/events/agma/registration`, {
        method: "GET",
        cache: "no-store"
    })
    const res = await data.json()
    if (!data.ok) {
        return {
            status: data.status,
            error: res.detail
        }
    }
    return {
        status: data.status,
        data: res
    }
}