import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const HolographicEffect = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Holographic scan lines */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(204, 255, 0, 0.03) 2px, rgba(204, 255, 0, 0.03) 4px)',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '0px 100px'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Holographic glitch bars */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#CCFF00] to-transparent"
          style={{
            top: `${20 + i * 15}%`,
            opacity: 0.2,
          }}
          animate={{
            x: ['-100%', '200%'],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Holographic grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(204, 255, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(204, 255, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          transform: `perspective(500px) rotateX(${mousePosition.y / 10}deg) rotateY(${mousePosition.x / 10}deg)`,
          transition: 'transform 0.3s ease-out',
        }}
      />

      {/* Chromatic aberration effect */}
      <motion.div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(204, 255, 0, 0.1) 0%, transparent 50%)`,
        }}
      />
      <motion.div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x + 2}% ${mousePosition.y + 2}%, rgba(255, 153, 0, 0.08) 0%, transparent 50%)`,
        }}
      />
      <motion.div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x - 2}% ${mousePosition.y - 2}%, rgba(0, 180, 216, 0.08) 0%, transparent 50%)`,
        }}
      />
    </div>
  );
};
