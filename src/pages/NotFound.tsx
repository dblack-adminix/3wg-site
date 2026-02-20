import { useLocation, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ShieldOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Terminal messages for typing effect
const terminalMessages = [
  "> Tracing route to origin... FAILED",
  "> Access denied: Insufficient privileges",
  "> Emergency protocol initiated...",
  "> Attempting secure fallback...",
  "> Connection terminated by remote host",
];

const NotFound = () => {
  const location = useLocation();
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  // Typing effect for terminal
  useEffect(() => {
    if (currentLineIndex >= terminalMessages.length) {
      // Loop after delay
      const timeout = setTimeout(() => {
        setDisplayedLines([]);
        setCurrentLineIndex(0);
        setCurrentCharIndex(0);
      }, 3000);
      return () => clearTimeout(timeout);
    }

    const currentMessage = terminalMessages[currentLineIndex];
    
    if (currentCharIndex < currentMessage.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines(prev => {
          const newLines = [...prev];
          if (newLines.length <= currentLineIndex) {
            newLines.push(currentMessage.slice(0, currentCharIndex + 1));
          } else {
            newLines[currentLineIndex] = currentMessage.slice(0, currentCharIndex + 1);
          }
          return newLines;
        });
        setCurrentCharIndex(prev => prev + 1);
      }, 30 + Math.random() * 40);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex]);

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 150 + Math.random() * 200);
      }
    }, 2000);
    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex items-center justify-center">
      {/* CRT Scanlines */}
      <div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1) 0px,
            rgba(0, 0, 0, 0.1) 1px,
            transparent 1px,
            transparent 2px
          )`,
        }}
      />
      
      {/* CRT Flicker */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        animate={{
          opacity: [0.02, 0.04, 0.02, 0.03, 0.02],
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)',
        }}
      />

      {/* Grid background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(177, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(177, 0, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      {/* Main Content */}
      <motion.div
        className="relative z-30 text-center px-4 max-w-2xl"
        animate={isGlitching ? {
          x: [0, -5, 5, -3, 3, 0],
          skewX: [0, 2, -2, 1, 0],
        } : {}}
        transition={{ duration: 0.15 }}
      >
        {/* ASCII Shield Icon */}
        <motion.div 
          className="mb-8 font-mono text-[#B10000]/60 text-xs leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <pre className="inline-block text-left">
{`    ╔═══════════╗
    ║  ╲     ╱  ║
    ║   ╲   ╱   ║
    ║    ╲ ╱    ║
    ║     ╳     ║
    ║    ╱ ╲    ║
    ║   ╱   ╲   ║
    ╚═══════════╝`}
          </pre>
        </motion.div>

        {/* Glitch Headline */}
        <motion.div
          className="relative mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 
            className="font-mono text-3xl md:text-5xl font-bold tracking-wider relative"
            style={{
              color: '#B10000',
              textShadow: isGlitching 
                ? '2px 0 #CCFF00, -2px 0 #00FFFF, 0 0 10px rgba(177, 0, 0, 0.8)' 
                : '0 0 20px rgba(177, 0, 0, 0.5)',
            }}
          >
            <span className={isGlitching ? 'opacity-90' : ''}>ERROR_404:</span>
            <br />
            <span 
              className="inline-block mt-2"
              style={{
                transform: isGlitching ? 'translateX(3px)' : 'none',
              }}
            >
              SIGNAL_LOST
            </span>
          </h1>
          
          {/* Glitch layers */}
          {isGlitching && (
            <>
              <div 
                className="absolute inset-0 font-mono text-3xl md:text-5xl font-bold tracking-wider"
                style={{
                  color: '#CCFF00',
                  clipPath: 'polygon(0 40%, 100% 40%, 100% 60%, 0 60%)',
                  transform: 'translateX(-4px)',
                  opacity: 0.7,
                }}
              >
                ERROR_404:<br /><span className="inline-block mt-2">SIGNAL_LOST</span>
              </div>
              <div 
                className="absolute inset-0 font-mono text-3xl md:text-5xl font-bold tracking-wider"
                style={{
                  color: '#00FFFF',
                  clipPath: 'polygon(0 70%, 100% 70%, 100% 85%, 0 85%)',
                  transform: 'translateX(4px)',
                  opacity: 0.5,
                }}
              >
                ERROR_404:<br /><span className="inline-block mt-2">SIGNAL_LOST</span>
              </div>
            </>
          )}
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="font-mono text-sm md:text-base text-muted-foreground mb-10 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Запрашиваемый узел не отвечает или был стерт из соображений безопасности.
        </motion.p>

        {/* Terminal Block */}
        <motion.div
          ref={terminalRef}
          className="mb-10 mx-auto max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="rounded-xl border border-[#B10000]/30 bg-background/90 overflow-hidden">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-[#B10000]/20 bg-[#B10000]/5">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#B10000]/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#B10000]/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#B10000]/20" />
              </div>
              <span className="font-mono text-[10px] text-[#B10000]/60 ml-2">error_trace.log</span>
            </div>
            
            {/* Terminal body */}
            <div className="p-4 h-40 font-mono text-xs md:text-sm text-left overflow-hidden">
              {displayedLines.map((line, idx) => (
                <div 
                  key={idx} 
                  className="mb-1"
                  style={{
                    color: line.includes('FAILED') || line.includes('denied') || line.includes('terminated')
                      ? '#FF4444'
                      : '#B10000',
                  }}
                >
                  {line}
                </div>
              ))}
              {currentLineIndex < terminalMessages.length && (
                <motion.span
                  className="inline-block w-2 h-4 bg-[#B10000]"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Link to="/">
            <Button
              variant="outline"
              size="lg"
              className="group relative font-mono text-sm border-[#B10000]/50 text-[#B10000] bg-transparent hover:bg-primary/10 hover:text-primary hover:border-primary transition-all duration-300"
              style={{
                boxShadow: '0 0 20px rgba(177, 0, 0, 0.3)',
              }}
            >
              <motion.div
                className="absolute -inset-[1px] rounded-md opacity-50 group-hover:opacity-0 transition-opacity duration-300"
                animate={{
                  boxShadow: [
                    '0 0 10px rgba(177, 0, 0, 0.4)',
                    '0 0 25px rgba(177, 0, 0, 0.6)',
                    '0 0 10px rgba(177, 0, 0, 0.4)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  border: '1px solid rgba(177, 0, 0, 0.5)',
                  borderRadius: '0.375rem',
                }}
              />
              <motion.div
                className="absolute -inset-[1px] rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  boxShadow: '0 0 25px rgba(204, 255, 0, 0.5)',
                  border: '1px solid rgba(204, 255, 0, 0.5)',
                  borderRadius: '0.375rem',
                }}
              />
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              ВЕРНУТЬСЯ В БЕЗОПАСНУЮ ЗОНУ
            </Button>
          </Link>
        </motion.div>

        {/* Route info */}
        <motion.div
          className="mt-8 font-mono text-[10px] text-muted-foreground/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <span className="text-[#B10000]/40">REQUESTED_PATH:</span> {location.pathname}
        </motion.div>
      </motion.div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 font-mono text-[10px] text-[#B10000]/30">
        <div>SYS_STATUS: OFFLINE</div>
        <div>ERR_CODE: 0x404</div>
      </div>
      
      <div className="absolute top-4 right-4 font-mono text-[10px] text-[#B10000]/30 text-right">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ● CONNECTION_TERMINATED
        </motion.div>
      </div>

      <div className="absolute bottom-4 left-4 font-mono text-[10px] text-muted-foreground/20">
        3LAB.PRO // SECURE_NETWORK
      </div>

      <div className="absolute bottom-4 right-4">
        <ShieldOff className="w-6 h-6 text-[#B10000]/20" />
      </div>
    </div>
  );
};

export default NotFound;
