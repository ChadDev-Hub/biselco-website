"use client";

import { NodeProps } from "@xyflow/react";
import TransformerNode from './transformerNode';
import ConsumerNode from './consumerNode';
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
        <TransformerNode id={"node-1"}  data={ transformer}/>
      );
    default:
      const consumer = data as ConsumerData;
      return (
        <ConsumerNode data={consumer} />
      );
  }
};

export default CustomNodes;
