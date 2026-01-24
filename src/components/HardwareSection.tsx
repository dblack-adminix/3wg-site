import { Router, Wifi, Tv, Gamepad2, Package, Check, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HardwareSection = () => {
  return (
    <section id="hardware" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
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
            
            <h2 className="text-3xl md:text-5xl font-bold font-['Montserrat'] mb-4">
              <span className="bg-gradient-to-r from-gray-200 via-primary to-gray-300 bg-clip-text text-transparent">3LAB HARDWARE</span>
              <br />
              <span className="text-muted-foreground text-xl md:text-2xl font-normal">Готовый роутер с VPN из коробки</span>
            </h2>
            <p className="text-sm text-muted-foreground font-mono-tech">
              Управление через встроенный Telegram Mini App v2.0
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Router Visualization */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Router Body */}
                <div className="relative w-80 h-48 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                  {/* Top Panel */}
                  <div className="absolute top-4 left-4 right-4 h-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg flex items-center px-3 gap-2">
                    {/* LED Indicators */}
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#CCFF00]" />
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '0.4s' }} />
                    <div className="flex-1" />
                    <span className="text-[8px] text-primary font-mono-tech">3LAB</span>
                  </div>
                  
                  {/* Ventilation Lines */}
                  <div className="absolute top-16 left-4 right-4 space-y-1">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-px bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700" />
                    ))}
                  </div>
                  
                  {/* Front Panel */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-primary" />
                      <span className="text-[10px] text-muted-foreground font-mono-tech">MESH_ACTIVE</span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-6 h-3 bg-gray-700 rounded-sm border border-gray-600 flex items-center justify-center"
                        >
                          <div className={`w-1 h-1 rounded-full ${i < 3 ? 'bg-primary' : 'bg-gray-500'}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
                </div>
                
                {/* Antennas */}
                <div className="absolute -top-12 left-8 w-2 h-16 bg-gradient-to-t from-gray-800 to-gray-600 rounded-full">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary shadow-[0_0_15px_#CCFF00] animate-pulse" />
                </div>
                <div className="absolute -top-10 right-8 w-2 h-14 bg-gradient-to-t from-gray-800 to-gray-600 rounded-full transform rotate-12">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary shadow-[0_0_15px_#CCFF00] animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
                
                {/* Glow Effects */}
                <div className="absolute -inset-8 bg-gradient-to-r from-primary/10 via-transparent to-gray-400/10 rounded-3xl blur-2xl -z-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-primary/20 rounded-full blur-[60px] -z-10" />
              </div>
            </div>
            
            {/* Right - Features */}
            <div>
              <h3 className="text-2xl font-bold font-['Montserrat'] mb-4">
                Plug & Play <span className="text-primary">свобода</span>
              </h3>
              
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Устали объяснять бабушке, как включать VPN на планшете? Мы берём надёжный роутер, 
                прошиваем его нашими алгоритмами и привозим вам. Весь трафик внутри дома 
                автоматически шифруется и проходит через ваш личный сервер.
              </p>
              
              {/* Feature List */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-primary/20 group hover:border-primary/40 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Wifi className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">VPN на уровне Wi-Fi сети</h4>
                    <p className="text-sm text-muted-foreground font-mono-tech">all_devices_protected</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-white/10 group hover:border-accent/40 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Package className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Plug & Play: Включил и работает</h4>
                    <p className="text-sm text-muted-foreground font-mono-tech">zero_configuration</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-white/10 group hover:border-[#B10000]/40 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-[#B10000]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Tv className="h-6 w-6 text-[#FF3333]" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Поддержка 4K стриминга на ТВ</h4>
                    <p className="text-sm text-muted-foreground font-mono-tech">youtube • netflix • streaming</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-white/10 group hover:border-purple-500/40 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Gamepad2 className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Обход блокировок для консолей</h4>
                    <p className="text-sm text-muted-foreground font-mono-tech">ps5 • xbox • nintendo</p>
                  </div>
                </div>
              </div>
              
              {/* Pricing */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-gray-400/10 via-primary/10 to-gray-300/10 border border-white/10 mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold bg-gradient-to-r from-gray-200 via-primary to-gray-300 bg-clip-text text-transparent">1500₽</span>
                  <span className="text-muted-foreground font-mono-tech">/мес</span>
                </div>
                <p className="text-sm text-muted-foreground font-mono-tech">+ стоимость оборудования (или аренда)</p>
              </div>
              
              <Button 
                size="lg"
                className="w-full bg-gradient-to-r from-gray-300 via-primary to-gray-400 hover:from-gray-200 hover:via-primary/90 hover:to-gray-300 text-background font-semibold transition-all duration-300 hover:scale-[1.02]"
              >
                Заказать комплект
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
