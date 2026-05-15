"use client";
import { use, useEffect, useState } from "react"
import { useWebsocket } from "@/app/utils/websocketprovider";
import StatsCard from "@/app/complaints/dashboard/components/statsCard";
import {CopyPlus, CalendarDays, CirclePlus} from "lucide-react"
type stats = {
  label: string;
  value: number;
  description: string;
}

type PromiseType = {
  status: number;
  data: {
    data: number;
    stats: stats[];
    total_page: number;
  };
}


type Props = {
  data: Promise<PromiseType>;
};

const Stats = ({ data }: Props) => {
  const stats = use(data);
  const [statistics, setStatistics] = useState<stats[]>([]);
  const { message } = useWebsocket();
  useEffect(() => {
    switch (stats?.status) {
      case 200:
        queueMicrotask(() => {
          setStatistics(stats.data.stats);
        });
        break;
      default:
        break;
    }
  }, [stats])

  useEffect(() => {
    switch (message?.detail) {
      case "post_change_meter":
        queueMicrotask(() => {
          setStatistics(message.data.change_meter_stats);
        });

        break;

      default:
        break;
    }
  })
  const svg = (label: string) => {
    switch (label) {
      case "Total":
        return (
          <CopyPlus className="text-amber-500" />
        )
  
      case "Daily":
        return (
          <CalendarDays className="text-emerald-500" />
        )
      case "Monthly":
        return (
          <CirclePlus className="text-blue-500" />
        )
      default:
        break;
    }
  }
 
  return (

    <div className="stats max-w-2xl shadow-md w-full bg-base-100 border border-gray-100 rounded-box ">
      {statistics.map((stat, index) => (
        <StatsCard
          key={index}
          label={stat.label}
          value={stat.value}
          description={stat.description}
          svg={svg(stat.label)}
        />
      ))}
    </div>
  )
}
export default Stats;