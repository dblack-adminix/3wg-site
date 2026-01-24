import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { VPNSection } from '@/components/VPNSection';
import { StatusWidget } from '@/components/StatusWidget';
import { ServicesSection } from '@/components/ServicesSection';
import { InfrastructureSection } from '@/components/InfrastructureSection';
import { PricingSection } from '@/components/PricingSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <main>
        <HeroSection />
        <VPNSection />
        <StatusWidget />
        <ServicesSection />
        <InfrastructureSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
