"use client"

import React from 'react'
import { useRouter } from 'next/navigation'


type Props = {
    svgfill:string;
    strokeColor:string;
    orientation:string;
}

const HomeRouteButton = ({strokeColor, svgfill, orientation}: Props) => {
    const router = useRouter()
    const handleClick = () => {
        router.push("/")
    }
    return (

        <button name='home' onClick={handleClick} type='button' className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${orientation} items-center`} data-tip="Homepage">
            {/* Home icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5"  stroke="currentColor">
            <path 
            d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
            stroke={strokeColor}
            fill={svgfill}
            ></path>
            <path 
            d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" 
            stroke={strokeColor}
            fill={svgfill}></path>
            
            </svg>
            <span className="is-drawer-close:hidden">Homepage</span>
        
        </button>

    )
}

export {HomeRouteButton}