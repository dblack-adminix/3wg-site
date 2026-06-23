import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface Card3DProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export const Card3D = ({ children, className = '', glowColor = '#CCFF00' }: Card3DProps) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg blur-xl opacity-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glowColor}40, transparent 70%)`,
        }}
        animate={{
          opacity: rotateX !== 0 || rotateY !== 0 ? 0.6 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Card content */}
      <div
        className="relative"
        style={{
          transform: 'translateZ(20px)',
        }}
      >
        {children}
      </div>
      
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden"
        style={{
          background: `linear-gradient(
            ${Math.atan2(rotateX, rotateY) * (180 / Math.PI) + 90}deg,
            transparent 0%,
            ${glowColor}20 50%,
            transparent 100%
          )`,
          opacity: 0,
        }}
        animate={{
          opacity: rotateX !== 0 || rotateY !== 0 ? 0.3 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};
