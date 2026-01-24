import { Shield, Zap, Eye, EyeOff, Server, Lock, Wifi, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: EyeOff,
    title: 'Протокол AmneziaWG',
    description: 'Устойчив к DPI-анализу — скрывает факт использования VPN от провайдера и РКН.',
  },
  {
    icon: Globe,
    title: 'Чистые IP-адреса',
    description: 'Наши адреса не в спам-листах и не заблокированы популярными сервисами.',
  },
  {
    icon: Lock,
    title: 'Полная конфиденциальность',
    description: 'Мы не ведем логи подключений. Ваши данные — только ваши.',
  },
  {
    icon: Server,
    title: 'Личный сервер',
    description: 'Выделенный VPN-сервер только для вас — никаких соседей по IP.',
  },
];

const plans = [
  {
    icon: Shield,
    name: 'Amnezia',
    tagline: 'Максимальная маскировка',
    description: 'Максимальная маскировка трафика. Работает там, где другие падают.',
    features: [
      'Обход DPI любого уровня',
      'Скрытый протокол',
      'Защита от блокировок РКН',
      'Работа в Китае, Иране, РФ',
    ],
    accent: 'primary',
  },
  {
    icon: Zap,
    name: 'WireGuard',
    tagline: 'Максимальная скорость',
    description: 'Максимальная скорость и минимальный пинг для игр и стриминга.',
    features: [
      'Пинг от 5ms',
      'Скорость до 1 Гбит/с',
      'Идеален для gaming',
      '4K стриминг без буферизации',
    ],
    accent: 'accent',
  },
];

export const VPNSection = () => {
  return (
    <section id="vpn" className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 cyber-grid opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            Новый сервис
          </span>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-['Montserrat'] mb-6">
            Персональный VPN на базе
            <br />
            <span className="text-gradient-primary">Amnezia</span>
            <span className="text-muted-foreground"> & </span>
            <span className="text-gradient-accent">WireGuard</span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Обход любых блокировок РКН. Полный контроль над данными. 
            <br className="hidden md:block" />
            Установка в один клик на мощностях нашего дата-центра.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-5 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* VPN Plans */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl border transition-all duration-500 overflow-hidden ${
                plan.accent === 'primary'
                  ? 'border-primary/50 bg-card hover:glow-primary'
                  : 'border-accent/50 bg-card hover:glow-accent'
              }`}
            >
              {/* Background Glow */}
              <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] opacity-20 ${
                plan.accent === 'primary' ? 'bg-primary' : 'bg-accent'
              }`} />
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl ${
                    plan.accent === 'primary' ? 'bg-primary/10' : 'bg-accent/10'
                  }`}>
                    <plan.icon className={`h-8 w-8 ${
                      plan.accent === 'primary' ? 'text-primary' : 'text-accent'
                    }`} />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold font-['Montserrat'] ${
                      plan.accent === 'primary' ? 'text-primary' : 'text-accent'
                    }`}>
                      {plan.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{plan.tagline}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-foreground mb-6 text-lg">
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Wifi className={`h-4 w-4 flex-shrink-0 ${
                        plan.accent === 'primary' ? 'text-primary' : 'text-accent'
                      }`} />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Price & CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center p-8 rounded-2xl border border-primary/30 bg-card/80 backdrop-blur-sm">
            <p className="text-muted-foreground mb-2">Личный VPN-сервер</p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-sm text-muted-foreground">от</span>
              <span className="text-5xl font-bold text-gradient-primary">300₽</span>
              <span className="text-muted-foreground">/ месяц</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Установка за 5 минут • Поддержка 24/7 • Гарантия возврата 7 дней
            </p>
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg px-8 glow-primary"
            >
              Подключить VPN
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
