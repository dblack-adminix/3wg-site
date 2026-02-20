import { Wifi, Activity, Users, Settings, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBlockContent } from '@/hooks/useBlockContent';
import { highlightUppercase } from '@/lib/textHighlight';

export const MiniAppShowcase = () => {
  const { content } = useBlockContent('services_section', {
    section_title: 'Управляйте сервером прямо из Telegram',
    section_subtitle: 'Наше мини-приложение превращает мессенджер в полноценную админ-панель. Мониторинг нагрузки, управление устройствами, смена протокола — всё в одном клике.',
    feature_1_title: 'Мониторинг в реальном времени',
    feature_1_description: 'cpu_load • bandwidth • latency',
    feature_2_title: 'Управление устройствами',
    feature_2_description: 'add_device • revoke_access • qr_invite',
    feature_3_title: 'Настройка протоколов',
    feature_3_description: 'wireguard • amnezia • shadowsocks',
    button_text: 'Открыть Mini App',
    button_url: 'https://t.me/your_bot',
  });

  const features = [
    {
      icon: Activity,
      title: content.feature_1_title,
      description: content.feature_1_description,
      color: 'primary',
    },
    {
      icon: Users,
      title: content.feature_2_title,
      description: content.feature_2_description,
      color: 'accent',
    },
    {
      icon: Settings,
      title: content.feature_3_title,
      description: content.feature_3_description,
      color: 'red',
    },
  ];

  return (
    <section id="mini-app" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Left - Phone Mockup */}
          <div className="flex justify-center lg:justify-end order-2 lg:order-1">
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative w-[280px] h-[580px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[40px] p-2 shadow-2xl">
                {/* Inner Bezel */}
                <div className="relative w-full h-full bg-background rounded-[32px] overflow-hidden border border-white/10">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between px-6 py-3 bg-background/80">
                    <span className="text-xs font-mono-tech text-muted-foreground">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 border border-muted-foreground rounded-sm">
                        <div className="w-3 h-full bg-primary rounded-sm" />
                      </div>
                    </div>
                  </div>
                  
                  {/* App Content */}
                  <div className="p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-primary">3LAB.PRO</h3>
                        <p className="text-[10px] text-muted-foreground font-mono-tech">MINI_APP v2.0</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary pulse-indicator" />
                        <span className="text-[10px] font-mono-tech text-primary">SECURE</span>
                      </div>
                    </div>
                    
                    {/* Connection Card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Wifi className="h-5 w-5 text-primary" />
                          <span className="font-bold text-sm">CONNECTED</span>
                        </div>
                        <div className="w-10 h-5 bg-primary rounded-full relative">
                          <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-background rounded-full" />
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-mono-tech">vpn.3lab.pro:51820</p>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-3 rounded-xl bg-card/50 border border-white/5 text-center">
                        <div className="text-lg font-bold text-primary font-mono-tech">4</div>
                        <div className="text-[8px] text-muted-foreground font-mono-tech">DEVICES</div>
                      </div>
                      <div className="p-3 rounded-xl bg-card/50 border border-white/5 text-center">
                        <div className="text-lg font-bold text-accent font-mono-tech">5ms</div>
                        <div className="text-[8px] text-muted-foreground font-mono-tech">PING</div>
                      </div>
                      <div className="p-3 rounded-xl bg-card/50 border border-white/5 text-center">
                        <div className="text-lg font-bold text-[#FF3333] font-mono-tech">42%</div>
                        <div className="text-[8px] text-muted-foreground font-mono-tech">LOAD</div>
                      </div>
                    </div>
                    
                    {/* Circular Progress */}
                    <div className="flex justify-center py-4">
                      <div className="relative w-32 h-32">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="64" cy="64" r="56" fill="none" stroke="hsl(0 0% 15%)" strokeWidth="8" />
                          <circle 
                            cx="64" cy="64" r="56" fill="none" 
                            stroke="#CCFF00" strokeWidth="8" strokeLinecap="round"
                            strokeDasharray="352" strokeDashoffset="150"
                            style={{ filter: 'drop-shadow(0 0 8px #CCFF0080)' }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold text-primary font-mono-tech">58%</span>
                          <span className="text-[8px] text-muted-foreground font-mono-tech">BANDWIDTH</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <button className="flex-1 p-3 rounded-xl bg-primary/10 border border-primary/30 flex flex-col items-center">
                        <Users className="h-4 w-4 text-primary mb-1" />
                        <span className="text-[9px] font-mono-tech text-muted-foreground">DEVICES</span>
                      </button>
                      <button className="flex-1 p-3 rounded-xl bg-card/50 border border-white/10 flex flex-col items-center">
                        <Activity className="h-4 w-4 text-muted-foreground mb-1" />
                        <span className="text-[9px] font-mono-tech text-muted-foreground">STATS</span>
                      </button>
                      <button className="flex-1 p-3 rounded-xl bg-card/50 border border-white/10 flex flex-col items-center">
                        <Settings className="h-4 w-4 text-muted-foreground mb-1" />
                        <span className="text-[9px] font-mono-tech text-muted-foreground">CONFIG</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Home Indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full" />
                </div>
              </div>
              
              {/* Glow Effects */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 rounded-[50px] blur-2xl -z-10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/30 rounded-full blur-[80px] -z-10" />
            </div>
          </div>
          
          {/* Right - Text Content */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5 text-accent text-sm font-medium mb-6">
              <span className="font-mono-tech text-xs">TELEGRAM_MINI_APP</span>
            </span>
            
            <h2 className="text-3xl md:text-5xl font-bold font-['Montserrat'] mb-6">
              {highlightUppercase(content.section_title)}
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {highlightUppercase(content.section_subtitle)}
            </p>
            
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-white/10">
                  <div 
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      feature.color === 'primary' 
                        ? 'bg-primary/20' 
                        : feature.color === 'accent'
                        ? 'bg-accent/20'
                        : 'bg-[#B10000]/20'
                    }`}
                  >
                    <feature.icon 
                      className={`h-5 w-5 ${
                        feature.color === 'primary' 
                          ? 'text-primary' 
                          : feature.color === 'accent'
                          ? 'text-accent'
                          : 'text-[#FF3333]'
                      }`}
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground font-mono-tech">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <a href={content.button_url} target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold group transition-all duration-300 hover:scale-105"
              >
                {content.button_text}
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
