"use server";
const baseUrl = process.env.BASESERVERURL
const Signup = async (formdata: FormData) => {
    const data = formdata
    const res = await fetch(`${baseUrl}/auth/signup`,
        {
            method: "POST",
            body: data
        }
    )
    if (!res.ok) {
        const results = await res.json()
        throw results.detail
    }

    const results = await res.json()
    return results

}




const Login = async (formdata: FormData) => {
    const body = new URLSearchParams({
        username: formdata.get("username") as string,
        password: formdata.get("password") as string
    }).toString();
    try {
        const res = await fetch(`${baseUrl}/auth/token`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: body,
            }
        )
        if (!res.ok){
            console.log(await res.json())
        }else{
            return await res.json()
        }
<<<<<<< HEAD
    )
=======
        
    } catch (error) {
        console.log(error)
    }

>>>>>>> 8586fa5e32fc0ffa88956b866c846f264a3964d4
}


export { Signup, Login };