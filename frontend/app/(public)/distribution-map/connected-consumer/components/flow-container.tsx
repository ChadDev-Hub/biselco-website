
"use client";
import {ReactFlow} from '@xyflow/react'
import type {ConsumerNodeData, TransformerNodeData} from "@/types/transformer"


const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];
const NodeType = {
    consumer: ConsumerNodeData,
    transformer: TransformerNodeData
}
const FlowContainer = () => {
    
  return (
    <div className="w-full h-100">
        <ReactFlow nodeType={NodeType} nodes={[]} edges={initialEdges} fitView />
    </div>
      
  
  )
}

export default FlowContainer