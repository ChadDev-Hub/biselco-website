"use client"

import React from 'react'

type Props = {
    children: React.ReactNode;
    className?:string;
}

const StatsContainer = ({children, className}: Props) => {
  return (
    <div className={`stats ${className}`}>
        {children}
    </div>
  )
}
export default StatsContainer;