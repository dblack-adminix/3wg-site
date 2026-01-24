import { Server, HardDrive, Cloud, Network, Shield, Headphones } from 'lucide-react';

const services = [
  {
    icon: HardDrive,
    title: 'Colocation',
    description: 'Аренда стоек и юнитов в защищенном дата-центре.',
    features: ['Tier III сертификация', 'Резервное питание', 'Охлаждение N+1'],
    accent: 'primary',
  },
  {
    icon: Server,
    title: 'Dedicated',
    description: 'Выделенные серверы под любые нагрузки.',
    features: ['Intel Xeon / AMD EPYC', 'NVMe SSD', 'До 10 Гбит/с'],
    accent: 'primary',
  },
  {
    icon: Cloud,
    title: 'Cloud VDS/VPS',
    description: 'Масштабируемые облачные VDS/VPS.',
    features: ['Мгновенный деплой', 'API управление', 'Auto-scaling'],
    accent: 'accent',
  },
  {
    icon: Network,
    title: 'Network',
    description: 'Высокоскоростные каналы и пиринг.',
    features: ['BGP сессии', 'DDoS защита', 'Прямые пиринги'],
    accent: 'primary',
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Комплексная защита инфраструктуры.',
    features: ['WAF / IDS / IPS', 'Backup & DR', 'Compliance'],
    accent: 'accent',
  },
  {
    icon: Headphones,
    title: 'Support',
    description: 'Техническая поддержка и консалтинг.',
    features: ['24/7 мониторинг', 'SLA до 15 минут', 'DevOps команда'],
    accent: 'primary',
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="py-24 relative">
      <div className="absolute inset-0 cyber-grid opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-4">
            Сервисы
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-['Montserrat'] mb-4">
            Полный стек <span className="text-gradient-primary">инфраструктурных</span> решений
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            От физического размещения до облачных сервисов — всё под ключ
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:bg-card"
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${service.accent === 'accent' ? 'from-accent/5' : 'from-primary/5'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${service.accent === 'accent' ? 'bg-accent/10' : 'bg-primary/10'} mb-4`}>
                  <service.icon className={`h-6 w-6 ${service.accent === 'accent' ? 'text-accent' : 'text-primary'}`} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold font-['Montserrat'] mb-2 text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground mb-4">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-muted-foreground">
                      <span className={`w-1.5 h-1.5 rounded-full ${service.accent === 'accent' ? 'bg-accent' : 'bg-primary'} mr-2`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
