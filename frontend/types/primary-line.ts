
import { FeatureCollection, Geometry } from "geojson";

export type PrimaryLines = FeatureCollection<Geometry, PrimaryLineProperties>;



export type PrimaryLineProperties = {
  primary_line_id: string;
  village: string;
  municipality: string;
  color: string;
  is_active: boolean;
  length_meters: number;
  phasing: string;
};
