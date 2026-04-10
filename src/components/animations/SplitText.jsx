import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

export const SplitText = ({ children, className = "", delay = 0.04 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  if (typeof children !== "string") {
    return <span className={className}>{children}</span>;
  }

  // Split by words, then by chars to retain proper word wrapping
  const words = children.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: delay },
    },
  };

  const charVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } },
  };

  return (
    <motion.span
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className={className}
      style={{ display: "inline-block" }}
    >
      {words.map((word, wordIndex) => (
        <span key={`word-${wordIndex}`} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={`${char}-${charIndex}`}
              variants={charVariants}
              style={{ display: "inline-block" }}
            >
              {char}
            </motion.span>
          ))}
          {/* Add spacing between words natively */}
          <span style={{ display: 'inline-block' }}>&nbsp;</span>
        </span>
      ))}
    </motion.span>
  );
};
