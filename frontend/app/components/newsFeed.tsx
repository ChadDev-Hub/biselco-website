"use server"
import React from 'react'
import { getNewsPage } from '@/lib/serverFetch'
import NewsDataContainer from './NewsDataContainer'
import { redirect } from 'next/navigation'

const NewsFeed = async() => {
    const news = await getNewsPage();
    if(news.status === 401) {
      redirect("/landing")
    }
  return (
    <NewsDataContainer initialData={news} />
  )
}

export default NewsFeed