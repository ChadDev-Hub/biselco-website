"use client";
import Image from "next/image";
import { motion } from "framer-motion";

import { textTyping } from "@/app/utils/framerFunctions";
import AgmaCircleIcon from "@/app/agma-registration/components/agmacircle";
import { letterVariant } from "@/app/utils/framerFunctions";
import { fadeInUp } from "@/app/utils/framerFunctions";
import Link from 'next/link';
import CountDown from '../../../agma-registration/components/countDown';


type Props = {
  image_src: string;
  title: string;
  qoute_title: string;
  qoute_description: string;
  footer: string;
  abrev: Abrev[],
  end_date: number
};

type Abrev = {
  char: string;
  color: string;
}


const EventCard = ({abrev, image_src, title, qoute_title, qoute_description, footer, end_date }: Props) => {

  return (
    <motion.div
    initial="hidden"
    whileInView="visible"
    variants={fadeInUp}
     className="card image-full  relative overflow-hidden h-100 shadow-md w-full max-w-2xl">
      {/* 1. Optimized Title: Responsive font sizing and better z-index */}
        
      
      <motion.h2 
      variants={textTyping}
      className="absolute top-2 left-3 z-20 pr-12 
                 text-2xl sm:text-3xl lg:text-4xl 
                 font-extrabold wrap-break-word leading-tight text-black text-shadow-md text-shadow-white">
        {title.split("").map((char, index) => (
          <motion.span
           key={index}
           variants={letterVariant}>
            {char}
          </motion.span>
        ))}
      </motion.h2>
      {/* 2. Image: Standardized aspect ratio for consistency */}
      <figure className="w-full  relative aspect-square sm:aspect-auto md:aspect-auto">
        <Image
        loading="eager"
          src={image_src}
          alt={title}
          fill
          className="object-fill object-center h-fit w-full "
          sizes="(max-width: 768px) 100vw,  (max-width: 1200px) 50vw, 33vw"
        />
      </figure>

      {/* 3. The Badge (AGMA): Changed to use percentages or dynamic sizes */}

      
        <AgmaCircleIcon 
        abrev={abrev} 
        positionClass="
                      drop-shadow-black
                      absolute
                      drop-shadow-xl
                      z-30
                      right-[10%] top-[50%] /* Positioned to image/body split */
                      w-30 h-30
                      rounded-full 
                      flex flex-col justify-center items-center
                    "
         />
      
      {/* Card Body */}
      <div className="card-body flex flex-col bottom-0 p-0 w-full absolute  overflow-hidden bg-transparent">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 w-full h-[60%] preserve-3d"
          viewBox="0 0 853 291"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6">
                <animate attributeName="stop-color" values="#3b82f6; #06b6d4; #3b82f6" dur="6s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#f97316">
                <animate attributeName="stop-color" values="#f97316; #fb7185; #f97316" dur="6s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
          <path fill="url('#waveGradient')" d="M0.131531 42.3431C496.072 -120.432 458.322 253.602 852.905 42.3431V291H0.131531L0.131531 42.3431Z" ></path>
          <path className="fill-base-200/50" d="M0 56.6734C445.7 -6.9999 498.477 210 852.774 56.6734V131C852.774 131 0.230428 71.0163 4.66999e-05 130.976C3.90831e-05 105.306 0 56.6734 0 56.6734Z" >

          </path>
        </svg>
        <div className="group z-50 w-1/2 ml-2.5 mt-50  relative">
        <div className="absolute -bottom-12">
          <div className=" text-center ">
            {/* TITLE */}
            <motion.h1
            variants={textTyping}
             className="text-xl font-extrabold text-violet-500 text-shadow-md text-shadow-orange-300">
            {`"${qoute_title}`.split("").map((char, index) => (
              <motion.span key={index} variants={letterVariant}>
                {char}
              </motion.span>
            ))}
            </motion.h1>
            {/* DESCRIPTION */}
            <motion.h2
            variants={textTyping}
             className="text-md italic font-bold">{
            `${qoute_description}"`.split("").map((char, index) => (
              <motion.span key={index} variants={letterVariant}>
                {char}
              </motion.span>
            ))
            }</motion.h2>
          </div>

          {/* FOOTER */}
          <div className="z-100 text-center text-xs mt-2 italic w-full ">
            <motion.h1
            variants={textTyping}
            >
              {footer.split("").map((char, index)=>(
                <motion.span key={index} variants={letterVariant}>{char}</motion.span>
              ))}</motion.h1>
          </div>
        </div>
          

        </div>
        <div className="relative mt-12 px-6">
              <CountDown targetDate={end_date}/>
        </div>
        {/* QOUTE SECTION */}
        

        {/* 5. Actions: Using absolute/relative to stay on top of SVG */}
        <div className="card-actions justify-end items-end h-full p-4 relative z-40">
          
          <Link href="/agma-registration" type="button"  className="btn btn-primary drop-shadow-lg z-50 active:scale-105 btn-sm sm:btn-md shadow-lg">
            Register Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
