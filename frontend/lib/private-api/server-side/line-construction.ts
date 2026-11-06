
import axios from "axios";
import getServerApi from "./server-api";
import {ApiError} from "../../../types/api-error";
import {LineConstructions} from '@/types/construction/construction';
export const GetLineConstruction = async () => {
    try {
        const serverApi = await getServerApi();
        const { data, status} = await serverApi.get("/v1/construction/distribution_lines");
        return {
            status: status,
            data: data as LineConstructions[],
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.response?.data.detail, error.response?.status || 500)
        }
        throw error;
    }
}