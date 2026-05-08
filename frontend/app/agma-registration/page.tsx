import Hero from "./components/hero"
import SvgBackground from "./components/svgBackground"
import RegistrationForm from "./components/registrationForm"
import AgmaRegistrationFooter from "./components/footer"
import AgmaCircleIcon from "./components/agmacircle"
import Schedules from "./components/schedules"
import ScheduleCard from "./components/scheduleCard"

const Page = () => {
  const Agma = [{
    char: "A",
    color: "text-red-600"
  }, {
    char: "G",
    color: "text-blue-600"
  }, {
    char: "M",
    color: "text-green-600"
  }, {
    char: "A",
    color: "text-yellow-600"
  }]
  const AgmaSchedules = [
    {
      area: "Municipality of Busuanga",
      date: "JUNE 16, 2023",
      time: "9:00 AM",
      location: "Salvacion Gymnasium, Busuanga Palawan",
      image: "/busuanga.jpg"
    },
    {
      area: "Municipality of Coron",
      date: "JUNE 17, 2023",
      time: "9:00 AM",
      location: "Biselco Main Office, Coron Palawan",
      image: "/coron.jpg"
    },
    {
      area: "Municipality of Culion",
      date: "JUNE 17, 2023",
      time: "9:00 AM",
      location: "Biselco Main Office, Culion Palawan",
      image: "/culion.jpg"
    },
    {
      area: "Municipality of Linapacan",
      date: "JUNE 17, 2023",
      time: "9:00 AM",
      location: "Biselco Main Office, Linapacan Palawan",
      image: "/linapacan.png"

    }
  ]
  return (
    <div className="w-full bg-linear-to-r from-blue-400 to-orange-500">
      {/* HERO SECTION */}
      <section className="bg-center shadow drop-shadow-md md:bg-center bg-cover bg-no-repeat max-h-50 lg:min-h-60 relative bg-[url(/agma_image.jpg)]">
        <Hero />

        <div className="absolute inset-0 bg-linear-to-r from-violet-500/45  to-transparent z-0">
        </div>

      </section>

      {/* BODY SECTION */}
      <section className="relative w-full h-full py-2 ">
        <AgmaCircleIcon abrev={Agma} positionClass="
              absolute
              drop-shadow-xl
              drop-shadow-black
              z-30
              right-[10%] -top-[4%] lg:-top[10%] xl:-top-[10%] /* Positioned to image/body split */
              w-30 h-30 lg:w-35 lg:h-35 xl:w-40 xl:h-40
              rounded-full 
              flex flex-col justify-center items-center
            "/>
        <SvgBackground />
        <div className="w-full grid grid-cols-1 px-2 gap-2 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2">
          <RegistrationForm />
          <Schedules >
            {
              AgmaSchedules?.map((schedule, index) => (
                <div key={index} className="w-full h-full flex flex-col gap-2 justify-center items-center">
                  <ScheduleCard 
                  image_url={schedule.image} 
                  location={schedule.location} 
                  title={schedule.area} 
                  date={schedule.date} 
                  time={schedule.time} />
                </div>
              ))
            }

          </Schedules>
        </div>
      </section>

      {/* Footer */}
      <section className="h-full p-3 flex justify-center w-full">
        <AgmaRegistrationFooter />
      </section>

    </div>
  )
}

export default Page