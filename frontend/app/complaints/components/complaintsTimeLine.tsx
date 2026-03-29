"use client"

import { switchClasses } from "@mui/material";
import TimeLineSvg from "./timeLineSvg";
type statusItem = {
    id: number;
    status_name: string;
    description: string;
}

type status = {
    id: number;
    name: string;
    description: string;
    date: string;
    time: string;

}
type Props = {
    data: statusItem[]
    status: status[];
}
const ComplaintsTimeLine = ({ data, status }: Props) => {
    const statuslist = status?.map((item) => item.name);
    const filterDate = (status_name: string) => {
        const filteredStatus = status?.filter((item) => item.name === status_name);
        return filteredStatus
    }
    const timeLineMiddelSvg = (status_name: string) => {
        
    }
    return (
        <ul className="timeline mt-6 timeline-snap-icon timeline-vertical ">
            {data.map((item) => (
                <li key={item.id}>
                    {item.id % 2 === 0 ? (
                        <div className={`timeline-end timeline-box   ${statuslist?.includes(item.status_name) ? "bg-base-100 drop-shadow-2xl" : "bg-base-100/10"}`}>
                            <h2 className={`text-md lg:text-lg text-shadow-2xs flex flex-col font-bold ${statuslist?.includes(item.status_name) ? "" : "text-gray-400/20"}`}>
                                {item.status_name}
                                {statuslist?.includes(item.status_name) && <span className="text-green-500 animate-pulse  text-[0.60rem] italic "> {filterDate(item?.status_name)?.[0]?.date} • {filterDate(item?.status_name)?.[0]?.time}</span>}
                            </h2>
                            <hr className={`${statuslist?.includes(item.status_name) ? "" : "bg-transparent"}`} />
                            <p className={`tex-sm lg:text-md italic ${statuslist?.includes(item.status_name) ? "" : "text-gray-400/20"}`}>
                                {item.description}
                            </p>
                        </div>
                    ) : (
                        <div className={`timeline-start timeline-box ${statuslist?.includes(item.status_name) ? "bg-base-100  drop-shadow-2xl" : "bg-base-100/10"}`}>
                            <h2 className={`text-md lg:text-lg text-shadow-2xs flex flex-col font-bold ${statuslist?.includes(item.status_name) ? "" : "text-gray-400/20"}`}>
                                {item.status_name}
                                {statuslist?.includes(item.status_name) && <span className="text-green-500 text-[0.60rem] italic animate-pulse "> {filterDate(item?.status_name)?.[0]?.date} • {filterDate(item?.status_name)?.[0]?.time}</span>}
                            </h2>
                            <hr className={`${statuslist?.includes(item.status_name) ? "" : "bg-transparent"}`} />
                            <p className={`tex-sm lg:text-md italic ${statuslist?.includes(item.status_name) ? "" : "text-gray-400/20"}`}>
                                {item.description}
                            </p>
                        </div>
                    )}
                    <div className="timeline-middle">
                        {<TimeLineSvg status_name={item.status_name} statuslist={statuslist} />}
                    </div>
                    <hr className={`${statuslist?.includes(item.status_name) ?
                        "bg-blue-500 animate-pulse" : "bg-gray-400"}`} />
                </li>

            ))}

        </ul>
    )
}

export default ComplaintsTimeLine;