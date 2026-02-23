"use server"
import React from 'react'
import { getNewsPage } from '@/lib/serverFetch'
import NewsDataContainer from './NewsDataContainer'

const NewsFeed = async() => {
    const news = await getNewsPage();
  return (
    <NewsDataContainer initialData={news} />
  )
}

export default NewsFeed