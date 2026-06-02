'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  variant?: 'fade' | 'stagger';
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};
const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export default function AnimatedSection({
  children,
  className,
  variant = 'stagger',
}: AnimatedSectionProps) {
  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variant === 'stagger' ? containerVariants : undefined}
      animate={variant === 'fade' ? 'visible' : undefined}
    >
      {variant === 'stagger' ? (
        <motion.div variants={itemVariants}>{children}</motion.div>
      ) : (
        children
      )}
    </motion.section>
  );
}
