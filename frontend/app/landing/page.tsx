"use server"
import { getLandingPageData } from "../../lib/serverFetch";
import Hero from "./components/hero";
import McoGoogleLogin from "../common/auth-component/mcoGoogleLogin";
import LandingStats from "./components/stats";
import VisionMission from "./components/visionMision";
import ServiceFeature from "./components/serviceFeature";
import Footer from "./components/footer";

const Landing = async () => {
  const landingPageData = await getLandingPageData()
  return (
    <div className="bg-base-100 text-base-content min-h-screen font-sans">
      <section>
        <Hero
          subtitle={landingPageData.hero.subtitle}
          description={landingPageData.hero.description}>
          <McoGoogleLogin />
        </Hero>
      </section>

      <section className="w-full bg-linear-to-b from-gray-300 to-blue-200">
        <LandingStats />
      </section>

      {/* VISION AND MISSION SECTION */}
      <section className="py-5 w-full bg-center bg-blend-overlay bg-cover  h-full bg-[url(/biselco_building.jpeg)] bg-no-repeat">
        <VisionMission />
      </section>

      {/* SERVICES AND FEATURES */}
      <section className="w-full px-5 py-10 sm:py-10 md:py-15 lg:py-25 bg-center bg-cover bg-[url(/services.jpg)] bg-no-repeat">
        <ServiceFeature />
      </section>

    <section>
      <Footer />
    </section>
      
    </div>



  )
}

export default Landing