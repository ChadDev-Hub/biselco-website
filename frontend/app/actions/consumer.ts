"use server"
import { serverFetchAutoRefresh } from "./actionWraper"
const baseUrl = process.env.BASESERVERURL

export const queryConsumer = async(query?:string)=>{
    const data = await serverFetchAutoRefresh(`${baseUrl}/v1/consumers/?consumer=${query}`,"GET")
    return data
}
