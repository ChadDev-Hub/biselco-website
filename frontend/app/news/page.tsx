"use server"
import { cookies } from 'next/headers'
import React from 'react'
import { redirect } from 'next/navigation'
import { refreshToken } from '../services/api'
const baseUrl = process.env.BASESERVERURL
const News = async() => {
  const token = (await cookies()).get("access_token")?.value;
  console.log(token)
  if (!token){
    redirect("/")
  }
  const res = await fetch(`${baseUrl}/news/`,{
    headers:{
      "Authorization": `Bearer ${token}`
    }
  })
  if (res.status === 401){
    const refreshResult = await refreshToken()
    redirect("/")
  }
  return (
    <div className='mt-20 border h-full'>
        HELLOW WORLD
    </div>
  )
}

export default News