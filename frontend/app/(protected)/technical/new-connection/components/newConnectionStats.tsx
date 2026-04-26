"use client"

import StatsCard from "@/app/complaints/dashboard/components/statsCard";
import { use, useState, useEffect } from "react";
import { useWebsocket } from "@/app/utils/websocketprovider";
type PromiseType = {
    status: number;
    data: StatsType[];
}

type Props = {
    data: Promise<PromiseType>
}

type StatsType = {
    label: string
    value: number;
    description: string;
}
const Stats = ({ data }: Props) => {
    // INITIAL DATA FETCHING
    const statsData = use(data);
    const [stats, setStats] = useState<StatsType[]>([])

    useEffect(() => {
        if (statsData.data) {
            queueMicrotask(() => {
                setStats(statsData.data)
            })

        }
    }, [statsData])

    // svg
    const svg = (label: string) => {
        switch (label) {
            case "Total":
                return (
                    <svg
                        fill="currentColor"
                        height={30}
                        width={30}
                        version="1.1"
                        d="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 492.308 492.308"
                        xmlSpace="preserve">
                        <g
                            id="SVGRepo_bgCarrier"
                        >
                        </g>
                        <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                        </g>
                        <g id="SVGRepo_iconCarrier">
                            <g>
                                <g>
                                    <polygon
                                        points="201.519,290.813 201.519,191.659 181.827,191.659 181.827,290.813 82.673,290.813 82.673,310.505 181.827,310.505 181.827,409.649 201.519,409.649 201.519,310.505 300.673,310.505 300.673,290.813 ">
                                    </polygon>
                                </g>
                            </g>
                            <g>
                                <g>
                                    <path
                                        d="M109.077,0.053v108.971H0v383.231h383.346V383.293h108.962V0.053H109.077z M363.654,383.293v89.269H19.692V128.716h89.385 h254.577V383.293z M472.615,363.601h-89.269V109.024H128.769V19.745h343.846V363.601z">
                                    </path>
                                </g>
                            </g>
                        </g>
                    </svg>
                )
                break;
            case "Daily Total":
                return (
                    <svg
                        height={30}
                        width={30}
                        version="1.1"
                        id="_x32_"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 512 512"
                        xmlSpace="preserve"
                        fill="currentColor">
                        <g
                            id="SVGRepo_bgCarrier"
                        >
                        </g>
                        <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                        </g>
                        <g
                            id="SVGRepo_iconCarrier">
                            <g>
                                <path d="M260.847,51.057C210.844,88.23,92.606,195.549,3.954,195.549c-5.836,0-3.486,4.232-3.486,4.232l77.458,32.376 l-47.118,46.646v77.175l251.153,104.964L512,233.189v-77.168L260.847,51.057z M68.485,204.425 c26.6-9.94,53.389-24.653,79.054-41.188c6.421-4.135,12.738-8.416,18.994-12.73c1.375-0.951,2.741-1.886,4.103-2.846 c6.063-4.232,12.036-8.506,17.889-12.802c0.681-0.499,1.335-0.991,2.016-1.491c5.68-4.192,11.234-8.377,16.676-12.528 c0.734-0.565,1.467-1.113,2.193-1.677c6.01-4.612,11.843-9.142,17.502-13.592l204.576,85.503 c-53.933,41.067-123.229,87.479-176.38,87.479c-3.797,0-7.498-0.25-11.012-0.75l-127.332-53.208l-21.933-9.158L68.485,204.425z M99.885,241.315L238.04,299.07c5.55,0.976,11.23,1.443,17.067,1.443c55.598,0,122.83-42.211,177.573-82.842L275.596,373.182 L58.384,282.415L99.885,241.315z M490.04,224.031L276.906,435.033l-224.138-93.67v-18.252l225.561,94.258L490.04,207.771V224.031z M490.04,194.783L276.209,406.486l-223.44-93.372v-19.445l225.71,94.323L490.04,178.546V194.783z">
                                </path>
                                <path
                                    d="M209.417,233.947c0.802,0.395,1.878,0.274,2.689-0.314l20.4-9.158c2.326-1.04,4.539-2.33,6.602-3.813 l65.672-47.532c0.806-0.589,0.81-1.242,0.008-1.644l-14.983-7.433c-0.939-0.468-2.012-0.678-3.217-0.612l-26.29,0.418 c-1.201,0.057-2.007,0.314-2.818,0.903l-16.7,12.085c-1.076,0.782-0.677,1.298,0.661,1.314l24.415-0.04l0.262,0.129l-46.065,33.344 l-26.68,12.746c-0.81,0.58-0.81,1.241-0.008,1.636L209.417,233.947z">
                                </path>
                            </g>
                        </g>
                    </svg>
                )
                break;

            case "Monthly Avg.":
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                )

                break;
            default:
                break;
        }
    }

    //  WEBSOCKET
    const { message } = useWebsocket()
    // EFFECT WHEN NEW WEBSOCKET ARRIVES
    useEffect(() => {
        switch (message?.detail) {
            case "new_connection_created":
                queueMicrotask(() => {
                    setStats(message.data.new_connection_stats)
                })
                break;
            default:
                break;
        }
    }, [message])
    return (
        <div className="stats shadow w-full">
            {stats.map((stat, index) => (
                <StatsCard
                    key={index}
                    label={stat.label}
                    value={stat.value}
                    description={stat.description}
                    svg={svg(stat.label)} />
            ))}
        </div>
    )
}

export default Stats;