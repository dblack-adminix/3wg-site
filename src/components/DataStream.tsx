import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const DataStream = () => {
  const [streams, setStreams] = useState<Array<{ id: number; top: string; delay: number }>>([]);

  useEffect(() => {
    const streamCount = 12;
    const newStreams = Array.from({ length: streamCount }, (_, i) => ({
      id: i,
      top: `${(i / streamCount) * 100}%`,
      delay: Math.random() * 5,
    }));
    setStreams(newStreams);
  }, []);

  // Simple console characters: numbers, letters, symbols
  const characters = '01ABCDEFabcdef<>[]{}()+-*/=_|\\~#$%&@!?';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
      {streams.map((stream) => (
        <motion.div
          key={stream.id}
          className="absolute left-0 font-mono text-xs text-[#CCFF00] whitespace-nowrap"
          style={{ top: stream.top }}
          initial={{ x: '-100%', opacity: 0 }}
          animate={{
            x: '100vw',
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 5,
            repeat: Infinity,
            delay: stream.delay,
            ease: 'linear',
          }}
        >
          {Array.from({ length: 40 }, (_, i) => (
            <span
              key={i}
              className="inline-block mx-1"
              style={{
                opacity: 0.8 - (i % 10) * 0.05,
                textShadow: '0 0 5px rgba(204, 255, 0, 0.5)',
              }}
            >
              {characters[Math.floor(Math.random() * characters.length)]}
            </span>
          ))}
        </motion.div>
      ))}
    </div>
  );
};
