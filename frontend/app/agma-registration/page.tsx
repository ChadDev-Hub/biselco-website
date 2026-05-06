import Hero from "./components/hero"
import FranchiseArea from "./components/franchiseArea"
import SvgBackground from "./components/svgBackground"
import RegistrationForm from "./components/registrationForm"
const Page = () => {
  return (
    <div className="w-full ">
        {/* HERO SECTION */}
        <section className="bg-center shadow drop-shadow-md md:bg-center bg-cover bg-no-repeat max-h-50 lg:min-h-60 relative bg-[url(/agma_image.jpg)]">
        <Hero/>
            <div className="absolute inset-0 bg-linear-to-r from-violet-500/45  to-transparent z-0">
            </div>
        </section>
        <section className="relative w-full h-screen py-2 bg-linear-to-b from-blue-600 to-orange-400">
                <SvgBackground/>
                <FranchiseArea/>
                <div className="w-full grid grid-cols-1 px-2 lg:grid-cols-2 xl:grid-cols-2">
                    <RegistrationForm/>
                </div>
        </section>
    </div>
  )
}

export default Page