"use client"
import React, { useState, useEffect } from 'react'
import { useWebsocket } from '@/app/utils/websocketprovider'
import NewsCard from './newscard'
type Props = {
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
    },
    news_images: string[]
}

const NewsDataContainer = ({ initialData }: { initialData: Props[] }) => {
    const [NewsData, setNewsData] = useState<Props[]>(initialData)
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
            {NewsData.map((n: Props) => (
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
                />
            ))}
        </section>
    )
}

export default NewsDataContainer