import { Layout } from '@/components/Layout';
import { HeroSection } from '@/components/HeroSection';
import { VPNSection } from '@/components/VPNSection';
import { PricingSection } from '@/components/PricingSection';
import { MiniAppShowcase } from '@/components/MiniAppShowcase';
import { HardwareSection } from '@/components/HardwareSection';
import { InfrastructureSection } from '@/components/InfrastructureSection';
import { StatusWidget } from '@/components/StatusWidget';
import { FAQSection } from '@/components/FAQSection';
import { ArticlesSection } from '@/components/ArticlesSection';
import { TelegramSection } from '@/components/TelegramSection';
import { AnimatedSection } from '@/components/AnimatedSection';
import { DataStream } from '@/components/DataStream';
import { useHomePageSettings } from '@/hooks/useHomePageSettings';
import { useBlockContent } from '@/hooks/useBlockContent';
import { Link } from 'react-router-dom';

const Index = () => {
  const { settings, isLoading } = useHomePageSettings();
  const { content: keeneticContent } = useBlockContent('keenetic_section', {
    title: 'Прошивка для Keenetic',
    description: 'Специальная прошивка для роутеров Keenetic с поддержкой VPN',
    button_text: 'Подробнее →',
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-primary font-mono">Загрузка...</div>
        </div>
      </Layout>
    );
  }

  // Дефолтный порядок блоков
  const defaultOrder = [
    'keenetic_section',
    'vpn_section',
    'pricing_section',
    'services_section',
    'hardware_section',
    'infrastructure_section',
    'faq_section',
    'articles_section',
    'telegram_section',
    'status_widget',
  ];

  const blockOrder = settings.block_order || defaultOrder;

  // Маппинг ключей блоков на компоненты
  const blockComponents: Record<string, React.ReactNode> = {
    keenetic_section: (
      <AnimatedSection delay={0.1}>
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-mono mb-4">
              {keeneticContent.title?.split('Keenetic')[0]}
              <span className="text-primary">Keenetic</span>
              {keeneticContent.title?.split('Keenetic')[1]}
            </h2>
            <p className="text-muted-foreground font-mono mb-8">
              {keeneticContent.description}
            </p>
            <Link to="/node-1">
              <button className="px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-all">
                {keeneticContent.button_text}
              </button>
            </Link>
          </div>
        </section>
      </AnimatedSection>
    ),
    vpn_section: (
      <AnimatedSection delay={0.1}>
        <VPNSection />
      </AnimatedSection>
    ),
    pricing_section: (
      <AnimatedSection delay={0.1} direction="up">
        <PricingSection />
      </AnimatedSection>
    ),
    services_section: (
      <AnimatedSection delay={0.15} direction="left">
        <MiniAppShowcase />
      </AnimatedSection>
    ),
    hardware_section: (
      <AnimatedSection delay={0.1} direction="right">
        <HardwareSection />
      </AnimatedSection>
    ),
    infrastructure_section: (
      <AnimatedSection delay={0.1}>
        <InfrastructureSection />
      </AnimatedSection>
    ),
    faq_section: (
      <AnimatedSection delay={0.1}>
        <FAQSection />
      </AnimatedSection>
    ),
    articles_section: (
      <AnimatedSection delay={0.1}>
        <ArticlesSection />
      </AnimatedSection>
    ),
    telegram_section: (
      <AnimatedSection delay={0.1}>
        <TelegramSection />
      </AnimatedSection>
    ),
    status_widget: (
      <AnimatedSection delay={0.2} direction="none">
        <StatusWidget />
      </AnimatedSection>
    ),
  };

  return (
    <Layout>
      {/* Matrix-style data stream background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DataStream />
      </div>
      
      <div className="relative z-10">
        {/* Hero всегда первый */}
        {settings.hero_section && <HeroSection />}
        
        {/* Остальные блоки в порядке из settings.block_order */}
        {blockOrder.map((blockKey) => {
          const isEnabled = settings[blockKey as keyof typeof settings];
          if (isEnabled && blockComponents[blockKey]) {
            return <div key={blockKey}>{blockComponents[blockKey]}</div>;
          }
          return null;
        })}
      </div>
    </Layout>
  );
};

export default Index;
