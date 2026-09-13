import {FeatureCollection,Geometry} from "geojson";

export type Transformers = FeatureCollection<Geometry, TransformerProperties>;



export type TransformerProperties = {
  id: number;
  transformer_id: string | null;
  transformer_type: string | null;
  description: string | null;
  installation_type:string | null;
  primary_phasing:string | null;
  secondary_phasing:string | null;
  is_active?: boolean ;
  color: string | null;
  village: string | null;
  municipality: string | null;
}
