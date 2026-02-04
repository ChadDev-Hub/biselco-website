"use server"

import { redirect } from "next/navigation";
import { getNewsPage } from "./services/serverapi";
import NewsDataContainer from "./components/NewsFeed/NewsDataContainer";
import NewsNavBar from "./components/newsNavBar";
import { div } from "framer-motion/client";



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
        <NewsDataContainer initialData={res}/>
      </main>
    </div>
  );
}
