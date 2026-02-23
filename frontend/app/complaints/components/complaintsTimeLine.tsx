"use client"
import React from 'react'

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
    const filterDate = (status_name:string) => {
        const filteredStatus =  status?.filter((item) => item.name === status_name);
        return filteredStatus
    }
    return (
        <ul className="timeline mt-6 timeline-snap-icon timeline-vertical ">
            {data.map((item) => (
                <li key={item.id}>
                    {item.id % 2 === 0 ? (
                        <div className={`timeline-end timeline-box   ${statuslist?.includes(item.status_name) ? "bg-base-100 drop-shadow-2xl" : "bg-base-100/10"}`}>
                            <h2 className={`text-md lg:text-lg text-shadow-2xs font-bold ${statuslist?.includes(item.status_name) ? "" : "text-gray-400/20"}`}>
                                {item.status_name}
                                <span className="text-gray-400/45 text-[0.60rem] italic "> {filterDate(item?.status_name)?.[0]?.date} • {filterDate(item?.status_name)?.[0]?.time}</span>
                            </h2>
                            <hr className={`${statuslist?.includes(item.status_name) ? "" : "bg-transparent"}`}/>
                            <p className={`tex-sm lg:text-md italic ${statuslist?.includes(item.status_name) ? "" : "text-gray-400/20"}`}>
                                {item.description}
                            </p>
                        </div>
                    ) : (
                        <div className={`timeline-start timeline-box ${statuslist?.includes(item.status_name) ? "bg-base-100  drop-shadow-2xl" : "bg-base-100/10"}`}>
                            <h2 className={`text-md lg:text-lg text-shadow-2xs flex flex-col font-bold ${statuslist?.includes(item.status_name) ? "" : "text-gray-400/20"}`}>
                                {item.status_name}
                                <span className="text-gray-400/45 text-[0.60rem] italic "> {filterDate(item?.status_name)?.[0]?.date} • {filterDate(item?.status_name)?.[0]?.time}</span>
                            </h2>
                            <hr className={`${statuslist?.includes(item.status_name) ? "" : "bg-transparent"}`}/>
                            <p className={`tex-sm lg:text-md italic ${statuslist?.includes(item.status_name) ? "" : "text-gray-400/20"}`}>
                                {item.description}
                            </p>
                        </div>
                    )}
                    <div className="timeline-middle">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            className={`text-primary h-5 w-5 ${statuslist?.includes(item.status_name) ? "animate-pulse" : ""}`}
                        >
                            <path
                                fillRule="evenodd"
                                fill={statuslist?.includes(item.status_name) ? "yellow" : "grey"}
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <hr className={`${statuslist?.includes(item.status_name) ?
                        "bg-yellow-200 animate-pulse" : "bg-gray-400"}`} />
                </li>

            ))}

        </ul>
    )
}

export default ComplaintsTimeLine;