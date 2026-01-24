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
import { AnimatedSection } from '@/components/AnimatedSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden scroll-smooth">
      <Header />
      <main>
        <HeroSection />
        
        <AnimatedSection delay={0.1}>
          <VPNSection />
        </AnimatedSection>
        
        <AnimatedSection delay={0.1} direction="up">
          <PricingSection />
        </AnimatedSection>
        
        <AnimatedSection delay={0.15} direction="left">
          <MiniAppShowcase />
        </AnimatedSection>
        
        <AnimatedSection delay={0.1} direction="right">
          <HardwareSection />
        </AnimatedSection>
        
        <AnimatedSection delay={0.1}>
          <InfrastructureSection />
        </AnimatedSection>
        
        <AnimatedSection delay={0.1}>
          <FAQSection />
        </AnimatedSection>
        
        <AnimatedSection delay={0.2} direction="none">
          <StatusWidget />
        </AnimatedSection>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
