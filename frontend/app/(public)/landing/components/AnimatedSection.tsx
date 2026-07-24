"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  id?: string
}

export default function AnimatedSection({
  children,
  className,
  id
}: AnimatedSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Disable heavy animations on mobile or for reduced-motion users
  if (isMobile || prefersReducedMotion) {
    return <section id={id} className={className}>{children}</section>;
  }

  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        amount: 0.1,
      }}
      transition={{
        duration: 0.25,
      }}
    >
      {children}
    </motion.section>
  );
}