const baseUrl = process.env.BASESERVERURL


export async function GetTransformers(){

    const res = await fetch(`${baseUrl}/v1/dt/`, {
        method: "GET",
        cache: "no-cache"
    })
    const data = await res.json()
    if (!res.ok){
        return {
            status: res.status,
            error: data.detail
        }
    }
    return {
        status: res.status,
        data: data
    }
}