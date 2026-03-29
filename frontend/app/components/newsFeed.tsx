"use client"
import React, { useState, useEffect, use } from 'react'
import { useWebsocket } from '@/app/utils/websocketprovider'
import { redirect } from 'next/navigation'
import NewsCard from './newscard'
type NewsData = {
    id: number
    title: string;
    date_posted: string;
    description: string;
    time_posted: string;
    period: string;
    user: {
        id: number;
        user_name: string;
        last_name: string;
        first_name: string;
        photo: string;
    },
    news_images: string[]
}



type PromiseType = {
    status?: number;
    data: NewsData[] | [];
}

type Props = {
    initialData: Promise<PromiseType>;
}

const NewsFeedContainer = ({ initialData }: Props) => {
    const NewsInitialData = use(initialData);
    const [NewsData, setNewsData] = useState<NewsData[] | []>(()=>{
        if (NewsInitialData.status === 404 || NewsInitialData.status === 401) {
            redirect("/landing")
        }
        return NewsInitialData.data
    });

    const {message} = useWebsocket();

    useEffect(() => {
        if (!message) return
        switch (message.detail) {
            case "news":
                queueMicrotask(()=>{
                    setNewsData((prev)=>{
                        const existing_news = prev.filter((news) => news.id !== message.data.id);
                        return [message.data, ...existing_news];
                    })
                })
                break;
            case "deleted_news":
                queueMicrotask(() =>
                    setNewsData((prev)=>
                        prev.filter((news) => news.id !== message.data.id)
                    )
                )
                break;
            default:
                break;
        }
    }, [message])
    
    return (
        <section className='flex flex-col gap-4 w-full items-center'>
            {NewsData.map((n: NewsData) => (
                <NewsCard
                    key={n.id}
                    postId={n.id}
                    title={n.title}
                    description={n.description}
                    date_posted={n.date_posted}
                    time_posted={n.time_posted}
                    user_name={n.user.user_name}
                    last_name={n.user.last_name}
                    first_name={n.user.first_name}
                    period={n.period}
                    photo={n.user.photo}
                />
            ))}
        </section>
    )
}

export default NewsFeedContainer;