import { Check, ArrowRight, Shield, Zap, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    icon: Zap,
    name: 'WireGuard Basic',
    price: '300',
    period: '/мес',
    description: 'Быстрый VPN для повседневного использования',
    features: [
      'Протокол WireGuard',
      'Скорость до 500 Мбит/с',
      '1 устройство',
      'Чистый IP-адрес',
      'Поддержка в Telegram',
    ],
    accent: false,
  },
  {
    icon: Shield,
    name: 'Amnezia Pro',
    price: '500',
    period: '/мес',
    description: 'Максимальная маскировка для обхода DPI',
    features: [
      'Протокол AmneziaWG',
      'Обход DPI-фильтров',
      '3 устройства',
      'Чистый IP-адрес',
      'Telegram-бот управления',
      'Приоритетная поддержка',
    ],
    accent: true,
    badge: 'Популярный',
  },
  {
    icon: Server,
    name: 'Личный VPS',
    price: '990',
    period: '/мес',
    description: 'Полный контроль над своим сервером',
    features: [
      'Выделенный VPS 1GB RAM',
      'Amnezia + WireGuard',
      'Безлимит устройств',
      'Root-доступ',
      'Свой домен/IP',
      'Установка любого ПО',
    ],
    accent: false,
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
            Тарифы
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-['Montserrat'] mb-4">
            Прозрачные <span className="text-gradient-primary">цены</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Выберите подходящий тариф. Все включено, никаких скрытых платежей.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-6 rounded-2xl border transition-all duration-500 ${
                plan.accent
                  ? 'border-primary bg-card glow-primary scale-[1.02]'
                  : 'border-border bg-card/50 hover:border-primary/30'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6 pt-2">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                  plan.accent ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  <plan.icon className={`h-6 w-6 ${plan.accent ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <h3 className="text-xl font-bold font-['Montserrat'] text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-4xl font-bold ${plan.accent ? 'text-primary' : 'text-foreground'}`}>
                    {plan.price}₽
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check className={`h-5 w-5 flex-shrink-0 ${plan.accent ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                className={`w-full ${
                  plan.accent
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                Заказать
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-2">
            Все тарифы включают: установку за 5 минут, гарантию возврата 7 дней, поддержку 24/7
          </p>
          <p className="text-sm text-muted-foreground">
            Нужен индивидуальный расчет? <a href="#support" className="text-accent hover:underline">Свяжитесь с нами</a>
          </p>
        </div>
      </div>
    </section>
  );
};
