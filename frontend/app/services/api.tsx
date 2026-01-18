
export async function getLandingPageData(){
    const res = await fetch("http://127.0.0.1:8000/",{
        method:"GET",
        cache: "force-cache"
    })
    const data = await res.json()
    return data 
}