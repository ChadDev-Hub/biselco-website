"use client"
import Image from "next/image"
import { textTyping, letterVariant, StaggeringFadeInUp, StaggeringChildren } from '../../utils/framerFunctions';
import { motion } from 'framer-motion';

type Props = {
    title: string
    date: string
    time: string
    location: string;
    image_url: string;

}

const ScheduleCard = ({ title, date, time, location, image_url }: Props) => {
    return (
        <motion.div
            className="card w-full h-full overflow-clip  bg-base-100  shadow-sm">
            <figure className="bg-linear-to-br inset-0 bg-blend-hard-light p-4 from-blue-600 to-violet-300">
                <Image
                    width={200}
                    height={200}
                    src={image_url}
                    alt="Shoes"
                    className="w-1/2 bg-transparent rounded-full drop-shadow-xl drop-shadow-black" />
            </figure>
            <div className="card-body text-center">
                <div className="badge badge-secondary">Schedule</div>
                <motion.h2
                    initial="hidden"
                    whileInView="visible"
                    variants={textTyping}
                    className="card-title flex justify-center gap-1 font-extrabold wrap-break-word flex-wrap">
                    {title.split("").map((char, index) => (
                        <motion.span
                            className=""
                            key={index}
                            variants={letterVariant}>
                            {char}
                        </motion.span>
                    ))}

                </motion.h2>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    variants={StaggeringFadeInUp}>
                    <motion.h2
                        variants={StaggeringChildren}
                    >
                        {location}
                    </motion.h2>
                    <motion.p
                        variants={StaggeringChildren}>
                        <span>{date}</span>
                        <span>{" | "}</span>
                        <span>{time}</span>
                    </motion.p>
                </motion.div>

                <motion.div
                    variants={StaggeringFadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    className="card-actions font-bold  justify-center">
                    {["Win Cash Prizes", "Win Exciting Prizes", "Win The Grand Prize"].map((item, index) => (
                        <motion.div
                            variants={StaggeringChildren}
                            key={index}
                            className="badge badge-outline">
                            {item}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    )
}

export default ScheduleCard