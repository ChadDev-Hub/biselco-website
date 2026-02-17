"use server"
interface Props {
    subtitle: string;
    description: string;
}
import Image from "next/image";
import LoginModal from "../auth-component/loginmodal";
import SignupModal from "../auth-component/signupmodal";


export default async function  Hero({ subtitle, description }: Props) {
    const baseUrl = process.env.BASESERVERURL
    return (
        <div className="
          grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2
          pt-25
          pb-4
          px-6 sm:px-0 md:px-60 lg:px-90
          bg-linear-to-b from-orange-700 to-gray-300
          gap-4
          ">
            <div className="flex flex-col gap-16 lg:items-start text-center sm:text-center md:text-start lg:text-start order-2 lg:order-1">
                <h1 className="text-2xl lg:text-5xl text-blue-700 font-bold text-shadow-lg">{subtitle}</h1>
                <p className="text-black text-base">{description}</p>
                <div className="
                flex justify-center sm:justify-center md:justify-end lg:justify-end
                 w-full gap-4">
                    <SignupModal/>
                    <LoginModal baseurl={baseUrl}/>
                </div>
            </div>
            <div className="flex justify-center rounded-full order-1 lg:order-2">
                <div className="hover-3d rounded-full">
                    <figure className="max-w-100 rounded-full">
                        <Image
                            fetchPriority="high"
                            loading="eager"
                            src="/biselco-icon.png"
                            alt="biselco-icon"
                            width={400}
                            height={400}
                        />
                    </figure>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>

            </div>
        </div>
    )
}