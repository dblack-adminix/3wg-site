import { Layout } from '@/components/Layout';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Shield, 
  Activity, 
  Cpu,
  Zap,
  Server,
  Wifi,
  HardDrive,
  Terminal
} from 'lucide-react';

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
      {/* Main Section - Two Column Layout */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
        {/* Background */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 cyber-grid opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* LEFT: Visual Block - Device Schematic */}
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
                  className="relative aspect-square max-w-[500px] mx-auto rounded-2xl border border-primary/20 p-8 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(220 20% 8%) 100%)',
                    boxShadow: '0 0 60px hsl(var(--primary) / 0.1), inset 0 1px 0 hsl(var(--primary) / 0.1)',
                  }}
                >
                  {/* Circuit Board Lines */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                    <defs>
                      <linearGradient id="traceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                        <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="traceGradV" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                        <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Circuit traces from CPU to edges */}
                    <g stroke="url(#traceGrad)" strokeWidth="1" fill="none">
                      {/* Horizontal lines */}
                      <path d="M 200 200 L 40 200" />
                      <path d="M 200 200 L 360 200" />
                      <path d="M 200 180 L 60 180 L 60 100" />
                      <path d="M 200 220 L 60 220 L 60 300" />
                      <path d="M 200 180 L 340 180 L 340 100" />
                      <path d="M 200 220 L 340 220 L 340 300" />
                    </g>
                    <g stroke="url(#traceGradV)" strokeWidth="1" fill="none">
                      {/* Vertical lines */}
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
                    
                    {/* Edge nodes */}
                    <g fill="hsl(var(--primary))" opacity="0.3">
                      <circle cx="40" cy="200" r="3" />
                      <circle cx="360" cy="200" r="3" />
                      <circle cx="200" cy="40" r="3" />
                      <circle cx="200" cy="360" r="3" />
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
                        animation: 'pulse 2s ease-in-out infinite',
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
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-mono-tech leading-tight text-primary mb-4">
                    NODE-1: Под капотом суверенитета
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Это не просто роутер. Это выделенный узел, оптимизированный для работы 
                    с зашифрованными потоками данных AmneziaWG на уровне ядра.
                  </p>
                </div>
                
                {/* Terminal-style Specs */}
                <div 
                  className="rounded-lg border border-primary/30 overflow-hidden"
                  style={{
                    background: 'linear-gradient(180deg, hsl(220 20% 6%) 0%, hsl(220 20% 4%) 100%)',
                    boxShadow: 'inset 0 1px 0 hsl(var(--primary) / 0.1)',
                  }}
                >
                  {/* Terminal header */}
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-primary/20 bg-primary/5">
                    <Terminal className="w-4 h-4 text-primary" />
                    <span className="font-mono-tech text-xs text-primary">system_specs.conf</span>
                    <div className="ml-auto flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-secondary/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
                    </div>
                  </div>
                  
                  {/* Specs content */}
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
                    <div className="flex">
                      <span className="text-primary w-20">VPN:</span>
                      <span className="text-muted-foreground">WireGuard / AmneziaWG Kernel Module</span>
                    </div>
                    <div className="flex">
                      <span className="text-primary w-20">Power:</span>
                      <span className="text-muted-foreground">{'<'}10W (24/7 Operation)</span>
                    </div>
                  </div>
                </div>
                
                {/* Firmware Control Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold font-mono-tech text-foreground flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Прошивка: Ваш командный центр
                  </h2>
                  
                  {/* Control Panel */}
                  <div 
                    className="rounded-lg border border-border p-4 space-y-4"
                    style={{
                      background: 'hsl(var(--card))',
                    }}
                  >
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
                              style={{
                                left: wireGuardOn ? 'calc(100% - 18px)' : '2px',
                              }}
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
                              style={{
                                left: amneziaOn ? 'calc(100% - 18px)' : '2px',
                              }}
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
                      
                      {/* Simple CSS graph line */}
                      <div className="h-12 relative rounded overflow-hidden bg-muted/20">
                        <svg className="w-full h-full" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="graphGrad" x1="0%" y1="0%" x2="0%" y2="100%">
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
                            fill="url(#graphGrad)"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* CTA */}
                <div className="pt-4">
                  <Button asChild size="lg" className="group w-full sm:w-auto">
                    <Link to="/pricing">
                      Заказать NODE-1
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <p className="text-sm text-muted-foreground mt-3 font-mono-tech">
                    Доступно ограниченное количество устройств
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Node1;
