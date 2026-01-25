import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Shield, Zap, Lock, Server, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderForm } from '@/components/OrderForm';

// Blinking Node positions (fixed for consistency)
const blinkingNodes = [
  { x: 15, y: 20 }, { x: 45, y: 35 }, { x: 75, y: 15 },
  { x: 25, y: 55 }, { x: 85, y: 45 }, { x: 55, y: 70 },
  { x: 10, y: 80 }, { x: 65, y: 25 }, { x: 35, y: 85 },
];

// 3D Grid Server Rack Component
const ServerRack3D = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto h-80" style={{ perspective: '1000px' }}>
      
      {/* Floating Server Units */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Server Stack */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="relative w-48 h-8 mb-2 rounded bg-gradient-to-r from-card via-card/80 to-card border border-primary/30 overflow-hidden group"
              style={{
                transform: `perspective(500px) rotateX(10deg) translateZ(${i * 10}px)`,
                animation: `float-server 3s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              {/* LED Lights */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 flex gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-primary' : 'bg-[#B10000]'} pulse-indicator`} />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              </div>
              {/* Activity Bar */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-16 h-1 bg-muted rounded overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent rounded"
                  style={{ 
                    width: `${60 + i * 15}%`,
                    animation: 'data-flow 1.5s ease-in-out infinite',
                  }}
                />
              </div>
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
          
          {/* Connection Lines */}
          <svg className="absolute -left-8 top-0 w-8 h-full" viewBox="0 0 32 100">
            <path
              d="M32 20 L16 20 L16 50 L0 50"
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="1"
              className="animate-pulse"
            />
            <path
              d="M32 50 L16 50 L16 80 L0 80"
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="1"
              className="animate-pulse"
              style={{ animationDelay: '0.5s' }}
            />
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#CCFF00" stopOpacity="0" />
                <stop offset="50%" stopColor="#CCFF00" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#CCFF00" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[80px] animate-pulse" />
    </div>
  );
};

export const HeroSection = () => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-[#080808]"
    >
      {/* 3D Perspective Grid - Tactical HUD */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ perspective: '1000px' }}
      >
        <div 
          className="absolute w-[200%] h-[200%] left-[-50%] top-[-20%]"
          style={{
            transform: 'rotateX(60deg)',
            backgroundImage: `
              linear-gradient(rgba(204, 255, 0, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(204, 255, 0, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Mouse Follow Glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1] transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(204, 255, 0, 0.12) 0%, transparent 50%)`,
        }}
      />

      {/* Blinking Nodes at Grid Intersections */}
      <div className="absolute inset-0 pointer-events-none">
        {blinkingNodes.map((node, i) => (
          <div
            key={i}
            className="absolute w-[3px] h-[3px] bg-primary rounded-sm"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              boxShadow: '0 0 8px 2px rgba(204, 255, 0, 0.6), 0 0 16px 4px rgba(204, 255, 0, 0.3)',
              animation: `node-blink ${2 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>
      
      {/* Animated Floating Blobs */}
      <div 
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[150px] opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #CCFF00 0%, transparent 70%)',
          animation: 'float-blob-1 12s ease-in-out infinite',
        }}
      />
      <div 
        className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full blur-[180px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #FF9900 0%, #1a1a1a 70%)',
          animation: 'float-blob-2 15s ease-in-out infinite',
        }}
      />
      
      {/* Scanline Overlay Effect */}
      <div 
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(204, 255, 0, 0.04) 50%, transparent 100%)',
          backgroundSize: '100% 200%',
          animation: 'scanline-move 8s linear infinite',
        }}
      />

      {/* Vignette Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(8, 8, 8, 0.6) 70%, #080808 100%)',
        }}
      />

      {/* Terminal Elements - Left Bottom */}
      <div className="absolute bottom-6 left-6 z-10 hidden md:block">
        <div className="font-mono text-[10px] text-white/20 tracking-wider space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
            <span>LATENCY: <span className="text-primary/40">12ms</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            <span>PACKET_LOSS: <span className="text-primary/40">0.00%</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            <span>ENCRYPTION: <span className="text-primary/40">AES-256-GCM</span></span>
          </div>
        </div>
      </div>

      {/* Terminal Elements - Right Bottom */}
      <div className="absolute bottom-6 right-6 z-10 hidden md:block text-right">
        <div className="font-mono text-[10px] text-white/20 tracking-wider space-y-1">
          <div className="flex items-center justify-end gap-2">
            <span>NODE-1 STATUS: <span className="text-primary/40">ACTIVE</span></span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <span>UPLINK: <span className="text-primary/40">1000Mbps</span></span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <span>LOCATION: <span className="text-white/30">[55.7558, 37.6173]</span></span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
          </div>
        </div>
      </div>
      
      {/* AuthKit-style Light Beams */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden z-[3]">
        {/* Left Light Beam */}
        <div 
          className="absolute top-0 left-1/2 w-[600px] h-[800px] opacity-20"
          style={{
            transform: 'translateX(-100%) rotate(-25deg)',
            transformOrigin: 'top center',
            background: 'linear-gradient(180deg, rgba(204, 255, 0, 0.3) 0%, transparent 60%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Right Light Beam */}
        <div 
          className="absolute top-0 left-1/2 w-[600px] h-[800px] opacity-20"
          style={{
            transform: 'translateX(0%) rotate(25deg)',
            transformOrigin: 'top center',
            background: 'linear-gradient(180deg, rgba(204, 255, 0, 0.3) 0%, transparent 60%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Center Glow */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[400px]"
          style={{
            background: 'linear-gradient(180deg, rgba(204, 255, 0, 0.4) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* X-shaped Decorative Lines */}
      <div className="absolute inset-0 pointer-events-none z-[4] overflow-hidden">
        {/* Left X Line */}
        <svg className="absolute left-[15%] top-[10%] w-32 h-32 opacity-20" viewBox="0 0 100 100">
          <line x1="0" y1="0" x2="100" y2="100" stroke="#CCFF00" strokeWidth="0.5" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="#CCFF00" strokeWidth="0.5" />
        </svg>
        {/* Right X Line */}
        <svg className="absolute right-[15%] top-[10%] w-32 h-32 opacity-20" viewBox="0 0 100 100">
          <line x1="0" y1="0" x2="100" y2="100" stroke="#CCFF00" strokeWidth="0.5" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="#CCFF00" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Horizontal Accent Lines */}
      <div className="absolute top-[12%] left-1/2 -translate-x-1/2 flex items-center gap-4 z-[5]">
        <div className="w-24 md:w-40 h-px bg-gradient-to-r from-transparent via-primary/40 to-primary/20" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
        <div className="w-24 md:w-40 h-px bg-gradient-to-l from-transparent via-primary/40 to-primary/20" />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left - Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge - Glassmorphism */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-primary pulse-indicator" />
              <span className="text-sm font-medium text-primary font-mono-tech">MANIFESTO_2024</span>
            </div>

            {/* Main Heading with AuthKit-style Glow */}
            <div className="relative">
              {/* Background Glow for Text */}
              <div 
                className="absolute -inset-8 opacity-30 blur-3xl pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(204, 255, 0, 0.3) 0%, transparent 70%)',
                }}
              />
              
              <h1 className="relative text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 font-['Montserrat']">
                <span className="text-gradient-primary">3LAB.PRO</span>
                <span className="text-foreground"> — Ваш</span>
                <br />
                <span 
                  className="text-foreground inline-block relative"
                  style={{
                    textShadow: '0 0 60px rgba(204, 255, 0, 0.5), 0 0 100px rgba(204, 255, 0, 0.3), 0 0 140px rgba(204, 255, 0, 0.2)',
                  }}
                >
                  ЦИФРОВОЙ
                  {/* Underline Glow */}
                  <span 
                    className="absolute -bottom-2 left-0 right-0 h-px"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(204, 255, 0, 0.6), transparent)',
                    }}
                  />
                </span>
                <br />
                <span 
                  className="text-gradient-accent inline-block"
                  style={{
                    textShadow: '0 0 60px rgba(255, 153, 0, 0.5), 0 0 100px rgba(255, 153, 0, 0.3)',
                  }}
                >
                  СУВЕРЕНИТЕТ.
                </span>
              </h1>
            </div>

            {/* Manifesto Text */}
            <div className="space-y-4 mb-10">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Мы верим, что <span className="text-primary font-semibold">доступ к информации</span> — 
                базовое право. Пока другие строят заборы, мы строим <span className="text-accent font-semibold">мосты</span>.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed font-mono-tech">
                // Персональные VPN-серверы. Железо в надёжном дата-центре. 
                Ноль логов. Ваши данные — только ваши.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-8">
              <Button 
                size="lg" 
                onClick={() => setIsOrderOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg px-8 py-6 glow-primary group transition-all duration-300 hover:scale-105"
              >
                <Shield className="mr-2 h-5 w-5" />
                Получить VPN-сервер
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-accent text-accent hover:bg-accent/10 font-semibold text-lg px-8 py-6 transition-all duration-300 hover:scale-105"
              >
                <Server className="mr-2 h-5 w-5" />
                ИТ-аутсорсинг
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-mono-tech">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary pulse-indicator" />
                <span className="text-muted-foreground">uptime: <span className="text-primary">99.9%</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#B10000]" />
                <span className="text-muted-foreground">latency: <span className="text-[#FF3333]">5ms</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-muted-foreground">encryption: <span className="text-accent">256-bit</span></span>
              </div>
            </div>
          </div>

          {/* Right - 3D Server Rack */}
          <div className="hidden lg:block">
            <ServerRack3D />
          </div>
        </div>

        {/* Protocol Cards - Mobile Only - Glassmorphism Style */}
        <div className="lg:hidden mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="flex flex-col items-center p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
            <Shield className="h-6 w-6 text-primary mb-2" />
            <span className="text-sm font-bold text-foreground">Amnezia</span>
            <span className="text-[10px] text-muted-foreground">DPI bypass</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
            <Zap className="h-6 w-6 text-[#FF3333] mb-2" />
            <span className="text-sm font-bold text-foreground">WireGuard</span>
            <span className="text-[10px] text-muted-foreground">5ms ping</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
            <Lock className="h-6 w-6 text-accent mb-2" />
            <span className="text-sm font-bold text-foreground">Zero Logs</span>
            <span className="text-[10px] text-muted-foreground">privacy</span>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      {/* Order Form Modal */}
      <OrderForm isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />

      {/* CSS Animations */}
      <style>{`
        @keyframes float-server {
          0%, 100% { transform: perspective(500px) rotateX(10deg) translateY(0); }
          50% { transform: perspective(500px) rotateX(10deg) translateY(-5px); }
        }
        @keyframes pulse-line {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes data-flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float-blob-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -20px) scale(1.05); }
          50% { transform: translate(-20px, 30px) scale(0.95); }
          75% { transform: translate(20px, 20px) scale(1.02); }
        }
        @keyframes float-blob-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 20px) scale(1.08); }
          66% { transform: translate(30px, -30px) scale(0.92); }
        }
        @keyframes scanline-move {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% 200%; }
        }
        @keyframes node-blink {
          0%, 100% { opacity: 0.3; box-shadow: 0 0 4px 1px rgba(204, 255, 0, 0.3); }
          50% { opacity: 1; box-shadow: 0 0 12px 4px rgba(204, 255, 0, 0.8), 0 0 24px 8px rgba(204, 255, 0, 0.4); }
        }
        .perspective-1000 { perspective: 1000px; }
        .rotateX-60 { transform: rotateX(60deg); }
      `}</style>
    </section>
  );
};
