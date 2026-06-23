import { Smartphone, Monitor, Download, ArrowRight, Shield, Zap, Lock, Settings, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { AnimatedSection } from '@/components/AnimatedSection';
import { motion } from 'framer-motion';
import { useBlockContent } from '@/hooks/useBlockContent';

const Software = () => {
  // Load content from API
  const { content } = useBlockContent('software_page', {
    hero: {
      badge: 'SOFTWARE',
      title: 'Программное',
      subtitle: 'обеспечение',
      description: 'Клиенты для всех платформ. Управление через Telegram Mini App.',
    },
    apps: [
      {
        title: 'Telegram Mini App',
        description: 'Управление сервером прямо из Telegram',
        features: ['Мониторинг статуса', 'Смена локации', 'Управление ключами', 'Статистика трафика'],
        platform: 'iOS / Android / Web',
        status: 'Доступно',
        downloadLink: '',
      },
      {
        title: 'Desktop Client',
        description: 'Нативное приложение для компьютера',
        features: ['Автоподключение', 'Kill Switch', 'Split Tunneling', 'DNS over HTTPS'],
        platform: 'Windows / macOS / Linux',
        status: 'Доступно',
        downloadLink: '',
      },
      {
        title: 'Mobile Apps',
        description: 'Приложения для смартфонов',
        features: ['WireGuard', 'AmneziaWG', 'Автореконнект', 'Уведомления'],
        platform: 'iOS / Android',
        status: 'Доступно',
        downloadLink: '',
      },
    ],
    features: [
      { title: 'Kill Switch', description: 'Защита от утечек' },
      { title: 'Быстрое подключение', description: 'Один клик' },
      { title: 'Шифрование', description: 'AES-256 + ChaCha20' },
      { title: 'Гибкие настройки', description: 'Полный контроль' },
    ],
    cta: {
      title: 'Готовы начать?',
      description: 'Скачайте клиент для вашей платформы и подключитесь к серверу за минуту.',
      buttonText: 'Скачать клиенты',
      buttonLink: '',
    },
  });

  const iconMap: Record<string, any> = {
    'Telegram Mini App': Smartphone,
    'Desktop Client': Monitor,
    'Mobile Apps': Smartphone,
  };

  const featureIconMap: Record<string, any> = {
    'Kill Switch': Shield,
    'Быстрое подключение': Zap,
    'Шифрование': Lock,
    'Гибкие настройки': Settings,
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium">
                  <Download className="h-4 w-4" />
                  <span className="font-mono text-xs tracking-widest">{content.hero.badge}</span>
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold font-mono-tech mb-6">
                {content.hero.title} <span className="text-gradient-primary">{content.hero.subtitle}</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {content.hero.description}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Apps Grid */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.apps.map((app, index) => {
              const AppIcon = iconMap[app.title] || Monitor;
              return (
              <AnimatedSection key={index} delay={0.1 + index * 0.1}>
                <motion.div
                  className="p-8 bg-card/50 rounded-lg border border-border h-full relative overflow-hidden group"
                  whileHover={{ y: -8, borderColor: 'hsl(73 100% 50% / 0.5)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'radial-gradient(circle at 50% 0%, hsl(73 100% 50% / 0.15) 0%, transparent 70%)',
                    }}
                  />

                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      className="p-3 bg-primary/10 rounded-lg w-fit mb-6"
                      whileHover={{ scale: 1.1, boxShadow: '0 0 20px hsl(73 100% 50% / 0.3)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <AppIcon className="w-8 h-8 text-primary" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold font-mono-tech mb-2 group-hover:text-primary transition-colors">
                      {app.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{app.description}</p>

                    {/* Platform */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs font-mono text-primary">{app.platform}</span>
                      <span className="text-xs px-2 py-1 rounded bg-accent/10 text-accent font-mono">
                        {app.status}
                      </span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {app.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Download button */}
                    {app.downloadLink ? (
                      <Button asChild className="w-full group/btn">
                        <a href={app.downloadLink} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 w-4 h-4" />
                          Скачать
                          <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      </Button>
                    ) : (
                      <Button className="w-full group/btn" disabled>
                        <Download className="mr-2 w-4 h-4" />
                        Скачать
                        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              </AnimatedSection>
            )})}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden bg-card/20">
        <div className="container mx-auto px-4">
          <AnimatedSection delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-bold font-mono-tech text-center mb-12">
              Возможности <span className="text-gradient-primary">клиентов</span>
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {content.features.map((feature, index) => {
              const FeatureIcon = featureIconMap[feature.title] || Settings;
              return (
              <AnimatedSection key={index} delay={0.2 + index * 0.1}>
                <div className="p-6 bg-card rounded-lg border border-border text-center">
                  <div className="inline-flex p-3 bg-primary/10 rounded-lg mb-4">
                    <FeatureIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </AnimatedSection>
            )})}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-bold font-mono-tech mb-6">
              {content.cta.title}
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              {content.cta.description}
            </p>
            {content.cta.buttonLink ? (
              <Button asChild size="lg" className="group">
                <a href={content.cta.buttonLink}>
                  {content.cta.buttonText}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            ) : (
              <Button size="lg" className="group" disabled>
                {content.cta.buttonText}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default Software;
