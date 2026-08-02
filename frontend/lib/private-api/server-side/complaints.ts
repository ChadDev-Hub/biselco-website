import { UserComplaintsResponseType } from "@/types/complaints";
import getServerApi from "./server-api";
import axios from "axios";
import { ApiError } from "@/types/api-error";
import { redirect } from 'next/navigation';


// GET COMPLAINTS ON SEPECIFIC USER

export async function UserComplaints() {
  const serverApi = await getServerApi();
  try {
    const { data, status} = await serverApi.get("/v1/complaints/");
    const response = {
      data: data as UserComplaintsResponseType,
      status: status,
    }
    return response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          redirect("/");
        default:
         throw new ApiError(error.response?.data.detail, error.response?.status || 500);
      }
    }
    throw error;
  }
}

export async function GetAllComplaints(
  page?: number,
  q?: string | number | boolean,
) {
  const serverApi = await getServerApi();
  try {
    const { data, status } = await serverApi.get(`/v1/complaints/all`, {
      params: {
        search: q,
        page: page,
      },
    });
    const response = {
      data: data as UserComplaintsResponseType,
      status: status,
    }
    return response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          redirect("/");
        default:
          throw new ApiError(
            error.response?.data.detail,
            error.response?.status || 500,
          );
      }
    }
    throw error;
  }
}
