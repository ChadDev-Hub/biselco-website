'use client';

import { motion } from 'framer-motion';

export default function EventsLoadingFallback() {
  return (
    <motion.div
      className="text-center py-8"
      animate={{ opacity: [0.5, 1] }}
      transition={{ repeat: Infinity, duration: 1 }}
    >
      <div className="inline-block">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </motion.div>
  );
}
