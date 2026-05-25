"use client";

import { use, useEffect, useState } from "react";
import { useWebsocket } from "@/app/utils/websocketprovider";
import StatsCard from "./statsCard";
import { CalendarDays, CheckCircle2, LayersPlus } from "lucide-react";
import StatsContainer from "@/app/common/Stats";
type PromiseType = {
  status: number;
  data: ComplaintStatsType[];
};
type Props = {
  data: Promise<PromiseType>;
};
type ComplaintStatsType = {
  label: string;
  value: number;
  description: string;
};

const Stats = ({ data }: Props) => {
  const stats = use(data);
  const [statsData, setStatsData] = useState<ComplaintStatsType[]>([]);
  useEffect(() => {
    queueMicrotask(() => setStatsData(stats.data));
  }, [stats]);

  // WEBSOCKET
  const { message } = useWebsocket();
  useEffect(() => {
    switch (message?.detail) {
      case "new_status":
        queueMicrotask(() => setStatsData(message.complaints_stats));
        break;
      case "new_complaint":
        queueMicrotask(() => setStatsData(message.stats));
        break;
      default:
        break;
    }
  }, [message]);

  const SpecificSvg = (title: string) => {
    switch (title) {
      case "Daily Complaints":
        return <CalendarDays className="text-emerald-500" />;
      case "Completion":
        return <CheckCircle2 className="text-yellow-500" />;
      case "Total Complaints":
        return <LayersPlus className="text-blue-500" />;
      default:
        break;
    }
  };

  return (
    <StatsContainer className="stats stats-vertical sm:stats-vertical md:stats-horizontal max-w-2xl  overflow-x-auto shadow-md w-full bg-base-100 border border-gray-100 rounded-box ">
      {statsData.map((m, index) => (
        <StatsCard
          key={index}
          label={m.label}
          value={m.value}
          svg={SpecificSvg(m.label)}
          description={m.description}
        />
      ))}
    </StatsContainer>
  );
};

export default Stats;
