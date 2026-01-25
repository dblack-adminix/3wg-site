import { Router, Wifi, Tv, Gamepad2, Package, ArrowRight, Shield, Cpu, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HardwareSection = () => {
  return (
    <section id="hardware" className="py-24 relative overflow-hidden bg-[#080808]">
      {/* Background Effects */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ perspective: '1000px' }}
      >
        <div 
          className="absolute w-[200%] h-[200%] left-[-50%] top-[-20%]"
          style={{
            transform: 'rotateX(60deg)',
            backgroundImage: `
              linear-gradient(rgba(204, 255, 0, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(204, 255, 0, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>
      
      {/* Glowing Orbs */}
      <div 
        className="absolute top-20 left-10 w-[400px] h-[400px] rounded-full blur-[150px] opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #CCFF00 0%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full blur-[180px] opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #888888 0%, transparent 70%)' }}
      />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, #080808 100%)',
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm text-primary text-sm font-medium">
                <Router className="h-4 w-4" />
                <span className="font-mono-tech text-xs tracking-wider">HARDWARE_SOLUTION</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#CCFF00]" />
                В наличии
              </span>
            </div>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold font-['Montserrat'] mb-6">
              <span className="text-foreground">3LAB</span>{' '}
              <span className="text-primary" style={{ textShadow: '0 0 40px rgba(204, 255, 0, 0.4)' }}>NODE-1</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground font-light mb-4">
              Роутер приватности с VPN из коробки
            </p>
            <p className="text-sm text-muted-foreground/60 font-mono-tech">
              firmware: amneziaWG • control: telegram mini app v2.0
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Router Visualization */}
            <div className="flex justify-center order-2 lg:order-1">
              <div className="relative group">
                {/* Outer Glow Ring */}
                <div className="absolute -inset-16 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div 
                    className="absolute inset-0 rounded-full animate-spin-slow"
                    style={{
                      background: 'conic-gradient(from 0deg, transparent, rgba(204, 255, 0, 0.2), transparent)',
                      animationDuration: '8s',
                    }}
                  />
                </div>
                
                {/* Main Glow */}
                <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-transparent to-primary/10 rounded-3xl blur-3xl opacity-60" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-40 bg-primary/30 rounded-full blur-[80px]" />
                
                {/* Router Body */}
                <div className="relative w-96 h-56 bg-gradient-to-br from-[#1a1a1a] via-[#0d0d0d] to-[#1a1a1a] rounded-2xl border border-primary/20 shadow-2xl overflow-hidden group-hover:border-primary/40 transition-colors duration-500">
                  {/* Metallic Texture Overlay */}
                  <div 
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                    }}
                  />
                  
                  {/* Top Panel */}
                  <div className="absolute top-5 left-5 right-5 h-10 bg-gradient-to-r from-[#1f1f1f] via-[#2a2a2a] to-[#1f1f1f] rounded-lg flex items-center px-4 gap-3 border border-white/5">
                    {/* LED Indicators */}
                    <div className="flex gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_12px_#CCFF00,0_0_24px_#CCFF00]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_#FF9900]" style={{ animationDelay: '0.3s' }} />
                      <div className="w-2.5 h-2.5 rounded-full bg-primary/50 animate-pulse" style={{ animationDelay: '0.6s' }} />
                    </div>
                    <div className="flex-1" />
                    <span className="text-xs text-primary font-mono-tech font-bold tracking-widest">3LAB</span>
                  </div>
                  
                  {/* Ventilation Grille */}
                  <div className="absolute top-20 left-5 right-5 space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                        style={{ opacity: 1 - i * 0.15 }}
                      />
                    ))}
                  </div>
                  
                  {/* Front Panel */}
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Wifi className="h-5 w-5 text-primary" />
                        <div className="absolute inset-0 animate-ping">
                          <Wifi className="h-5 w-5 text-primary/30" />
                        </div>
                      </div>
                      <span className="text-xs text-primary/80 font-mono-tech tracking-wider">MESH_ACTIVE</span>
                    </div>
                    <div className="flex gap-2">
                      {[...Array(4)].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-8 h-4 bg-[#1a1a1a] rounded border border-white/10 flex items-center justify-center gap-0.5"
                        >
                          <div className={`w-1 h-1 rounded-full ${i < 3 ? 'bg-primary shadow-[0_0_4px_#CCFF00]' : 'bg-gray-600'}`} />
                          <div className={`w-1 h-1 rounded-full ${i < 2 ? 'bg-primary/60' : 'bg-gray-700'}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
                </div>
                
                {/* Antennas */}
                <div className="absolute -top-16 left-12 w-2.5 h-20 bg-gradient-to-t from-[#2a2a2a] to-[#4a4a4a] rounded-full shadow-lg">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_#CCFF00,0_0_40px_#CCFF00] animate-pulse" />
                </div>
                <div className="absolute -top-14 right-12 w-2.5 h-18 bg-gradient-to-t from-[#2a2a2a] to-[#4a4a4a] rounded-full shadow-lg transform rotate-12">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_#CCFF00,0_0_40px_#CCFF00] animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
                
                {/* Tech Specs Floating Labels */}
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 -translate-x-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 border border-primary/30 backdrop-blur-sm">
                    <Shield className="h-3 w-3 text-primary" />
                    <span className="text-[10px] text-primary font-mono-tech">KILL_SWITCH</span>
                  </div>
                </div>
                <div className="absolute -right-4 top-1/3 translate-x-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 border border-accent/30 backdrop-blur-sm">
                    <Cpu className="h-3 w-3 text-accent" />
                    <span className="text-[10px] text-accent font-mono-tech">HW_CRYPTO</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right - Features */}
            <div className="order-1 lg:order-2">
              <h3 className="text-3xl md:text-4xl font-bold font-['Montserrat'] mb-6">
                Plug & Play <span className="text-primary">приватность</span>
              </h3>
              
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                Устали объяснять бабушке, как включать VPN? Мы берём надёжный роутер, 
                прошиваем его нашими алгоритмами и привозим вам. Весь трафик внутри дома 
                автоматически шифруется.
              </p>
              
              {/* Feature Cards */}
              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Wifi className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-1">Защита всей сети</h4>
                  <p className="text-xs text-muted-foreground font-mono-tech">all_devices_protected</p>
                </div>
                
                <div className="p-5 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 backdrop-blur-sm hover:border-accent/40 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Package className="h-6 w-6 text-accent" />
                  </div>
                  <h4 className="font-semibold mb-1">Zero Config</h4>
                  <p className="text-xs text-muted-foreground font-mono-tech">включил → работает</p>
                </div>
                
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#B10000]/10 to-transparent border border-[#B10000]/20 backdrop-blur-sm hover:border-[#B10000]/40 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-[#B10000]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Tv className="h-6 w-6 text-[#FF3333]" />
                  </div>
                  <h4 className="font-semibold mb-1">4K Стриминг</h4>
                  <p className="text-xs text-muted-foreground font-mono-tech">youtube • netflix</p>
                </div>
                
                <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Gamepad2 className="h-6 w-6 text-purple-400" />
                  </div>
                  <h4 className="font-semibold mb-1">Консоли</h4>
                  <p className="text-xs text-muted-foreground font-mono-tech">ps5 • xbox • switch</p>
                </div>
              </div>
              
              {/* Pricing Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 backdrop-blur-sm mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary" style={{ textShadow: '0 0 20px rgba(204, 255, 0, 0.3)' }}>1500₽</span>
                    <span className="text-muted-foreground font-mono-tech">/мес</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
                    <Zap className="h-3 w-3 text-primary" />
                    <span className="text-xs text-primary font-mono-tech">FAST_SETUP</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground/70 font-mono-tech">+ стоимость оборудования (или аренда)</p>
              </div>
              
              <Button 
                size="lg"
                className="w-full h-14 bg-gradient-to-r from-primary via-primary to-[#a8cc00] hover:from-[#a8cc00] hover:to-primary text-background font-bold text-lg transition-all duration-300 hover:scale-[1.02] shadow-[0_0_30px_rgba(204,255,0,0.3)]"
              >
                Заказать NODE-1
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Animations */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </section>
  );
};
