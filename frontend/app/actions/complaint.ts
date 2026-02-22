"use server"
import { cookies } from "next/headers"
import { serverFetchAutoRefresh } from "./actionWraper"
const baseUrl = process.env.BASESERVERURL
// POST COMPLAINTS
export async function PostComplaints(form: FormData) {
    const cookieStore = await cookies()
    const accessToken =  cookieStore.get("access_token")?.value
    const data = await serverFetchAutoRefresh( 
        `${baseUrl}/v1/complaints/create`,
        "POST",
        form,
    )
    return data
}


// DELETE COMPLAINT
export async function DeleteComplaint(id: number) {
    const data = await serverFetchAutoRefresh(
        `${baseUrl}/v1/complaints/delete/${id}`,
        "DELETE",
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