"use server";
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