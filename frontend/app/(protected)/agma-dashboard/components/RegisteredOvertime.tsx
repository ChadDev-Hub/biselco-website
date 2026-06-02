"use client";

import { use } from "react";
import SimpleLineChart from "@/app/common/LineChart";
import { TooltipContentProps } from "recharts";
type PromiseType = {
  status: number;
  data?: Data[];
  error?: string;
};

type Data = {
  name?: string;
  coron?: number;
  busuanga?: number;
  culion?: number;
  linapacan?: number;
};

type Props = {
  promise: Promise<PromiseType>;
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipContentProps) => {
  const isVisible = active && payload != null;
  return (
    <div
      className={` bg-base-200 shadow-md border-slate-200 rounded-box p-2 ${isVisible ? "visible" : "hidden"}`}
    >
      <p className="label text-xs">{label}</p>
      <p className="value text-xs text-center font-bold">
        {payload.map((item, index)=> (
          <div className="flex justify-between " key={index}>
            <span className={`text-${item.color}-600`}>{item.name}: </span>
            <span className={`text-${item.color}-600`}>{item.value}</span>
          </div>
        ))}
        
      </p>
    </div>
  );
};


const RegisteredOvertime = ({ promise }: Props) => {
  const Data = use(promise);

  return (
    <div className="h-100 bg-base-100 shadow-md p-2 rounded-box w-full">
        <h2 className="text-lg font-bold">Registered Running Total</h2>
      <SimpleLineChart
        xaxisStyle={{ fontSize: 12, angle: -45, fontWeight: "bold" }}
        yaxisStyle={{ fontSize: 10 }}
        data={Data?.data}
        dataKey={[
          { label: "coron", color: "blue" },
          { label: "busuanga", color: "green" },
          { label: "culion", color: "red" },
          { label: "linapacan", color: "yellow" },
        ]}
        customToolTip={CustomTooltip}
      />
    </div>
  );
};

export default RegisteredOvertime;
