

import clientApi from "./clientApi";
import { ApiError } from '../../../types/api-error';
import {Consumer} from "@/types/consumer-meter";
import axios from 'axios';

export const queryConsumer = async(query?:string)=>{
    try {
        const {data, status} = await clientApi.get("/v1/consumers",{
        params:{
            q:query
        }
    })
        return {
            status: status,
            data: data as Consumer[]
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.response?.data.detail, error.response?.status || 500)
        }
        throw error
    }
}