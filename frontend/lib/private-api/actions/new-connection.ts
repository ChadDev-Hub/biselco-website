import clientApi from "./clientApi";
import {NewConnectionCreatedType} from "@/types/new-connection";
import {ApiError} from "@/types/api-error";

import axios from "axios";
// POST NEW CONNECTION
export const newConnectionMeter = async (formData: FormData) => {
  try {
    const {data} = await clientApi.post("/v1/new_connection/", formData);
    return data as NewConnectionCreatedType}
  catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError(error.response?.data.detail, error.response?.status || 500);
    }
  }
};

//  DELETE NEW CONNECTION DATA
export const deleteNewConnection = async (id: Set<number>) => {
  try {
    const {data} = await clientApi.delete(`/v1/new_connection/`,{
      data: Array.from(id)
      
    });
    return data as string;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError(error.response?.data.detail, error.response?.status || 500);
    }
  }
};


// DOWNLOAD REPORT
export const DownloadNewConnectionReport = async (items:object) => {
  try {
    const {data} = await clientApi.post(`/v1/new_connection/excel/report`,items, {
      responseType: 'blob'
    })
    return data as Blob
  } catch(error){
    if (axios.isAxiosError(error)) {
      throw new ApiError(error.response?.data.detail, error.response?.status || 500)
    }
    throw error
  }
}

