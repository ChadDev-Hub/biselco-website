const baseUrl = process.env.BASESERVERURL

export const GetOffices = async () => {
    const res = await fetch(`${baseUrl}/v1/biselco-offices`, {
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