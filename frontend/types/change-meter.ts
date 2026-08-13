import {TotalPage} from "./total-page";

export type ChangeMeterType = {
  id: number;
  date_accomplished: string;
  account_no: string;
  consumer_name: string;
  location: string;
  pull_out_meter: string;
  pull_out_meter_reading: number;
  new_meter_serial_no: string;
  new_meter_brand: string;
  initial_reading: number;
  remarks?: string;
  accomplished_by: string;
  images: string[];
  geom: {
    type: string;
    coordinates: number[];
    srid: number;
  };
};


export type ChangeMeterStatsType = {
    label: string;
    value: number;
    description: string;
}


export type ChangeMeterResponseLists = {
    data: ChangeMeterType[];
    total_page: TotalPage;
    stats: ChangeMeterStatsType[]
}