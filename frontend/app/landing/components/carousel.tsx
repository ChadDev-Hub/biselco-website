"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
type Props = {
  children: React.ReactNode[];
};

const Carousel = ({ children }: Props) => {
  const [current, setCurrent] = useState(0);
  return (
    <div className="wrap-break-word relative flex justify-center items-center carousel">
      <div className="carousel-item flex  flex-col gap-2 h-full">
        <AnimatePresence mode="sync">
          <motion.div
            key={current} // Unique key triggers the animation on change
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {children[current]}
          </motion.div>
          <motion.div className="flex gap-1 justify-center">
            {children.length > 1 && children.map((child, index) => (
              <button
                type="button"
                title="dfs"
                className="btn btn-xs btn-info"
                key={index}
                onClick={() => setCurrent(index)}
              >{index+1}</button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Carousel;
