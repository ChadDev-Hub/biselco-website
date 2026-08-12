import { ApiError } from '../../../types/api-error';
import axios from 'axios';
import clientApi from "./clientApi";
import { redirect } from "next/navigation";

export const SetupAgmaEvent = async (form: FormData) => {
  try {
    const {data} = await clientApi.post("/v1/agma/setup", form)
    return data as string;
  } catch (error) {
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
};

export const AgmaEventSchedules = async (schedules) => {
  try {
    const {data} = await clientApi.post("/v1/events/agma/schedules", schedules)
    return data as string;
  } catch (error){
    if (axios.isAxiosError(error)){
      switch (error.response?.status){
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
};
