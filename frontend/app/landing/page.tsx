"use server"
import { getLandingPageData } from "../services/serverapi";
import Hero from "../components/hero";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const Landing = async() => {
  const cookie = (await cookies()).get("refresh_token")
  if (cookie){
    redirect("/")
  }
  const landingPageData = await getLandingPageData()
  return (
      <Hero
            subtitle={landingPageData.hero.subtitle}
            description={landingPageData.hero.description} />
  )
}

export default Landing