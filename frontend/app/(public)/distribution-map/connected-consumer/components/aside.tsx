
"use client"
import React, { use, useCallback} from "react";
import { useReactFlow } from '@xyflow/react';

import type {
  ConnectedConsumerResponseType,
  ConsumerData,
} from "@/types/transformer";

type PromiseType = {
  error?: number;
  status?: number;
  data?: ConnectedConsumerResponseType;
};
type Props = {
  promise: Promise<PromiseType>;
};

const Aside = ({ promise }: Props) => {
  const initialData = use(promise);
  const {getNode, fitView} = useReactFlow();
  const handleLocate = useCallback(
    (id:string) => {
      const node = getNode(id);
      
      if (node) {
        fitView({
          nodes: [node],
          padding: 1,
          duration: 1000,
          ease:(t: number) => t * t 
        })
      }
    },
  [getNode, fitView]);
   
  return (
    <aside className="hidden lg:block lg:col-span-3 sticky top-8 drop-shadow-lg h-screen overflow-y-scroll">
      <nav className="card  bg-base-100 shadow-sm border border-base-300 p-4 rounded-2xl">
        <div className=" sticky top-0 left-0 w-full z-10 bg-blue-600 p-4 rounded-t-box">
          <h2 className="text-lg font-bold text-white ">Connected Consumers</h2>
        </div>

        <ul className="space-y-1 text-sm list">
          {initialData.data?.nodes.map(
            (node) =>
              node.type === "consumer" && (
                <li key={node.id} onClick={() => handleLocate(node.id)} className="list-row last:mb-0 hover:bg-base-200 text-xs hover:cursor-pointer">
                  {(node.data as ConsumerData).account_name}
                </li>
              ),
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Aside;
