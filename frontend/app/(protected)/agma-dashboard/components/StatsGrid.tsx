import React, { use } from "react";
import StatsCard from "@/app/complaints/dashboard/components/statsCard";
import StatsContainer from "@/app/common/Stats";
import { Users, CalendarDays, BadgePercent, CalendarArrowUp } from "lucide-react";
import CustomIcon from "./customeIcon";
type Stat = {
  id: number;
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
  data: Stat[] | string;
};

const StatsGrid = ({ stats }: Props) => {
  const statsData = use(stats);
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
    <StatsContainer className="shadow w-full stats-vertical lg:stats-horizontal bg-base-100 border border-gray-100 rounded-box ">
      {Array.isArray(statsData.data) &&
        statsData.data.map((stat, index) => (
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
