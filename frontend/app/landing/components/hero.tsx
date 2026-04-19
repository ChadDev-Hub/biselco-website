"use client";

import { motion, useScroll, useTransform, MotionValue} from 'framer-motion';
import { useRef } from 'react';
import Image from "next/image";
// Simple animation variants
const fadeLeftSide = {
    hidden: { opacity: 0, x: -70 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const fadeRightSide = {
    hidden: { opacity: 0, x: 70 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const fadeinSide = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 2, x: 0, transition: { duration: 0.6 } }
};



interface Props {
    subtitle: string;
    description: string;
    children?: React.ReactNode
}


function useParallax(value: MotionValue<number>, distance: number) {
    return useTransform(value, [0, 1], [-distance, distance])
}


export default function Hero({ subtitle, description, children }: Props) {
    const scollRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: scollRef,
        offset: ["start end", "end start"],
    })
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const y = useParallax(scrollYProgress, isMobile ? 0 : 100);
    return (
        <div
            ref={scollRef}
            className="
          flex flex-col sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2
          pt-25
          pb-16
          px-6 sm:px-0 md:px-60 lg:px-60
          bg-linear-to-b from-orange-700 to-gray-300
          overflow-hidden
          ">
            <motion.div
                style={{ y }}
                initial="hidden"
                whileInView="visible"
                variants={fadeinSide}
                className='flex justify-center w-full'>
                <motion.h1
                initial={{ visibility: "hidden" }}
                animate={{ visibility: "visible" }}
                style={{ y }}
                className="text-2xl  lg:text-5xl text-center text-blue-700 font-bold text-shadow-lg">{subtitle}</motion.h1>
            </motion.div>

            <div className='grid  mt-10 grid-cols-1 sm:grid-cols-1 md:grid-cols-3'>
                <motion.div
                    style={{ y }}
                    initial="hidden"
                    whileInView="visible"
                    variants={fadeLeftSide}
                    className=" flex flex-col col-span-2 items-center gap-4 lg:items-start text-center sm:text-center md:text-start lg:text-start order-2 lg:order-1">
                    <div className="badge text-center sm:text-center md:text-start lg:text-start badge-primary badge-outline">Empowering Our Community</div>
                    <h1 className=" text-5xl whitespace-normal wrap-break-words md:text-5xl font-black mb-6s leading-tight">
                        Sustainable Energy for a <span className="text-primary italic">Brighter Tomorrow.</span>
                    </h1>
                    <p className="text-black text-base break-normal">{description}</p>
                    <div className="
                flex justify-center sm:justify-center md:justify-center lg:justify-start
                 w-full gap-4 ">
                        {children}
                    </div>


                </motion.div>

                <motion.div
                    style={{ y }}
                    className="w-80 h-80  rounded-full lg:hover-3d order-1 lg:order-2 justify-self-end"
                    initial="hidden"
                    whileInView="visible"
                    variants={fadeRightSide}

                >
                   
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


                    

                </motion.div>

            </div>



        </div>
    )
}