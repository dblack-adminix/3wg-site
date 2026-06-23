import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface GlitchTextProps {
  children: string;
  className?: string;
  glitchIntensity?: 'low' | 'medium' | 'high';
}

export const GlitchText = ({ children, className = '', glitchIntensity = 'medium' }: GlitchTextProps) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const intervals = {
      low: 8000,
      medium: 5000,
      high: 3000,
    };

    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, intervals[glitchIntensity]);

    return () => clearInterval(interval);
  }, [glitchIntensity]);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      
      {isGlitching && (
        <>
          {/* Red glitch layer */}
          <motion.span
            className="absolute inset-0 text-red-500 mix-blend-screen"
            initial={{ x: 0, opacity: 0 }}
            animate={{
              x: [-2, 2, -2, 2, 0],
              opacity: [0.7, 0.5, 0.8, 0.6, 0],
            }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.span>
          
          {/* Cyan glitch layer */}
          <motion.span
            className="absolute inset-0 text-cyan-400 mix-blend-screen"
            initial={{ x: 0, opacity: 0 }}
            animate={{
              x: [2, -2, 2, -2, 0],
              opacity: [0.6, 0.8, 0.5, 0.7, 0],
            }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.span>
          
          {/* Green glitch layer */}
          <motion.span
            className="absolute inset-0 text-[#CCFF00] mix-blend-screen"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: [-1, 1, -1, 1, 0],
              y: [1, -1, 1, -1, 0],
              opacity: [0.5, 0.7, 0.6, 0.8, 0],
            }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.span>
        </>
      )}
    </span>
  );
};
