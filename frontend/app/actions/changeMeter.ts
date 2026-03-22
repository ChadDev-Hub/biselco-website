"use server"
import { serverFetchAutoRefresh } from "./actionWraper"

const baseUrl = process.env.BASESERVERURL
export const SubmitChangeMeter = async (formData: FormData, page:number) => {
    const data = await serverFetchAutoRefresh(
        `${baseUrl}/v1/change_meter/?page=${page}`, 
        "POST", 
        formData,
    )
    return data;
};


export const DeleteChangeMeter = async (items:Set<number>) => {
    const data = await serverFetchAutoRefresh(
        `${baseUrl}/v1/change_meter/`, 
        "DELETE", 
        JSON.stringify(Array.from(items)),
        {
            "content-type": "application/json"
        }
    )
    return data;
}