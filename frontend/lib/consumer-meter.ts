"use server"


const baseUrl = process.env.BASESERVERURL
// VERIFY CONSUMER
export const queryConsumer = async(query?:string)=>{
    const param = new URLSearchParams();
    if (query) param.set("consumer", query);
    const url = `${baseUrl}/v1/consumers/?${param.toString()}`;
    const res = await fetch(url,{
        cache:"no-store",
        method:"GET"})
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