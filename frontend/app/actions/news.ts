"use server"
import { cookies } from "next/headers"
import { serverFetchAutoRefresh } from "./actionWraper"


const baseUrl = process.env.BASESERVERURL
// POST NEWS
export const PostNews = async(form: FormData) => {
    const data = await serverFetchAutoRefresh(
        `${baseUrl}/v1/news/create`,
        "POST",
        form
    )
    return data
}

export const DeleteNews = async(id: number) => {
    const cookieHeader = (await cookies()).toString();
    const data = await serverFetchAutoRefresh(
        `${baseUrl}/v1/news/delete/${id}`,
        "DELETE",
        undefined,
        {
            "Cookie": cookieHeader
        }
    )
    return data
}