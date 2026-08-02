
import clientApi from "./actions/clientApi";
import {GoogleValidateType, LogoutResponseType} from "@/types/auth"
import {User} from "@/types/user"
import { ApiError } from '../../types/api-error';
import axios from 'axios';

// LOUTOUT
export const Logout = async () => {
  const {data, status, statusText} = await clientApi.post("/v1/auth/logout",null,{onUploadProgress:({progress})=>{
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
// GOOGLE
export const GoogleLoginRoute = async (secretKey?:string) => {
  const params = new URLSearchParams();
  if(secretKey){
    params.set("secret",secretKey)
  }
  try {
    const {data} = await clientApi.post("/v1/auth/google/validate",null,{params})
    return data as GoogleValidateType
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError(error.response?.data.detail, error.response?.status || 500)
    }
    throw error
  }
  }
  

export const GetUser = async () => {
  try {
    const {data} = await clientApi.get("/v1/users/me")
    return data as User
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError(error.response?.data.detail, error.response?.status || 500)
    }
    throw error
  }
  }
  

  

