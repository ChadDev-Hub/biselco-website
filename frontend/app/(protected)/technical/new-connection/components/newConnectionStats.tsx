"use client"

import StatsCard from "@/app/complaints/dashboard/components/statsCard";
import { use, useState, useEffect } from "react";
import { useWebsocket } from "@/app/utils/websocketprovider";
import {CopyPlus, CalendarDays, CirclePlus} from "lucide-react"
import StatsContainer from "@/app/common/Stats";
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
                    <CopyPlus  className="text-amber-500" />
                )
                break;
            case "Daily Total":
                return (
                    <CalendarDays className="text-emerald-500" />
                )
                break;
            case "Monthly":
                return (
                    <CirclePlus className="text-blue-500" />
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
        <StatsContainer className="shadow-md  w-full max-w-2xl bg-base-100 border-gray-100">
            {stats.map((stat, index) => (
                <StatsCard
                    key={index}
                    label={stat.label}
                    value={stat.value}
                    description={stat.description}
                    svg={svg(stat.label)} />
            ))}
        </StatsContainer>
    )
}

export default Stats;