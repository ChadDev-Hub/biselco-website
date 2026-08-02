import getServerApi from "@/lib/private-api/server-side/server-api";
import { TechnicalFormsType } from "../../../types/technical";
import axios from "axios";
import { ApiError } from "@/types/api-error";
import { redirect } from "next/navigation";
export async function GetTechnicalForm() {
  const serverApi = await getServerApi();
  try {
    const { data } = await serverApi.get("/v1/technical_form/all");
    return data as TechnicalFormsType[];
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
