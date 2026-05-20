import Image from "next/image";

const LandingPageLoadingImage = () => {
  return (
    <div className="rounded-full  relative">
        <div className="border-4 rounded-full w-[102%] h-[102%] -top-1.5 -left-0.4 animate-spin absolute border-x-amber-200 border-y-blue-700">
        </div>
        <Image
        src="/biselco-icon.png"
        alt = "biselco-icon"
        width={80}
        height={80}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover p-0.5 object-center w-auto h-auto"
        />
    </div>
  )
}

export default LandingPageLoadingImage;