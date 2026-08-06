
import getServerApi from "./server-api";
import axios from "axios";
import { ApiError } from "@/types/api-error";
import { redirect } from "next/navigation";
import { AllTicketInfoType } from '../../../types/agma';

type Props = {
     
        search: string | string[] | undefined
        page: string | string[] | undefined
        year: string | string[] | undefined
        barangay: string | string[] | undefined
        municipality: string | string[] | undefined
        is_verified: string | string[] | undefined | boolean
    
}

export const GetAgmaTicketAll = async (
  {   search, page, year, barangay, municipality, is_verified }: Props
) => {
  try {
    const serverApi = await getServerApi();
    const { data, status } = await serverApi.get(`/v1/agma/registered/all`, {
      params: {
        search: search,
        page: page,
        year: year,
        barangay: barangay,
        municipality: municipality,
        is_verified: is_verified,
      },
    });
    return {
      status: status,
      data: data as AllTicketInfoType,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          redirect("/");
        case 403:
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
};

// export const GetAgmaTicketAll = async (
//   page: string | string[] | undefined,
//   year: string | string[] | undefined,
//   barangay: string | string[] | undefined,
//   search: string | string[] | undefined,
//   municipality: string | string[] | undefined,
//   is_verified: string | string[] | undefined | boolean,
// ) => {
//   const params = new URLSearchParams();
//   const cookie = await cookies();
//   const accessToken = cookie.get("access_token")?.value;

//   if (search) {
//     params.set("search", typeof search === "string" ? search : "");
//   } else {
//     if (page) {
//       params.set("page", typeof page === "string" ? page : "");
//     }
//     if (year !== "All" && year) {
//       params.set("year", typeof year === "string" ? year : "");
//     }
//     if (barangay !== "All" && barangay) {
//       params.set("barangay", typeof barangay === "string" ? barangay : "");
//     }
//     if (municipality !== "All" && municipality) {
//       params.set(
//         "municipality",
//         typeof municipality === "string" ? municipality : "",
//       );
//     }
//     if (is_verified !== "All" && is_verified) {
//       params.set(
//         "is_verified",
//         typeof is_verified === "string" ? is_verified : "",
//       );
//     }
//   }
//   const res = await fetch(
//     `${baseUrl}/v1/agma/registered/all?${params.toString()}`,
//     {
//       method: "GET",
//       cache: "no-store",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//       },
//     },
//   );

//   const data = await res.json();
//   if (!res.ok) {
//     return {
//       status: res.status,
//       data: data.detail,
//     };
//   }
//   return {
//     status: res.status,
//     data: data,
//   };
// };
