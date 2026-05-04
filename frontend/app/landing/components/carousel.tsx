"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
type Props = {
  children: React.ReactNode[];
};

const Carousel = ({ children }: Props) => {
  const [current, setCurrent] = useState(0);
  const prev = () => {
    setCurrent((c) => (c - 1 + children.length) % children.length);
  };
  const next = () => {
    setCurrent((c) => (c + 1) % children.length);
  };
  return (
    <div className="wrap-break-word flex justify-center items-center carousel h-full">
      <div className="carousel-item relativ flex  flex-col">
        <AnimatePresence mode="wait">
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
            {children.map((child, index) => (
              <button
                type="button"
                title="dfs"
                className="btn btn-xs btn-circle"
                key={index}
                onClick={() => setCurrent(index)}
              ></button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Carousel;
