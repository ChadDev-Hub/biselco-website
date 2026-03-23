
"use client"

import React from 'react'
type Props = {
    numberofStats: number
}
const StatsSkeleton = ({numberofStats}:Props) => {
    const arrayOfStats = Array.from({ length: numberofStats }, (_, index) => index);
    return (
        <div className='p-4 gap-2 h-full  stats'>
            {arrayOfStats.map((stat) =>
            <div key={stat} className='skeleton gap-2 glass h-fit w-full stat'>
                <div className='skeleton  h-10 w-10 glass stat-figure'></div>
                <div className='skeleton glass h-5 w-20 stat-title'>
                </div>
                <div className='skeleton glass stat-value w-12 h-12'>
                </div>
                <div className='skeleton h-2 glass stat-desc'>
                </div>
            </div>)}
        </div>
    )
}

export default StatsSkeleton;