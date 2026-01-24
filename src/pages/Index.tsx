import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { VPNSection } from '@/components/VPNSection';
import { InfrastructureSection } from '@/components/InfrastructureSection';
import { ArticlesSection } from '@/components/ArticlesSection';
import { TelegramSection } from '@/components/TelegramSection';
import { PricingSection } from '@/components/PricingSection';
import { StatusWidget } from '@/components/StatusWidget';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <main>
        <HeroSection />
        <VPNSection />
        <InfrastructureSection />
        <ArticlesSection />
        <TelegramSection />
        <PricingSection />
        <StatusWidget />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
