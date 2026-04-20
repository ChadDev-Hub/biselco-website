"use client"
import { useMotionValue, animate, useMotionValueEvent } from "framer-motion";
import React, { useState, useEffect } from "react"

type Props = {
    label: string;
    value: number;
    svg: React.ReactNode;
    description: string;
}

const StatsCard = ({ label, value, svg, description }: Props) => {
    const motionVaue = useMotionValue(0);
    const [count, setCount] = useState(0);

    useMotionValueEvent(motionVaue, "change", (latest: number) => {
        setCount(Math.round(latest));
    })

    useEffect(() => {
        const controls = animate(motionVaue, value, {
            duration: 2,
            ease: "easeInOut",
        });

        return () => controls.stop();
    },[value, motionVaue]);
    return (
        <div className="stat glass ">
            <div className="stat-figure text-secondary">
                {svg}
            </div>
            <div className="stat-title text-yellow-400">{label}</div>
            <div className="stat-value text-center">{count}</div>
            <div className="stat-desc">{description}</div>
        </div>
    )
}

export default StatsCard