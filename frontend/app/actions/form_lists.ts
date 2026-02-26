"use server"
import { serverFetchAutoRefresh } from "./actionWraper"

export const getTechnicalForms = async() => {
    const data  = await serverFetchAutoRefresh(`${process.env.BASESERVERURL}/v1/technical_form/all`,"GET")
    return data
}