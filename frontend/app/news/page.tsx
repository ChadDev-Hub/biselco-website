"use server"
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

const baseUrl = process.env.BASESERVERURL
const News = async() => {
  const token = (await cookies()).get("access_token")?.value;
  console.log(token)
    const res = await fetch(`${baseUrl}/news/`,{
      method: "GET",
      credentials: "include"
    })
    console.log(res)
    
  return (
    <div className='mt-20 border h-full'>
        hello world
    </div>
  )
}

export default News