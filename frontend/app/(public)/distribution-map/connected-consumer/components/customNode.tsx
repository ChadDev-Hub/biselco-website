"use client";

import { NodeProps, Handle, Position } from "@xyflow/react";
import {
  TransformerData,
  ConsumerData,
  ConnectedNodes,
} from "@/types/transformer";

const CustomNodes = ({ data, type }: NodeProps<ConnectedNodes>) => {
  switch (type) {
    case "transformer":
      const transformer = data as TransformerData;
      return (
        <div className="w-full h-full bg-base-300 rounded-box p-4">
          <div>{transformer.label}</div>

          <Handle type="source" position={Position.Bottom} />
          
        </div>
      );
    default:
      const consumer = data as ConsumerData;
      return (
        <div className="w-full h-full bg-base-300 rounded-box p-4">
          <div>{consumer.account_no}</div>
          <Handle type="target" position={Position.Top} />
        </div>
      );
  }
};

export default CustomNodes;
