"use client";
import SimpleBarChart from "@/app/common/Barchart";
import { use } from "react";
import { TooltipContentProps } from "recharts";
type PromiseType = {
  status: number;
  data?: CountRegistered[];
  error?: string;
};

type CountRegistered = {
  name?: string;
  value?: number;
};

type Props = {
  promise: Promise<PromiseType>;
};

const RegisteredCountCustomTooltip = ({
  active,
  payload,
  label,
}: TooltipContentProps) => {
  const firstPayload = payload?.[0];
  const isVisible = active && firstPayload != null;
  return (
    <div
      className={` bg-base-200 shadow-md border-slate-200 rounded-box p-2 ${isVisible ? "visible" : "hidden"}`}
    >
      <p className="label text-xs">{label}</p>
      <p className="value text-md text-center font-bold">
        <span></span>
        {firstPayload?.value}
      </p>
    </div>
  );
};
const CountRegistered = ({ promise }: Props) => {
  const data = use(promise);
  return (
    <div className="bg-base-100 rounded-box shadow-md p-2">
      <h2 className="text-lg font-bold">Registered Count</h2>
      <SimpleBarChart
        data={data.data}
        xaxisStyle={{ fontSize: 8, angle: -45, fontWeight: "bold" }}
        yaxisStyle={{ fontSize: 8 }}
        customTooltip={RegisteredCountCustomTooltip}
      />
    </div>
  );
};

export default CountRegistered;
