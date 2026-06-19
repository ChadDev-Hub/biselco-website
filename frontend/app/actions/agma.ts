"use server";
import { serverFetchAutoRefresh } from './actionWraper';
const baseUrl = process.env.BASESERVERURL;


export const RegisterAgma = async (data: FormData) => {
    const res = await fetch(
        `${baseUrl}/v1/agma/register`,{
            method: "POST",
            body: data
        }
        
    );
    const results = await res.json();
    if (!res.ok) {
        return {
            status: res.status,
            error: results.detail,
        };
    }
    return {
        status: res.status,
        data: results,
    };
};


export const DownloadAgmaTicket = async (id:string, url:string) => {
    const res = await fetch(
        `${baseUrl}/v1/agma/ticket?id=${id}&path=${url}`,{
            method: "GET",
        }
        
    );

    const blob = await res.blob();
    if (!res.ok) {
        return {
            status: res.status,
            error: "Failed to download ticket",
        };
    }
    return {
        status: res.status,
        data: blob,
    };
}

export const AgmaSpinRoulette = async()=>{
    const res = await serverFetchAutoRefresh(
        `${baseUrl}/v1/agma/raffle/spin`,
        "POST"
    )
    return res
}



export const GetWinnerInfo = async (account_number: string) => {
    const res = await serverFetchAutoRefresh(
        `${baseUrl}/v1/agma/raffle/winner/info`,
        "POST",
        JSON.stringify({
         account_no: account_number}),
        {
            "Content-Type": "application/json",
        }
    )
    return res
}


export const UpdateWinnerStatus = async (id:string)=> {
    const res = await serverFetchAutoRefresh(
        `${baseUrl}/v1/agma/raffle/winner/status`,
        "PATCH",
        JSON.stringify({
            id: id
        }),
        {
            "Content-Type": "application/json",
        }
    )
    return res;
}


export const DismissedWinner = async (id:string)=> {
    const res = await serverFetchAutoRefresh(
        `${baseUrl}/v1/agma/raffle/winner/dismissed`,
        "PATCH",
        JSON.stringify({
            id: id
        }),
        {
            "Content-Type": "application/json",
        }
    )
    return res;
}


export const VerifyRegistered = async (id:string, is_verified: boolean) => {
    const res = await serverFetchAutoRefresh(
        `${baseUrl}/v1/agma/registered/verify`,
        "PATCH",
        JSON.stringify({
            id: id,
            is_verified: is_verified
        }),
        {
            "Content-Type": "application/json",
        }
    )
    return res
}