"use server"
import { serverFetchAutoRefresh } from "./actionWraper"
const baseUrl = process.env.BASESERVERURL
// POST COMPLAINTS
export async function PostComplaints(form: FormData) {
    const data = await serverFetchAutoRefresh( 
        `${baseUrl}/v1/complaints/`,
        "POST",
        form,
    )
    
    return data
}

export async function PostGenericComplaints(form: FormData) {
    const data = await serverFetchAutoRefresh( 
        `${baseUrl}/v1/complaints/generic`,
        "POST",
        form,
    )
    return data
}


// DELETE COMPLAINT
export async function DeleteComplaint(id: number) {
    const data = await serverFetchAutoRefresh(
        `${baseUrl}/v1/complaints/${id}`,
        "DELETE",
    )
    return data
}



// UPDATE COMPLAINT STATUS
export async function UpdateComplaintStatus(complaint_id: number, status_name: string) {
    const data = await serverFetchAutoRefresh(
        `${baseUrl}/v1/complaints/status/${complaint_id}`,
        "PUT",
        JSON.stringify({
            status_name: status_name
        }),
        {
            "content-type": "application/json"
        }
    )
    return data
}

// DELETE COMPLAINT STATUS
export async function DeleteComplaintStatus(complaint_id: number, status_name: string) {
    const data = await serverFetchAutoRefresh(
        `${baseUrl}/v1/complaints/status/${complaint_id}`,
        "DELETE",
        JSON.stringify({
            status_name: status_name,
        }),
        {
            "content-type": "application/json"
        }
    )
    return data
}