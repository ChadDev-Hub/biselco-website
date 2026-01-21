"use server";
const baseUrl = process.env.BASESERVERURL
const Signup = async (formdata:FormData) => {
    const data =  formdata
    const res = await fetch(`${baseUrl}/auth/signup`,
        {
            method:"POST",
            body:data
        }
    )
    if (!res.ok){
        const results = await res.json()
        throw results.detail
    }

    const results = await res.json()
    return results
    
}




const Login = async(formdata:FormData) => {
    const data = formdata
    const res = await fetch(`${baseUrl}/auth/login`,
        {
            method: "POST",
            body: data
        }
    )
}


export {Signup, Login};