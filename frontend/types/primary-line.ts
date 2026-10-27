
import { Geometry, GeoJSON} from "geojson";

export type PrimaryLines = GeoJSON<Geometry, PrimaryLineProperties>;



export type PrimaryLineProperties = {
  id: number;
  primary_line_id: string;
  village: string;
  municipality: string;
  color: string;
  is_active: boolean;
  length_meters: number;
  phasing: string;
  conductor_wire: string;
  neutral_wire: string;
};
