import {Stats} from "./stats";



export type TicketInfoType = {
    id: string;
    account_no: string;
    account_name: string;
    year: string;
    image: string;
    name: string;
    village: string;
    municipality: string;
    phone: string;
    meter_no: string;
    meter_brand: string;
    date_registered: string;
    time_registered: string;
    signature: string
    sample_bill?: string;
    authorization_letter?: string;
    is_verified?: boolean
    monitoring?: monitoringType[]
}


export type UserMonitoringType = {
    id: string;
    first_name: string;
    last_name: string;
    photo: string;
}

export type monitoringType = {
    id: string;
    comment: string;
    date: string;
    time: string;
    user?: UserMonitoringType
}

export type AgmaVerificationType = {
    id: string;
    is_verified?: boolean,
    monitoring?: monitoringType[]
}

export type WinnerInfoType = {
    id: string; 
    account_no: string;
    name: string; 
    image: string; 
    municipality: string; 
    village: string;

}


export type AgmaStatsType = {
    w_per_mun: Stats[];
    w_per_vill: Stats[];
}

export type FormType = {
  account_no: string;
  name: string;
  mobile_number: string | null;
  image: File;
  signature: File;
  sample_bill: File;
  authorization_letter: File | null;
};


export type CountPerMunicipality = {
    name: string;
    value?: number
}