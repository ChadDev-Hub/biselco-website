import {PointCoordinates} from "@/types/location";
import {Stats} from "@/types/stats";

export type NewConnectionType = {
    id: number;
    date_accomplished: string;
    consumer_name: string;
    location: string;
    meter_serial_no: string;
    meter_brand: string;
    meter_sealed: string;
    initial_reading: number;
    multiplier: number;
    accomplished_by: string;
    remarks: string;
    images: string[];
    geom: PointCoordinates
}


export type NewConnectionCreatedType = {
  new_connection: NewConnectionType;
  new_connection_stats: Stats[];
}

export type NewConnectionInitialType = {
    data: NewConnectionType[];
    total_page: number;
    
}