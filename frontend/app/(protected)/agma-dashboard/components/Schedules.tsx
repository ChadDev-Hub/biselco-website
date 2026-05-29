"use client"

import { use, useState } from "react";

type PromiseType<T> = {
    status: number;
    error?: string;
    data?: T
}
type EventSchedules= {
    id:string;
    area: string;
    event_location: string;
    event_date:string;
}
type Props = {
    promiseData: Promise<PromiseType<EventSchedules[]>>
}

const Schedules = ({promiseData}:Props) => {
    const initialData = use(promiseData)
    const [schedules, setSchedules] = useState<EventSchedules[]>(()=>{
        return initialData.data || []
    })
    console.log(schedules)
  return (
    <div>Schedules</div>
  )
}

export default Schedules