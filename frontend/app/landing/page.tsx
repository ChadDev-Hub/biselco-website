"use server"
import { getLandingPageData } from "../services/api";
import Hero from "../components/hero";
const News = async() => {
  const landingPageData = await getLandingPageData()
  return (
    <Hero
            subtitle={landingPageData.hero.subtitle}
            description={landingPageData.hero.description} />
  )
}

export default News