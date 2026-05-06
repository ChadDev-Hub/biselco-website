"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const ParentContainer = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
    },

}

const container = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
        },
    },
};


const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};


export default function Sponsor() {
    const items = ["/coron.jpg", "/busuanga.jpeg", "/culion.jpg", "/linapacan.png", "/erc.png", "/nea.png", "/npc.png", "/vivant.png"];
    return (
        <motion.div
            variants={ParentContainer}
            initial="hidden"
            whileInView="visible"
            className="overflow-hidden w-full">
            <motion.div
                initial="hidden"
                whileInView="visible"
                className="flex gap-4"
                animate={{
                    x: ["0%", "-100%"]
                }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 5,
                }}
                variants={container}
            >
                {/* duplicate items for seamless loop */}
                {[...items, ...items].map((item, i) => (
                    <motion.div
                        key={i}
                        variants={itemVariants}
                        className="w-10 shrink-0 h-full py-2 flex items-center justify-center text-white"
                    >
                        <Image
                            loading="eager"                            
                            src={item}
                            alt="sponsor"
                            width={100}
                            height={100}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="h-full w-full drop-shadow-md shadow-md rounded-box bg-base-100 object-cover"
                        />



                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}