"use client";

import EventCard from "./agmaCard";
import { use } from "react";
import { usePathname } from "next/navigation";
import { AgmaEventType } from "@/types/events";
type PromiseType = {
  status: number;
  error?: string;
  data?: AgmaEventType;
};

type Props = {
  event: Promise<PromiseType>;
};

const Events = ({ event }: Props) => {
  const data = use(event);
  const pathname = usePathname();
  if (data.status === 404) return null;
  return (
    <>
      <h1
        className={`font-bold self-start w-full text-2xl ${pathname === "/" ? "block" : "hidden"}`}
      >
        Events
      </h1>
      <div className="w-full flex flex-col justify-center items-center  overflow-x-clip">
        <EventCard
          data={{...data.data}}
        />
      </div>
    </>
  );
};

export default Events;
