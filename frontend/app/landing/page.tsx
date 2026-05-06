"use server";
import { getLandingPageData } from "../../lib/serverFetch";
import Hero from "./components/hero";
import McoGoogleLogin from "../common/auth-component/mcoGoogleLogin";
import LandingStats from "./components/stats";
import VisionMission from "./components/visionMision";
import ServiceFeature from "./components/serviceFeature";
import Footer from "./components/footer";
import Events from "./components/events";
const Landing = async () => {
  const landingPageData = await getLandingPageData();
  return (
    <div className="bg-base-100  text-base-content min-h-screen font-sans">
      <main className="w-full">
        <section className="w-full">
          <Hero
            subtitle={landingPageData.hero.subtitle}
            description={landingPageData.hero.description}
          >
            <McoGoogleLogin />
          </Hero>
        </section>

        <section className="w-full  bg-linear-to-b from-gray-300 to-blue-200">
          <LandingStats />
        </section>

        {/* VISION AND MISSION SECTION */}
        <section className="py-4 w-full  bg-center bg-blend-overlay bg-cover  h-full bg-[url(/biselco_building.jpeg)] bg-no-repeat">
          <VisionMission />
        </section>

        {/* SERVICES AND FEATURES */}
        <section className="w-full  py-4  bg-center bg-cover bg-[url(/services.jpg)] bg-no-repeat">
          <ServiceFeature />
        </section>
        {/* EVent */}
        <section className="w-full relative h-full bg-linear-to-b from-gray-300 to-blue-200  py-4 flex flex-col justify-center items-center">
          <Events />
        </section>
        <section className="w-full">
          <Footer />
        </section>

      </main>

    </div>
  );
};

export default Landing;
