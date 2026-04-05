"use client"
import React from 'react'
import { Fascinate } from 'next/font/google'

const facinate = Fascinate({ weight: '400', subsets: ['latin'], variable: '--font-fascinate' , display: 'swap'})

const ComplaintDashBoardHeader = () => {
  return (
    <h1 className={`${facinate.className} flex justify-center items-end gap-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl w-full text-center text-shadow-2xs text-yellow-400`}>
      <span>Serbisyo</span>
      <div>
        <span className='text-red-500 text-6xl'>2</span><span className='text-blue-800 text-6xl'>4</span>
      </div>
    </h1>
  )
}

export default ComplaintDashBoardHeader