"use server"

import axios from "axios"
import { cookies } from "next/headers"

const baseUrl = process.env.BASESERVERURL


//  GET CURRENT USER
export async function getCurrentUser(){
    const cookieHeader = (await cookies()).toString();
    const res = await fetch(`${baseUrl}/auth/user/me`, {
        method: "GET",
        cache: "no-store",
        credentials: "include",
        headers: {
            "Cookie": cookieHeader
        }
    })
    const data = await res.json()
    if (!res.ok){
        return {
            status: res.status,
            detail: data.detail

        }
    }
    return {
        status: res.status,
        detail: data
    }
}


// GET LANDING PAGE DATA

export async function getLandingPageData() {
    const res = await fetch("http://127.0.0.1:8000/", {
        method: "GET",
        cache: "no-store",

    })
    const data = await res.json()
    return data
}



// GET NEWS PAGE DATA
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




// LOGOUT FUNCTION


// POST NEWS
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
    const status =  res.status
    const data = await res.json()
    if (!res.ok){
        return{
            error: true
        }
    }
    return {
        status: status,
        detail:data.detail
    }
}

// GET ALL COMPLAINTS 
export async function GetAllComplaints(){
    const cookieHeader = (await cookies()).toString();
    const res = await fetch(`${baseUrl}/complaints/all`,
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
        return data
    }
    return data
}


// GET COMPLAINTS ON SEPECIFIC USER 

export async function UserComplaints(){
    const cookieHeader = (await cookies()).toString();
    const res = await fetch(`${baseUrl}/complaints/`,
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


// GET COMPLAINT STATUS NAME
export async function ComplaintStatusName(){
    const cookieHeader = (await cookies()).toString();
    const res = await fetch(`${baseUrl}/complaints/status/name`,
        {
            method: "GET",
            cache: "no-store",
            credentials:"include",
            headers:{
                "Cookie": cookieHeader
            }
        }
    )
    const data = res.json()
    if (!res.ok){
        return{
            error: true
        }
    }
    return data
}


// POST COMPLAINTS
export async function PostComplaints(form:FormData){
    const cookieHeader = (await cookies()).toString();
    const res = await axios.post(`${baseUrl}/complaints/create`,
        form,
        {  
            onUploadProgress(progressEvent) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1));
                return {progress: percentCompleted}
            },
            withCredentials: true,
            headers: {
                "Cookie": cookieHeader,
                "content-type": "multipart/form-data"
            }
        }
    )
    return {
        status: res.status,
        data: res.data
    };
}


// DELETE COMPLAINT
export async function DeleteComplaint(id:number){
    const cookieHeader = (await cookies()).toString();
    const res = await fetch(`${baseUrl}/complaints/delete/${id}`,
        {
            method: "DELETE",
            credentials:"include",
            headers:{
                "Cookie": cookieHeader
            }
        }
    )
    const data = await res.json()
    if (!res.ok){
        return data
    }
    return data
}

// UPDATE COMPLAINT STATUS
export async function UpdateComplaintStatus(complaint_id:number, status_name:string, user_id:number){
    const cookieHeader = (await cookies()).toString();
    const res = await fetch(`${baseUrl}/complaints/update/status/${complaint_id}`,
        {
            method: "PUT",
            credentials:"include",
            body: JSON.stringify({
                status_name: status_name,
                user_id: user_id
            }),
            headers:{
                "Cookie": cookieHeader,
                "content-type": "application/json"
            }
        }
    )
    const data = await res.json()
    if (!res.ok){
        return {
            status: res.status,
            detail: data.detail}
    }
    return {
        status: res.status,
        detail: data.detail
    }
}

// DELETE COMPLAINT STATUS
export async function DeleteComplaintStatus(complaint_id:number, status_name:string, user_id:number){
    const cookieHeader = (await cookies()).toString();
    const res = await fetch(`${baseUrl}/complaints/delete/status/${complaint_id}`,
        {
            method: "DELETE",
            credentials:"include",
            body: JSON.stringify({
                status_name: status_name,
                user_id: user_id
            }),
            headers:{
                "Cookie": cookieHeader,
                "content-type": "application/json"
            }
        }
    )
    const data = await res.json()
    if (!res.ok){
        return {
            status: res.status,
            detail: data.detail
        }
    }
    return {
        status: res.status,
        detail: data.detail
    }
}