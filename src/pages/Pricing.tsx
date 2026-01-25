import { Check, ArrowRight, User, Home, Users, Sparkles, Router, Wifi, Tv, Gamepad2, Package, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { AnimatedSection } from '@/components/AnimatedSection';

const plans = [
  {
    icon: User,
    name: 'SOLO',
    subtitle: 'Личный сервер',
    price: '300',
    period: '/мес',
    description: 'Для тех, кому нужна приватность в кармане.',
    features: [
      { value: 'до 3-х устройств' },
      { value: 'WireGuard' },
      { value: 'Выделенный IP' },
      { value: 'Работа с зарубежными банками' },
      { value: 'Базовая поддержка (тикеты)' },
    ],
    accent: false,
    gradient: 'wireguard',
  },
  {
    icon: Home,
    name: 'FAMILY',
    subtitle: 'Семейный сервер',
    price: '650',
    period: '/мес',
    description: 'Один сервер на весь дом. Никакой платы за каждого члена семьи.',
    features: [
      { value: 'до 10 устройств + Smart TV' },
      { value: 'AmneziaWG + WireGuard' },
      { value: 'Обход блокировок DPI' },
      { value: 'Настройка на роутер' },
      { value: 'Приоритетная поддержка' },
    ],
    accent: true,
    badge: 'ХИТ',
    gradient: 'primary',
  },
  {
    icon: Users,
    name: 'COMMUNITY',
    subtitle: 'Для своих',
    price: '1200',
    period: '/мес',
    description: 'Свой узел связи для компании друзей или малого офиса.',
    features: [
      { value: 'до 25 устройств' },
      { value: 'Amnezia + WireGuard + SS' },
      { value: 'Усиленный CPU' },
      { value: '4K стриминг, игры без лагов' },
      { value: 'Персональный инженер' },
    ],
    accent: false,
    gradient: 'amnezia',
  },
];

const hardwarePlan = {
  icon: Router,
  name: 'HARDWARE',
  subtitle: 'Готовый роутер',
  price: '1500',
  period: '/мес',
  priceNote: '+ оборудование',
  description: 'VPN на уровне всей домашней сети. Просто включите роутер в розетку.',
  features: [
    { icon: Wifi, value: 'VPN на уровне Wi-Fi сети' },
    { icon: Package, value: 'Plug & Play: Включил и работает' },
    { icon: Tv, value: 'Поддержка 4K стриминга на ТВ' },
    { icon: Gamepad2, value: 'Обход блокировок для PS5/Xbox' },
  ],
  gradient: 'hardware',
  badge: 'PREMIUM',
};

const Pricing = () => {
  return (
    <Layout>
      <section className="pt-32 pb-24 relative">
        <div className="absolute inset-0 cyber-grid opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-4">
                <span className="font-mono-tech text-xs">PRICING_GRID</span>
              </span>
              <h1 className="text-4xl md:text-6xl font-bold font-['Montserrat'] mb-4">
                Тарифная сетка <span className="text-gradient-primary">3LAB</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Личный виртуальный сервер — вы владеете ресурсами, а не делите их с тысячами пользователей.
              </p>
            </div>
          </AnimatedSection>

          {/* VPN vs Server Rent Separator */}
          <AnimatedSection delay={0.1}>
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#B10000]/10 border border-[#B10000]/30">
                <Zap className="h-4 w-4 text-[#FF3333]" />
                <span className="text-sm font-medium text-[#FF3333]">VPN-only тарифы</span>
              </div>
              <div className="h-px w-16 bg-gradient-to-r from-[#B10000]/50 to-primary/50" />
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Аренда сервера</span>
              </div>
            </div>
          </AnimatedSection>

          {/* Pricing Cards - Main 3 */}
          <AnimatedSection delay={0.15}>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative group transition-all duration-500 ${
                    plan.accent ? 'scale-[1.02] z-10' : 'hover:scale-[1.01]'
                  }`}
                >
                  <div 
                    className={`absolute -inset-[2px] rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-sm ${
                      plan.gradient === 'amnezia' 
                        ? 'bg-gradient-to-br from-accent via-purple-500 to-purple-800' 
                        : plan.gradient === 'primary'
                        ? 'bg-gradient-to-br from-primary via-primary/70 to-primary/40'
                        : 'bg-gradient-to-br from-[#B10000] via-[#8B0000] to-[#500000]'
                    }`}
                  />
                  
                  <div className="relative p-6 md:p-8 rounded-3xl backdrop-blur-xl bg-background/85 border border-white/10 h-full">
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg shadow-primary/40">
                          <Sparkles className="h-3 w-3" />
                          {plan.badge}
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-8 pt-2">
                      <div 
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                          plan.gradient === 'amnezia'
                            ? 'bg-gradient-to-br from-accent/20 to-purple-500/20'
                            : plan.gradient === 'primary'
                            ? 'bg-gradient-to-br from-primary/20 to-primary/10'
                            : 'bg-gradient-to-br from-[#B10000]/30 to-[#B10000]/10'
                        }`}
                      >
                        <plan.icon 
                          className={`h-8 w-8 ${
                            plan.gradient === 'amnezia' 
                              ? 'text-accent' 
                              : plan.gradient === 'primary'
                              ? 'text-primary'
                              : 'text-[#FF3333]'
                          }`} 
                        />
                      </div>
                      
                      <h3 
                        className={`text-2xl font-bold font-['Montserrat'] mb-1 ${
                          plan.gradient === 'amnezia'
                            ? 'bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent'
                            : plan.gradient === 'primary'
                            ? 'text-primary'
                            : 'bg-gradient-to-r from-primary to-[#FF3333] bg-clip-text text-transparent'
                        }`}
                      >
                        {plan.name}
                      </h3>
                      <p className="text-sm text-muted-foreground font-mono-tech mb-4">
                        {plan.subtitle}
                      </p>
                      
                      <div className="flex items-baseline justify-center gap-1 mb-4">
                        <span 
                          className={`text-5xl font-bold ${
                            plan.gradient === 'amnezia' 
                              ? 'bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent' 
                              : plan.gradient === 'primary'
                              ? 'text-primary'
                              : 'bg-gradient-to-r from-primary to-[#FF3333] bg-clip-text text-transparent'
                          }`}
                        >
                          {plan.price}₽
                        </span>
                        <span className="text-muted-foreground font-mono-tech text-sm">{plan.period}</span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {plan.description}
                      </p>
                    </div>

                    <div className="mb-8 p-4 rounded-xl bg-background/50 border border-white/5">
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div 
                              className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                                plan.gradient === 'amnezia' 
                                  ? 'bg-accent/20' 
                                  : plan.gradient === 'primary'
                                  ? 'bg-primary/20'
                                  : 'bg-[#B10000]/20'
                              }`}
                            >
                              <Check 
                                className={`h-3 w-3 ${
                                  plan.gradient === 'amnezia' 
                                    ? 'text-accent' 
                                    : plan.gradient === 'primary'
                                    ? 'text-primary'
                                    : 'text-[#FF3333]'
                                }`}
                              />
                            </div>
                            <span className="font-mono-tech text-sm text-foreground">{feature.value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      className={`w-full font-semibold transition-all duration-300 text-base py-6 hover:scale-105 ${
                        plan.gradient === 'amnezia'
                          ? 'bg-gradient-to-r from-accent to-purple-500 hover:from-accent/90 hover:to-purple-500/90 text-white shadow-lg shadow-accent/30 hover:shadow-accent/50'
                          : plan.gradient === 'primary'
                          ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-[0_0_30px_hsl(73_100%_50%/0.5)]'
                          : 'bg-gradient-to-r from-[#B10000] to-primary hover:from-[#B10000]/90 hover:to-primary/90 text-white shadow-lg shadow-[#B10000]/30 hover:shadow-[#B10000]/50'
                      }`}
                    >
                      Купить
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* HARDWARE Premium Card */}
          <AnimatedSection delay={0.2}>
            <div className="max-w-4xl mx-auto mb-16">
              <div className="relative group transition-all duration-500 hover:scale-[1.01]">
                <div className="absolute -inset-[2px] rounded-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 blur-sm bg-gradient-to-r from-gray-400 via-primary to-gray-300" />
                <div className="absolute -inset-[3px] rounded-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 blur-md bg-gradient-to-r from-primary via-gray-200 to-primary" />
                
                <div className="relative p-8 md:p-10 rounded-3xl backdrop-blur-xl bg-background/90 border border-white/20 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-gray-400/10 to-transparent rounded-full blur-3xl" />
                  
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-5 py-1.5 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 text-background text-xs font-bold shadow-lg">
                      <Sparkles className="h-3 w-3" />
                      {hardwarePlan.badge}
                    </span>
                  </div>

                  <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                    <div className="text-center md:text-left pt-4">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 bg-gradient-to-br from-gray-400/30 via-primary/20 to-gray-300/30 border border-white/10">
                        <Router className="h-10 w-10 text-primary" />
                      </div>
                      
                      <h3 className="text-3xl font-bold font-['Montserrat'] mb-2 bg-gradient-to-r from-gray-200 via-primary to-gray-300 bg-clip-text text-transparent">
                        3LAB {hardwarePlan.name}
                      </h3>
                      <p className="text-sm text-muted-foreground font-mono-tech mb-4">
                        {hardwarePlan.subtitle}
                      </p>
                      
                      <div className="flex items-baseline justify-center md:justify-start gap-2 mb-2">
                        <span className="text-5xl font-bold bg-gradient-to-r from-primary to-gray-300 bg-clip-text text-transparent">
                          {hardwarePlan.price}₽
                        </span>
                        <span className="text-muted-foreground font-mono-tech text-sm">{hardwarePlan.period}</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono-tech mb-6">
                        {hardwarePlan.priceNote}
                      </p>
                      
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {hardwarePlan.description}
                      </p>

                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-gray-300 via-primary to-gray-400 hover:from-gray-200 hover:via-primary/90 hover:to-gray-300 text-background font-semibold shadow-lg shadow-primary/30 hover:shadow-[0_0_30px_hsl(73_100%_50%/0.5)] transition-all duration-300 hover:scale-105"
                      >
                        Заказать комплект
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>

                    <div className="p-6 rounded-2xl bg-background/50 border border-white/10">
                      <div className="font-mono-tech text-xs text-muted-foreground mb-4">
                        // hardware_features
                      </div>
                      <ul className="space-y-4">
                        {hardwarePlan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-gray-400/20 flex items-center justify-center">
                              <feature.icon className="h-5 w-5 text-primary" />
                            </div>
                            <span className="font-mono-tech text-sm text-foreground">{feature.value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Why Better Block */}
          <AnimatedSection delay={0.25}>
            <div className="max-w-4xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary/40 via-accent/40 to-purple-500/40 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative p-8 md:p-10 rounded-2xl backdrop-blur-xl bg-background/90 border border-white/5">
                  <h3 className="text-xl md:text-2xl font-bold font-['Montserrat'] mb-4 text-foreground">
                    Почему наши тарифы <span className="text-gradient-primary">выгоднее</span>?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    В обычном VPN вы платите за каждый аккаунт отдельно. В <span className="text-primary font-semibold">3LAB</span> вы арендуете мощность сервера. Это как аренда квартиры: сколько людей там будет жить — <span className="text-accent font-semibold">решать вам</span>. Мы не ограничиваем количество девайсов технически, мы подбираем мощность сервера так, чтобы всем было комфортно.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;
