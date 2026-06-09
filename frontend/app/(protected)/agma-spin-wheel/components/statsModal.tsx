"use client";
import React, { use, useRef } from "react";
import { AgmaStatsType } from "@/types/agma";
import { ChartNoAxesCombined, XCircle } from "lucide-react";
import SimpleBarChart from "@/app/common/Barchart";
import { TooltipContentProps } from "recharts";
import StatsCard from "@/app/complaints/dashboard/components/statsCard";
import StatsContainer from "@/app/common/Stats";
type PromiseType = {
  status: number;
  data?: AgmaStatsType;
  error?: string;
};

type Props = {
  promise: Promise<PromiseType>;
};

const CustomTooltip = ({ active, payload, label }: TooltipContentProps) => {
  const isVisible = active && payload != null;

  return (
    <div
      className={` bg-base-200 shadow-md border-slate-800 rounded-box p-2 ${isVisible ? "visible" : "hidden"}`}
    >
      <p className="label text-xs text-black">{label}</p>
      <div className="value  text-xs text-center font-bold">
        {payload.map((item, index) => (
          <p className="flex text-black justify-between gap-4 " key={index}>
            <span>{item.name}: </span>
            <span>{item.value}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

const StatsModal = ({ promise }: Props) => {
  const modal = useRef<HTMLDialogElement>(null);
  const initialData = use(promise);
  const handleOpen = () => modal.current?.showModal();
  const handleClose = () => modal.current?.close();

  return (
    <>
      <button
        type="button"
        title="View Winner Stats"
        className="btn btn-lg btn-circle bg-linear-to-r from-blue-400 via-purple-400 to-pink-400"
        onClick={handleOpen}
      >
        <ChartNoAxesCombined className="text-white" />
      </button>
      <dialog ref={modal} className="modal">
        <div className="modal-box max-w-md flex flex-col gap-3 bg-slate-800/90 ring-2 ring-slate-600 backdrop-blur-md">
          <button
            onClick={handleClose}
            type="button"
            className="btn btn-sm btn-circle absolute top-2 btn-error right-2"
          >
            <XCircle className="w-6 h-6 text-white" />
          </button>
          <header className="font-bold text-2xl">Winner Stats</header>
          <div className="w-full flex flex-col gap-3  items-center">
            <StatsContainer className="bg-slate-600 rounded-box h-fit max-w-sm">
              {initialData.data?.w_per_mun.map((item, index) => (
                <StatsCard
                  style={{
                    titleClass: "text-white text-xs",
                    valueClass: "text-white font-bold",
                  }}
                  svg={null}
                  key={index}
                  label={item.name}
                  value={item.value}
                />
              ))}
            </StatsContainer>
            <SimpleBarChart
              customTooltip={CustomTooltip}
              xaxisStyle={{ fontSize: 8 }}
              yaxisStyle={{ fontSize: 8 }}
              data={initialData?.data?.w_per_vill}
            />
          </div>
        </div>
      </dialog>
    </>
  );
};

export default StatsModal;
