import { Check, ArrowRight, Shield, Zap, Globe, Cpu, Server, Package, Lock, Terminal, Bitcoin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { AnimatedSection } from '@/components/AnimatedSection';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';

interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  icon: string;
  color: string;
  badge?: string;
  features: string[];
  buttonText: string;
  buttonLink?: string;
  highlighted?: boolean;
}

interface CryptoPayment {
  id: string;
  name: string;
  symbol: string;
  color: string;
}

interface PricingContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
  };
  tiers: PricingTier[];
  crypto: {
    title: string;
    subtitle: string;
    badge: string;
    payments: CryptoPayment[];
  };
  footer: {
    note: string;
  };
}

// Default content
const defaultContent: PricingContent = {
  hero: {
    badge: 'ACCESS_CONTROL',
    title: 'ВЫБЕРИТЕ УРОВЕНЬ СУВЕРЕНИТЕТА',
    subtitle: 'Доступ к узлам 3WG.RU. Никаких логов. Никаких следов.',
  },
  tiers: [
    {
      id: '1',
      name: 'LITE',
      description: 'Базовый доступ',
      price: '9$',
      period: '/ mo',
      icon: 'Shield',
      color: 'muted',
      features: ['WireGuard Protocol', 'Standard Speed', '1 Device', 'Location: Netherlands'],
      buttonText: 'SELECT_TIER',
      highlighted: false,
    },
    {
      id: '2',
      name: 'PRO',
      description: 'Оптимальный выбор',
      price: '19$',
      period: '/ mo',
      icon: 'Zap',
      color: 'primary',
      badge: 'OPTIMAL_CHOICE',
      features: ['WireGuard + AmneziaWG', 'High Speed (1Gbps)', '5 Devices', 'All Locations', 'Priority Support'],
      buttonText: 'SELECT_TIER',
      highlighted: true,
    },
    {
      id: '3',
      name: 'SOVEREIGN',
      description: 'Железо + Сеть',
      price: '99$',
      period: '+ Shipping',
      icon: 'Server',
      color: 'accent',
      badge: 'HARDWARE_BUNDLE',
      features: ['NODE-1 Hardware Included', 'Lifetime Firmware Updates', 'Personal Node Setup', 'Private Domain Access'],
      buttonText: 'CONFIGURE_NODE',
      buttonLink: '/hardware',
      highlighted: false,
    },
  ],
  crypto: {
    title: 'Anonymous Settlement',
    subtitle: 'PAYMENT_METHOD: CRYPTO_ONLY',
    badge: 'PAYMENT_METHOD: CRYPTO_ONLY',
    payments: [
      { id: '1', name: 'Bitcoin', symbol: 'BTC', color: '#F7931A' },
      { id: '2', name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
      { id: '3', name: 'USDT', symbol: 'USDT', color: '#26A17B' },
      { id: '4', name: 'Monero', symbol: 'XMR', color: '#FF6600' },
      { id: '5', name: 'Litecoin', symbol: 'LTC', color: '#BFBBBB' },
    ],
  },
  footer: {
    note: '*Мы не запрашиваем вашу почту или имя. Только хэш транзакции. Только приватность.',
  },
};

const iconMap: Record<string, any> = {
  Shield,
  Zap,
  Server,
  Package,
  Globe,
  Cpu,
  Lock,
  Terminal,
};

const Pricing = () => {
  const [hoveredCrypto, setHoveredCrypto] = useState<string | null>(null);
  const [content, setContent] = useState<PricingContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await api.request<PricingContent>('/settings/pages/pricing');
        setContent(data);
      } catch (error) {
        console.error('Failed to load pricing content:', error);
        // Use default content on error
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground font-mono">Загрузка...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return {
          glow: 'linear-gradient(135deg, hsl(73, 100%, 50%) 0%, hsl(73, 100%, 40%) 50%, hsl(73, 100%, 50%) 100%)',
          glowOuter: 'linear-gradient(135deg, hsl(73, 100%, 50%) 0%, hsl(73, 100%, 30%) 100%)',
          border: 'border-primary/50',
          bg: 'bg-primary/10',
          text: 'text-primary',
          button: 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50',
        };
      case 'accent':
        return {
          glow: 'linear-gradient(135deg, #FF9900 0%, #CC7700 50%, #FF9900 100%)',
          glowOuter: 'linear-gradient(135deg, #FF9900 0%, #FF6600 100%)',
          border: 'border-accent/50',
          bg: 'bg-accent/10',
          text: 'text-accent',
          button: 'bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/30 hover:shadow-accent/50',
        };
      default:
        return {
          glow: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
          glowOuter: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
          border: 'border-muted-foreground/20',
          bg: 'bg-muted-foreground/10',
          text: 'text-muted-foreground',
          button: 'border-muted-foreground/30 text-muted-foreground hover:bg-muted-foreground/10 hover:border-muted-foreground/50',
        };
    }
  };

  return (
    <Layout>
      <section className="pt-32 pb-24 relative min-h-screen">
        {/* Background grid */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(204, 255, 0, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(204, 255, 0, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        
        {/* Vignette */}
        <div 
          className="absolute inset-0 pointer-events-none pricing-gradient"
        />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
                <Terminal className="h-4 w-4 text-primary" />
                <span className="font-mono text-xs text-primary tracking-wider">{content.hero.badge}</span>
              </div>
              
              <h1 className="font-mono text-3xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 tracking-tight">
                {content.hero.title}
              </h1>
              
              <p className="font-mono text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
                {content.hero.subtitle}
              </p>
            </div>
          </AnimatedSection>

          {/* Pricing Cards */}
          <AnimatedSection delay={0.15}>
            <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
              {content.tiers.map((tier, index) => {
                const colors = getColorClasses(tier.color);
                const IconComponent = iconMap[tier.icon] || Shield;
                const isHighlighted = tier.highlighted;

                return (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                    className={`relative group ${isHighlighted ? 'lg:scale-105 z-10' : ''}`}
                  >
                    {/* Glow effect */}
                    {isHighlighted ? (
                      <>
                        <div 
                          className="absolute -inset-[2px] rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
                          style={{ background: colors.glow }}
                        />
                        <div 
                          className="absolute -inset-[3px] rounded-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 blur-md"
                          style={{ background: colors.glowOuter }}
                        />
                      </>
                    ) : (
                      <div 
                        className="absolute -inset-[1px] rounded-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                        style={{ background: colors.glow }}
                      />
                    )}
                    
                    <div 
                      className={`relative h-full p-6 md:p-8 rounded-2xl border ${colors.border} ${
                        isHighlighted ? 'backdrop-blur-xl pricing-card-pro' : 
                        tier.color === 'accent' ? 'pricing-card-sovereign' : 'bg-background'
                      }`}
                    >
                      {/* Badge */}
                      {tier.badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full ${
                            tier.color === 'primary' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/40' :
                            tier.color === 'accent' ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/40' :
                            'bg-muted text-muted-foreground'
                          } text-[10px] font-bold font-mono tracking-wider`}>
                            <IconComponent className="h-3 w-3" />
                            {tier.badge}
                          </span>
                        </div>
                      )}

                      {/* Terminal header */}
                      <div className={`flex items-center gap-2 mb-6 pb-4 border-b ${
                        tier.color === 'primary' ? 'border-primary/30' :
                        tier.color === 'accent' ? 'border-accent/30' :
                        'border-muted-foreground/20'
                      } ${tier.badge ? 'pt-2' : ''}`}>
                        <div className="flex gap-1.5">
                          <div className={`w-2.5 h-2.5 rounded-full ${colors.bg}`} />
                          <div className={`w-2.5 h-2.5 rounded-full ${colors.bg} opacity-60`} />
                          <div className={`w-2.5 h-2.5 rounded-full ${colors.bg} opacity-30`} />
                        </div>
                        <span className={`font-mono text-[10px] ${colors.text} ml-2`}>
                          tier_{tier.name.toLowerCase()}.sh
                        </span>
                      </div>

                      <div className="text-center mb-8">
                        <div 
                          className={`inline-flex items-center justify-center ${
                            isHighlighted ? 'w-16 h-16' : 'w-14 h-14'
                          } rounded-xl ${colors.bg} border ${colors.border} mb-4`}
                          style={isHighlighted ? { boxShadow: `0 0 30px ${tier.color === 'primary' ? 'rgba(204, 255, 0, 0.2)' : 'rgba(255, 153, 0, 0.2)'}` } : {}}
                        >
                          <IconComponent className={`${isHighlighted ? 'h-8 w-8' : 'h-7 w-7'} ${colors.text}`} />
                        </div>
                        
                        <h3 className={`font-mono ${isHighlighted ? 'text-3xl' : 'text-2xl'} font-bold ${colors.text} mb-1`}>
                          {tier.name}
                        </h3>
                        <p className={`font-mono text-xs ${colors.text} opacity-70 mb-6`}>
                          {tier.description}
                        </p>
                        
                        <div className="flex items-baseline justify-center gap-1">
                          <span className={`font-mono ${isHighlighted ? 'text-6xl' : 'text-5xl'} font-bold ${colors.text}`}>
                            {tier.price}
                          </span>
                          <span className={`font-mono text-sm ${colors.text} opacity-70`}>
                            {tier.period}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 mb-8">
                        {tier.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3 font-mono text-sm">
                            <div className={`w-4 h-4 rounded-sm ${colors.bg} flex items-center justify-center`}>
                              <Check className={`w-3 h-3 ${colors.text}`} />
                            </div>
                            <span className={tier.color === 'muted' ? 'text-muted-foreground' : 'text-foreground'}>
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      {tier.buttonLink ? (
                        <Link to={tier.buttonLink}>
                          <Button className={`w-full font-mono ${colors.button} transition-all`}>
                            <span className="mr-2">&gt;</span> {tier.buttonText}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          variant={tier.color === 'muted' ? 'outline' : 'default'}
                          className={`w-full font-mono ${colors.button} transition-all`}
                        >
                          <span className="mr-2">&gt;</span> {tier.buttonText}
                          {isHighlighted && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>

          {/* Payment Section */}
          <AnimatedSection delay={0.3}>
            <div className="max-w-3xl mx-auto mb-16">
              <div className="relative">
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-50" />
                
                <div className="relative p-8 md:p-10 rounded-2xl bg-background border border-primary/20">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 mb-4">
                      <Lock className="h-4 w-4 text-primary" />
                      <span className="font-mono text-xs text-primary tracking-wider">{content.crypto.badge}</span>
                    </div>
                    <h3 className="font-mono text-xl md:text-2xl font-bold text-foreground">
                      {content.crypto.title}
                    </h3>
                  </div>

                  {/* Crypto Icons */}
                  <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
                    {content.crypto.payments.map((crypto) => (
                      <motion.div
                        key={crypto.id}
                        className="relative cursor-pointer"
                        onMouseEnter={() => setHoveredCrypto(crypto.symbol)}
                        onMouseLeave={() => setHoveredCrypto(null)}
                        whileHover={{ scale: 1.1, y: -5 }}
                      >
                        <div 
                          className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center transition-all duration-300"
                          style={{
                            backgroundColor: hoveredCrypto === crypto.symbol ? `${crypto.color}20` : 'rgba(255,255,255,0.05)',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: hoveredCrypto === crypto.symbol ? crypto.color : 'rgba(255,255,255,0.1)',
                            boxShadow: hoveredCrypto === crypto.symbol ? `0 0 30px ${crypto.color}40` : 'none',
                          }}
                        >
                          <span 
                            className="font-mono text-lg font-bold transition-colors duration-300"
                            style={{
                              color: hoveredCrypto === crypto.symbol ? crypto.color : 'rgba(255,255,255,0.4)',
                            }}
                          >
                            {crypto.symbol}
                          </span>
                        </div>
                        
                        {/* Tooltip */}
                        {hoveredCrypto === crypto.symbol && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute left-1/2 -translate-x-1/2 -bottom-8 whitespace-nowrap"
                          >
                            <span 
                              className="font-mono text-[10px] px-2 py-1 rounded"
                              style={{ 
                                backgroundColor: `${crypto.color}20`,
                                color: crypto.color,
                              }}
                            >
                              {crypto.name}
                            </span>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Footer Note */}
          <AnimatedSection delay={0.4}>
            <div className="text-center">
              <p className="font-mono text-xs text-muted-foreground/60 max-w-lg mx-auto">
                {content.footer.note}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;
