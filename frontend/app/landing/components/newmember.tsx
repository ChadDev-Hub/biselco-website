"use client"
import {motion} from "framer-motion"

type Props = {}

const NewMember = (props: Props) => {
  return (
    <motion.div className="flex flex-col gap-4 mx-auto px-4">
        <motion.h1 className="text-4xl text-primary  font-extrabold mb-4 italic">newmember</motion.h1>
    </motion.div>
  )
}

export default NewMember;