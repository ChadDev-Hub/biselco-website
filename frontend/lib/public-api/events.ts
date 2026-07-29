
const baseUrl = process.env.BASESERVERURL

export const GetAgmaEvents = async() => {
    const res = await fetch(`${baseUrl}/v1/events/agma`, {
        method: "GET",
        cache: "no-store"
    })
    const data = await res.json()
    if (!res.ok){
        return {
            status: res.status,
            erorr: data.detail
        }
    }
    return {
        status: res.status,
        data: data 
    }
}