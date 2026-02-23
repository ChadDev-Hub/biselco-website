"use client"
import React from 'react'
import { Fascinate } from 'next/font/google'
const fascinate = Fascinate({weight: '400',
     subsets: ['latin'],
    variable: '--font-fascinate'},
    )
const AdminLoginHeader = () => {
  return (
    <div className='w-full'>
        <h1 className={`${fascinate.className} 
        text-2xl 
        sm:text-3xl 
        md:text-4xl 
        lg:text-5xl 
        w-full 
        text-center 
        text-shadow-2xs
        text-yellow-400
        `}>LOG IN AS ADMINISTRATOR</h1>
    </div>
  )
}

export default AdminLoginHeader;