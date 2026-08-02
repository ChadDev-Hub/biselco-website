import clientApi from "./clientApi";
import { ComplaintResponse, ComplaintMessage } from "@/types/complaints";
import axios from "axios";
import { ApiError } from "@/types/api-error";

export async function PostComplaints(form: FormData) {
  try {
    const { data } = await clientApi.post("/v1/complaints/", form);
    return data as ComplaintResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError(
        error.response?.data.detail,
        error.response?.status || 500,
      );
    }
    throw error;
  }
}

// DELETE COMPLAINT
export async function DeleteComplaint(id: number) {
  try {
    const { data } = await clientApi.delete(`/v1/complaints/${id}`);
    return data as ComplaintResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError(
        error.response?.data.detail,
        error.response?.status || 500,
      );
    }
    throw error;
  }
}

// UPDATE COMPLAINT STATUS
export async function UpdateComplaintStatus(
  complaint_id: number,
  status_name: string,
  status_id: number,
  current_status_id?: number,
) {
  const body = {
    status_name: status_name,
    status_id: status_id,
    current_status_id: current_status_id,
  };
  try {
    const { data } = await clientApi.put(
      `/v1/complaints/status/${complaint_id}`,
      body,
    );
    return data as ComplaintResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError(
        error.response?.data.detail,
        error.response?.status || 500,
      );
    }
    throw error;
  }
}

// DELETE COMPLAINT STATUS
export async function DeleteComplaintStatus(
  complaint_id: number,
  status_name: string,
  status_id: number,
  current_status_id?: number,
) {
  const body = {
    status_name: status_name,
    status_id: status_id,
    current_status_id: current_status_id,
  };
  try {
    const { data } = await clientApi.delete(`/v1/complaints/status/${complaint_id}`, {
        data: body
    });
    return data as ComplaintResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError(
        error.response?.data.detail,
        error.response?.status || 500,
      );
    }
    throw error;
  }
}


// GET COMPLAINTS MESSAGE
export async function GetComplaintsMessage(complaint_id: number | undefined) {
    if (!complaint_id) return

    try{
      const {data} = await clientApi.get(`/v1/complaints/message`,{
        params: {
          complaints_id: complaint_id
        }
      })
      return data as ComplaintMessage[]
    }catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.response?.data.detail,
          error.response?.status || 500,
        );
      }
      throw error;
    }
  
}