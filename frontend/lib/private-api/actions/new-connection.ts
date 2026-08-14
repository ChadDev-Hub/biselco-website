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
export const deleteNewConnection = async (id: Set<number>, page: number) => {
  const res = serverFetchAutoRefresh(
    `${baseUrl}/v1/new_connection/`,
    "DELETE",
    JSON.stringify({
      items: Array.from(id),
      page: page,
    }),
    {
      "content-type": "application/json",
    },
  );
  return res;
};


// DOWNLOAD REPORT
export const DownloadNewConnectionReport = async (items:object) => {
    const data = await serverFetchAutoRefresh(
        `${baseUrl}/v1/new_connection/excel/report`, 
        "POST",
        JSON.stringify(items),
        {
            "content-type": "application/json"
        }
    )
    return data;
}

export const CheckImageLocation = async (attachment: File) => {
  const formData = new FormData();
  formData.append("attachment", attachment);
  const data = await serverFetchAutoRefresh(
    `${baseUrl}/v1/new_connection/check_image_location/`,
    "POST",
    formData
  );
  await new Promise((resolve)=> setTimeout(resolve, 2000));
  return data;
};