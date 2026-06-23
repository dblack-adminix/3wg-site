import { motion } from 'framer-motion';
import { useState } from 'react';

interface RouterVisualizationProps {
  routerImage: string;
}

export const RouterVisualization = ({ routerImage }: RouterVisualizationProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center min-h-[600px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated orbital rings */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          border: '1px solid rgba(204, 255, 0, 0.15)',
          boxShadow: '0 0 40px rgba(204, 255, 0, 0.1)',
        }}
        animate={{
          rotate: 360,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{
          rotate: { duration: 40, repeat: Infinity, ease: 'linear' },
          scale: { duration: 0.5 },
        }}
      >
        {/* Orbital particles */}
        {[0, 120, 240].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              background: `radial-gradient(circle, ${
                i === 0 ? '#CCFF00' : i === 1 ? '#00B4D8' : '#FF9900'
              }, transparent)`,
              boxShadow: `0 0 15px ${
                i === 0 ? '#CCFF00' : i === 1 ? '#00B4D8' : '#FF9900'
              }`,
            }}
            animate={{
              x: [
                `${Math.cos((angle * Math.PI) / 180) * 250 - 6}px`,
                `${Math.cos(((angle + 360) * Math.PI) / 180) * 250 - 6}px`,
              ],
              y: [
                `${Math.sin((angle * Math.PI) / 180) * 250 - 6}px`,
                `${Math.sin(((angle + 360) * Math.PI) / 180) * 250 - 6}px`,
              ],
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </motion.div>

      {/* Inner ring */}
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full"
        style={{
          border: '1px solid rgba(0, 180, 216, 0.2)',
          boxShadow: '0 0 30px rgba(0, 180, 216, 0.1)',
        }}
        animate={{
          rotate: -360,
          scale: isHovered ? 1.08 : 1,
        }}
        transition={{
          rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
          scale: { duration: 0.5 },
        }}
      />

      {/* Elegant glow layers */}
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(204, 255, 0, 0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 180, 216, 0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />

      {/* Router container with 3D effect */}
      <motion.div
        className="relative z-10"
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Router image */}
        <motion.div
          className="relative"
          whileHover={{
            scale: 1.05,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
        >
          <motion.img
            src={routerImage}
            alt="NODE-1 Router"
            className="w-full max-w-[450px] h-auto relative z-10"
            style={{
              filter: 'drop-shadow(0 0 40px rgba(204, 255, 0, 0.3)) drop-shadow(0 0 80px rgba(0, 180, 216, 0.2))',
            }}
            animate={{
              filter: isHovered
                ? 'drop-shadow(0 0 60px rgba(204, 255, 0, 0.5)) drop-shadow(0 0 100px rgba(0, 180, 216, 0.3))'
                : 'drop-shadow(0 0 40px rgba(204, 255, 0, 0.3)) drop-shadow(0 0 80px rgba(0, 180, 216, 0.2))',
            }}
          />

          {/* LED indicators on router */}
          <div className="absolute top-[40%] left-[48%] flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  background: i === 0 ? '#CCFF00' : i === 1 ? '#00B4D8' : '#FF9900',
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  boxShadow: [
                    `0 0 5px ${i === 0 ? '#CCFF00' : i === 1 ? '#00B4D8' : '#FF9900'}`,
                    `0 0 15px ${i === 0 ? '#CCFF00' : i === 1 ? '#00B4D8' : '#FF9900'}`,
                    `0 0 5px ${i === 0 ? '#CCFF00' : i === 1 ? '#00B4D8' : '#FF9900'}`,
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Shadow */}
        <motion.div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[70%] h-8 rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(0, 0, 0, 0.4) 0%, transparent 70%)',
            filter: 'blur(15px)',
          }}
          animate={{
            scale: [1, 0.9, 1],
            opacity: [0.4, 0.3, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Data flow particles */}
      {isHovered && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#CCFF00]"
              style={{
                left: '50%',
                top: '50%',
              }}
              initial={{
                x: 0,
                y: 0,
                opacity: 0,
              }}
              animate={{
                x: Math.cos((i * 45 * Math.PI) / 180) * 200,
                y: Math.sin((i * 45 * Math.PI) / 180) * 200,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeOut',
              }}
            />
          ))}
        </>
      )}

      {/* Tech labels */}
      <motion.div
        className="absolute top-10 right-10 font-mono-tech text-xs tracking-widest"
        animate={{
          opacity: [0.4, 0.8, 0.4],
          x: isHovered ? 10 : 0,
        }}
        transition={{
          opacity: { duration: 3, repeat: Infinity },
          x: { duration: 0.3 },
        }}
      >
        <div className="text-[#CCFF00]">[ AmneziaWG ]</div>
        <div className="text-[#00B4D8] mt-1">[ ENCRYPTED ]</div>
      </motion.div>

      <motion.div
        className="absolute bottom-16 left-10 font-mono-tech text-xs tracking-widest"
        animate={{
          opacity: [0.4, 0.8, 0.4],
          x: isHovered ? -10 : 0,
        }}
        transition={{
          opacity: { duration: 3, repeat: Infinity, delay: 1 },
          x: { duration: 0.3 },
        }}
      >
        <div className="text-[#FF9900]">[ NODE-1 ]</div>
        <div className="text-gray-500 mt-1">[ ACTIVE ]</div>
      </motion.div>
    </div>
  );
};
