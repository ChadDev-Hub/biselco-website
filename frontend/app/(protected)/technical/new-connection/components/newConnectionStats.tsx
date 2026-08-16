"use client";

import StatsCard from "@/app/(protected)/complaints/dashboard/components/statsCard";
import { use, useState, useEffect } from "react";
import { useWebsocket } from "@/app/context/websocketprovider";
import { CopyPlus, CalendarDays, CalendarFold, CalendarCheck} from "lucide-react";
import StatsContainer from "@/app/common/Stats";
import { Stats } from "@/types/stats";

type PromiseType = {
  status: number;
  data: {
    stats: Stats[];
  };
};

type Props = {
  data: Promise<PromiseType>;
};

const NewConnectionStats = ({ data }: Props) => {
  // INITIAL DATA FETCHING
  const statsData = use(data);
  const [stats, setStats] = useState<Stats[]>([]);

  useEffect(() => {
    if (statsData.data) {
      queueMicrotask(() => {
        setStats(statsData.data.stats);
      });
    }
  }, [statsData]);

  // svg
  const svg = (label: string) => {
    switch (label) {
      case "Total":
        return <CopyPlus className="text-amber-500" />;

      case "Daily Total":
        return <CalendarDays className="text-emerald-500" />;

      case "Last Month":
        return <CalendarFold className="text-blue-500" />;
        case "Current Month":
        return <CalendarCheck className="text-purple-500" />;
      default:
        break;
    }
  };

  //  WEBSOCKET
  const { message } = useWebsocket();
  // EFFECT WHEN NEW WEBSOCKET ARRIVES
  useEffect(() => {
    switch (message?.detail) {
      case "new_connection_created":
        queueMicrotask(() => {
          setStats(message.data.new_connection_stats);
        });
        break;
      case "new_connection_deleted":
        queueMicrotask(() => {
          setStats(message.stats);
        });
        break;
      default:
        break;
    }
  }, [message]);
  console.log(stats)
  return (
    <StatsContainer className="shadow-md  w-full max-w-2xl bg-base-100 border-gray-100">
      {stats.map((stat, index) => (
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

export default NewConnectionStats;
