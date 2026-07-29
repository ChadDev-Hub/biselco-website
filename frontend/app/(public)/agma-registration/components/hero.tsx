"use client"
import React from 'react'

const Hero = () => {
    const title = "ANNUAL GENERAL MEMBERSHIP ASSEMBLY (AGMA)"
  return (
    <div className='h-full w-full p-4 overflow-clip'>
        <h1 className='text-2xl sm:text-3xl md:text-4xl xl:text-5xl flex gap-2 lg:max-w-1/2 flex-wrap font-extrabold text-shadow-md shadow'>
            {title.split(" ").map((char,index)=>(
                <span key={index} className={`z-10 text-shadow-md text-black text-shadow-white`}>
                    {char}
                </span>
            ))}
        </h1>
    </div>
  )
}

export default Hero