import clientApi from "./clientApi";
import { ApiError } from "@/types/api-error";
import {redirect} from "next/navigation"
import axios from "axios";
import {RegistrationResponse, SpinResponse, WinnerInfoType} from "@/types/agma"

// DOWNLOAD AGMA TICKET INDIVIDUAL

export const DownloadAgmaTicket = async (id:string, url:string) => {
    try {
        const { data } = await clientApi.get(`/v1/agma/ticket`, {
          responseType: "blob",
          params: {
            id: id,
            url: url,
          },
        });
        return data as Blob;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.response?.data.detail, error.response?.status || 500)
        }
        throw error
    }
}


export const DownloadAgmaTicketToPdf = async (
  selector: string,
  current_route: string,
  startPage: number,
  endPage: number,
  onProgress?: (percent:number) => void
) => {
  const body = {
    start_page: startPage,
    end_page: endPage,
    current_route: current_route,
    selector: selector,
    
  };
  try {
    return await clientApi.post(`/v1/agma/tickets/to_pdf`, body, {
      responseType: "blob",
      onDownloadProgress: (e) => {
        if (!e.total) return;
        const progress = Math.round((100 * e.loaded) / e.total);
        onProgress?.(progress);
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          redirect("/");
        case 403:
          redirect("/home");
        default:
          throw new ApiError(
            error.response?.data.detail,
            error.response?.status || 500,
          );
      };
    }
    throw error;
  }
};


// AGMA REGISTRATION
export const RegisterAgma = async (formdata: FormData) => {
    try {
      const {data, status} = await clientApi.post("/v1/agma/register", formdata)
      return {
        status: status,
        data: data as RegistrationResponse
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(error.response?.data.detail, error.response?.status || 500);
      } 
      throw error
    }}
    


// VERIFY AGMA TICKET

export const VerifyRegistered = async (id:string, is_verified: boolean) => {
  try{
    const {data} = await clientApi.patch(`/v1/agma/registered/verify`,{id: id, is_verified: is_verified})
    return data
  }catch(error){
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          redirect("/");
        case 403:
          redirect("/home");
        default:
          throw new ApiError(error.response?.data.detail, error.response?.status || 500);
      }
    }
    throw error
  }
}



// SPIN ROULETE
export const AgmaSpinRoulette = async()=>{
  try {
    const {data} = await clientApi.post(`/v1/agma/raffle/spin`)
    return data as SpinResponse
  } catch (error) {
    if (axios.isAxiosError(error)){
      throw new ApiError(error.response?.data.detail, error.response?.status || 500);
    }
    throw error
  }
}

// GET WINNER INFORMATION IF SPIN SUCCESSFULLY AND WINNER IS VERIFIED
export const GetWinnerInfo = async (account_number: string) => {
    try {
      const {data} = await clientApi.post(`/v1/agma/raffle/winner/info`,{account_no: account_number})
      return data as WinnerInfoType
    } catch (error) {
      if (axios.isAxiosError(error)){
        throw new ApiError(error.response?.data.detail, error.response?.status || 500);
      }
      throw error
    }
}


// UPDATE WINNER STATUS

export const UpdateWinnerStatus = async (id:string)=> {
    try {
      const {data} = await clientApi.patch(`/v1/agma/raffle/winner/status`,{id: id})
      return data as string
    } catch (error) {
      if (axios.isAxiosError(error)){
        switch (error.response?.status) {
          case 401:
            redirect("/");
          case 403:
            redirect("/home");
          default:
            throw new ApiError(error.response?.data.detail, error.response?.status || 500);
        }
      }
      throw error
    }
}


// DISMISSED WINNER
export const DismissedWinner = async (id:string)=> {
  try {
    const {data} = await clientApi.patch(`/v1/agma/raffle/winner/dismissed`,{id: id})
    return data as string
  } catch (error) {
    if (axios.isAxiosError(error)){
      switch (error.response?.status) {
        case 401:
          redirect("/");
        case 403:
          redirect("/home");
        default:
          throw new ApiError(error.response?.data.detail, error.response?.status || 500);
      }
    }
    throw error
  }
  }
   
