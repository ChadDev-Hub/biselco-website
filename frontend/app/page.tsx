"use server"

import { redirect } from "next/navigation";
import { getNewsPage } from "./services/serverapi";
import NewsCard from "./components/NewsFeed/newscard";
import NewsNavBar from "./components/newsNavBar";
import { div } from "framer-motion/client";

interface News {
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

export default async function Home() {
  const res = await getNewsPage()
  if (res.error) {
    redirect("/landing")
  }
  return (
    <div className="flex min-h-screen items-center w-full justify-center bg-zinc-50 font-sans  bg-linear-to-bl from-blue-600 to-yellow-600">
      <main className="
      flex 
      gap-4 
      flex-col 
      items-stretch 
      lg:items-center 
      mt-20 
      sm:mt-20 
      md:mt-20
      lg:mt-20 
      pb-20">
        <NewsNavBar />
        {res.map((n: News) => (
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
      </main>
    </div>
  );
}
