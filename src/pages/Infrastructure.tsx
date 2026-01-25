import { Building2, Cpu, Thermometer, Zap, Lock, Wifi, Shield, Server, Globe, MapPin } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { AnimatedSection } from '@/components/AnimatedSection';

const features = [
  {
    icon: Zap,
    title: '2N Питание',
    description: 'Бесперебойное электроснабжение с полным резервированием',
  },
  {
    icon: Shield,
    title: 'Охрана 24/7',
    description: 'Биометрический контроль доступа и видеонаблюдение',
  },
  {
    icon: Wifi,
    title: 'Резервные каналы',
    description: 'Множественные магистральные каналы с автопереключением',
  },
  {
    icon: Thermometer,
    title: 'Климат N+1',
    description: 'Прецизионное охлаждение с резервированием',
  },
  {
    icon: Lock,
    title: 'Физическая защита',
    description: 'Клетки Фарадея и защита от проникновения',
  },
  {
    icon: Cpu,
    title: 'DCIM мониторинг',
    description: 'Контроль всех параметров в реальном времени',
  },
];

const locations = [
  { city: 'Москва', country: 'RU', latency: '5ms', status: 'online' },
  { city: 'Франкфурт', country: 'DE', latency: '25ms', status: 'online' },
  { city: 'Амстердам', country: 'NL', latency: '30ms', status: 'online' },
  { city: 'Хельсинки', country: 'FI', latency: '35ms', status: 'online' },
  { city: 'Лондон', country: 'UK', latency: '40ms', status: 'maintenance' },
  { city: 'Сингапур', country: 'SG', latency: '120ms', status: 'online' },
];

const techSpecs = [
  { label: 'Power', value: '2N Redundancy', detail: 'UPS + Diesel Generator' },
  { label: 'Cooling', value: 'N+1', detail: 'Precision Air Conditioning' },
  { label: 'Security', value: 'Tier III', detail: 'Biometric + CCTV + Armed Guards' },
  { label: 'Network', value: '100 Gbps', detail: 'Multiple Fiber Backbones' },
  { label: 'Uptime SLA', value: '99.98%', detail: 'Financial Guarantee' },
  { label: 'PUE', value: '1.3', detail: 'Energy Efficient' },
];

const Infrastructure = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-transparent to-muted/20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5 text-accent text-sm font-medium mb-6">
                <Building2 className="h-4 w-4" />
                <span className="font-mono-tech text-xs">TIER_III_DATACENTER</span>
              </span>
              
              <h1 className="text-4xl md:text-6xl font-bold font-['Montserrat'] mb-4">
                Инфраструктура <span className="text-gradient-accent">Tier III</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Бесперебойное питание, охрана 24/7 и каналы связи с резервированием.
                <br />
                <span className="text-accent font-semibold">Размещайте проекты там, где о них заботятся.</span>
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-6 rounded-2xl border border-border bg-card/50 hover:border-accent/30 transition-all duration-300 group hover:scale-105"
                >
                  <div className="p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Server Locations */}
      <section className="py-24 relative">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-['Montserrat'] mb-4">
                Серверные <span className="text-gradient-primary">локации</span>
              </h2>
              <p className="text-muted-foreground">
                Глобальная сеть точек присутствия
              </p>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={0.1}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {locations.map((loc, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                    loc.status === 'online' 
                      ? 'bg-card/50 border-border hover:border-primary/30' 
                      : 'bg-card/30 border-yellow-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      loc.status === 'online' ? 'bg-primary pulse-indicator' : 'bg-yellow-500 animate-pulse'
                    }`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{loc.city}</span>
                        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {loc.country}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-mono-tech ${
                      loc.status === 'online' ? 'text-primary' : 'text-yellow-500'
                    }`}>
                      {loc.latency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Tech Specs */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-['Montserrat'] mb-4">
                Технические <span className="text-gradient-accent">характеристики</span>
              </h2>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={0.1}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {techSpecs.map((spec, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-card/50 border border-border hover:border-accent/30 transition-all duration-300"
                >
                  <div className="text-xs text-muted-foreground font-mono-tech mb-2">
                    {spec.label}
                  </div>
                  <div className="text-2xl font-bold text-accent mb-1">
                    {spec.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {spec.detail}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Server Rack Visual */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <div className="relative rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8 overflow-hidden">
                <div className="absolute inset-0 cyber-grid opacity-30" />
                
                <div className="relative z-10 space-y-3">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border group hover:border-primary/30 transition-all"
                    >
                      <div className="flex gap-1">
                        <div className={`w-2 h-2 rounded-full ${i < 9 ? 'bg-primary pulse-indicator' : 'bg-muted-foreground'}`} />
                        <div className={`w-2 h-2 rounded-full ${i < 9 ? 'bg-primary' : 'bg-muted-foreground'}`} />
                      </div>
                      <div className="flex-1 h-2 bg-muted rounded overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-accent to-accent/50 rounded transition-all duration-1000"
                          style={{ width: `${Math.random() * 40 + 30}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">
                        SRV-{String(i + 1).padStart(3, '0')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-background/80 backdrop-blur-sm border border-accent/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Uptime</p>
                      <p className="text-lg font-bold text-primary">99.98%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Температура</p>
                      <p className="text-lg font-bold text-foreground">21°C</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">PUE</p>
                      <p className="text-lg font-bold text-accent">1.3</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Nodes</p>
                      <p className="text-lg font-bold text-primary">14</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default Infrastructure;
