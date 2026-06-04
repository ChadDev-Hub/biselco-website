

export type Transformers = {
  type: string;
  features: {
    type: string;
    geometry: {
      type: string;
      coordinates: number[][];
    };
    properties: TransformerProperties;
  }[];
};



export type TransformerProperties = {
  id: number;
  transformer_id: string | null;
  transformer_type: string | null;
  is_active: string | null;
  color: string | null;
  village: string | null;
  municipality: string | null; 
}
