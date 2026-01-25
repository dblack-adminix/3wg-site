import { Layout } from '@/components/Layout';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ToggleRight, 
  Shield, 
  Activity, 
  Lock,
  Cpu,
  Zap,
  Server,
  Wifi,
  HardDrive,
  Terminal
} from 'lucide-react';
import node1Internal from '@/assets/node1-internal.jpg';
import node1Router from '@/assets/node1-router.png';

const firmwareFeatures = [
  {
    icon: ToggleRight,
    title: 'Мгновенное переключение',
    description: 'WireGuard для скорости, AmneziaWG для маскировки.',
  },
  {
    icon: Shield,
    title: 'Kill Switch',
    description: 'Защита от утечек при обрыве соединения.',
  },
  {
    icon: Activity,
    title: 'Мониторинг трафика',
    description: 'Всегда знайте, что происходит в вашей сети.',
  },
  {
    icon: Lock,
    title: 'Автоматические обновления',
    description: 'Мы позаботились о защите.',
  },
];

const Node1 = () => {
  const [wireGuardOn, setWireGuardOn] = useState(true);
  const [amneziaOn, setAmneziaOn] = useState(true);
  const [tiltStyle, setTiltStyle] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' });
  
  // Animated network graph data
  const [graphPoints, setGraphPoints] = useState<number[]>([40, 35, 30, 25, 20, 28, 15, 22, 18, 12, 20, 10]);
  const [networkSpeed, setNetworkSpeed] = useState(847);
  
  // Generate new random point for the graph
  const generateNewPoint = useCallback(() => {
    return Math.floor(Math.random() * 35) + 5; // Random value between 5 and 40
  }, []);
  
  // Update graph data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setGraphPoints(prev => {
        const newPoints = [...prev.slice(1), generateNewPoint()];
        return newPoints;
      });
      // Update speed with slight variation
      setNetworkSpeed(prev => {
        const variation = Math.floor(Math.random() * 100) - 50;
        const newSpeed = prev + variation;
        return Math.max(500, Math.min(950, newSpeed)); // Keep between 500-950
      });
    }, 800); // Update every 800ms
    
    return () => clearInterval(interval);
  }, [generateNewPoint]);
  
  // Generate SVG path from points
  const graphPath = useMemo(() => {
    const width = 400;
    const segmentWidth = width / (graphPoints.length - 1);
    
    let path = `M 0 ${graphPoints[0]}`;
    
    for (let i = 1; i < graphPoints.length; i++) {
      const x = i * segmentWidth;
      const y = graphPoints[i];
      const prevX = (i - 1) * segmentWidth;
      const prevY = graphPoints[i - 1];
      const cpX = (prevX + x) / 2;
      
      path += ` Q ${cpX} ${prevY}, ${x} ${y}`;
    }
    
    return path;
  }, [graphPoints]);
  
  const graphFillPath = useMemo(() => {
    return `${graphPath} L 400 48 L 0 48 Z`;
  }, [graphPath]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 cyber-grid opacity-30" />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <AnimatedSection delay={0.1}>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-mono-tech text-primary uppercase tracking-wider">
                    Production Ready
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-mono-tech leading-tight">
                  <span className="text-foreground">NODE-1:</span>
                  <br />
                  <span className="text-gradient-primary">Железо, которое не сдается.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                  Ваш личный шлюз в цифровую свободу. 
                  <span className="text-primary font-medium"> Производство 3LAB.PRO.</span>
                </p>
                
                <ul className="space-y-3 pt-4">
                  {[
                    'OEM-платформа: Проверенная база, доработанная 3LAB.',
                    'Кастомная прошивка: Управление каждым пакетом на уровне ядра.',
                    'Интегрированный AmneziaWG: Маскировка трафика по умолчанию.',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span className="font-mono-tech text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
            
            {/* Right: NODE-1 3D Router Image */}
            <AnimatedSection delay={0.2} direction="right">
              <div className="relative flex items-center justify-center">
                {/* Animated background glow layers */}
                <motion.div 
                  className="absolute w-[550px] h-[550px] rounded-full"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    background: 'radial-gradient(circle, hsl(73 100% 50% / 0.2) 0%, transparent 60%)',
                    filter: 'blur(60px)',
                  }}
                />
                <motion.div 
                  className="absolute w-[400px] h-[400px] rounded-full"
                  animate={{
                    scale: [1.1, 1, 1.1],
                    opacity: [0.4, 0.6, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  style={{
                    background: 'radial-gradient(circle, hsl(180 100% 50% / 0.15) 0%, transparent 50%)',
                    filter: 'blur(40px)',
                  }}
                />
                
                {/* Rotating ring effect */}
                <motion.div
                  className="absolute w-[480px] h-[480px] rounded-full border border-primary/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  style={{
                    boxShadow: '0 0 30px hsl(73 100% 50% / 0.1)',
                  }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/50" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400/50" />
                </motion.div>
                
                {/* Second rotating ring (opposite direction) */}
                <motion.div
                  className="absolute w-[420px] h-[420px] rounded-full border border-cyan-500/10"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/40" />
                </motion.div>
                
                {/* Circuit background pattern */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(90deg, hsl(var(--primary) / 0.2) 1px, transparent 1px),
                      linear-gradient(hsl(var(--primary) / 0.2) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                  }}
                />
                
                {/* 3D Router Image with floating animation */}
                <motion.div 
                  className="relative z-10"
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* Image shadow (separate for 3D effect) */}
                  <motion.div
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-8 rounded-full"
                    animate={{
                      scale: [1, 0.9, 1],
                      opacity: [0.3, 0.2, 0.3],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      background: 'radial-gradient(ellipse, hsl(73 100% 50% / 0.3) 0%, transparent 70%)',
                      filter: 'blur(15px)',
                    }}
                  />
                  
                  <motion.img 
                    src={node1Router} 
                    alt="NODE-1 Router" 
                    className="w-full max-w-[500px] h-auto"
                    whileHover={{
                      scale: 1.05,
                      rotateY: 5,
                      rotateX: -5,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    style={{
                      filter: 'drop-shadow(0 0 40px hsl(73 100% 50% / 0.4)) drop-shadow(0 0 80px hsl(180 100% 50% / 0.2))',
                    }}
                  />
                  
                  {/* Glowing accent points on the device */}
                  <motion.div
                    className="absolute top-[35%] left-[45%] w-4 h-4 rounded-full"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        '0 0 10px hsl(73 100% 50% / 0.5)',
                        '0 0 25px hsl(73 100% 50% / 0.8)',
                        '0 0 10px hsl(73 100% 50% / 0.5)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      background: 'radial-gradient(circle, hsl(73 100% 70%) 0%, hsl(73 100% 50%) 100%)',
                    }}
                  />
                </motion.div>
                
                {/* Tech labels floating around */}
                <motion.div
                  className="absolute top-10 right-10 font-mono-tech text-xs text-primary/60 tracking-widest"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  AmneziaWG
                </motion.div>
                <motion.div
                  className="absolute bottom-16 left-10 font-mono-tech text-xs text-cyan-400/60 tracking-widest"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  ENCRYPTED
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Performance Section - Chip Schematic */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <AnimatedSection delay={0.1}>
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-mono-tech">
                Под Капотом:
              </h2>
              <p className="text-xl text-muted-foreground mt-2">Производительность</p>
            </div>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Chip Schematic Visualization */}
            <AnimatedSection delay={0.2} direction="left">
              <div className="relative">
                {/* Main Frame */}
                <div 
                  className="relative aspect-square max-w-[450px] mx-auto rounded-lg border border-cyan-500/30 p-6"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,40,60,0.3) 0%, rgba(0,20,30,0.5) 100%)',
                    boxShadow: '0 0 30px rgba(0, 180, 255, 0.1), inset 0 0 30px rgba(0, 180, 255, 0.05)',
                  }}
                >
                  {/* SVG Circuit Board */}
                  <svg className="w-full h-full" viewBox="0 0 400 400">
                    <defs>
                      {/* Cyan glow gradient */}
                      <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00ffff" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="#00ffff" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#00ffff" stopOpacity="0.2" />
                      </linearGradient>
                      <linearGradient id="greenGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#CCFF00" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="#CCFF00" stopOpacity="1" />
                        <stop offset="100%" stopColor="#CCFF00" stopOpacity="0.2" />
                      </linearGradient>
                      {/* Glow filter */}
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="pulseGlow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    
                    {/* Animated pulse paths */}
                    <style>
                      {`
                        @keyframes pulse-left-right {
                          0% { offset-distance: 0%; opacity: 0; }
                          10% { opacity: 1; }
                          90% { opacity: 1; }
                          100% { offset-distance: 100%; opacity: 0; }
                        }
                        @keyframes pulse-right-left {
                          0% { offset-distance: 100%; opacity: 0; }
                          10% { opacity: 1; }
                          90% { opacity: 1; }
                          100% { offset-distance: 0%; opacity: 0; }
                        }
                        @keyframes pulse-top-bottom {
                          0% { offset-distance: 0%; opacity: 0; }
                          10% { opacity: 1; }
                          90% { opacity: 1; }
                          100% { offset-distance: 100%; opacity: 0; }
                        }
                        @keyframes pulse-bottom-top {
                          0% { offset-distance: 100%; opacity: 0; }
                          10% { opacity: 1; }
                          90% { opacity: 1; }
                          100% { offset-distance: 0%; opacity: 0; }
                        }
                        .data-pulse-h1 {
                          offset-path: path('M 50 100 L 120 100');
                          animation: pulse-left-right 2s ease-in-out infinite;
                        }
                        .data-pulse-h2 {
                          offset-path: path('M 280 100 L 350 100');
                          animation: pulse-right-left 2.5s ease-in-out infinite;
                          animation-delay: 0.5s;
                        }
                        .data-pulse-h3 {
                          offset-path: path('M 50 300 L 120 300');
                          animation: pulse-left-right 2.2s ease-in-out infinite;
                          animation-delay: 1s;
                        }
                        .data-pulse-h4 {
                          offset-path: path('M 280 300 L 350 300');
                          animation: pulse-right-left 2.3s ease-in-out infinite;
                          animation-delay: 0.3s;
                        }
                        .data-pulse-v1 {
                          offset-path: path('M 100 50 L 100 100');
                          animation: pulse-top-bottom 1.8s ease-in-out infinite;
                          animation-delay: 0.2s;
                        }
                        .data-pulse-v2 {
                          offset-path: path('M 150 50 L 150 120');
                          animation: pulse-top-bottom 2.1s ease-in-out infinite;
                          animation-delay: 0.7s;
                        }
                        .data-pulse-v3 {
                          offset-path: path('M 250 50 L 250 120');
                          animation: pulse-top-bottom 1.9s ease-in-out infinite;
                          animation-delay: 1.2s;
                        }
                        .data-pulse-v4 {
                          offset-path: path('M 100 300 L 100 350');
                          animation: pulse-bottom-top 2s ease-in-out infinite;
                          animation-delay: 0.4s;
                        }
                        .data-pulse-v5 {
                          offset-path: path('M 150 280 L 150 350');
                          animation: pulse-bottom-top 2.4s ease-in-out infinite;
                          animation-delay: 0.9s;
                        }
                        .data-pulse-cpu-left {
                          offset-path: path('M 95 200 L 120 200');
                          animation: pulse-left-right 1.5s ease-in-out infinite;
                          animation-delay: 0.6s;
                        }
                        .data-pulse-cpu-right {
                          offset-path: path('M 280 200 L 305 200');
                          animation: pulse-right-left 1.5s ease-in-out infinite;
                          animation-delay: 0.8s;
                        }
                        .data-pulse-green1 {
                          offset-path: path('M 85 330 L 120 280');
                          animation: pulse-left-right 2.5s ease-in-out infinite;
                          animation-delay: 0.3s;
                        }
                        .data-pulse-green2 {
                          offset-path: path('M 75 210 L 95 200 L 120 200');
                          animation: pulse-left-right 2.8s ease-in-out infinite;
                          animation-delay: 1.1s;
                        }
                        @keyframes node-pulse {
                          0%, 100% { opacity: 0.4; r: 3; }
                          50% { opacity: 1; r: 5; }
                        }
                        .connection-node {
                          animation: node-pulse 2s ease-in-out infinite;
                        }
                      `}
                    </style>
                    
                    {/* Background circuit traces - Cyan */}
                    <g stroke="#00b4d8" strokeWidth="1" fill="none" opacity="0.4">
                      <path d="M 50 100 L 120 100" />
                      <path d="M 50 150 L 100 150 L 100 130" />
                      <path d="M 50 300 L 120 300" />
                      <path d="M 50 350 L 80 350 L 80 320" />
                      <path d="M 280 100 L 350 100" />
                      <path d="M 300 150 L 350 150" />
                      <path d="M 280 300 L 350 300" />
                      <path d="M 300 350 L 350 350" />
                      <path d="M 100 50 L 100 100" />
                      <path d="M 150 50 L 150 120" />
                      <path d="M 250 50 L 250 120" />
                      <path d="M 300 50 L 300 100" />
                      <path d="M 100 300 L 100 350" />
                      <path d="M 150 280 L 150 350" />
                      <path d="M 250 280 L 250 350" />
                      <path d="M 300 300 L 300 350" />
                    </g>
                    
                    {/* Animated Data Pulses - Cyan */}
                    <circle className="data-pulse-h1" r="4" fill="#00ffff" filter="url(#pulseGlow)" />
                    <circle className="data-pulse-h2" r="4" fill="#00ffff" filter="url(#pulseGlow)" />
                    <circle className="data-pulse-h3" r="4" fill="#00ffff" filter="url(#pulseGlow)" />
                    <circle className="data-pulse-h4" r="4" fill="#00ffff" filter="url(#pulseGlow)" />
                    <circle className="data-pulse-v1" r="4" fill="#00ffff" filter="url(#pulseGlow)" />
                    <circle className="data-pulse-v2" r="4" fill="#00ffff" filter="url(#pulseGlow)" />
                    <circle className="data-pulse-v3" r="4" fill="#00ffff" filter="url(#pulseGlow)" />
                    <circle className="data-pulse-v4" r="4" fill="#00ffff" filter="url(#pulseGlow)" />
                    <circle className="data-pulse-v5" r="4" fill="#00ffff" filter="url(#pulseGlow)" />
                    <circle className="data-pulse-cpu-left" r="5" fill="#00ffff" filter="url(#pulseGlow)" />
                    <circle className="data-pulse-cpu-right" r="5" fill="#00ffff" filter="url(#pulseGlow)" />
                    
                    {/* Animated Data Pulses - Green */}
                    <circle className="data-pulse-green1" r="4" fill="#CCFF00" filter="url(#pulseGlow)" />
                    <circle className="data-pulse-green2" r="4" fill="#CCFF00" filter="url(#pulseGlow)" />
                    
                    {/* Center CPU Frame */}
                    <rect 
                      x="120" y="120" 
                      width="160" height="160" 
                      fill="rgba(0,30,40,0.8)" 
                      stroke="#00ffff" 
                      strokeWidth="2"
                      rx="4"
                      filter="url(#glow)"
                    />
                    
                    {/* CPU Pins */}
                    <g stroke="#00ffff" strokeWidth="1.5" filter="url(#glow)">
                      <line x1="140" y1="120" x2="140" y2="95" />
                      <line x1="160" y1="120" x2="160" y2="95" />
                      <line x1="180" y1="120" x2="180" y2="95" />
                      <line x1="200" y1="120" x2="200" y2="95" />
                      <line x1="220" y1="120" x2="220" y2="95" />
                      <line x1="240" y1="120" x2="240" y2="95" />
                      <line x1="260" y1="120" x2="260" y2="95" />
                    </g>
                    <g stroke="#00ffff" strokeWidth="1.5" filter="url(#glow)">
                      <line x1="140" y1="280" x2="140" y2="305" />
                      <line x1="160" y1="280" x2="160" y2="305" />
                      <line x1="180" y1="280" x2="180" y2="305" />
                      <line x1="200" y1="280" x2="200" y2="305" />
                      <line x1="220" y1="280" x2="220" y2="305" />
                      <line x1="240" y1="280" x2="240" y2="305" />
                      <line x1="260" y1="280" x2="260" y2="305" />
                    </g>
                    <g stroke="#00ffff" strokeWidth="1.5" filter="url(#glow)">
                      <line x1="120" y1="140" x2="95" y2="140" />
                      <line x1="120" y1="160" x2="95" y2="160" />
                      <line x1="120" y1="180" x2="95" y2="180" />
                      <line x1="120" y1="200" x2="95" y2="200" />
                      <line x1="120" y1="220" x2="95" y2="220" />
                      <line x1="120" y1="240" x2="95" y2="240" />
                      <line x1="120" y1="260" x2="95" y2="260" />
                    </g>
                    <g stroke="#00ffff" strokeWidth="1.5" filter="url(#glow)">
                      <line x1="280" y1="140" x2="305" y2="140" />
                      <line x1="280" y1="160" x2="305" y2="160" />
                      <line x1="280" y1="180" x2="305" y2="180" />
                      <line x1="280" y1="200" x2="305" y2="200" />
                      <line x1="280" y1="220" x2="305" y2="220" />
                      <line x1="280" y1="240" x2="305" y2="240" />
                      <line x1="280" y1="260" x2="305" y2="260" />
                    </g>
                    
                    {/* CPU Inner Core */}
                    <rect 
                      x="160" y="160" 
                      width="80" height="80" 
                      fill="rgba(0,60,80,0.6)" 
                      stroke="#CCFF00" 
                      strokeWidth="2"
                      rx="2"
                      filter="url(#glow)"
                    />
                    
                    {/* CPU Label */}
                    <text x="200" y="208" textAnchor="middle" fill="#CCFF00" fontSize="18" fontFamily="JetBrains Mono" fontWeight="bold">
                      CPU
                    </text>
                    
                    {/* RAM Module */}
                    <rect x="300" y="60" width="60" height="30" fill="rgba(0,40,50,0.8)" stroke="#00ffff" strokeWidth="1" rx="2" />
                    <text x="330" y="80" textAnchor="middle" fill="#CCFF00" fontSize="10" fontFamily="JetBrains Mono">RAM</text>
                    
                    {/* STORAGE Module */}
                    <rect x="300" y="100" width="60" height="30" fill="rgba(0,40,50,0.8)" stroke="#00ffff" strokeWidth="1" rx="2" />
                    <text x="330" y="120" textAnchor="middle" fill="#CCFF00" fontSize="9" fontFamily="JetBrains Mono">STORAGE</text>
                    
                    {/* Shield Icon */}
                    <path 
                      d="M 55 180 L 75 165 L 95 180 L 95 210 Q 95 230 75 245 Q 55 230 55 210 Z" 
                      fill="rgba(204,255,0,0.1)" 
                      stroke="#CCFF00" 
                      strokeWidth="1.5"
                      filter="url(#glow)"
                    />
                    
                    {/* AmneziaWG Label */}
                    <rect x="40" y="310" width="90" height="30" fill="rgba(0,40,50,0.8)" stroke="#CCFF00" strokeWidth="1" rx="2" />
                    <text x="85" y="330" textAnchor="middle" fill="#CCFF00" fontSize="10" fontFamily="JetBrains Mono">AmneziaWG</text>
                    
                    {/* Connection dots */}
                    <g fill="#00ffff" filter="url(#glow)">
                      <circle className="connection-node" cx="50" cy="100" r="3" style={{ animationDelay: '0s' }} />
                      <circle className="connection-node" cx="50" cy="150" r="3" style={{ animationDelay: '0.3s' }} />
                      <circle className="connection-node" cx="50" cy="300" r="3" style={{ animationDelay: '0.6s' }} />
                      <circle className="connection-node" cx="350" cy="100" r="3" style={{ animationDelay: '0.9s' }} />
                      <circle className="connection-node" cx="350" cy="150" r="3" style={{ animationDelay: '1.2s' }} />
                      <circle className="connection-node" cx="350" cy="300" r="3" style={{ animationDelay: '1.5s' }} />
                      <circle className="connection-node" cx="100" cy="50" r="3" style={{ animationDelay: '0.2s' }} />
                      <circle className="connection-node" cx="300" cy="50" r="3" style={{ animationDelay: '0.5s' }} />
                      <circle className="connection-node" cx="100" cy="350" r="3" style={{ animationDelay: '0.8s' }} />
                      <circle className="connection-node" cx="300" cy="350" r="3" style={{ animationDelay: '1.1s' }} />
                    </g>
                    
                    {/* Data flow paths */}
                    <path d="M 85 330 L 120 280" stroke="#CCFF00" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
                    <path d="M 75 210 L 95 200 L 120 200" stroke="#CCFF00" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
                  </svg>
                  
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyan-400" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-cyan-400" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-cyan-400" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-cyan-400" />
                </div>
              </div>
            </AnimatedSection>
            
            {/* Right: Content */}
            <AnimatedSection delay={0.3}>
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold font-mono-tech mb-4">
                    Не просто router.
                    <br />
                    <span className="text-gradient-primary">Ваш личный сервер.</span>
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    NODE-1 — это не клиентское устройство. Это выделенный вычислительный узел, 
                    созданный для одной цели: обеспечить ваш цифровой суверенитет. 
                    Отказоустойчивость, скорость и невидимость — его фундаментальные принципы.
                  </p>
                </div>
                
                {/* Tech Specs - Terminal Style */}
                <div 
                  className="border border-primary/40 rounded p-4 space-y-1"
                  style={{
                    background: 'rgba(0,20,10,0.5)',
                  }}
                >
                  <div className="font-mono-tech text-sm text-primary mb-3">Hardware Specs:</div>
                  <div className="font-mono-tech text-sm text-muted-foreground">
                    <span className="text-cyan-400">{'>'}</span> CPU: Custom ARM Core @ 1.8 GHz
                  </div>
                  <div className="font-mono-tech text-sm text-muted-foreground">
                    RAM: 2GB DDR4 ECC (Error-Correcting Code)
                  </div>
                  <div className="font-mono-tech text-sm text-muted-foreground">
                    Storage: 32GB eMMC (Secure Flash)
                  </div>
                  
                  <div className="font-mono-tech text-sm text-primary mt-4 mb-2">Performance Specs:</div>
                  <div className="font-mono-tech text-sm text-muted-foreground">
                    Throughput (VPN): Up to 950 Mbps (WireGuard)
                  </div>
                  <div className="font-mono-tech text-sm text-muted-foreground">
                    Throughput (VPN): Up to 800 Mbps (AmneziaWG)
                  </div>
                  <div className="font-mono-tech text-sm text-muted-foreground">
                    Power Draw: {'<'}10W (optimized 24/7 operation)
                  </div>
                  <div className="font-mono-tech text-sm text-muted-foreground">
                    Operating Temperature: -20°C to +60°C
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* NEW: Command Center Section - Two Column with Tilt Effect */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* LEFT: Visual Block - Device Schematic with Tilt */}
            <AnimatedSection delay={0.1} direction="left">
              <motion.div 
                className="relative"
                style={tiltStyle}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Main Card */}
                <div 
                  className="relative aspect-square max-w-[450px] mx-auto rounded-2xl border border-primary/20 p-8 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(220 20% 8%) 100%)',
                    boxShadow: '0 0 60px hsl(var(--primary) / 0.1), inset 0 1px 0 hsl(var(--primary) / 0.1)',
                  }}
                >
                  {/* Circuit Board Lines */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                    <defs>
                      <linearGradient id="traceGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                        <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="traceGradV2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                        <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Circuit traces from CPU to edges */}
                    <g stroke="url(#traceGrad2)" strokeWidth="1" fill="none">
                      <path d="M 200 200 L 40 200" />
                      <path d="M 200 200 L 360 200" />
                      <path d="M 200 180 L 60 180 L 60 100" />
                      <path d="M 200 220 L 60 220 L 60 300" />
                      <path d="M 200 180 L 340 180 L 340 100" />
                      <path d="M 200 220 L 340 220 L 340 300" />
                    </g>
                    <g stroke="url(#traceGradV2)" strokeWidth="1" fill="none">
                      <path d="M 200 200 L 200 40" />
                      <path d="M 200 200 L 200 360" />
                      <path d="M 180 200 L 180 60 L 100 60" />
                      <path d="M 220 200 L 220 60 L 300 60" />
                      <path d="M 180 200 L 180 340 L 100 340" />
                      <path d="M 220 200 L 220 340 L 300 340" />
                    </g>
                    
                    {/* Corner nodes */}
                    <g fill="hsl(var(--primary))" opacity="0.5">
                      <circle cx="60" cy="100" r="4" />
                      <circle cx="60" cy="300" r="4" />
                      <circle cx="340" cy="100" r="4" />
                      <circle cx="340" cy="300" r="4" />
                      <circle cx="100" cy="60" r="4" />
                      <circle cx="300" cy="60" r="4" />
                      <circle cx="100" cy="340" r="4" />
                      <circle cx="300" cy="340" r="4" />
                    </g>
                  </svg>
                  
                  {/* CPU Core - Center */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {/* Pulsing glow */}
                    <div 
                      className="absolute inset-0 -m-4 rounded-lg animate-pulse"
                      style={{
                        background: 'hsl(var(--primary) / 0.3)',
                        filter: 'blur(20px)',
                      }}
                    />
                    
                    {/* CPU Box */}
                    <div 
                      className="relative w-24 h-24 rounded-lg border-2 border-primary flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, hsl(220 20% 12%) 0%, hsl(220 20% 8%) 100%)',
                        boxShadow: '0 0 30px hsl(var(--primary) / 0.5), inset 0 0 20px hsl(var(--primary) / 0.1)',
                      }}
                    >
                      <Cpu className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                  
                  {/* Corner Labels */}
                  <div className="absolute top-6 left-6 flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-primary/60" />
                    <span className="font-mono-tech text-xs text-muted-foreground">WAN</span>
                  </div>
                  <div className="absolute top-6 right-6 flex items-center gap-2">
                    <span className="font-mono-tech text-xs text-muted-foreground">LAN</span>
                    <Server className="w-4 h-4 text-primary/60" />
                  </div>
                  <div className="absolute bottom-6 left-6 flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-primary/60" />
                    <span className="font-mono-tech text-xs text-muted-foreground">32GB</span>
                  </div>
                  <div className="absolute bottom-6 right-6 flex items-center gap-2">
                    <span className="font-mono-tech text-xs text-muted-foreground">2GB DDR4</span>
                    <Zap className="w-4 h-4 text-primary/60" />
                  </div>
                  
                  {/* Status indicator */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="font-mono-tech text-xs text-primary">ACTIVE</span>
                  </div>
                </div>
                
                {/* Card label */}
                <div className="text-center mt-4">
                  <span className="font-mono-tech text-sm text-muted-foreground">NODE-1 ARCHITECTURE</span>
                </div>
              </motion.div>
            </AnimatedSection>
            
            {/* RIGHT: Content Block */}
            <AnimatedSection delay={0.2}>
              <div className="space-y-8">
                {/* Header */}
                <div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-mono-tech leading-tight text-primary mb-4">
                    Прошивка: Ваш командный центр
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Интуитивный интерфейс для управления вашей приватной сетью. 
                    Переключайте протоколы, мониторьте трафик и настраивайте правила безопасности.
                  </p>
                </div>
                
                {/* Terminal-style Specs */}
                <div 
                  className="rounded-lg border border-primary/30 overflow-hidden"
                  style={{
                    background: 'linear-gradient(180deg, hsl(220 20% 6%) 0%, hsl(220 20% 4%) 100%)',
                  }}
                >
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-primary/20 bg-primary/5">
                    <Terminal className="w-4 h-4 text-primary" />
                    <span className="font-mono-tech text-xs text-primary">system_specs.conf</span>
                    <div className="ml-auto flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-secondary/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
                    </div>
                  </div>
                  <div className="p-4 space-y-2 font-mono-tech text-sm">
                    <div className="flex">
                      <span className="text-primary w-20">CPU:</span>
                      <span className="text-muted-foreground">Quad-core ARM 1.8GHz (Optimized for AES)</span>
                    </div>
                    <div className="flex">
                      <span className="text-primary w-20">RAM:</span>
                      <span className="text-muted-foreground">2GB DDR4 High-Speed</span>
                    </div>
                    <div className="flex">
                      <span className="text-primary w-20">Flash:</span>
                      <span className="text-muted-foreground">32GB Secure Storage</span>
                    </div>
                    <div className="flex">
                      <span className="text-primary w-20">OS:</span>
                      <span className="text-muted-foreground">3LAB Custom Hardened Linux</span>
                    </div>
                  </div>
                </div>
                
                {/* Control Panel */}
                <div className="rounded-lg border border-border p-4 space-y-4 bg-card">
                  {/* Protocol Toggles */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* WireGuard Toggle */}
                    <motion.div 
                      className="p-3 rounded-lg border cursor-pointer overflow-hidden relative"
                      onClick={() => setWireGuardOn(!wireGuardOn)}
                      animate={{
                        borderColor: wireGuardOn ? 'hsl(73 100% 50%)' : 'hsl(240 3.7% 15.9%)',
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Background glow */}
                      <motion.div
                        className="absolute inset-0 rounded-lg"
                        animate={{
                          background: wireGuardOn 
                            ? 'linear-gradient(135deg, hsl(73 100% 50% / 0.15) 0%, hsl(73 100% 50% / 0.05) 100%)'
                            : 'transparent',
                          boxShadow: wireGuardOn 
                            ? 'inset 0 0 20px hsl(73 100% 50% / 0.1)'
                            : 'none',
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono-tech text-sm text-foreground">WireGuard</span>
                          
                          {/* Toggle Switch */}
                          <motion.div 
                            className="w-11 h-6 rounded-full relative p-0.5 cursor-pointer"
                            animate={{
                              background: wireGuardOn 
                                ? 'linear-gradient(90deg, hsl(73 100% 40%), hsl(73 100% 50%))'
                                : 'hsl(240 3.7% 20%)',
                              boxShadow: wireGuardOn 
                                ? '0 0 12px hsl(73 100% 50% / 0.5)'
                                : 'inset 0 1px 3px rgba(0,0,0,0.3)',
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <motion.div 
                              className="w-5 h-5 rounded-full bg-white shadow-md"
                              animate={{
                                x: wireGuardOn ? 20 : 0,
                                boxShadow: wireGuardOn 
                                  ? '0 0 8px hsl(73 100% 50% / 0.3)'
                                  : '0 1px 3px rgba(0,0,0,0.2)',
                              }}
                              transition={{ 
                                type: "spring", 
                                stiffness: 500, 
                                damping: 30 
                              }}
                            />
                          </motion.div>
                        </div>
                        
                        <motion.span 
                          className="font-mono-tech text-xs block"
                          animate={{
                            color: wireGuardOn ? 'hsl(73 100% 50%)' : 'hsl(240 5% 50%)',
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          {wireGuardOn ? '● ACTIVE' : '○ INACTIVE'}
                        </motion.span>
                      </div>
                    </motion.div>
                    
                    {/* AmneziaWG Toggle */}
                    <motion.div 
                      className="p-3 rounded-lg border cursor-pointer overflow-hidden relative"
                      onClick={() => setAmneziaOn(!amneziaOn)}
                      animate={{
                        borderColor: amneziaOn ? 'hsl(33 100% 50%)' : 'hsl(240 3.7% 15.9%)',
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Background glow */}
                      <motion.div
                        className="absolute inset-0 rounded-lg"
                        animate={{
                          background: amneziaOn 
                            ? 'linear-gradient(135deg, hsl(33 100% 50% / 0.15) 0%, hsl(33 100% 50% / 0.05) 100%)'
                            : 'transparent',
                          boxShadow: amneziaOn 
                            ? 'inset 0 0 20px hsl(33 100% 50% / 0.1)'
                            : 'none',
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono-tech text-sm text-foreground">AmneziaWG</span>
                          
                          {/* Toggle Switch */}
                          <motion.div 
                            className="w-11 h-6 rounded-full relative p-0.5 cursor-pointer"
                            animate={{
                              background: amneziaOn 
                                ? 'linear-gradient(90deg, hsl(33 100% 40%), hsl(33 100% 50%))'
                                : 'hsl(240 3.7% 20%)',
                              boxShadow: amneziaOn 
                                ? '0 0 12px hsl(33 100% 50% / 0.5)'
                                : 'inset 0 1px 3px rgba(0,0,0,0.3)',
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <motion.div 
                              className="w-5 h-5 rounded-full bg-white shadow-md"
                              animate={{
                                x: amneziaOn ? 20 : 0,
                                boxShadow: amneziaOn 
                                  ? '0 0 8px hsl(33 100% 50% / 0.3)'
                                  : '0 1px 3px rgba(0,0,0,0.2)',
                              }}
                              transition={{ 
                                type: "spring", 
                                stiffness: 500, 
                                damping: 30 
                              }}
                            />
                          </motion.div>
                        </div>
                        
                        <motion.span 
                          className="font-mono-tech text-xs block"
                          animate={{
                            color: amneziaOn ? 'hsl(33 100% 50%)' : 'hsl(240 5% 50%)',
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          {amneziaOn ? '● STEALTH MODE' : '○ INACTIVE'}
                        </motion.span>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Network Activity Graph - Animated */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono-tech text-xs text-muted-foreground flex items-center gap-2">
                        <Activity className="w-3 h-3" />
                        Network Activity
                      </span>
                      <motion.span 
                        className="font-mono-tech text-xs text-primary"
                        key={networkSpeed}
                        initial={{ opacity: 0.5, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {networkSpeed} Mbps
                      </motion.span>
                    </div>
                    
                    <div className="h-12 relative rounded overflow-hidden bg-muted/20">
                      <svg className="w-full h-full" viewBox="0 0 400 48" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="graphGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                          </linearGradient>
                          <filter id="graphGlow">
                            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                            <feMerge>
                              <feMergeNode in="coloredBlur"/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                        </defs>
                        {/* Animated fill */}
                        <motion.path 
                          d={graphFillPath}
                          fill="url(#graphGrad2)"
                          initial={false}
                          animate={{ d: graphFillPath }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                        {/* Animated line */}
                        <motion.path 
                          d={graphPath}
                          fill="none" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth="2"
                          filter="url(#graphGlow)"
                          initial={false}
                          animate={{ d: graphPath }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                        {/* Current point indicator */}
                        <motion.circle
                          cx="400"
                          cy={graphPoints[graphPoints.length - 1]}
                          r="4"
                          fill="hsl(var(--primary))"
                          filter="url(#graphGlow)"
                          initial={false}
                          animate={{ 
                            cy: graphPoints[graphPoints.length - 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{ 
                            cy: { duration: 0.5, ease: "easeInOut" },
                            opacity: { duration: 1, repeat: Infinity }
                          }}
                        />
                      </svg>
                      
                      {/* Scanline effect */}
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--primary) / 0.03) 2px, hsl(var(--primary) / 0.03) 4px)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Firmware Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <AnimatedSection delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-bold font-mono-tech text-center mb-12">
              Возможности <span className="text-gradient-primary">прошивки</span>
            </h2>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {firmwareFeatures.map((feature, i) => (
              <AnimatedSection key={i} delay={0.1 + i * 0.1}>
                <motion.div 
                  className="p-6 bg-card/50 rounded-lg border border-border h-full relative overflow-hidden group cursor-pointer"
                  whileHover={{ 
                    y: -8,
                    borderColor: 'hsl(73 100% 50% / 0.5)',
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25 
                  }}
                >
                  {/* Hover glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'radial-gradient(circle at 50% 0%, hsl(73 100% 50% / 0.15) 0%, transparent 70%)',
                    }}
                  />
                  
                  {/* Bottom glow line */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(90deg, transparent, hsl(73 100% 50% / 0.5), transparent)',
                    }}
                  />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <motion.div 
                      className="p-2 bg-primary/10 rounded-lg w-fit mb-4"
                      whileHover={{ 
                        scale: 1.1,
                        boxShadow: '0 0 20px hsl(73 100% 50% / 0.3)',
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <feature.icon className="w-6 h-6 text-primary" />
                    </motion.div>
                    <h4 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(var(--primary) / 0.1) 0%, transparent 60%)',
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <AnimatedSection delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-bold font-mono-tech mb-6">
              Готовы к <span className="text-gradient-primary">цифровой свободе</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Доступно ограниченное количество устройств. 
              Обеспечьте свой суверенитет сегодня.
            </p>
            <Button asChild size="lg" className="group">
              <Link to="/pricing">
                Заказать NODE-1
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default Node1;
