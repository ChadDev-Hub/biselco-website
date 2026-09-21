import { FeatureCollection, Geometry } from "geojson";
import type { Node, Edge } from "@xyflow/react";
export type Transformers = FeatureCollection<Geometry, TransformerProperties>;

export type TransformerProperties = {
  id: number;
  transformer_id: string | null;
  transformer_type: string | null;
  description: string | null;
  installation_type: string | null;
  primary_phasing: string | null;
  secondary_phasing: string | null;
  is_active?: boolean;
  color: string | null;
  village: string | null;
  municipality: string | null;
  connected_consumer: number | null;
  primary_voltage_rating_kv: number | null;
  secondary_voltage_rating_kv: number | null;
  kva_rating: number | null;
};


export type TransformerData = {
  label: string;
}

export type TransformerNodeData = Node<
  TransformerData,
  "transformer"
>;

export type ConsumerData = {
  id: number;
  account_no: string;
  account_type: string;
  account_name: string;
  meter_brand: string;
  meter_no: string;
};

export type ConsumerNodeData = Node<ConsumerData, "consumer">;

export type ConnectedNodes = ConsumerNodeData | TransformerNodeData;
export type ConnectedEdges = Edge;
export type ConnectedConsumerResponseType = {
  nodes: ConnectedNodes[];
  edges: ConnectedEdges[];
};
