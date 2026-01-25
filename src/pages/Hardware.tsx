import { Router, Wifi, Tv, Gamepad2, Package, ArrowRight, Cpu, Shield, Zap, Lock, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { AnimatedSection } from '@/components/AnimatedSection';

const specs = [
  { label: 'CPU', value: 'ARM Cortex-A53 Quad-Core 1.2GHz' },
  { label: 'RAM', value: '512MB DDR4' },
  { label: 'Storage', value: '128MB NAND Flash' },
  { label: 'Crypto', value: 'Hardware AES-256 + ChaCha20' },
  { label: 'Ports', value: '4x Gigabit Ethernet + 1x WAN' },
  { label: 'Wi-Fi', value: '802.11ac Dual-Band (optional)' },
];

const steps = [
  {
    step: '01',
    title: 'Заказываете комплект',
    description: 'Оформляете заказ на нашем сайте или через Telegram-бота. Выбираете способ доставки.',
  },
  {
    step: '02',
    title: 'Получаете роутер',
    description: 'Мы привозим уже настроенный роутер с прошитыми ключами вашего персонального сервера.',
  },
  {
    step: '03',
    title: 'Включаете в розетку',
    description: 'Подключаете роутер к интернету и электросети. Всё работает автоматически.',
  },
  {
    step: '04',
    title: 'Управляете через Telegram',
    description: 'Используете наш Mini App для мониторинга, перезагрузки и смены локации сервера.',
  },
];

const Hardware = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-400/30 bg-gray-400/5 text-gray-300 text-sm font-medium">
                  <Router className="h-4 w-4" />
                  <span className="font-mono-tech text-xs">HARDWARE_SOLUTION</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-bold animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  In Stock
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold font-['Montserrat'] mb-4">
                <span className="bg-gradient-to-r from-gray-200 via-primary to-gray-300 bg-clip-text text-transparent">3LAB NODE-1</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                Готовый роутер с VPN из коробки
              </p>
            </div>
          </AnimatedSection>

          {/* Router Visualization */}
          <AnimatedSection delay={0.1}>
            <div className="max-w-3xl mx-auto mb-16">
              <div className="relative">
                {/* Router Body */}
                <div className="relative w-full max-w-md mx-auto h-56 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                  {/* Top Panel */}
                  <div className="absolute top-4 left-4 right-4 h-10 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg flex items-center px-4 gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#CCFF00]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2.5 h-2.5 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '0.4s' }} />
                    <div className="flex-1" />
                    <span className="text-xs text-primary font-mono-tech font-bold">3LAB NODE-1</span>
                  </div>
                  
                  {/* Ventilation Lines */}
                  <div className="absolute top-20 left-4 right-4 space-y-1.5">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="h-px bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700" />
                    ))}
                  </div>
                  
                  {/* Front Panel */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-5 w-5 text-primary" />
                      <span className="text-xs text-muted-foreground font-mono-tech">MESH_ACTIVE</span>
                    </div>
                    <div className="flex gap-1.5">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-7 h-4 bg-gray-700 rounded-sm border border-gray-600 flex items-center justify-center"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${i < 4 ? 'bg-primary' : 'bg-gray-500'}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
                </div>
                
                {/* Antennas */}
                <div className="absolute -top-14 left-16 w-2.5 h-20 bg-gradient-to-t from-gray-800 to-gray-600 rounded-full">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_#CCFF00] animate-pulse" />
                </div>
                <div className="absolute -top-12 right-16 w-2.5 h-18 bg-gradient-to-t from-gray-800 to-gray-600 rounded-full transform rotate-12">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_#CCFF00] animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
                
                {/* Glow */}
                <div className="absolute -inset-8 bg-gradient-to-r from-primary/10 via-transparent to-gray-400/10 rounded-3xl blur-3xl -z-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-40 bg-primary/20 rounded-full blur-[80px] -z-10" />
              </div>
            </div>
          </AnimatedSection>

          {/* Description */}
          <AnimatedSection delay={0.15}>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Промышленный маршрутизатор в <span className="text-primary font-semibold">металлическом корпусе</span>. 
                Никакого пластика. Только надежность, <span className="text-accent font-semibold">пассивное охлаждение</span> и 
                встроенный <span className="text-[#FF3333] font-semibold">Kill Switch</span>.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
              <div className="p-6 rounded-2xl bg-card/50 border border-primary/20 group hover:border-primary/40 transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Package className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Plug & Play</h3>
                <p className="text-sm text-muted-foreground">Включил и работает</p>
              </div>
              
              <div className="p-6 rounded-2xl bg-card/50 border border-accent/20 group hover:border-accent/40 transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-bold text-lg mb-2">Hardware Crypto</h3>
                <p className="text-sm text-muted-foreground">Аппаратное шифрование AmneziaWG/WireGuard</p>
              </div>
              
              <div className="p-6 rounded-2xl bg-card/50 border border-[#B10000]/20 group hover:border-[#B10000]/40 transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 rounded-xl bg-[#B10000]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-7 w-7 text-[#FF3333]" />
                </div>
                <h3 className="font-bold text-lg mb-2">Gigabit Ports</h3>
                <p className="text-sm text-muted-foreground">Скорость до 1000 Мбит/с</p>
              </div>
              
              <div className="p-6 rounded-2xl bg-card/50 border border-purple-500/20 group hover:border-purple-500/40 transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Settings className="h-7 w-7 text-purple-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Admin Console</h3>
                <p className="text-sm text-muted-foreground">Управление через Telegram Mini App</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Specs Table */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold font-['Montserrat'] text-center mb-12">
                Технические <span className="text-gradient-primary">характеристики</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {specs.map((spec, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border hover:border-primary/30 transition-colors"
                  >
                    <span className="text-muted-foreground font-mono-tech text-sm">{spec.label}</span>
                    <span className="text-foreground font-medium text-sm">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold font-['Montserrat'] text-center mb-16">
              Как это <span className="text-gradient-primary">работает</span>
            </h2>
          </AnimatedSection>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {steps.map((item, index) => (
                <AnimatedSection key={index} delay={0.1 * (index + 1)}>
                  <div className="relative p-6 rounded-2xl bg-card/50 border border-border hover:border-primary/30 transition-all duration-300 group">
                    <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-lg shadow-primary/30">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-lg mb-2 mt-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto text-center">
              <div className="p-8 rounded-3xl bg-gradient-to-r from-gray-400/10 via-primary/10 to-gray-300/10 border border-white/10">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-5xl font-bold bg-gradient-to-r from-gray-200 via-primary to-gray-300 bg-clip-text text-transparent">1500₽</span>
                  <span className="text-muted-foreground font-mono-tech">/мес</span>
                </div>
                <p className="text-sm text-muted-foreground font-mono-tech mb-6">
                  В стоимость оборудования уже включен личный сервер
                </p>
                
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-gray-300 via-primary to-gray-400 hover:from-gray-200 hover:via-primary/90 hover:to-gray-300 text-background font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_hsl(73_100%_50%/0.5)]"
                >
                  Заказать комплект
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default Hardware;
