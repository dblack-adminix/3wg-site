import { Building2, Cpu, Thermometer, Zap, Lock, Wifi, Shield, Server } from 'lucide-react';
import { useBlockContent } from '@/hooks/useBlockContent';
import { highlightUppercase } from '@/lib/textHighlight';

export const InfrastructureSection = () => {
  const { content } = useBlockContent('infrastructure_section', {
    section_title: 'Инфраструктура Tier III.',
    section_description: 'Бесперебойное питание, охрана 24/7 и каналы связи с резервированием.',
    section_quote: 'Размещайте проекты там, где о них заботятся.',
    feature_1_title: '2N Питание',
    feature_1_description: 'Бесперебойное электроснабжение с полным резервированием',
    feature_2_title: 'Охрана 24/7',
    feature_2_description: 'Биометрический контроль доступа и видеонаблюдение',
    feature_3_title: 'Резервные каналы',
    feature_3_description: 'Множественные магистральные каналы с автопереключением',
    feature_4_title: 'Климат N+1',
    feature_4_description: 'Прецизионное охлаждение с резервированием',
    feature_5_title: 'Физическая защита',
    feature_5_description: 'Клетки Фарадея и защита от проникновения',
    feature_6_title: 'DCIM мониторинг',
    feature_6_description: 'Контроль всех параметров в реальном времени',
    stat_1_label: 'Uptime',
    stat_1_value: '99.98%',
    stat_2_label: 'Температура',
    stat_2_value: '18°C',
    stat_3_label: 'PUE',
    stat_3_value: '1.3',
  });

  const features = [
    {
      icon: Zap,
      title: content.feature_1_title,
      description: content.feature_1_description,
    },
    {
      icon: Shield,
      title: content.feature_2_title,
      description: content.feature_2_description,
    },
    {
      icon: Wifi,
      title: content.feature_3_title,
      description: content.feature_3_description,
    },
    {
      icon: Thermometer,
      title: content.feature_4_title,
      description: content.feature_4_description,
    },
    {
      icon: Lock,
      title: content.feature_5_title,
      description: content.feature_5_description,
    },
    {
      icon: Cpu,
      title: content.feature_6_title,
      description: content.feature_6_description,
    },
  ];

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
              {highlightUppercase(content.section_title)}
            </h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              {content.section_description}
            </p>
            <p className="text-xl text-foreground font-medium mb-8 border-l-4 border-accent pl-4">
              {content.section_quote}
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
              <div className="relative z-10 space-y-3 mb-24">
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
                    <p className="text-xs text-muted-foreground">{content.stat_1_label}</p>
                    <p className="text-lg font-bold text-primary">{content.stat_1_value}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{content.stat_2_label}</p>
                    <p className="text-lg font-bold text-foreground">{content.stat_2_value}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{content.stat_3_label}</p>
                    <p className="text-lg font-bold text-accent">{content.stat_3_value}</p>
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
