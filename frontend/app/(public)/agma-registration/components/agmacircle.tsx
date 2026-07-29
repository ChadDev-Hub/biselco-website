"use client"

import { motion } from "framer-motion"
import { bouncingLetter } from "@/app/utils/framerFunctions"
import { textTyping } from "@/app/utils/framerFunctions"
import { Luckiest_Guy } from "next/font/google"

const font = Luckiest_Guy({ weight: "400", subsets: ["latin"] });
type Props = {
    abrev: {char: string, color: string}[];
    positionClass: string
}

const AgmaCircleIcon = ({abrev, positionClass}: Props) => {
    const year = new Date().getFullYear();
  return (
    <div className={positionClass}>
        <div className="absolute inset-0 rounded-full p-1 animate-spin bg-linear-to-tr from-amber-300 via-blue-600 to-amber-300">
          <div className="w-full h-full rounded-full bg-linear-to-r from-violet-400 to-blue-500"></div>
        </div>
    <div className="relative z-100 flex flex-col items-center ">
          <motion.h1
          variants={textTyping}
           className={`text-xl text-shadow-2xs sm:text-2xl lg:text-3xl flex gap-1 font-black ${font.className}`}>
            {abrev.map((item, index)=>(
              <motion.span
              whileInView="animate"
              whileHover={{scale: 1.1}}
              className={`${item.color}`} 
              variants={bouncingLetter(index)}
              key={index}>
                  {item.char}
              </motion.span>
            ))}
          </motion.h1>
          <span className={`text-black font-bold text-2xl lg:text-3xl [text-stroke:1px_white] [-webkit-text-stroke:1px_white] ${font.className} `}>{year}</span>

        </div>
        </div>
  )
}

export default AgmaCircleIcon