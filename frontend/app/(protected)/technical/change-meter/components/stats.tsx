"use client";
import { use, useEffect, useState } from "react";
import { useWebsocket } from "@/app/context/websocketprovider";
import StatsCard from "@/app/(protected)/complaints/dashboard/components/statsCard";
import { CopyPlus, CalendarDays, CalendarFold, CalendarCheck } from "lucide-react";
import StatsContainer from "@/app/common/Stats";
import {ChangeMeterResponseLists} from '../../../../../types/change-meter';
import {Stats} from "@/types/stats";

type PromiseType = {
  status: number;
  data: ChangeMeterResponseLists
};

type Props = {
  data: Promise<PromiseType>;
};

const ChangeMeterStats = ({ data }: Props) => {
  const stats = use(data);
  const [statistics, setStatistics] = useState<Stats[]>([]);
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
  }, [stats]);

  useEffect(() => {
    switch (message?.detail) {
      case "post_change_meter":
        queueMicrotask(() => {
          setStatistics(message.data.change_meter_stats);
        });

        break;
      case "deleted_change_meter":
        queueMicrotask(() => {
          setStatistics(message.stats);
      })
      default:
        break;
    }
  },[message]);
  const svg = (label: string) => {
    switch (label) {
      case "Total":
        return <CopyPlus className="text-amber-500" />;

      case "Daily":
        return <CalendarDays className="text-emerald-500" />;
      case "Last Month":
        return <CalendarFold className="text-blue-500" />;

      case "Current Month":
        return <CalendarCheck className="text-purple-500" />;
      default:
        break;
    }
  };

  return (
    <StatsContainer className="max-w-2xl shadow-md w-full bg-base-100 border border-gray-100 rounded-box ">
      {statistics.map((stat, index) => (
        <StatsCard
          key={index}
          label={stat.name}
          value={stat.value}
          description={stat.description}
          svg={svg(stat.name)}
        />
      ))}
    </StatsContainer>
  );
};
export default ChangeMeterStats;
