import { useState } from 'react';
import { ArrowRight, Shield, Server, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderForm } from '@/components/OrderForm';
import { Layout } from '@/components/Layout';
import { AnimatedSection } from '@/components/AnimatedSection';
import { StatusWidget } from '@/components/StatusWidget';

// Abstract 3D Server Rack Visual
const ServerRack3D = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto h-96 perspective-1000">
      {/* 3D Grid Base */}
      <div className="absolute inset-0 transform-gpu rotateX-60 translateZ-0">
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
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative w-56 h-10 mb-3 rounded bg-gradient-to-r from-card via-card/80 to-card border border-primary/30 overflow-hidden group"
              style={{
                transform: `perspective(500px) rotateX(10deg) translateZ(${i * 10}px)`,
                animation: `float-server 3s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-1.5">
                <div className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-primary' : i === 2 ? 'bg-accent' : 'bg-[#B10000]'} pulse-indicator`} />
                <div className="w-2 h-2 rounded-full bg-primary/50" />
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-20 h-1.5 bg-muted rounded overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent rounded"
                  style={{ 
                    width: `${60 + i * 10}%`,
                    animation: 'data-flow 1.5s ease-in-out infinite',
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>

      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
    </div>
  );
};

const Index = () => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 cyber-grid" />
        <div className="absolute inset-0 scan-line pointer-events-none" />
        
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-[128px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8">
                <span className="w-2 h-2 rounded-full bg-primary pulse-indicator" />
                <span className="text-sm font-medium text-primary font-mono-tech">MANIFESTO_2024</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 font-['Montserrat']">
                <span className="text-primary drop-shadow-[0_0_20px_hsl(73_100%_50%/0.6)]">3LAB.PRO</span>
                <span className="text-foreground"> — Ваш</span>
                <br />
                <span className="text-foreground">технологический </span>
                <br />
                <span className="text-gradient-accent">суверенитет.</span>
              </h1>

              <div className="space-y-4 mb-10">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Мы верим, что <span className="text-primary font-semibold">доступ к информации</span> — 
                  базовое право. Пока другие строят заборы, мы строим <span className="text-accent font-semibold">мосты</span>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-8">
                <Button 
                  size="lg" 
                  onClick={() => setIsOrderOpen(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg px-8 py-6 glow-primary group transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_hsl(73_100%_50%/0.7)]"
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Получить VPN-сервер
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-accent text-accent hover:bg-accent/10 font-semibold text-lg px-8 py-6 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_hsl(33_100%_50%/0.4)]"
                >
                  <Server className="mr-2 h-5 w-5" />
                  ИТ-аутсорсинг
                </Button>
              </div>
            </div>

            <div className="hidden lg:block">
              <ServerRack3D />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Manifesto Section */}
      <AnimatedSection delay={0.1}>
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="relative p-10 md:p-16 rounded-3xl border border-primary/20 bg-card/50 backdrop-blur-sm">
                <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-sm opacity-50" />
                
                <div className="relative z-10">
                  <Cpu className="h-12 w-12 text-primary mx-auto mb-6 drop-shadow-[0_0_20px_hsl(73_100%_50%/0.5)]" />
                  
                  <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold font-['Montserrat'] leading-relaxed mb-8">
                    <span className="text-primary">3LAB.PRO</span> — это ваш личный{' '}
                    <span className="text-gradient-accent">цифровой рубеж</span>.
                  </blockquote>
                  
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    Технологическая честность, <span className="text-primary font-semibold">нулевое знание (Zero Knowledge)</span> и 
                    физическая реальность собственного дата-центра.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Status Widget */}
      <AnimatedSection delay={0.2} direction="none">
        <StatusWidget />
      </AnimatedSection>

      <OrderForm isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />

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
    </Layout>
  );
};

export default Index;
