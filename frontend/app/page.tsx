"use server"

import { redirect } from "next/navigation";
import { getNewsPage } from "./services/serverapi";
import NewsDataContainer from "./components/NewsFeed/NewsDataContainer";
import NewsNavBar from "./components/common/newsNavBar";



export default async function Home() {
  const res = await getNewsPage()
  if (res.error) {
    redirect("/landing")
  }
  return (
    <div className="flex min-h-screen items-start w-full justify-center bg-zinc-50 font-sans  bg-linear-to-bl from-blue-600 to-yellow-600">
      <main className="
      container
      max-w-190
      px-3
      flex 
      gap-4 
      flex-col 
      lg:items-center 
      mt-20 
      sm:mt-20 
      md:mt-20
      lg:mt-20 
      pb-21">
        <header className="flex flex-col items-center">
          <h1 className="text-[clamp(2rem,6vw,4rem)] text-shadow-2xs  tracking-tight font-extrabold flex gap-4">
            <span className="text-blue-700">
              NEWS
            </span>
            <span className="text-yellow-300">
              UPDATE</span>
          </h1>
        </header>
        <NewsNavBar />
        <NewsDataContainer initialData={res} />
      </main>
    </div>
  );
}
