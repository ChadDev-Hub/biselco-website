"use server"

import { redirect } from "next/navigation";
import { getNewsPage } from "./services/api";
export default async function Home() {
  const res = await getNewsPage()
  if (res.error){
    redirect("/landing")
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen  w-full flex-col items-center justify-between">

        {
          res.news
        }
      </main>
    </div>
  );
}
