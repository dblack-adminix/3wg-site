import { Building2, Cpu, Thermometer, Zap, Lock, Wifi, Shield, Server } from 'lucide-react';

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

export const InfrastructureSection = () => {
  return (
    <section id="infrastructure" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-transparent to-muted/20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-accent/30 bg-accent/5 text-accent text-sm font-medium mb-4">
              <Building2 className="h-4 w-4" />
              Дата-центр
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-['Montserrat'] mb-6">
              Инфраструктура <span className="text-gradient-accent">Tier III.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              Бесперебойное питание, охрана 24/7 и каналы связи с резервированием.
            </p>
            <p className="text-xl text-foreground font-medium mb-8 border-l-4 border-accent pl-4">
              Размещайте проекты там, где о них заботятся.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card/50 hover:border-accent/30 transition-all duration-300 group"
                >
                  <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <feature.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            {/* Decorative Elements */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-3xl opacity-30" />
            
            <div className="relative rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8 overflow-hidden">
              {/* Grid Pattern */}
              <div className="absolute inset-0 cyber-grid opacity-30" />
              
              {/* Server Rack Visualization */}
              <div className="relative z-10 space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border group hover:border-primary/30 transition-all"
                  >
                    <div className="flex gap-1">
                      <div className={`w-2 h-2 rounded-full ${i < 7 ? 'bg-primary pulse-indicator' : 'bg-muted-foreground'}`} />
                      <div className={`w-2 h-2 rounded-full ${i < 7 ? 'bg-primary' : 'bg-muted-foreground'}`} />
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

              {/* Stats Overlay */}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
