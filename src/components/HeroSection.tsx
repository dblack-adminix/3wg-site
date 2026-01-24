import { ArrowRight, Shield, Zap, Lock, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-primary pulse-indicator" />
            <span className="text-sm font-medium text-primary">Технологический суверенитет</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 font-['Montserrat']">
            <span className="text-gradient-primary">3LAB.PRO</span>
            <span className="text-foreground"> — Ваш</span>
            <br />
            <span className="text-foreground">технологический </span>
            <span className="text-gradient-accent">суверенитет.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            ИТ-аутсорсинг, современный дата-центр и персональные решения 
            для свободного интернета (AmneziaWG/WireGuard).
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg px-8 py-6 glow-primary group"
            >
              <Shield className="mr-2 h-5 w-5" />
              Получить VPN-сервер
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-accent text-accent hover:bg-accent/10 font-semibold text-lg px-8 py-6"
            >
              <Server className="mr-2 h-5 w-5" />
              ИТ-аутсорсинг
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center p-6 rounded-xl border-glow bg-card/50 backdrop-blur-sm group hover:border-primary/50 transition-all">
              <Shield className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-bold text-foreground mb-1">AmneziaWG</span>
              <span className="text-sm text-muted-foreground text-center">Невидим для DPI</span>
            </div>
            <div className="flex flex-col items-center p-6 rounded-xl border-glow bg-card/50 backdrop-blur-sm group hover:border-accent/50 transition-all">
              <Zap className="h-8 w-8 text-accent mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-bold text-foreground mb-1">WireGuard</span>
              <span className="text-sm text-muted-foreground text-center">Пинг от 5ms</span>
            </div>
            <div className="flex flex-col items-center p-6 rounded-xl border-glow bg-card/50 backdrop-blur-sm group hover:border-primary/50 transition-all">
              <Lock className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-bold text-foreground mb-1">Zero Logs</span>
              <span className="text-sm text-muted-foreground text-center">Полная приватность</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
