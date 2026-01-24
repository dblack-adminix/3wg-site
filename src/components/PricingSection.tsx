import { Check, ArrowRight, Zap, Shield, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    icon: Zap,
    name: 'S - Личный',
    price: '300',
    period: '/мес',
    description: 'Быстрый старт для одного',
    features: [
      'До 3 устройств',
      'Личный IP-адрес',
      'Протокол WireGuard',
      'Установка за 1 минуту',
    ],
    accent: false,
    gradient: 'wireguard',
  },
  {
    icon: Shield,
    name: 'M - Семейный',
    price: '600',
    period: '/мес',
    description: 'Для всей семьи на одном сервере',
    features: [
      'До 10 устройств',
      'AmneziaWG (Обход DPI)',
      'Вся семья на одном сервере',
      'Поддержка 24/7',
    ],
    accent: true,
    badge: 'Популярный',
    gradient: 'amnezia',
  },
  {
    icon: Server,
    name: 'L - Корпоративный',
    price: '1200',
    period: '/мес',
    description: 'Полный контроль для бизнеса',
    features: [
      'Безлимит устройств*',
      'Максимальная скорость',
      'Персональный инженер',
      'Любые протоколы на выбор',
    ],
    accent: false,
    gradient: 'wireguard',
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 cyber-grid opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-4">
            Тарифы VPN
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-['Montserrat'] mb-4">
            Прозрачные <span className="text-gradient-primary">цены</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Выберите подходящий тариф. Все включено, никаких скрытых платежей.
          </p>
        </div>

        {/* Article Block */}
        <div className="max-w-4xl mx-auto mb-16 p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 backdrop-blur-xl">
          <h3 className="text-xl md:text-2xl font-bold font-['Montserrat'] mb-4 text-foreground">
            Почему 3LAB лучше обычного VPN?
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Массовые сервисы используют общие IP, которые легко блокируются. В <span className="text-primary font-semibold">3LAB</span> вы получаете личную виртуальную машину. Это ваш приватный коридор в интернет, <span className="text-accent font-semibold">невидимый для систем фильтрации</span>.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative group transition-all duration-500 ${
                plan.accent ? 'scale-[1.02] z-10' : 'hover:scale-[1.01]'
              }`}
            >
              {/* Gradient Border Effect */}
              <div 
                className={`absolute -inset-[1px] rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 ${
                  plan.gradient === 'amnezia' 
                    ? 'bg-gradient-to-br from-accent via-purple-500 to-accent/50' 
                    : 'bg-gradient-to-br from-primary via-cyan-400 to-primary/50'
                }`}
              />
              
              {/* Card Content with Glassmorphism */}
              <div 
                className={`relative p-6 rounded-2xl backdrop-blur-xl bg-background/80 border border-white/5 h-full ${
                  plan.accent ? 'bg-background/90' : ''
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-gradient-to-r from-accent to-purple-500 text-white text-xs font-bold shadow-lg shadow-accent/30">
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6 pt-2">
                  <div 
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${
                      plan.gradient === 'amnezia'
                        ? 'bg-gradient-to-br from-accent/20 to-purple-500/20'
                        : 'bg-gradient-to-br from-primary/20 to-cyan-400/20'
                    }`}
                  >
                    <plan.icon 
                      className={`h-7 w-7 ${
                        plan.gradient === 'amnezia' ? 'text-accent' : 'text-primary'
                      }`} 
                    />
                  </div>
                  <h3 className="text-xl font-bold font-['Montserrat'] text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span 
                      className={`text-4xl font-bold ${
                        plan.gradient === 'amnezia' 
                          ? 'bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent' 
                          : 'bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent'
                      }`}
                    >
                      {plan.price}₽
                    </span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div 
                        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          plan.gradient === 'amnezia'
                            ? 'bg-accent/20'
                            : 'bg-primary/20'
                        }`}
                      >
                        <Check 
                          className={`h-3 w-3 ${
                            plan.gradient === 'amnezia' ? 'text-accent' : 'text-primary'
                          }`} 
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  className={`w-full font-semibold transition-all duration-300 ${
                    plan.gradient === 'amnezia'
                      ? 'bg-gradient-to-r from-accent to-purple-500 hover:from-accent/90 hover:to-purple-500/90 text-white shadow-lg shadow-accent/30'
                      : 'bg-gradient-to-r from-primary to-cyan-400 hover:from-primary/90 hover:to-cyan-400/90 text-primary-foreground shadow-lg shadow-primary/30'
                  }`}
                >
                  Заказать
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-2">
            Все тарифы включают: установку за 5 минут, гарантию возврата 7 дней, поддержку 24/7
          </p>
          <p className="text-xs text-muted-foreground/60">
            * Безлимит устройств — до 50 одновременных подключений
          </p>
        </div>
      </div>
    </section>
  );
};
