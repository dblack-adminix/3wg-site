import { Shield, Zap, Lock, EyeOff, Server, Fingerprint, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: EyeOff,
    title: 'Протокол Amnezia',
    description: 'Невидимость для DPI-фильтров. Меняет «почерк» пакетов, делая их похожими на обычный веб-серфинг.',
    accent: 'primary',
  },
  {
    icon: Zap,
    title: 'WireGuard',
    description: 'Высокая скорость и низкий пинг. Идеален для игр, стриминга и работы без задержек.',
    accent: 'accent',
  },
  {
    icon: Lock,
    title: 'Никаких логов',
    description: 'Полная приватность на уровне железа дата-центра. Мы физически не храним данные о подключениях.',
    accent: 'primary',
  },
];

const cards = [
  {
    icon: Shield,
    name: 'Amnezia VPN',
    tagline: 'Обход любых блокировок',
    description: 'Работает там, где падают обычные VPN. Устойчив к блокировкам РКН, Китая, Ирана.',
    features: ['DPI-resistant протокол', 'Маскировка под HTTPS', 'Смена сигнатур пакетов', 'Работа через CDN'],
    price: 'от 350₽',
    accent: 'primary',
  },
  {
    icon: Zap,
    name: 'WireGuard',
    tagline: 'Максимальная скорость',
    description: 'Современный протокол для тех, кому важна скорость. Минимальный пинг, максимум производительности.',
    features: ['Пинг от 5ms', 'До 1 Гбит/с', '4K стриминг', 'Игры без лагов'],
    price: 'от 300₽',
    accent: 'accent',
  },
  {
    icon: Server,
    name: 'Личный сервер',
    tagline: 'Полный контроль',
    description: 'Выделенный VPS только для вас. Никаких соседей, чистый IP, root-доступ.',
    features: ['Чистый IP-адрес', 'Root-доступ', 'Любые настройки', 'Ваш личный exit-node'],
    price: 'от 500₽',
    accent: 'primary',
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
            VPN-серверы
          </span>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-['Montserrat'] mb-6">
            Личные серверы для
            <br />
            <span className="text-gradient-primary">обхода блокировок.</span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Вы арендуете не «аккаунт в сервисе», а целый виртуальный сервер, 
            где вы — единственный хозяин.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group p-6 rounded-2xl border bg-card/50 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] ${
                feature.accent === 'primary' 
                  ? 'border-primary/30 hover:border-primary/60 hover:glow-primary' 
                  : 'border-accent/30 hover:border-accent/60 hover:glow-accent'
              }`}
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 ${
                feature.accent === 'primary' ? 'bg-primary/10' : 'bg-accent/10'
              }`}>
                <feature.icon className={`h-7 w-7 ${
                  feature.accent === 'primary' ? 'text-primary' : 'text-accent'
                }`} />
              </div>
              <h3 className="text-xl font-bold font-['Montserrat'] text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`relative p-6 rounded-2xl border transition-all duration-500 overflow-hidden group hover:scale-[1.02] ${
                card.accent === 'primary'
                  ? 'border-primary/40 bg-card hover:glow-primary'
                  : 'border-accent/40 bg-card hover:glow-accent'
              }`}
            >
              {/* Background Glow */}
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-20 transition-opacity group-hover:opacity-40 ${
                card.accent === 'primary' ? 'bg-primary' : 'bg-accent'
              }`} />
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-xl ${
                    card.accent === 'primary' ? 'bg-primary/10' : 'bg-accent/10'
                  }`}>
                    <card.icon className={`h-6 w-6 ${
                      card.accent === 'primary' ? 'text-primary' : 'text-accent'
                    }`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold font-['Montserrat'] ${
                      card.accent === 'primary' ? 'text-primary' : 'text-accent'
                    }`}>
                      {card.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{card.tagline}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {card.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {card.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <Fingerprint className={`h-3.5 w-3.5 flex-shrink-0 ${
                        card.accent === 'primary' ? 'text-primary' : 'text-accent'
                      }`} />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className={`text-2xl font-bold ${
                    card.accent === 'primary' ? 'text-primary' : 'text-accent'
                  }`}>
                    {card.price}
                    <span className="text-sm text-muted-foreground font-normal">/мес</span>
                  </span>
                  <Button 
                    size="sm"
                    className={card.accent === 'primary' 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                      : 'bg-accent text-accent-foreground hover:bg-accent/90'
                    }
                  >
                    Заказать
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Установка за 5 минут • Поддержка 24/7 • Гарантия возврата 7 дней
          </p>
          <Button 
            size="lg" 
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 font-semibold group"
          >
            Сравнить тарифы
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};
