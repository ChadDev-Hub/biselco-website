import getServerApi from './server-api';

import axios from 'axios';
import { ApiError } from '../../../types/api-error';
import { ChangeMeterResponseLists } from '../../../types/change-meter';


//  GET CHANGE METER DATA
export const GetChangeMeter = async (page?:number,search?:string) => {
    try {
        const serverApi = await getServerApi();
        const { data, status } = await serverApi.get(`/v1/change_meter/`, {
            params: {
                search: search,
                page: page,
            },
        })
        
        return {
            status: status,
            data: data as ChangeMeterResponseLists
        }
    } catch (
        error
    ){
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.response?.data.detail, error.response?.status || 500)
        }
        throw error;
    }
};