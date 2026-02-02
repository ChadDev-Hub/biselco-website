"use server"

import { redirect } from "next/navigation";
import { getNewsPage } from "./services/serverapi";
import NewsCard from "./components/NewsFeed/newscard";
import NewsNavBar from "./components/newsNavBar";

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
    <div className="flex min-h-screen items-center w-full  justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen gap-4 w-full flex-col items-stretch lg:items-center justify-between mt-20 pb-20">
        <NewsNavBar />
        {res.map((n: News) => (
          <NewsCard
            key={n.id}
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
