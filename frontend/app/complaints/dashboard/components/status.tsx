"use client";

import { use, useEffect, useState } from "react";
import { useWebsocket } from "@/app/utils/websocketprovider";
type PromiseType = {
  status: number;
  data: ComplaintStatsType[];
};
type Props = {
  data: Promise<PromiseType>;
};
type ComplaintStatsType = {
  id: number;
  title: string;
  value: number;
  description: string;
};
const Stats = ({ data }: Props) => {
  const stats = use(data);
  const [statsData, setStatsData] = useState<ComplaintStatsType[]>([]);
  useEffect(() => {
    queueMicrotask(() => 
      setStatsData(stats.data));
  }, [stats]);

  // WEBSOCKET
  const { message } = useWebsocket();
  useEffect(() => {
    if (message?.detail === "complaint_stats") {
        queueMicrotask(()=> setStatsData(message.data));
    }
  }, [message]);


  return (
    <div className="stats   shadow">
      {statsData.map((m) => (
        <div key={m.id} className="stat ">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title text-yellow-400">{m.title}</div>
          <div className="stat-value">{m.value}</div>
          <div className="stat-desc">{m.description}</div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
