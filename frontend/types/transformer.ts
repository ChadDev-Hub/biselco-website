import {FeatureCollection,Geometry} from "geojson";

export type Transformers = FeatureCollection<Geometry, TransformerProperties>;



export type TransformerProperties = {
  id: number;
  transformer_id: string | null;
  transformer_type: string | null;
  is_active: string | null;
  color: string | null;
  village: string | null;
  municipality: string | null; 
}
