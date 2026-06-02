"use client"
import  { use, useState, useEffect } from "react";
import StatsCard from "@/app/complaints/dashboard/components/statsCard";
import StatsContainer from "@/app/common/Stats";
import { Users, CalendarDays, BadgePercent, CalendarArrowUp } from "lucide-react";
import CustomIcon from "./customeIcon";
import { redirect } from 'next/navigation';
import { useWebsocket } from '@/app/utils/websocketprovider';

type Stat = {
  title: string;
  description: string;
  value: number;
  is_percentage: boolean;
};

type Props = {
  stats: Promise<PromiseType>;
};

type PromiseType = {
  status: number;
  data?: Stat[]
  error?: string
};

const StatsGrid = ({ stats }: Props) => {
  const statsData = use(stats);
  const { message } = useWebsocket();
  if(statsData.status === 403) redirect("/")
  const [statistics, setStatistics] = useState<Stat[]>([]);


  useEffect(()=>{
    const setInitialData = async () => {
      setStatistics(statsData.data || []);
    }
    setInitialData();
  },[statsData])


  useEffect(()=>{
    const newStats = async () => {
      if (message?.detail === "new_registered"){
        setStatistics(message.new_stats);
      }
    }
    newStats();
  },[message])

  const icon = (title: string) => {
    switch (title) {
      case "Total":
        return (
          <CustomIcon
            icon={{
              value: Users,
              color: "blue",
              rounded: true,
              bgColor: true,
            }}
          />
        );
      case "Percentage":
        return (
          <CustomIcon
            icon={{
              value: BadgePercent,
              color: "red",
              rounded: true,
              bgColor: true,
            }}
          />
        );
      case "Average":
        return (
          <CustomIcon
            icon={{
              value: CalendarArrowUp,
              color: "emerald",
              rounded: true,
              bgColor: true,
            }}
          />
        );
      case "Today":
        return (
          <CustomIcon
            icon={{
              value: CalendarDays,
              color: "yellow",
              rounded: true,
              bgColor: true,
            }}
          />
        )
    }
  };

  
  return (
    <StatsContainer>
      {Array.isArray(statistics) &&
        statistics.map((stat, index) => (
          <StatsCard
            key={index}
            description={stat.description}
            label={stat.title}
            value={stat.value}
            svg={icon(stat.title)}
            isPercentage={stat.is_percentage}
          />
        ))}
    </StatsContainer>
  );
};

export default StatsGrid;
