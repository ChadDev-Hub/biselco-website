"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Luckiest_Guy } from "next/font/google";
type Props = {
  image_src: string;
  title: string;
  qoute_title: string;
  qoute_description: string;
  footer: string;
  abrev: Abrev[]
};

type Abrev = {
  char: string;
  color: string;
}

const font = Luckiest_Guy({ weight: "400", subsets: ["latin"] });



const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

const textTyping = {
  hidden: { },
  visible: {
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.05,
    },
    
  },
}

const letterVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};




const bouncingLetter = (i: number)=>{ 
return {
  hidden: { 
    y: 0 
  },
  animate: {
    y: [-10, 0],
    transition: {
      delay: 0.2 * i,
      duration: 0.4,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut" as const
    }
  }
}};

const EventCard = ({abrev, image_src, title, qoute_title, qoute_description, footer }: Props) => {
  const year = new Date().getFullYear();
  return (
    <motion.div
    initial="hidden"
    whileInView="visible"
    variants={fadeInUp}
     className="card card-md drop-shadow-2xl relative overflow-hidden h-100 shadow-xl w-screen md:w-md lg:w-lg xl:w-xl group">
      {/* 1. Optimized Title: Responsive font sizing and better z-index */}
      
      <motion.h2 
      variants={textTyping}
      initial="hidden"
      whileInView="visible"
      className="absolute top-2 left-3 z-20 pr-12 
                 text-2xl sm:text-3xl lg:text-4xl 
                 font-extrabold wrap-break-word leading-tight
                 [text-stroke:1px_white] [-webkit-text-stroke:1px_white] 
                 md:[text-stroke:2px_white] md:[-webkit-text-stroke:2px_white]">
        {title.split("").map((char, index) => (
          <motion.span
           key={index}
           variants={letterVariant}>
            {char}
          </motion.span>
        ))}
      </motion.h2>

      {/* 2. Image: Standardized aspect ratio for consistency */}
      <figure className="w-full aspect-square sm:aspect-video md:aspect-square">
        <Image
          src={image_src}
          alt={title}
          fill
          className="object-fill h-fit w-full"
        />
      </figure>

      {/* 3. The Badge (AGMA): Changed to use percentages or dynamic sizes */}

      <div className="
              absolute
              drop-shadow-2xl
              z-30
              right-[10%] top-[50%] /* Positioned to image/body split */
              w-30 h-30
              rounded-full 
              flex flex-col justify-center items-center
            ">
        <div className="absolute inset-0 rounded-full p-1 animate-spin bg-linear-to-tr from-amber-300 via-blue-600 to-amber-300">
          <div className="w-full h-full rounded-full bg-linear-to-r from-violet-400 to-blue-500"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center ">
          <motion.h1
          initial="hidden"
          whileInView="animate"
          variants={textTyping}
           className={`text-xl text-shadow-2xs sm:text-2xl lg:text-3xl flex gap-1 font-black ${font.className}`}>
            {abrev.map((item, index)=>(
              <motion.span className={`${item.color}`} variants={bouncingLetter(index)} key={index}>
                  {item.char}
              </motion.span>
            ))}
          </motion.h1>
          <span className={`text-black font-bold text-2xl lg:text-3xl [text-stroke:1px_white] [-webkit-text-stroke:1px_white] ${font.className} `}>{year}</span>

        </div>

      </div>
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
            initial="hidden"
            whileInView="visible"
             className="text-xl font-extrabold text-violet-500 text-shadow-md text-shadow-orange-300">
            {`"${qoute_title}`.split("").map((char, index) => (
              <motion.span key={index} variants={letterVariant}>
                {char}
              </motion.span>
            ))}
            </motion.h1>
            {/* DESCRIPTION */}
            <motion.h2
            initial="hidden"
            whileInView="visible"
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
            initial="hidden"
            whileInView="visible"
            variants={textTyping}
            >
              
              {footer.split("").map((char, index)=>(
                <motion.span key={index} variants={letterVariant}>{char}</motion.span>
              ))}</motion.h1>
          </div>

        </div>
          

        </div>
        {/* QOUTE SECTION */}
        

        {/* 5. Actions: Using absolute/relative to stay on top of SVG */}
        <div className="card-actions justify-end items-end h-full p-4 relative z-40">
          
          <button type="button" className="btn btn-primary drop-shadow-lg active:scale-105 btn-sm sm:btn-md shadow-lg">
          
            Register Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
