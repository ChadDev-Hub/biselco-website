"use client";

import { motion, } from "framer-motion";

import Image from "next/image";
import Sponsor from "./sponsor";
// Simple animation variants
const fadeLeftSide = {
  hidden: { opacity: 0, x: -70 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const fadeRightSide = {
  hidden: { opacity: 0, x: 70 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const fadeinSide = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 2, x: 0, transition: { duration: 0.6 } },
};

const textTyping = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.05,
    },
  },
};

const letterVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

interface Props {
  subtitle: string;
  description: string;
  children?: React.ReactNode;
}


export default function Hero({ subtitle, description, children }: Props) {
  const title = "Sustainable Energy for a";
  return (
    <div
      className="
          flex flex-col
          pt-25
          pb-16
          gap-4
          px-2 sm:px-2 md:px-12 lg:px-16 xl:px-60                                      
              bg-linear-to-b from-blue-300 to-orange-700 
          overflow-x-clip
          "
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={fadeinSide}
        className="flex justify-center w-full"
      >
        <motion.h1 className="text-2xl  sm:text-3xl md:text-4xl  lg:text-5xl text-center text-blue-700 font-bold text-shadow-lg">
          {subtitle}
        </motion.h1>
      </motion.div>

      <div className="grid gap-1   mt-10 grid-cols-1 sm:grid-cols-1 md:grid-cols-1  lg:grid-cols-2 ">
        <motion.div   
          initial="hidden"
          whileInView="visible"
          variants={fadeLeftSide}
          className="flex flex-col shrink-0 w-full items-center gap-2 lg:items-start  order-2 lg:order-1"
        >
          <div className="badge text-center sm:text-center md:text-end lg:text-start  badge-primary badge-outline">
            Empowering Our Community
          </div>
          <div className=" flex w-full flex-col gap-2">

            {/* TITLE */}
            <motion.h1
              variants={textTyping}
              className="text-4xl text-center sm:text-center md:text-center lg:text-start sm:text-3xl md:text-3xl lg:text-4xl whitespace-normal wrap-break-word font-black mb-6s leading-normal"
            >
              {title.split("").map((letter, index) => (
                <motion.span key={index} variants={letterVariant}>
                  {letter}
                </motion.span>
              ))}
            </motion.h1>

            {/* SUBTITLE */}
            <motion.h2
              variants={textTyping}
              className="text-primary font-extrabold italic text-center sm:text-center md:text-center lg:text-start text-4xl sm:text-3xl md:text-3xl lg:text-4xl whitespace-normal wrap-break-word"
            >
              {"Brighter Tomorrow".split("").map((letter, index) => (
                <motion.span key={index} variants={letterVariant}>
                  {letter}
                </motion.span>
              ))}
            </motion.h2>

            {/* DESCRIPTION */}
            <motion.p
            variants={textTyping} 
            className="text-black text-base break-normal text-center sm:text-center my-4 md:text-center lg:text-start wrap-break-word whitespace-normal">
              {description.split("").map((char, index)=> (
                <motion.span key={index} variants={letterVariant}>
                  {char}
                </motion.span>
              ))}
            </motion.p>
          </div>

          <div
            className="
                flex justify-center sm:justify-center md:justify-center lg:justify-start
                 w-full gap-4 wrap-break-word"
          >
            {children}
          </div>
        </motion.div>
        <motion.div className="order-1 flex flex-col justify-center items-center  gap-4 px-2 md:px-15 lg:px-20  lg:order-2">
          <motion.div

            className="rounded-full  lg:hover-3d "
            initial="hidden"
            whileInView="visible"
            variants={fadeRightSide}
          >
            <figure className="w-full rounded-full">
              <Image
                fetchPriority="high"
                loading="eager"
                src="/biselco-icon.png"
                alt="biselco-icon"
                width={200}
                height={200}
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

          <Sponsor />
        </motion.div>
      </div>
    </div>
  );
}
