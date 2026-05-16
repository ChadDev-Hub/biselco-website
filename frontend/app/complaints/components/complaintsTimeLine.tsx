"use client"

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
    data.sort((a, b) => a.id - b.id);
    
    return (
        <ul className="timeline timeline-vertical bg-base-200 timeline-snap-icons">
            {data.map((item) => (

                <li key={item.id} data-tip={item.description} className="tooltip tooltip-xs tooltip-left cursor-pointer">
                    { item.id !== 1 && <hr className={`w-[0.2rem] ${statuslist?.includes(item.status_name) ?
                        "bg-blue-500  animate-pulse" : "bg-gray-400"}`} />}
                    {item.id % 2 === 0 ? (
                        <div className={`timeline-end ${statuslist?.includes(item.status_name) ? "  drop-shadow-2xl" :""}`}>
                            <h2 className={`text-xs text-shadow-2xs flex flex-col font-bold ${statuslist?.includes(item.status_name) ? "text-blue-500" : "text-gray-400/20"}`}>
                                {item.status_name}
                                {statuslist?.includes(item.status_name) && <span className="text-green-500 text-[0.50rem] italic animate-pulse "> {filterDate(item?.status_name)?.[0]?.date} • {filterDate(item?.status_name)?.[0]?.time}</span>}
                            </h2>
                            
                        </div>
                        
                    ) : (
                        <div  className={`timeline-start`}>
                            <h2 className={`text-xs  text-blue-500 text-shadow-2xs flex flex-col font-bold ${statuslist?.includes(item.status_name) ? "" : "text-gray-400/20"}`}>
                                {item.status_name}
                                {statuslist?.includes(item.status_name) && <span className="text-green-500  animate-pulse  text-[0.50rem] italic "> {filterDate(item?.status_name)?.[0]?.date} • {filterDate(item?.status_name)?.[0]?.time}</span>}
                            </h2>
                        </div>
                        
                    )}
                    <div className="timeline-middle text-xs">
                        {<TimeLineSvg status_name={item.status_name} statuslist={statuslist} />}
                    </div>
                    
                </li>

            ))}

        </ul>
    )
}

export default ComplaintsTimeLine;