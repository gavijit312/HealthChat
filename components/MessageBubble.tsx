'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
  isPlaceholder?: boolean;
}

export default function MessageBubble({
  message,
  isUser,
  timestamp,
  isPlaceholder = false,
}: MessageBubbleProps) {
  const messageVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      x: isUser ? 20 : -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  if (isPlaceholder) {
    return (
      <motion.div
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
        variants={messageVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={`max-w-xs lg:max-w-md rounded-lg px-4 py-3 bg-muted/30 border-l-4 border-primary/30`}>
          <div className="space-y-2">
            <div className="h-3 bg-muted/60 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-muted/60 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      variants={messageVariants}
      initial="hidden"
      animate="visible"
    >
      <div
        className={`max-w-xs lg:max-w-md rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-muted text-muted-foreground rounded-bl-none'
        }`}
      >
        <p className="text-sm leading-relaxed wrap-break-word">{message}</p>
        {timestamp && (
          <p className={`text-xs mt-1 ${isUser ? 'opacity-70' : 'opacity-60'}`}>
            {format(timestamp, 'HH:mm')}
          </p>
        )}
      </div>
    </motion.div>
  );
}
