"use server"
import { serverFetchAutoRefresh } from "./actionWraper"

const baseUrl = process.env.BASESERVERURL

export const newConnectionMeter = async (data:FormData) => {
    console.log(data)
    const res = serverFetchAutoRefresh(
        `${baseUrl}/v1/new_connection/`, 
        "POST", 
        data,
    )
    return res;
}