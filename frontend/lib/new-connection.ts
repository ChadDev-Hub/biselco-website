const baseUrl = process.env.BASESERVERURL
export const GetNewConnection = async (page?:number, search?:string | number | string[]) => {
    const params = new URLSearchParams();
    
    if(page){
        params.set("page",page.toString())
    }
    if(search){
        params.set("search",search.toString())
    }
    const res = await fetch(`${baseUrl}/v1/new_connection/?${params?.toString()}`, {
        method: "GET",
        cache: "no-store"
    })
    const data = await res.json()
    if (!res.ok){
        return {
            status: res.status,
            data: data.detail
        }
    }
    return {
        status: res.status,
        data: data
    }
}
