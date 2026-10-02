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


export async function GetConnectedConsumers(
    transformer_id: string
){
    const params = new URLSearchParams();
    params.set("dt", transformer_id)
    const res = await fetch(`${baseUrl}/v1/dt/connected_consumers?${params?.toString()}`, {
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