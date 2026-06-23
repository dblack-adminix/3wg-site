import { motion } from 'framer-motion';
import logoImage from '@/assets/logogrin.png';

interface LogoProps {
  className?: string;
  animated?: boolean;
}

export const Logo = ({ className = '', animated = true }: LogoProps) => {
  return (
    <div className={`flex items-center ${className} group cursor-pointer`}>
      <div className="flex flex-col">
        <img 
          src={logoImage}
          alt="3WG.RU"
          className="h-8 w-auto"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(204, 255, 0, 0.3))',
          }}
        />
        <div className="relative inline-block">
          <span className="text-[7px] font-mono text-muted-foreground/60 tracking-wider block">
            PERSONAL VPN SERVERS AND NETWORKS
          </span>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <span 
              className="text-[7px] font-mono text-primary tracking-wider block whitespace-nowrap absolute top-0 left-0"
              style={{
                filter: 'drop-shadow(0 0 3px rgba(204, 255, 0, 0.9)) drop-shadow(0 0 6px rgba(204, 255, 0, 0.6))',
              }}
            >
              PERSONAL VPN SERVERS AND NETWORKS
            </span>
            <motion.div
              className="absolute top-0 left-0 h-full bg-background"
              style={{
                width: 'calc(100% - 12px)',
                clipPath: 'inset(0)',
              }}
              animate={{
                left: ['-100%', '100%'],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'linear',
                repeatDelay: 1.5,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
