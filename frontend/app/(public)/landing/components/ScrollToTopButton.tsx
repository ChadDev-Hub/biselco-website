'use client';

import { motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ScrollToTopButton() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 p-3 rounded-full bg-primary text-primary-content shadow-lg hover:shadow-xl z-40"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: showScrollTop ? 1 : 0,
        scale: showScrollTop ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Scroll to top"
    >
      <ChevronUp size={24} />
    </motion.button>
  );
}
