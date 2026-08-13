import clientApi from "@/lib/private-api/actions/clientApi";
import { ApiError } from "@/types/api-error";
import axios from "axios";


export const SubmitChangeMeter = async (formData: FormData, page: number) => {
  try {
    const { data } = await clientApi.post("/v1/change_meter/", formData, {
      params: {
        page: page.toString(),
      },
    });
    return data as string;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError(error.response?.data.detail, error.response?.status || 500);
    }
    throw error;
  }
};

export const DeleteChangeMeter = async (items: Set<number>) => {
    try {
        const {data} = await clientApi.delete(`/v1/change_meter/`,{data: Array.from(items)});
        return new Set<number>(data);
    } catch (error) { 
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.response?.data.detail, error.response?.status || 500)
        }
        throw error
    }
};

export const DownloadChangeMeterReport = async (items: object) => {
    try {
        const {data} = await clientApi.post(`/v1/change_meter/excel/report`,items, {
            responseType: 'blob'
        });
        return data
    } catch(error){
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.response?.data.detail, error.response?.status || 500)
        }
        throw error
    }
};
