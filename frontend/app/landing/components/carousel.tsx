"use client"
import React, {useState} from "react"
import { AnimatePresence, motion } from "framer-motion"
type Props = {
    children: React.ReactNode[]
}

const Carousel = ({children}: Props) => {
    const [current, setCurrent] = useState(0)
   const prev = () => {
        setCurrent((c) => (c - 1 + children.length) % children.length)
    }
    const next = () => {
        setCurrent((c) => (c + 1) % children.length)
    }
    return (
        <div className="relative carousel w-fit h-full p-4">
            <div className="carousel-item flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current} // Unique key triggers the animation on change
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 , 
                            transition: { duration: 0.3 },
                            
                         }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="w-full px-20">
                        {children[current]}
                    </motion.div>
                </AnimatePresence>
                {children.length > 1 && (
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
                            disabled={current === children.length - 1}
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