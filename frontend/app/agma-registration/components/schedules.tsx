"use client"

import { useState, useEffect } from "react"
import { motion } from 'framer-motion';
type Props = {
    children: React.ReactNode[]
}

const Schedules = ({ children }: Props) => {
    const [current, setCurrent] = useState(0);
    const [stop, setStop] = useState(false);
    useEffect(()=>{
        if(stop) return
        const interval = setInterval(() => {
            setCurrent((prev) => (prev === children.length - 1 ? 0 : prev + 1));
          }, 3000);
          return () => clearInterval(interval);
    },[stop, children.length])
    const handleStop = () => setStop(true);
    const handleStart = () => setStop(false);
    return (
        <div className="z-10 w-full mt-0 sm:mt-0 md:mt-2 lg:mt-5 xl:mt-10 h-full  flex flex-col justify-start items-center">
            <div 
            onPointerDown={handleStop}
            onPointerUp={handleStart}
            className='carousel hover:cursor-grabbing w-full glass rounded-box  overflow-x-hidden'>
                {children.map((child, index) => (
                    <motion.div
                    style={{transform: `translateX(-${current * 100}%)`}}
                     id={`item${index.toString()}`} key={index} className="carousel-item transition duration-300 ease-in-out -z-10 w-full">
                        {child}
                    </motion.div>
                ))}
                
                
            </div>
            <div className="flex w-full z-auto justify-center gap-2 py-2">
                    {children.map((child, index) => (
                    <button key={index} onClick={() => setCurrent(index)} className={`btn ${current === index ? "btn-active" : ""} btn-xs drop-shadow-md drop-shadow-black`}>{index + 1}</button>
                ))}
                </div>
        </div>
    )
}

export default Schedules