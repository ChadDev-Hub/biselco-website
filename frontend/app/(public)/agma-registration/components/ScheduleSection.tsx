"use client";
import { use, useMemo, useEffect } from "react";
import SchduleCard from "./scheduleCard";
import Schedules from "./schedules";
import { redirect } from "next/navigation";

type PromiseType<T> = {
  status: number;
  error?: string;
  data?: T;
};
type EventSchedules = {
  id: string | null;
  area: string;
  location: string | null;
  date: string | null;
  time: string | null;
  image: string | null;
};

type Props = {
  promise: Promise<PromiseType<EventSchedules[]>>;
};

const ScheduleSection = ({ promise }: Props) => {
  const initialData = use(promise);
  const schedulesData: EventSchedules[] = useMemo(() => {
    return initialData.data || [];
  }, [initialData.data]);
  useEffect(() => {
    if (initialData.status === 404) redirect("/");
  }, [initialData]);
  return (
    <>
      <Schedules>
        {schedulesData.map((schedule: EventSchedules, index) => (
          <div
            key={index}
            className="w-full flex flex-col  transition-all duration-200 text-black"
          >
            <SchduleCard
              key={schedule.id}
              title={schedule.area}
              date={schedule.date}
              time={schedule.time}
              location={schedule.location}
              image_url={schedule.image || ""}
            />
          </div>
        ))}
      </Schedules>
    </>
  );
};

export default ScheduleSection;
