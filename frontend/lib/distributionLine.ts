const baseUrl = process.env.BASESERVERURL

export async function GetPrimaryLines() {
    const res = await fetch(`${baseUrl}/v1/dl/primary_lines`, {
        method: "GET",
        cache: "no-store"
    })
    const data = await res.json()
    if (!res.ok) {
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