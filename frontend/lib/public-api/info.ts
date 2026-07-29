import {LandingPageInfoType} from "@/types/info"
const baseUrl = process.env.BASESERVERURL

// GET LANDING PAGE DATA

export async function GetLandingPageData() {
    const res = await fetch(`${baseUrl}/v1/info`, {
        method: "GET",
        cache: "no-store",

    })
    const data = await res.json()
    return data as LandingPageInfoType
}

