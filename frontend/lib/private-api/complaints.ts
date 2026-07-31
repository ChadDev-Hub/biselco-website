
import {UserComplaintsResponseType} from "@/types/complaints";
import getServiceApi from './server-api';


// GET COMPLAINTS ON SEPECIFIC USER 

export async function UserComplaints() {
    const serverApi = await getServiceApi();
    const {data, status, statusText} = await serverApi.get("/v1/complaints/")

    switch (status) {
        case 200:
            return data as UserComplaintsResponseType
        case 401:
            throw new Error(statusText);
        default:
            throw new Error(statusText);
    }
}
   