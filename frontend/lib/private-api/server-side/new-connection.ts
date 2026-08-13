import axios from "axios";
import { ApiError } from "@/types/api-error";
import  getServerApi from "./server-api"
import { redirect } from "next/navigation";
import { NewConnectionInitialType } from "@/types/new-connection";


export const GetNewConnection = async (page?:number, search?:string | number | string[]) => {
    try {
        const serverApi = await getServerApi();
        const {data , status} = await serverApi.get(`/v1/new_connection`, {
            params: {
                search: search,
                page: Number(page) || 1,
            },
        })
        return {
            status:status,
            data: data as NewConnectionInitialType
        }
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
        throw error;
    };
};
