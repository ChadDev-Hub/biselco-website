import { getLandingPageData } from "./services/api";
import Hero from "./components/hero";
export default async function Home() {
  const landingPageData = await getLandingPageData()
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen  w-full flex-col items-center justify-between">
       
          {
            <Hero
              subtitle={landingPageData.hero.subtitle}
              description={landingPageData.hero.description} />
          }
      </main>
    </div>
  );
}
