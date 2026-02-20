"use server"
import { cookies } from "next/headers"
const baseUrl = process.env.BASESERVERURL
// POST COMPLAINTS
export async function PostComplaints(form: FormData) {
    const cookieStore = await cookies()
    const accessToken =  cookieStore.get("access_token")?.value
    const res = await fetch( 
        `${baseUrl}/v1/complaints/create`,
        {
            method: "POST",
            body: form,
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


// DELETE COMPLAINT
export async function DeleteComplaint(id: number) {
    const cookieHeader = (await cookies()).toString();
    const data = await serverFetchAutoRefresh(
        `${baseUrl}/v1/complaints/delete/${id}`,
        "DELETE",
        undefined,
        {
            "Cookie": cookieHeader
        }
    )
    return data
}



// UPDATE COMPLAINT STATUS
export async function UpdateComplaintStatus(complaint_id: number, status_name: string, user_id: number) {
    const cookieHeader = (await cookies()).toString();
    const data = await serverFetchAutoRefresh(
        `${baseUrl}/v1/complaints/update/status/${complaint_id}`,
        "PUT",
        JSON.stringify({
            status_name: status_name,
            user_id: user_id
        }),
        {
            "Cookie": cookieHeader,
            "content-type": "application/json"
        }
    )
    return data
}

// DELETE COMPLAINT STATUS
export async function DeleteComplaintStatus(complaint_id: number, status_name: string, user_id: number) {
    const cookieHeader = (await cookies()).toString();
    const data = await serverFetchAutoRefresh(
        `${baseUrl}/v1/complaints/delete/status/${complaint_id}`,
        "DELETE",
        JSON.stringify({
            status_name: status_name,
            user_id: user_id
        }),
        {
            "Cookie": cookieHeader,
            "content-type": "application/json"
        }
    )
    return data
}