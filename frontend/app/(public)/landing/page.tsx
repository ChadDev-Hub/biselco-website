import { GetAgmaEvents } from "../../../lib/serverFetch";
import Hero from "./components/hero";
import McoGoogleLogin from "../../common/auth-component/mcoGoogleLogin";
import LandingStats from "./components/stats";
import VisionMission from "./components/visionMision";
import ServiceFeature from "./components/serviceFeature";
import Footer from "./components/footer";
import Events from "./components/agmaeventContainer";
import AnimatedSection from "./components/AnimatedSection";
import ScrollToTopButton from "./components/ScrollToTopButton";
import AnimatedBackground from "./components/AnimatedBackground";
import EventsLoadingFallback from "./components/EventsLoadingFallback";
import { Suspense } from "react";
import Image from "next/image";

export default function Landing() {
  const AgmaEvents = GetAgmaEvents();

  return (
    <div className="bg-linear-to-b  from-base-100 via-blue-50 to-base-100 text-base-content min-h-screen font-sans overflow-x-hidden">
      <main className="w-full">
        {/* HERO SECTION */}
        <section className="w-full relative ">
          <Hero>
            <McoGoogleLogin />
          </Hero>
        </section>

        {/* STATS SECTION */}
        <AnimatedSection className="w-full py-8 px-4 md:py-16 bg-linear-to-b from-blue-200 to-blue-50">
          <LandingStats />
        </AnimatedSection>

        {/* VISION AND MISSION SECTION */}
        <AnimatedSection className="py-12 px-4 md:py-20 w-full place-items-center  bg-linear-to-t from-blue-100 to-blue-50 relative overflow-hidden ">
          <AnimatedBackground variant="subtle" />
          <div className="grid grid-cols-1  md:grid-cols-2 gap-2 w-full max-w-7xl  items-stretch ">
            <div className="absolute md:relative z-10 w-full max-w-2xl  inset-0 ">
              <Image
                loading="eager"
                src="/lineworker.jpg"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt="lineworker"
                className="relative mask-radial-from-60%   mask-radial-at-center mask-radial-to-70%"
              />
            </div>

            <div className="relative z-10  w-full self-stretch ">
              <VisionMission />
            </div>
          </div>
        </AnimatedSection>

        {/* SERVICES AND FEATURES SECTION */}
        <AnimatedSection className="w-full py-12 px-4 md:py-20 bg-conic-180 from-blue-100 via-blue-100 to-blue-100">
          <ServiceFeature />
        </AnimatedSection>

        {/* EVENTS SECTION */}
        <AnimatedSection className="relative py-12 px-4 bg-linear-to-t from-blue-300 to-blue-100">
          <AnimatedBackground variant="animated" />

          <div className="relative z-10 w-full ">
            <Suspense fallback={<EventsLoadingFallback />}>
              <Events event={AgmaEvents} />
            </Suspense>
          </div>
        </AnimatedSection>

        {/* FOOTER SECTION */}
        <section className="w-full">
          <Footer />
        </section>
      </main>

      {/* SCROLL TO TOP BUTTON */}
      <ScrollToTopButton />
    </div>
  );
}
