"use client";

import EventCard from "./agmaCard";
import {use} from "react"
type PromiseType = {
  status : number,
  data : Data
};
type Data = {
  id: number;
  title: string;
  description: string;
  date_end: number;
  qoute_title: string;
  qoute_description: string;
  footer: string;
  image_src: string;
  abrevation: { char: string; color: string }[];
}
type Props = {
  event: Promise<PromiseType>;
};

const Events = ({ event }: Props) => {
    const data = use(event)
    if(data.status ===404) return null
  return (
    <div className="w-full flex flex-col justify-center items-center px-2 sm:px-2 md:px-20 lg:px-28 xl:px-64 overflow-x-clip">
      <EventCard
        footer={data.data.footer}
        image_src={data.data.image_src}
        title={data.data.description}
        qoute_title={data.data.qoute_title}
        qoute_description={data.data.qoute_description}
        abrev={data.data.abrevation}
        end_date={data.data.date_end}
      />
    </div>
  );
};

export default Events;
