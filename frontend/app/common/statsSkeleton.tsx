
"use client"

import React from 'react'
type Props = {
    numberofStats: number
}
const StatsSkeleton = ({numberofStats}:Props) => {
    const arrayOfStats = Array.from({ length: numberofStats }, (_, index) => index);
    return (
        <>
            {arrayOfStats.map((stat) =>
            <div key={stat} className='skeleton gap-1 bg-base-100 h-fit w-full stat group'>
                <div className='skeleton  h-6 w-6  stat-figure'></div>
                <div className='skeleton  h-2 w-12 stat-title'>
                </div>
                <div className='skeleton stat-value w-8 h-8'>
                </div>
                <div className='skeleton h-2 stat-desc'>
                </div>
            </div>)}
        </>
    )
}

export default StatsSkeleton;