"use client"
import React from 'react'
import { Fascinate } from 'next/font/google'

const facinate = Fascinate({weight: '400', subsets: ['latin'], variable: '--font-fascinate'})

const ComplaintDashBoardHeader = () => {
  return (
    <h1 className={`${facinate.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl w-full text-center text-shadow-2xs text-yellow-400`}>24 COMPLAINTS DASHBOARD HEADER</h1>
  )
}

export default ComplaintDashBoardHeader