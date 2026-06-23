import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface AnimatedIconProps {
  icon: LucideIcon;
  className?: string;
  size?: number;
  color?: string;
  animationType?: 'pulse' | 'spin' | 'bounce' | 'float' | 'glow';
}

export const AnimatedIcon = ({
  icon: Icon,
  className = '',
  size = 24,
  color = 'currentColor',
  animationType = 'pulse',
}: AnimatedIconProps) => {
  const animations = {
    pulse: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    spin: {
      rotate: 360,
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      },
    },
    bounce: {
      y: [0, -10, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    float: {
      y: [0, -15, 0],
      x: [0, 5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    glow: {
      filter: [
        'drop-shadow(0 0 2px currentColor)',
        'drop-shadow(0 0 10px currentColor)',
        'drop-shadow(0 0 2px currentColor)',
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      className={`inline-flex ${className}`}
      animate={animations[animationType]}
      whileHover={{
        scale: 1.1,
        rotate: animationType === 'spin' ? 0 : 5,
      }}
    >
      <Icon size={size} color={color} />
    </motion.div>
  );
};
