"use client"
import React from 'react'
import { Limelight } from 'next/font/google'

const limelight = Limelight({ weight: '400', subsets: ['latin'], variable: '--font-fascinate' , display: 'swap'})

const ComplaintDashBoardHeader = () => {
  return (
    <h1 className={`${limelight.className} font-extrabold flex justify-center  items-end gap-2 text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl w-full text-center  text-white text-shadow-md`}>
      <span>Serbisyo</span>
      <div>
        <span className='text-red-500 text-6xl'>2</span><span className='text-yellow-500 text-6xl'>4</span>
      </div>
    </h1>
  )
}

export default ComplaintDashBoardHeader