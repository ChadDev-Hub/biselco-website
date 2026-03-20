"use server"
import { serverFetchAutoRefresh } from "./actionWraper"

const baseUrl = process.env.BASESERVERURL
export const SubmitChangeMeter = async (formData: FormData) => {
    const data = await serverFetchAutoRefresh(
        `${baseUrl}/v1/change_meter/`, 
        "POST", 
        formData,
    )
    return data;
};


export const GetChangeMeter = async (page?:number,query?: string) => {
    const url = query ? `${baseUrl}/v1/change_meter/?q=${query}` : page? `${baseUrl}/v1/change_meter/?p=${page}` : `${baseUrl}/v1/change_meter/`;
    const data = await serverFetchAutoRefresh(
        url,
        "GET",
        undefined,
        
    )
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return data;
};