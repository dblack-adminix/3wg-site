import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'VPS Start',
    price: '990',
    period: '/мес',
    description: 'Для небольших проектов и тестирования',
    features: [
      '2 vCPU',
      '4 GB RAM',
      '40 GB NVMe SSD',
      '1 Гбит/с канал',
      'IPv4 + IPv6',
    ],
    accent: false,
  },
  {
    name: 'Dedicated Pro',
    price: '15 900',
    period: '/мес',
    description: 'Оптимальное решение для production',
    features: [
      'Intel Xeon E-2388G',
      '64 GB DDR4 ECC',
      '2x 960GB NVMe SSD',
      '10 Гбит/с канал',
      'DDoS защита включена',
      'Бесплатная миграция',
    ],
    accent: true,
    badge: 'Популярный',
  },
  {
    name: 'Colocation',
    price: 'от 4 500',
    period: '/юнит',
    description: 'Размещение вашего оборудования',
    features: [
      '1U в защищенной стойке',
      '1 кВт электропитания',
      '100 Мбит/с канал',
      'Hands & Eyes 24/7',
      'Резервное питание',
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
            Прозрачное <span className="text-gradient-primary">ценообразование</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Выберите подходящий тариф или свяжитесь с нами для индивидуального расчета
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-6 rounded-2xl border transition-all duration-500 ${
                plan.accent
                  ? 'border-primary bg-card glow-primary'
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
                <h3 className="text-xl font-bold font-['Montserrat'] text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-4xl font-bold ${plan.accent ? 'text-primary' : 'text-foreground'}`}>
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">₽{plan.period}</span>
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

        {/* Custom Quote */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Нужна индивидуальная конфигурация?
          </p>
          <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">
            Запросить расчет
          </Button>
        </div>
      </div>
    </section>
  );
};
