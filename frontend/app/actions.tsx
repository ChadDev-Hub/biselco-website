"use server";
const baseUrl = process.env.BASESERVERURL

// SIGNUP ACTION
const Signup = async (formdata: FormData) => {
    const data = formdata
    const res = await fetch(`${baseUrl}/auth/signup`,
        {
            method: "POST",
            body: data
        }
    )
    const results = await res.json()
    if (!res.ok) {
        return {
            error: results.detail
        }
    }
    return results

}

export { Signup};