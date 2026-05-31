import Hero from "./components/hero";

import RegistrationForm from "./components/registrationForm";
import AgmaRegistrationFooter from "./components/footer";
import AgmaCircleIcon from "./components/agmacircle";

import Return from "../common/Return";
import {GetAgmaRegistrationSchedules} from "@/lib/serverFetch";
import ScheduleSection from "./components/ScheduleSection"
const Page = () => {
  const Agma = [
    {
      char: "A",
      color: "text-red-600",
    },
    {
      char: "G",
      color: "text-blue-600",
    },
    {
      char: "M",
      color: "text-green-600",
    },
    {
      char: "A",
      color: "text-yellow-600",
    },
  ];

  const AgmaSchedules = GetAgmaRegistrationSchedules();
  return (
    <article className="w-full min-h-screen bg-linear-to-br from-slate-100 via-indigo-950 to-slate-900 text-slate-100 antialiased pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-cover bg-center bg-no-repeat  flex flex-col justify-between bg-[url(/agma_image.jpg)] shadow-2xl">
        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0  bg-linear-to-r from-slate-200/45 via-indigo-950/50 to-transparent z-0" />

        {/* Top Navigation Row */}
        <div className="w-full backdrop-blur-md bg-slate-900/40 border-b border-white/5 z-10 px-4 py-2">
          <Return />
        </div>

        {/* Main Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Hero />
        </div>
      </section>

      {/* BODY SECTION */}
      <section className="relative w-full mx-auto  sm:px-6 lg:px-8 py-12 lg:py-16 ">
        <AgmaCircleIcon
          abrev={Agma}
          positionClass="
              absolute z-30 right-6 sm:right-12 -top-16 lg:-top-20
        w-28 h-28 lg:w-36 lg:h-36
        rounded-full flex flex-col justify-center items-center
        bg-slate-900/80 backdrop-blur-xl text-white
        border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.3)]
        transition-transform duration-300 hover:scale-105
            "
        />
        <div className="relative text-black z-10 flex flex-col  gap-4  sm:flex-col md:flex-col lg:flex-col xl:flex-row justify-center items-center  w-full max-w-7xl ">
          <RegistrationForm />
          <ScheduleSection promise={AgmaSchedules} />
        </div>
      </section>

      {/* Footer */}
      <section className="h-full flex justify-center w-full">
        <AgmaRegistrationFooter />
      </section>
    </article>
  );
};

export default Page;
