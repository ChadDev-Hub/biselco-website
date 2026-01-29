"use server"

import { redirect } from "next/navigation";
import { getNewsPage } from "./services/serverapi";
<<<<<<< HEAD
import NewsCard from "./components/newscard";
=======
import NewsCard from "./components/NewsFeed/newscard";
>>>>>>> c18c9ea4afe98a60fc56bb6b6a63110dd0735ee5
import NewsNavBar from "./components/newsNavBar";
export default async function Home() {
  const res = await getNewsPage()
  if (res.error){
    redirect("/landing")
  }
  return (
    <div className="flex min-h-screen items-center w-full  justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen gap-4 w-full flex-col items-stretch lg:items-center justify-between mt-20 pb-20">
          <NewsNavBar/>
            {res.map((n:any,)=>(
          <NewsCard
<<<<<<< HEAD
          
=======
>>>>>>> c18c9ea4afe98a60fc56bb6b6a63110dd0735ee5
          key={n.id}
          title={n.title}
          description={n.description}
          />
        ))}
          
      </main>
    </div>
  );
}
