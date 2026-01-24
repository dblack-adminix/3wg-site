import { ArrowRight, Shield, Zap, Lock, Server, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 3D Grid Server Rack Component
const ServerRack3D = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto h-80 perspective-1000">
      {/* 3D Grid Base */}
      <div className="absolute inset-0 transform-gpu rotateX-60 translateZ-0">
        {/* Horizontal lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
            style={{
              top: `${(i + 1) * 8}%`,
              animation: `pulse-line ${2 + i * 0.1}s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
        {/* Vertical lines */}
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute h-full w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent"
            style={{
              left: `${(i + 1) * 6}%`,
              animation: `pulse-line ${2.5 + i * 0.1}s ease-in-out infinite`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
      
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
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 cyber-grid" />
      <div className="absolute inset-0 scan-line pointer-events-none" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-[128px]" />
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left - Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <span className="w-2 h-2 rounded-full bg-primary pulse-indicator" />
              <span className="text-sm font-medium text-primary font-mono-tech">MANIFESTO_2024</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 font-['Montserrat']">
              <span className="text-gradient-primary">3LAB.PRO</span>
              <span className="text-foreground"> — Ваш</span>
              <br />
              <span className="text-foreground">технологический </span>
              <br />
              <span className="text-gradient-accent">суверенитет.</span>
            </h1>

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

        {/* Protocol Cards - Mobile Only */}
        <div className="lg:hidden mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="flex flex-col items-center p-4 rounded-xl border-glow bg-card/50 backdrop-blur-sm">
            <Shield className="h-6 w-6 text-primary mb-2" />
            <span className="text-sm font-bold text-foreground">Amnezia</span>
            <span className="text-[10px] text-muted-foreground">DPI bypass</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl border-glow bg-card/50 backdrop-blur-sm">
            <Zap className="h-6 w-6 text-[#FF3333] mb-2" />
            <span className="text-sm font-bold text-foreground">WireGuard</span>
            <span className="text-[10px] text-muted-foreground">5ms ping</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl border-glow bg-card/50 backdrop-blur-sm">
            <Lock className="h-6 w-6 text-accent mb-2" />
            <span className="text-sm font-bold text-foreground">Zero Logs</span>
            <span className="text-[10px] text-muted-foreground">privacy</span>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

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
        .perspective-1000 { perspective: 1000px; }
        .rotateX-60 { transform: rotateX(60deg); }
      `}</style>
    </section>
  );
};
