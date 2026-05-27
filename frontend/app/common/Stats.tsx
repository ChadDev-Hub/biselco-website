"use client"

import React from 'react'

type Props = {
    children: React.ReactNode;
    className?:string;
}

const StatsContainer = ({children, className}: Props) => {
  return (
    <div className={`stats ${className} shadow w-full stats-vertical lg:stats-horizontal bg-base-100 border border-gray-100 rounded-box `}>
        {children}
    </div>
  )
}
export default StatsContainer;