
import fastapi from "./interceptor";
import {GoogleValidateType, LogoutResponseType} from "@/types/auth"

// LOUTOUT

export const Logout = async () => {
  const {data, status, statusText} = await fastapi.post("/v1/auth/logout",null,{onUploadProgress:({progress})=>{
    console.log(progress)
  }})
  switch (status) {
    case 202:
      return data as LogoutResponseType
    case 401:
      throw new Error(statusText);
    default:
      throw new Error(statusText);
  }
}





export const GoogleLoginRoute = async (secretKey?:string) => {
  const params = new URLSearchParams();
  if(secretKey){
    params.set("secret",secretKey)
  }
  const {data, status, statusText} = await fastapi.post("/v1/auth/google/validate",null,{params})
  switch (status) {
    case 200:
      return data as GoogleValidateType
    case 401:
      throw new Error(statusText);
    default:
      throw new Error(statusText);
  }
}

  

