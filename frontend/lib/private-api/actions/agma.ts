import clientApi from './clientApi';
import {ApiError} from '@/types/api-error';
import axios from 'axios';
export const DownloadAgmaTicketToPdf = async (ticketID: string, current_route: string) => {
    const body = {
        current_route: current_route,
        ticket_id: ticketID
    }
    try {
        return await clientApi.post(`/v1/agma/tickets/to_pdf`, body, {
            responseType: 'blob'
        })
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.response?.data.detail, error.response?.status || 500)
        }
        throw error
    }
}