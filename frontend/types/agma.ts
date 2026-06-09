import {Stats} from "./stats";

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