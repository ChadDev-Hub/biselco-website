import {TotalPage} from "@/types/total-page";
import {Location} from "@/types/location"
import {User} from "@/types/user";
export type UserComplaintsResponseType = {
    data : Complaints[];
    total_page: TotalPage
}

export type Complaints = {
    id: number; 
    user_id: string;
    first_name: string;
    last_name: string;
    user_photo:string;
    subject: string;
    description: string;
    reference_pole: string;
    village: string;
    municipality: string;
    location: Location;
    date_time_submitted: string;
    status: ComplaintsStatus[];
    latest_status?: Lateststatus;
    status_history?: StatusHistory[];
    images?: ComplaintsImage[];
    resolution_time?:string;
    unread_messages?: number;
}




export type ComplaintStatusData = {
  complaint_id: number;
  status: ComplaintsStatus[];
  status_history: StatusHistory[];
  latest_status?: Lateststatus;
  resolution_time?: string;
}


export type ComplaintsStatus = {
    id: number;
    complaints_id: number;
    status_id: number;
    name: string;
    description: string;
    date: string;
    time: string;
}

export type Lateststatus = { 
    id: number;
    name: string;
}

export type StatusHistory = {
    id: number;
    first_name: string
    last_name:string
    comments: string
    timestamped: string
    user_photo:string

}

export type ComplaintsImage={
    id: number;
    url: string;
}



export type ComplaintMessage = {
  id: string;
  complaints_id: number;
  message: string;
  receiver?: User;
  sender: User;
  sender_status: string;
  receiver_status: string;
  date: string;
  time: string;
}


export type ComplaintResponse  = {
    detail: string 
}