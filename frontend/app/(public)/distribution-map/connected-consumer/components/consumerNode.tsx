"use client";
import { Handle, Position } from "@xyflow/react";
import { ConsumerData } from "@/types/transformer";
import { CircleGauge } from "lucide-react";

type Props = {
  data: ConsumerData;
};

const ConsumerNode = ({ data }: Props) => {
  return (
    <div className="card w-64 bg-base-100 shadow-xl border border-base-300 hover:border-secondary">
      {/* Output Handle (Bottom) */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-primary rounded-full"
      />
      <div className="card-body p-4 flex flex-col  gap-4">
        {/* Node Label & Subtitle */}
        <div className="flex flex-row gap-2">
          <div className="bg-green-500/35 p-2 rounded-box border h-fit border-green-500/25">
            <CircleGauge className="size-6 text-green-500" />
          </div>
          <div className="flex flex-col">
            <h2 className="card-title text-sm font-semibold">
              {data.account_no || "Transformer"}
            </h2>
            <span className="text-[10px] text-base-content/60">
              {data.account_name}
            </span>
            <span className="text-[9px] text-base-content/60">
              {data.account_type}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          
          {/* METER NO */}
          <div className="flex flex-col bg-base-200 p-2 rounded-box">
            <label className="label text-[9px]">
              Meter No
            </label>
            <span className="text-[10px] font-semibold">{data.meter_no}</span>
          </div>
          {/* METER BRAND */}
          <div className="flex flex-col bg-base-200 p-2 rounded-box">
            <label className="label text-[9px]">
              Brand
            </label>
            <span className="text-[10px] font-semibold">{data.meter_brand}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerNode;
