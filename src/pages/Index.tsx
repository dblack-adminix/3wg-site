import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { VPNSection } from '@/components/VPNSection';
import { PricingSection } from '@/components/PricingSection';
import { MiniAppShowcase } from '@/components/MiniAppShowcase';
import { HardwareSection } from '@/components/HardwareSection';
import { FAQSection } from '@/components/FAQSection';
import { InfrastructureSection } from '@/components/InfrastructureSection';
import { StatusWidget } from '@/components/StatusWidget';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden scroll-smooth">
      <Header />
      <main>
        <HeroSection />
        <VPNSection />
        <PricingSection />
        <MiniAppShowcase />
        <HardwareSection />
        <InfrastructureSection />
        <FAQSection />
        <StatusWidget />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
