import { Layout } from '@/components/Layout';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState } from 'react';
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
            
            {/* Right: NODE-1 3D Image */}
            <AnimatedSection delay={0.2} direction="right">
              <div className="relative flex items-center justify-center">
                {/* Glow Effect */}
                <div 
                  className="absolute w-[500px] h-[500px] rounded-full opacity-50"
                  style={{
                    background: 'radial-gradient(circle, hsl(var(--primary) / 0.25) 0%, hsl(180 100% 50% / 0.1) 40%, transparent 70%)',
                    filter: 'blur(50px)',
                  }}
                />
                
                {/* Circuit background pattern */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `
                      linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px),
                      linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '30px 30px',
                  }}
                />
                
                {/* 3D Image */}
                <div className="relative">
                  <img 
                    src={node1Internal} 
                    alt="NODE-1 Internal Architecture" 
                    className="w-full max-w-[450px] h-auto relative z-10"
                    style={{
                      filter: 'drop-shadow(0 0 30px hsl(var(--primary) / 0.3)) drop-shadow(0 0 60px hsl(180 100% 50% / 0.2))',
                    }}
                  />
                  
                  {/* Label */}
                  <div className="absolute bottom-4 left-4 font-mono-tech text-xs text-primary/80 tracking-widest">
                    NODE-1 INTERNAL
                  </div>
                </div>
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
                    <div 
                      className="p-3 rounded-lg border transition-all cursor-pointer"
                      style={{
                        borderColor: wireGuardOn ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                        background: wireGuardOn ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                      }}
                      onClick={() => setWireGuardOn(!wireGuardOn)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono-tech text-sm text-foreground">WireGuard</span>
                        <div 
                          className="w-10 h-5 rounded-full relative transition-colors"
                          style={{
                            background: wireGuardOn ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                          }}
                        >
                          <div 
                            className="absolute top-0.5 w-4 h-4 rounded-full bg-background transition-all"
                            style={{ left: wireGuardOn ? 'calc(100% - 18px)' : '2px' }}
                          />
                        </div>
                      </div>
                      <span className="font-mono-tech text-xs text-muted-foreground">
                        {wireGuardOn ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    
                    {/* AmneziaWG Toggle */}
                    <div 
                      className="p-3 rounded-lg border transition-all cursor-pointer"
                      style={{
                        borderColor: amneziaOn ? 'hsl(var(--secondary))' : 'hsl(var(--border))',
                        background: amneziaOn ? 'hsl(var(--secondary) / 0.1)' : 'transparent',
                      }}
                      onClick={() => setAmneziaOn(!amneziaOn)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono-tech text-sm text-foreground">AmneziaWG</span>
                        <div 
                          className="w-10 h-5 rounded-full relative transition-colors"
                          style={{
                            background: amneziaOn ? 'hsl(var(--secondary))' : 'hsl(var(--muted))',
                          }}
                        >
                          <div 
                            className="absolute top-0.5 w-4 h-4 rounded-full bg-background transition-all"
                            style={{ left: amneziaOn ? 'calc(100% - 18px)' : '2px' }}
                          />
                        </div>
                      </div>
                      <span className="font-mono-tech text-xs text-muted-foreground">
                        {amneziaOn ? 'STEALTH MODE' : 'INACTIVE'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Network Activity Graph */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono-tech text-xs text-muted-foreground flex items-center gap-2">
                        <Activity className="w-3 h-3" />
                        Network Activity
                      </span>
                      <span className="font-mono-tech text-xs text-primary">847 Mbps</span>
                    </div>
                    
                    <div className="h-12 relative rounded overflow-hidden bg-muted/20">
                      <svg className="w-full h-full" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="graphGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path 
                          d="M 0 40 Q 20 35, 40 30 T 80 25 T 120 20 T 160 28 T 200 15 T 240 22 T 280 18 T 320 12 T 360 20 T 400 10" 
                          fill="none" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth="2"
                        />
                        <path 
                          d="M 0 40 Q 20 35, 40 30 T 80 25 T 120 20 T 160 28 T 200 15 T 240 22 T 280 18 T 320 12 T 360 20 T 400 10 L 400 48 L 0 48 Z" 
                          fill="url(#graphGrad2)"
                        />
                      </svg>
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
                <div className="p-6 bg-card/50 rounded-lg border border-border hover:border-primary/30 transition-colors h-full">
                  <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-foreground mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
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
