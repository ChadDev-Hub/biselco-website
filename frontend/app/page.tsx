import { getLandingPageData } from "./services/api";
import Hero from "./components/hero";
export default async function Home() {
  const landingPageData = await getLandingPageData()
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen  w-full max-w-6xl flex-col items-center justify-between py-32 lg:px-16 px-6 ">
       
          {
            <Hero
              subtitle={landingPageData.hero.subtitle}
              description={landingPageData.hero.description} />
          }
       
      </main>
    </div>
  );
}
