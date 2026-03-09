'use client';

import { motion } from 'framer-motion';

export default function TypingIndicator() {
  const dotVariants = {
    hidden: { opacity: 0.4, y: 0 },
    visible: { opacity: 1, y: -10 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        repeatDelay: 0.3,
      },
    },
  };

  return (
    <motion.div
      className="flex items-center gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <span className="text-sm text-primary-foreground italic">AI is typing</span>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2.5 h-2.5 bg-primary/80 rounded-full"
          variants={dotVariants}
          animate="visible"
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
    </motion.div>
  );
}
