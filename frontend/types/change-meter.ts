import { TotalPage } from "./total-page";
import { PointCoordinates } from "@/types/location";
import { Stats } from "@/types/stats";
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
  meter_sealed?: string;
  initial_reading: number;
  remarks?: string;
  accomplished_by: string;
  images: string[];
  geom: PointCoordinates;
};

export type ChangeMeterResponseLists = {
  data: ChangeMeterType[];
  total_page: TotalPage;
  stats: Stats[];
};

export type ChangeMeterCreatedType = {
  detail: "post_change_meter";
  message: string;
  total_page: number;
  number_of_features: number;
  data: {
    change_meter_data: ChangeMeterType;
    change_meter_stats: Stats[];
  };
};
