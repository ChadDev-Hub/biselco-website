"use client";
import { ReactFlow } from "@xyflow/react";
import type {
  ConnectedConsumerResponseType,
  ConnectedNodes,
  ConnectedEdges,
} from "@/types/transformer";
import { use, useState, useEffect } from "react";
import CustomNodes from "./customNode";

type PromiseType = {
  error?: number;
  status?: number;
  data?: ConnectedConsumerResponseType;
};

type Props = {
  promise: Promise<PromiseType>;
};

const FlowContainer = ({ promise }: Props) => {
  const initialData = use(promise);
  
  const [nodes, setNodes] = useState<ConnectedNodes[] | []>([]);
  const [edges, setEdges] = useState<ConnectedEdges[] | []>([]);
  
  
  useEffect(() => {
    const setupData = async () => {
      if (initialData.data) {
        setNodes(initialData.data.nodes);
        setEdges(initialData.data.edges);
      }
    };
    setupData();
  }, [initialData]);
  return (
    <div  className="w-full h-screen min-h-0">
      <ReactFlow nodes={nodes} edges={edges} 
      nodeTypes={{
        consumer: CustomNodes,
        transformer: CustomNodes
      }} 
      fitView />
    </div>
  );
};

export default FlowContainer;
