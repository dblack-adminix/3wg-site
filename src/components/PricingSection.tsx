import { Check, ArrowRight, User, Home, Users, Sparkles, Router, Wifi, Tv, Gamepad2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useBlockContent } from '@/hooks/useBlockContent';
import { highlightUppercase } from '@/lib/textHighlight';

export const PricingSection = () => {
  const { content } = useBlockContent('pricing_section', {
    section_title: 'Тарифная сетка 3LAB',
    section_subtitle: 'Личный виртуальный сервер — вы владеете ресурсами, а не делите их с тысячами пользователей.',
    
    solo_name: 'SOLO',
    solo_subtitle: 'Личный сервер',
    solo_price: '300',
    solo_description: 'Для тех, кому нужна приватность в кармане.',
    solo_feature_1: 'до 3-х устройств',
    solo_feature_2: 'WireGuard',
    solo_feature_3: 'Выделенный IP',
    solo_feature_4: 'Работа с зарубежными банками',
    solo_feature_5: 'Базовая поддержка (тикеты)',
    solo_button: 'Купить',
    solo_button_url: '/generator',
    
    family_name: 'FAMILY',
    family_subtitle: 'Семейный сервер',
    family_price: '650',
    family_description: 'Один сервер на весь дом. Никакой платы за каждого члена семьи.',
    family_feature_1: 'до 10 устройств + Smart TV',
    family_feature_2: 'AmneziaWG + WireGuard',
    family_feature_3: 'Обход блокировок DPI',
    family_feature_4: 'Настройка на роутер',
    family_feature_5: 'Приоритетная поддержка',
    family_button: 'Купить',
    family_button_url: '/generator',
    
    community_name: 'COMMUNITY',
    community_subtitle: 'Для своих',
    community_price: '1200',
    community_description: 'Свой узел связи для компании друзей или малого офиса.',
    community_feature_1: 'до 25 устройств',
    community_feature_2: 'Amnezia + WireGuard + SS',
    community_feature_3: 'Усиленный CPU',
    community_feature_4: '4K стриминг, игры без лагов',
    community_feature_5: 'Персональный инженер',
    community_button: 'Купить',
    community_button_url: '/generator',
    
    hardware_name: 'HARDWARE',
    hardware_subtitle: 'Готовый роутер',
    hardware_price: '1500',
    hardware_price_note: '+ оборудование',
    hardware_description: 'VPN на уровне всей домашней сети. Просто включите роутер в розетку.',
    hardware_feature_1: 'VPN на уровне Wi-Fi сети',
    hardware_feature_2: 'Plug & Play: Включил и работает',
    hardware_feature_3: 'Поддержка 4K стриминга на ТВ',
    hardware_feature_4: 'Обход блокировок для PS5/Xbox',
    hardware_button: 'Заказать комплект',
    hardware_button_url: '/generator',
    
    router_article_title: 'Забудьте про настройку VPN на каждом устройстве',
    router_article_text: 'Устали объяснять бабушке, как включать VPN на планшете, или воевать с телевизором, который не открывает YouTube? Тариф 3LAB HARDWARE решает это раз и навсегда. Мы берём надёжный роутер, прошиваем его нашими алгоритмами и привозим вам. Весь трафик внутри вашего дома автоматически шифруется и проходит через ваш личный сервер в нашем дата-центре. Это максимально безопасный и удобный способ вернуть привычный интернет в каждую комнату.',
    
    why_better_title: 'Почему наши тарифы выгоднее?',
    why_better_text: 'В обычном VPN вы платите за каждый аккаунт отдельно. В 3LAB вы арендуете мощность сервера. Это как аренда квартиры: сколько людей там будет жить — решать вам. Мы не ограничиваем количество девайсов технически, мы подбираем мощность сервера так, чтобы всем было комфортно.',
  });

  const plans = [
    {
      icon: User,
      name: content.solo_name,
      subtitle: content.solo_subtitle,
      price: content.solo_price,
      period: '/мес',
      description: content.solo_description,
      features: [
        { value: content.solo_feature_1 },
        { value: content.solo_feature_2 },
        { value: content.solo_feature_3 },
        { value: content.solo_feature_4 },
        { value: content.solo_feature_5 },
      ],
      button: content.solo_button,
      buttonUrl: content.solo_button_url || '/generator',
      accent: false,
      gradient: 'wireguard',
    },
    {
      icon: Home,
      name: content.family_name,
      subtitle: content.family_subtitle,
      price: content.family_price,
      period: '/мес',
      description: content.family_description,
      features: [
        { value: content.family_feature_1 },
        { value: content.family_feature_2 },
        { value: content.family_feature_3 },
        { value: content.family_feature_4 },
        { value: content.family_feature_5 },
      ],
      button: content.family_button,
      buttonUrl: content.family_button_url || '/generator',
      accent: true,
      badge: 'ХИТ',
      gradient: 'primary',
    },
    {
      icon: Users,
      name: content.community_name,
      subtitle: content.community_subtitle,
      price: content.community_price,
      period: '/мес',
      description: content.community_description,
      features: [
        { value: content.community_feature_1 },
        { value: content.community_feature_2 },
        { value: content.community_feature_3 },
        { value: content.community_feature_4 },
        { value: content.community_feature_5 },
      ],
      button: content.community_button,
      buttonUrl: content.community_button_url || '/generator',
      accent: false,
      gradient: 'amnezia',
    },
  ];

  const hardwarePlan = {
    icon: Router,
    name: content.hardware_name,
    subtitle: content.hardware_subtitle,
    price: content.hardware_price,
    period: '/мес',
    priceNote: content.hardware_price_note,
    description: content.hardware_description,
    features: [
      { icon: Wifi, value: content.hardware_feature_1 },
      { icon: Package, value: content.hardware_feature_2 },
      { icon: Tv, value: content.hardware_feature_3 },
      { icon: Gamepad2, value: content.hardware_feature_4 },
    ],
    button: content.hardware_button,
    buttonUrl: content.hardware_button_url || '/generator',
    gradient: 'hardware',
    badge: 'PREMIUM',
  };

  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 cyber-grid opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-4">
            <span className="font-mono-tech text-xs">PRICING_GRID</span>
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-['Montserrat'] mb-4">
            {content.section_title?.split('3LAB')[0]}
            <span className="text-gradient-primary">3LAB</span>
            {content.section_title?.split('3LAB')[1]}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {content.section_subtitle}
          </p>
        </div>

        {/* Pricing Cards - Main 3 */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative group transition-all duration-500 ${
                plan.accent ? 'scale-[1.02] z-10' : 'hover:scale-[1.01]'
              }`}
            >
              {/* Gradient Border Effect */}
              <div 
                className={`absolute -inset-[2px] rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-sm ${
                  plan.gradient === 'amnezia' 
                    ? 'bg-gradient-to-br from-accent via-purple-500 to-purple-800' 
                    : plan.gradient === 'primary'
                    ? 'bg-gradient-to-br from-primary via-primary/70 to-primary/40'
                    : 'bg-gradient-to-br from-[#B10000] via-[#8B0000] to-[#500000]'
                }`}
              />
              
              {/* Card Content with Glassmorphism */}
              <div className="relative p-6 md:p-8 rounded-3xl backdrop-blur-xl bg-background/85 border border-white/10 h-full">
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg shadow-primary/40">
                      <Sparkles className="h-3 w-3" />
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan Header */}
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

                {/* Features - Monospace Style */}
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

                {/* CTA */}
                <Link to={plan.buttonUrl}>
                  <Button
                    className={`w-full font-semibold transition-all duration-300 text-base py-6 ${
                      plan.gradient === 'amnezia'
                        ? 'bg-gradient-to-r from-accent to-purple-500 hover:from-accent/90 hover:to-purple-500/90 text-white shadow-lg shadow-accent/30 hover:shadow-accent/50'
                        : plan.gradient === 'primary'
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50'
                        : 'bg-gradient-to-r from-[#B10000] to-primary hover:from-[#B10000]/90 hover:to-primary/90 text-white shadow-lg shadow-[#B10000]/30 hover:shadow-[#B10000]/50'
                    }`}
                  >
                    {plan.button}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* HARDWARE Premium Card */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative group transition-all duration-500 hover:scale-[1.01]">
            {/* Metallic Silver + Acid Green Glow */}
            <div className="absolute -inset-[2px] rounded-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 blur-sm bg-gradient-to-r from-gray-400 via-primary to-gray-300" />
            <div className="absolute -inset-[3px] rounded-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 blur-md bg-gradient-to-r from-primary via-gray-200 to-primary" />
            
            {/* Card Content */}
            <div className="relative p-8 md:p-10 rounded-3xl backdrop-blur-xl bg-background/90 border border-white/20 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-gray-400/10 to-transparent rounded-full blur-3xl" />
              
              {/* Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 px-5 py-1.5 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 text-background text-xs font-bold shadow-lg">
                  <Sparkles className="h-3 w-3" />
                  {hardwarePlan.badge}
                </span>
              </div>

              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                {/* Left Side - Info */}
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

                  <Link to={hardwarePlan.buttonUrl}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-gray-300 via-primary to-gray-400 hover:from-gray-200 hover:via-primary/90 hover:to-gray-300 text-background font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
                    >
                      {hardwarePlan.button}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {/* Right Side - Features */}
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

        {/* Router Article Block */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative group">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-gray-400/40 via-primary/40 to-gray-300/40 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-8 md:p-10 rounded-2xl backdrop-blur-xl bg-background/90 border border-white/5">
              <h3 className="text-xl md:text-2xl font-bold font-['Montserrat'] mb-4 text-foreground">
                {highlightUppercase(content.router_article_title)}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {highlightUppercase(content.router_article_text)}
              </p>
            </div>
          </div>
        </div>

        {/* Why Our Tariffs Are Better Block */}
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary/40 via-accent/40 to-purple-500/40 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-8 md:p-10 rounded-2xl backdrop-blur-xl bg-background/90 border border-white/5">
              <h3 className="text-xl md:text-2xl font-bold font-['Montserrat'] mb-4 text-foreground">
                {highlightUppercase(content.why_better_title)}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {highlightUppercase(content.why_better_text)}
              </p>
              
              <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary font-mono-tech">∞</div>
                    <div className="text-xs text-muted-foreground font-mono-tech">devices_per_plan</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent font-mono-tech">0₽</div>
                    <div className="text-xs text-muted-foreground font-mono-tech">extra_user_fee</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#FF3333] font-mono-tech">100%</div>
                    <div className="text-xs text-muted-foreground font-mono-tech">resources_yours</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-2 font-mono-tech text-sm">
            setup: 5min • refund: 7d • uptime: 99.9%
          </p>
        </div>
      </div>
    </section>
  );
};
