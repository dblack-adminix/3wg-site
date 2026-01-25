import { Layout } from '@/components/Layout';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ToggleRight, 
  Shield, 
  Activity, 
  Lock,
  Cpu,
  Zap,
  Server
} from 'lucide-react';

const techSpecs = [
  { label: 'CPU', value: 'Custom ARM Core @ 1.8 GHz (optimized for encryption)' },
  { label: 'RAM', value: '2GB DDR4 ECC (Error-Correcting Code)' },
  { label: 'Storage', value: '32GB eMMC (Secure Flash)' },
  { label: 'Throughput (VPN)', value: 'Up to 950 Mbps (WireGuard) / 800 Mbps (AmneziaWG)' },
  { label: 'Power Draw', value: '<10W (optimized for 24/7 operation)' },
  { label: 'Operating Temperature', value: '-20°C to +60°C' },
];

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
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[#080808]" />
        <div className="absolute inset-0 cyber-grid opacity-30" />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, hsl(73 100% 50% / 0.15) 0%, transparent 70%)',
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
            
            {/* Right: Router Visualization */}
            <AnimatedSection delay={0.2} direction="right">
              <div className="relative flex items-center justify-center">
                {/* Glow Effect */}
                <div 
                  className="absolute w-[400px] h-[400px] rounded-full opacity-40"
                  style={{
                    background: 'radial-gradient(circle, hsl(73 100% 50% / 0.3) 0%, transparent 60%)',
                    filter: 'blur(40px)',
                  }}
                />
                
                {/* Router Body */}
                <div className="relative w-[320px] h-[200px] bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg border border-zinc-700/50 shadow-2xl">
                  {/* Top Panel */}
                  <div className="absolute inset-x-4 top-4 h-[60px] bg-zinc-950 rounded border border-zinc-800 flex items-center px-4 gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="w-8 h-1 bg-zinc-700 rounded" />
                      <div className="w-6 h-1 bg-zinc-700 rounded" />
                    </div>
                    <div className="ml-auto flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(73_100%_50%)]" />
                      <div className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_hsl(33_100%_50%)]" />
                    </div>
                  </div>
                  
                  {/* Brand */}
                  <div className="absolute left-4 bottom-4">
                    <span className="font-mono-tech text-xs text-zinc-500">3LAB</span>
                    <span className="font-mono-tech text-xs text-primary">.NODE-1</span>
                  </div>
                  
                  {/* Ports */}
                  <div className="absolute right-4 bottom-4 flex gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-4 h-3 bg-zinc-950 rounded-sm border border-zinc-700" />
                    ))}
                  </div>
                  
                  {/* Side LED Strip */}
                  <div 
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-20 rounded-full"
                    style={{
                      background: 'linear-gradient(180deg, hsl(73 100% 50%) 0%, hsl(33 100% 50%) 100%)',
                      boxShadow: '0 0 15px hsl(73 100% 50% / 0.5)',
                    }}
                  />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Performance Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Abstract Chip Visualization */}
            <AnimatedSection delay={0.1} direction="left">
              <div className="relative h-[400px] flex items-center justify-center">
                {/* Circuit Lines */}
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 400">
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(73 100% 50%)" stopOpacity="0" />
                      <stop offset="50%" stopColor="hsl(73 100% 50%)" stopOpacity="1" />
                      <stop offset="100%" stopColor="hsl(73 100% 50%)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Horizontal Lines */}
                  <line x1="0" y1="100" x2="400" y2="100" stroke="url(#lineGrad)" strokeWidth="1" />
                  <line x1="0" y1="200" x2="400" y2="200" stroke="url(#lineGrad)" strokeWidth="1" />
                  <line x1="0" y1="300" x2="400" y2="300" stroke="url(#lineGrad)" strokeWidth="1" />
                  
                  {/* Vertical Lines */}
                  <line x1="100" y1="0" x2="100" y2="400" stroke="url(#lineGrad)" strokeWidth="1" />
                  <line x1="200" y1="0" x2="200" y2="400" stroke="url(#lineGrad)" strokeWidth="1" />
                  <line x1="300" y1="0" x2="300" y2="400" stroke="url(#lineGrad)" strokeWidth="1" />
                  
                  {/* Connection Nodes */}
                  <circle cx="100" cy="100" r="4" fill="hsl(73 100% 50%)" />
                  <circle cx="200" cy="200" r="6" fill="hsl(73 100% 50%)" />
                  <circle cx="300" cy="100" r="4" fill="hsl(73 100% 50%)" />
                  <circle cx="100" cy="300" r="4" fill="hsl(73 100% 50%)" />
                  <circle cx="300" cy="300" r="4" fill="hsl(73 100% 50%)" />
                </svg>
                
                {/* Central Chip */}
                <div className="relative w-32 h-32 bg-zinc-900 border-2 border-primary/50 rounded-lg flex items-center justify-center">
                  <Cpu className="w-12 h-12 text-primary" />
                  <div 
                    className="absolute inset-0 rounded-lg"
                    style={{
                      boxShadow: '0 0 30px hsl(73 100% 50% / 0.3), inset 0 0 20px hsl(73 100% 50% / 0.1)',
                    }}
                  />
                </div>
                
                {/* Orbiting Elements */}
                <div className="absolute w-64 h-64 border border-primary/20 rounded-full animate-spin" style={{ animationDuration: '20s' }}>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-[0_0_10px_hsl(73_100%_50%)]" />
                </div>
              </div>
            </AnimatedSection>
            
            {/* Right: Content */}
            <AnimatedSection delay={0.2}>
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold font-mono-tech mb-4">
                    Не просто роутер.
                    <br />
                    <span className="text-gradient-primary">Ваш личный сервер.</span>
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    NODE-1 — это не клиентское устройство. Это выделенный вычислительный узел, 
                    созданный для одной цели: обеспечить ваш цифровой суверенитет. 
                    Отказоустойчивость, скорость и невидимость — его фундаментальные принципы.
                  </p>
                </div>
                
                {/* Tech Specs Terminal */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-secondary/60" />
                    <div className="w-3 h-3 rounded-full bg-primary/60" />
                    <span className="ml-3 text-xs font-mono-tech text-muted-foreground">specs.conf</span>
                  </div>
                  <div className="p-4 space-y-2">
                    {techSpecs.map((spec, i) => (
                      <div key={i} className="flex font-mono-tech text-sm">
                        <span className="text-primary w-44 shrink-0">{spec.label}:</span>
                        <span className="text-muted-foreground">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Firmware Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Firmware UI Mockup */}
            <AnimatedSection delay={0.1} direction="left">
              <div className="relative">
                {/* Glow */}
                <div 
                  className="absolute -inset-4 rounded-2xl opacity-30"
                  style={{
                    background: 'radial-gradient(ellipse at center, hsl(73 100% 50% / 0.2) 0%, transparent 70%)',
                    filter: 'blur(20px)',
                  }}
                />
                
                {/* UI Frame */}
                <div className="relative bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-primary" />
                      <span className="font-mono-tech text-sm text-foreground">NODE-1 Control Panel</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs font-mono-tech text-muted-foreground">Online</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Protocol Toggle */}
                    <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-primary" />
                        <div>
                          <div className="text-sm font-medium">Активный протокол</div>
                          <div className="text-xs text-muted-foreground">AmneziaWG Stealth Mode</div>
                        </div>
                      </div>
                      <div className="w-12 h-6 bg-primary/20 rounded-full flex items-center px-1">
                        <div className="w-4 h-4 bg-primary rounded-full ml-auto shadow-[0_0_8px_hsl(73_100%_50%)]" />
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Uptime', value: '99.9%' },
                        { label: 'Latency', value: '12ms' },
                        { label: 'Traffic', value: '2.4TB' },
                      ].map((stat, i) => (
                        <div key={i} className="text-center p-3 bg-zinc-900/30 rounded-lg border border-zinc-800/50">
                          <div className="text-lg font-mono-tech text-primary">{stat.value}</div>
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            {/* Right: Content */}
            <AnimatedSection delay={0.2}>
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold font-mono-tech mb-4">
                    Полный контроль.
                    <br />
                    <span className="text-gradient-primary">В один клик.</span>
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Наша кастомная прошивка — это интуитивный интерфейс для управления 
                    вашей приватной сетью. Переключайте протоколы, мониторьте трафик 
                    и настраивайте правила безопасности без лишних сложностей.
                  </p>
                </div>
                
                {/* Features List */}
                <div className="space-y-4">
                  {firmwareFeatures.map((feature, i) => (
                    <div 
                      key={i} 
                      className="flex items-start gap-4 p-4 bg-card/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(73 100% 50% / 0.1) 0%, transparent 60%)',
          }}
        />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <AnimatedSection delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-bold font-mono-tech mb-6">
              Готовы обрести <span className="text-gradient-primary">суверенитет</span>?
            </h2>
            
            <Link to="/pricing">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg px-8 py-6 glow-primary transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_hsl(73_100%_50%/0.5)]"
              >
                Заказать NODE-1
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <p className="mt-6 text-muted-foreground font-mono-tech text-sm">
              Доступно ограниченное количество устройств. Обеспечьте свой суверенитет сегодня.
            </p>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default Node1;
