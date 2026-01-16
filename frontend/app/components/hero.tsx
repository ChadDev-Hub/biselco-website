"use client"
interface Props {
    subtitle: string;
    description: string;
}
import Image from "next/image";
import SignupButton from "./signupbutton";
export default function Hero({ subtitle, description }: Props) {
    return (
        <div className="
          grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2
          gap-4">
            <div className="flex flex-col gap-16 lg:items-start text-center sm:text-center md:text-start lg:text-start order-2 lg:order-1">
                <h1 className="text-2xl lg:text-4xl">{subtitle}</h1>
                <p>{description}</p>
                <div>
                    <SignupButton/>
                </div>
            </div>
            <div className="flex justify-center rounded-full order-1 lg:order-2">
                <div className="hover-3d rounded-full">
                    <figure className="max-w-100 rounded-full">
                        <Image
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