"use client"
import React, {use} from "react";
import CardComponent from "@/app/common/card";
import SimpleBarChart from "@/app/common/Barchart";
import {TooltipContentProps } from "recharts";
import MunicipalityFiter from './MunicipalityFiter';
import SimpleLineChart from "@/app/common/LineChart";




const RegisteredCountCustomTooltip = ({ active, payload, label }: TooltipContentProps) => {
  const firstPayload = payload?.[0];
  const isVisible = active && firstPayload != null;
  return (
    <div className={` bg-base-200 shadow-md border-slate-200 rounded-box p-2 ${isVisible ? "visible" : "hidden"}`}>
      <p className="label text-xs">{label}</p>
      <p className="value text-md text-center font-bold">
        <span></span>
        {firstPayload?.value}
        </p>
    </div>
  );}

const StatisticsCharts = ({registerCountPromise}:Props) => {
  const registeredCount = use(registerCountPromise)
  return (
    <div className="grid grid-cols-1 max-w-4xl gap-2">
      <MunicipalityFiter />
      <CardComponent className="bg-base-100 w-fu p-2">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Registered Distribution</h2>
        <div className="w-full">
          <SimpleBarChart 
          data={registeredCount.data} 
          xaxisStyle={{ fontSize: 8, angle: -45, fontWeight: "bold" }}
          yaxisStyle={{ fontSize: 8 }}
          customTooltip={RegisteredCountCustomTooltip}  />
        </div>
      </CardComponent>

      <CardComponent className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Activity Trends</h2>
        <div className="h-64 flex items-center justify-center bg-linear-to-br from-green-50 to-emerald-50 rounded-lg">
          <SimpleLineChart />
        </div>
      </CardComponent>
    </div>
  );
};

export default StatisticsCharts;
