"use client";
import {ChartColumnDecreasing} from "lucide-react"
const ChartSkeleton = () => {
  return (
    <div className="bg-base-100 shadow rounded-2xl p-2 w-full h-fit">
      {/* Title */}
      <div className="h-10 w-1/2 skeleton bg-slate-200 rounded mb-2"></div>

      {/* Fake chart circle */}
      <div className="flex gap-2 items-end w-full justify-center h-full ">
        <ChartColumnDecreasing className="w-30 h-30 mx-20 my-20 skeleton  p-4 bg-slate-100 text-slate-100 " />
      </div>
    </div>
  );
};

export default ChartSkeleton;