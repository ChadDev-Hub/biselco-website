import clientApi from "./clientApi";
import { ApiError } from "@/types/api-error";
import axios from "axios";

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
      throw new ApiError(
        error.response?.data.detail,
        error.response?.status || 500,
      );
    }
    throw error;
  }
};
