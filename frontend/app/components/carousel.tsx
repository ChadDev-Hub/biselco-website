'use client'
import Image from "next/image"
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
type Props = {
    postId: number;
    imageList: string[];
}
const Carousel = ({ postId, imageList }: Props) => {
    const [current, setCurrent] = useState(0)
    const prev = () => {
        setCurrent((c) => (c - 1 + imageList.length) % imageList.length)
    }
    const next = () => {
        setCurrent((c) => (c + 1) % imageList.length)
    }
    return (
        <div className="relative carousel w-full">
            <div
                className="carousel-item relative w-full bg-transparent ">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current} // Unique key triggers the animation on change
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                    >
                        <Image
                            loading="eager"
                            src={imageList[current]}
                            alt="carousel"
                            width={50}
                            height={50}
                            sizes="(min-width: 1024px) 200px, 100vw"
                            className="w-full h-125 object-cover rounded-md"
                        />
                    </motion.div>
                </AnimatePresence>
                {imageList.length > 1 && (
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 justify-between">
                        <button
                            type="button"
                            disabled={current === 0}
                            aria-label="Previous"
                            onClick={prev}
                            className="btn btn-circle btn-outline"
                        >
                            ❮
                        </button>
                        <button
                            type="button"
                            aria-label="Next"
                            disabled={current === imageList.length - 1}
                            onClick={next}
                            className="btn btn-circle btn-outline"
                        >
                            ❯
                        </button>
                    </div>
                )}
            </div>
        </div>

    )
}

export default Carousel