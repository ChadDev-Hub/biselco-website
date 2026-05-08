
const baseUrl = process.env.BASESERVERURL;


export const RegisterAgma = async (data: FormData) => {
    console.log(data)
    const res = await fetch(
        `${baseUrl}/v1/agma/registration`,{
            method: "POST",
            body: data
        }
        
    );
    return res;
};