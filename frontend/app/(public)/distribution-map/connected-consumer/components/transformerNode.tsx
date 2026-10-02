"use client";

import { Handle, Position, useReactFlow } from "@xyflow/react";
import type { TransformerData } from "@/types/transformer";
import {useRef, useEffect} from "react"
import {Zap} from "lucide-react"
type Props ={
    id: string
    data:  TransformerData};

const TransformerNode = ({ id,data }: Props) => {
    const containerRef =useRef<HTMLDivElement>(null) 
    const {setViewport, getNode} = useReactFlow();

    useEffect(() => {
    const element = containerRef.current;

    if (!element) return;

    const flow = document.querySelector(".react-flow") as HTMLElement;

    if (!flow) return;

    const node = getNode(id);

    if (!node) return;

    const { width, height } = element.getBoundingClientRect();

    const flowWidth = flow.clientWidth;
    const flowHeight = flow.clientHeight;

    const zoom = 0.6;

    // Where we want the transformer CENTER on screen
    const targetX = flowWidth * 0.5;
    const targetY = flowHeight * 0.2;

    // Node center in React Flow coordinates
    const nodeCenterX = node.position.x + width / 2;
    const nodeCenterY = node.position.y + height / 2;
    console.log(nodeCenterX, nodeCenterY); 
    setViewport(
      {
        x: targetX - nodeCenterX * zoom,
        y: targetY - nodeCenterY * zoom,
        zoom,
      },
      {
        duration: 1000,
      }
    );
  }, [id, getNode, setViewport]);

  return (
    <div ref={containerRef} id="transformer_node_container" className="card w-64 bg-base-100 shadow-xl border border-base-300 hover:border-primary">
      <div className="card-body p-4 flex flex-row items-center gap-4">
        <div className="bg-orange-500/35 p-2 rounded-box border border-orange-500/25">
            <Zap className="size-6 text-orange-500"/>
        </div>

        {/* Node Label & Subtitle */}
        <div className="flex flex-col">
          <h2 className="card-title text-sm font-semibold">{data.label || 'Transformer'}</h2>
          <span className="text-xs text-base-content/60">Distribution Transformer</span>
        </div>
      </div>

      {/* Output Handle (Bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-primary rounded-full"
      />
    </div>
  );
};

export default TransformerNode;
