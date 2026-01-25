import { Shield, Zap, Lock, Tv, Smartphone, Router, Globe, EyeOff, Check, ArrowRight, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import amneziaWgLogo from '@/assets/amneziawg-logo.webp';
import wireguardLogo from '@/assets/wireguard-logo.svg';

const advantages = [
  {
    icon: Globe,
    title: 'Чистый IP',
    description: 'Ваш адрес не забанен в Google, Netflix или банках.',
    gradient: 'wireguard',
  },
  {
    icon: Tv,
    title: 'Один сервер на 10+ девайсов',
    description: 'ТВ, смартфоны, консоли и роутер — всё на одном тарифе.',
    gradient: 'amnezia',
  },
  {
    icon: EyeOff,
    title: 'Полная маскировка трафика',
    description: 'AmneziaWG — работает даже через самые жёсткие фильтры.',
    gradient: 'wireguard',
  },
];

const protocols = [
  {
    name: 'WireGuard',
    tagline: 'Максимальная скорость',
    description: 'Мы используем оригинальные протоколы в фирменном стиле, гарантируя надёжность на уровне ядра Linux.',
    features: ['kernel-level integration', 'latency < 5ms', 'throughput 1 Gbit/s', 'cryptokey routing'],
    gradient: 'wireguard',
    icon: Zap,
  },
  {
    name: 'AmneziaWG',
    tagline: 'Обход любых блокировок',
    description: 'Модифицированный протокол, невидимый для DPI-систем. Работает в России, Китае, Иране.',
    features: ['DPI-resistant protocol', 'traffic obfuscation', 'signature morphing', 'CDN tunneling'],
    gradient: 'amnezia',
    icon: Shield,
  },
];

export const VPNSection = () => {
  return (
    <section id="vpn" className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-6">
            <Server className="h-4 w-4" />
            <span className="font-mono-tech text-xs">PERSONAL_SERVER</span>
          </span>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-['Montserrat'] mb-6 leading-tight">
            Ваш личный сервер —
            <br />
            <span className="text-gradient-primary">интернет без границ</span>
            <br />
            <span className="text-muted-foreground text-2xl md:text-3xl font-normal">для всей семьи.</span>
          </h2>
        </div>

        {/* Main Pitch Block with Glassmorphism */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative group">
            {/* Animated Gradient Border */}
            <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-primary via-[#B10000] to-accent opacity-50 blur-sm group-hover:opacity-75 transition-opacity duration-500" />
            
            {/* Glassmorphism Card */}
            <div className="relative p-8 md:p-10 rounded-3xl backdrop-blur-xl bg-background/80 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[#B10000] flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
                    <Tv className="h-5 w-5 text-white" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[#B10000] flex items-center justify-center">
                    <Router className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>
                <span className="text-muted-foreground text-sm font-mono-tech">devices: 10+</span>
              </div>
              
              <p className="text-lg md:text-xl text-foreground leading-relaxed">
                Забудьте о подписках на каждого пользователя. Вы арендуете мощность личного сервера в <span className="text-primary font-semibold">3LAB</span>, а сколько устройств подключить — решаете сами. Это ваш <span className="text-accent font-semibold">приватный цифровой дом</span>, который невозможно вычислить.
              </p>
            </div>
          </div>
        </div>

        {/* Advantages Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {advantages.map((item, index) => (
            <div key={index} className="relative group">
              {/* Glowing Border */}
              <div 
                className={`absolute -inset-[1px] rounded-2xl opacity-40 group-hover:opacity-80 transition-all duration-500 ${
                  item.gradient === 'amnezia' 
                    ? 'bg-gradient-to-br from-accent via-purple-500 to-purple-800' 
                    : 'bg-gradient-to-br from-primary via-[#B10000] to-[#700000]'
                }`}
              />
              
              {/* Glassmorphism Card */}
              <div className="relative p-6 rounded-2xl backdrop-blur-xl bg-background/90 border border-white/5 h-full">
                <div 
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                    item.gradient === 'amnezia'
                      ? 'bg-gradient-to-br from-accent/20 to-purple-500/20'
                      : 'bg-gradient-to-br from-primary/20 to-[#B10000]/20'
                  }`}
                >
                  <item.icon 
                    className={`h-6 w-6 ${
                      item.gradient === 'amnezia' ? 'text-accent' : 'text-[#FF3333]'
                    }`} 
                  />
                </div>
                
                <h3 className="text-lg font-bold font-['Montserrat'] text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Protocol Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {protocols.map((protocol, index) => (
            <div key={index} className="relative group">
              {/* Animated Glowing Border */}
              <div 
                className={`absolute -inset-[2px] rounded-3xl opacity-50 group-hover:opacity-100 blur-sm transition-all duration-500 ${
                  protocol.gradient === 'amnezia'
                    ? 'bg-gradient-to-br from-accent via-purple-500 to-purple-900'
                    : 'bg-gradient-to-br from-primary via-[#B10000] to-[#500000]'
                }`}
              />
              
              {/* Glassmorphism Card */}
              <div className="relative p-8 rounded-3xl backdrop-blur-xl bg-background/85 border border-white/10 h-full">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className={`p-3 rounded-2xl ${
                      protocol.gradient === 'amnezia'
                        ? 'bg-gradient-to-br from-accent/20 to-purple-500/20'
                        : 'bg-gradient-to-br from-[#B10000]/30 to-primary/20'
                    }`}
                  >
                    <protocol.icon 
                      className={`h-8 w-8 ${
                        protocol.gradient === 'amnezia' ? 'text-accent' : 'text-[#FF3333]'
                      }`}
                    />
                  </div>
                  <div>
                    {protocol.gradient === 'amnezia' ? (
                      <div className="h-12 flex items-center">
                        <img 
                          src={amneziaWgLogo} 
                          alt="AmneziaWG" 
                          className="h-20 w-auto object-contain"
                        />
                      </div>
                    ) : (
                      <div className="h-10 flex items-center">
                        <img 
                          src={wireguardLogo} 
                          alt="WireGuard" 
                          className="h-9 w-auto object-contain"
                        />
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground font-mono-tech">{protocol.tagline}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {protocol.description}
                </p>

                {/* Technical Specs - Monospace */}
                <div className="mb-8 p-4 rounded-xl bg-background/50 border border-white/5">
                  <div className="font-mono-tech text-xs text-muted-foreground mb-2">
                    // specs
                  </div>
                  <ul className="space-y-2">
                    {protocol.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div 
                          className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${
                            protocol.gradient === 'amnezia' ? 'bg-accent' : 'bg-[#FF3333]'
                          }`}
                        />
                        <span className="font-mono-tech text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <Button
                  className={`w-full font-semibold transition-all duration-300 ${
                    protocol.gradient === 'amnezia'
                      ? 'bg-gradient-to-r from-accent to-purple-500 hover:from-accent/90 hover:to-purple-500/90 text-white shadow-lg shadow-accent/30'
                      : 'bg-gradient-to-r from-primary to-[#B10000] hover:from-primary/90 hover:to-[#B10000]/90 text-primary-foreground shadow-lg shadow-[#B10000]/30'
                  }`}
                >
                  Подключить {protocol.name}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card/50 backdrop-blur-sm mb-6">
            <Lock className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground font-mono-tech">
              setup: 5min • support: 24/7 • refund: 7d
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-[#B10000] text-primary-foreground hover:from-primary/90 hover:to-[#B10000]/90 font-semibold glow-wireguard"
            >
              Выбрать тариф
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-muted-foreground/30 text-muted-foreground hover:bg-muted/10 font-mono-tech"
            >
              diff --protocols
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
