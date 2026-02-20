"use client"
import React, { useState, useEffect} from 'react'
import { useWebsocket } from '@/app/utils/websocketprovider'
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

type Props = {
    initialData: NewsData[];
}

const NewsDataContainer = ({ initialData }: Props) => {
    const [NewsData, setNewsData] = useState<NewsData[] | []>(initialData || []);
    const message = useWebsocket();
    useEffect(() => {
        if (!message) return
        if (message.detail === "news") {
            queueMicrotask(() => {
                setNewsData(prev => [message.data, ...prev]);
            });
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

export default NewsDataContainer