import { Check, ArrowRight, Shield, Zap, Globe, Cpu, Server, Package, Lock, Terminal, Bitcoin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { AnimatedSection } from '@/components/AnimatedSection';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Crypto payment icons data
const cryptoPayments = [
  { name: 'Bitcoin', symbol: 'BTC', color: '#F7931A' },
  { name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
  { name: 'USDT', symbol: 'USDT', color: '#26A17B' },
  { name: 'Monero', symbol: 'XMR', color: '#FF6600' },
  { name: 'Litecoin', symbol: 'LTC', color: '#BFBBBB' },
];

const Pricing = () => {
  const [hoveredCrypto, setHoveredCrypto] = useState<string | null>(null);

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
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, transparent 0%, rgba(0,0,0,0.6) 100%)',
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
                <Terminal className="h-4 w-4 text-primary" />
                <span className="font-mono text-xs text-primary tracking-wider">ACCESS_CONTROL</span>
              </div>
              
              <h1 className="font-mono text-3xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 tracking-tight">
                ВЫБЕРИТЕ УРОВЕНЬ СУВЕРЕНИТЕТА
              </h1>
              
              <p className="font-mono text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
                Доступ к узлам 3LAB.PRO. Никаких логов. Никаких следов.
              </p>
            </div>
          </AnimatedSection>

          {/* Pricing Cards */}
          <AnimatedSection delay={0.15}>
            <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
              
              {/* LITE Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative group"
              >
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-muted-foreground/30 to-muted-foreground/10 opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                
                <div className="relative h-full p-6 md:p-8 rounded-2xl bg-[#0a0a0a] border border-muted-foreground/20 group-hover:border-muted-foreground/40 transition-all duration-500">
                  {/* Terminal header */}
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-muted-foreground/20">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40" />
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground ml-2">tier_lite.sh</span>
                  </div>

                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-muted-foreground/10 border border-muted-foreground/20 mb-4">
                      <Shield className="h-7 w-7 text-muted-foreground" />
                    </div>
                    
                    <h3 className="font-mono text-2xl font-bold text-foreground mb-1">LITE</h3>
                    <p className="font-mono text-xs text-muted-foreground mb-6">Базовый доступ</p>
                    
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="font-mono text-5xl font-bold text-foreground">9$</span>
                      <span className="font-mono text-sm text-muted-foreground">/ mo</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {[
                      'WireGuard Protocol',
                      'Standard Speed',
                      '1 Device',
                      'Location: Netherlands',
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 font-mono text-sm">
                        <div className="w-4 h-4 rounded-sm bg-muted-foreground/10 flex items-center justify-center">
                          <Check className="w-3 h-3 text-muted-foreground" />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full font-mono border-muted-foreground/30 text-muted-foreground hover:bg-muted-foreground/10 hover:border-muted-foreground/50 transition-all"
                  >
                    <span className="mr-2">&gt;</span> SELECT_TIER
                  </Button>
                </div>
              </motion.div>

              {/* PRO Card - Highlighted */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative group lg:scale-105 z-10"
              >
                {/* Glow effect */}
                <div 
                  className="absolute -inset-[2px] rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
                  style={{
                    background: 'linear-gradient(135deg, hsl(73, 100%, 50%) 0%, hsl(73, 100%, 40%) 50%, hsl(73, 100%, 50%) 100%)',
                  }}
                />
                <div 
                  className="absolute -inset-[3px] rounded-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 blur-md"
                  style={{
                    background: 'linear-gradient(135deg, hsl(73, 100%, 50%) 0%, hsl(73, 100%, 30%) 100%)',
                  }}
                />
                
                <div 
                  className="relative h-full p-6 md:p-8 rounded-2xl border border-primary/50 backdrop-blur-xl"
                  style={{
                    background: 'linear-gradient(180deg, rgba(204, 255, 0, 0.08) 0%, rgba(10, 10, 10, 0.95) 30%)',
                  }}
                >
                  {/* Recommended badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold font-mono tracking-wider shadow-lg shadow-primary/40">
                      <Zap className="h-3 w-3" />
                      OPTIMAL_CHOICE
                    </span>
                  </div>

                  {/* Terminal header */}
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-primary/30 pt-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-primary/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-primary/20" />
                    </div>
                    <span className="font-mono text-[10px] text-primary ml-2">tier_pro.sh</span>
                  </div>

                  <div className="text-center mb-8">
                    <div 
                      className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 border border-primary/30 mb-4"
                      style={{ boxShadow: '0 0 30px rgba(204, 255, 0, 0.2)' }}
                    >
                      <Zap className="h-8 w-8 text-primary" />
                    </div>
                    
                    <h3 className="font-mono text-3xl font-bold text-primary mb-1">PRO</h3>
                    <p className="font-mono text-xs text-primary/70 mb-6">Оптимальный выбор</p>
                    
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="font-mono text-6xl font-bold text-primary">19$</span>
                      <span className="font-mono text-sm text-primary/70">/ mo</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {[
                      'WireGuard + AmneziaWG',
                      'High Speed (1Gbps)',
                      '5 Devices',
                      'All Locations',
                      'Priority Support',
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 font-mono text-sm">
                        <div className="w-4 h-4 rounded-sm bg-primary/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full font-mono bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
                  >
                    <span className="mr-2">&gt;</span> SELECT_TIER
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>

              {/* SOVEREIGN Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="relative group"
              >
                {/* Orange glow */}
                <div 
                  className="absolute -inset-[2px] rounded-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 blur-sm"
                  style={{
                    background: 'linear-gradient(135deg, #FF9900 0%, #CC7700 50%, #FF9900 100%)',
                  }}
                />
                <div 
                  className="absolute -inset-[3px] rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 blur-md"
                  style={{
                    background: 'linear-gradient(135deg, #FF9900 0%, #FF6600 100%)',
                  }}
                />
                
                <div 
                  className="relative h-full p-6 md:p-8 rounded-2xl border border-accent/50"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255, 153, 0, 0.08) 0%, rgba(10, 10, 10, 0.98) 30%)',
                  }}
                >
                  {/* Badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold font-mono tracking-wider shadow-lg shadow-accent/40">
                      <Package className="h-3 w-3" />
                      HARDWARE_BUNDLE
                    </span>
                  </div>

                  {/* Terminal header */}
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-accent/30 pt-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-accent/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-accent/20" />
                    </div>
                    <span className="font-mono text-[10px] text-accent ml-2">tier_sovereign.sh</span>
                  </div>

                  <div className="text-center mb-8">
                    <div 
                      className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-accent/10 border border-accent/30 mb-4"
                      style={{ boxShadow: '0 0 30px rgba(255, 153, 0, 0.2)' }}
                    >
                      <Server className="h-8 w-8 text-accent" />
                    </div>
                    
                    <h3 className="font-mono text-2xl font-bold text-accent mb-1">SOVEREIGN</h3>
                    <p className="font-mono text-xs text-accent/70 mb-6">Железо + Сеть</p>
                    
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="font-mono text-5xl font-bold text-accent">99$</span>
                      <span className="font-mono text-sm text-accent/70">+ Shipping</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {[
                      'NODE-1 Hardware Included',
                      'Lifetime Firmware Updates',
                      'Personal Node Setup',
                      'Private Domain Access',
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 font-mono text-sm">
                        <div className="w-4 h-4 rounded-sm bg-accent/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-accent" />
                        </div>
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link to="/hardware">
                    <Button
                      className="w-full font-mono bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/30 hover:shadow-accent/50 transition-all"
                    >
                      <span className="mr-2">&gt;</span> CONFIGURE_NODE
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>

            </div>
          </AnimatedSection>

          {/* Payment Section */}
          <AnimatedSection delay={0.3}>
            <div className="max-w-3xl mx-auto mb-16">
              <div className="relative">
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-50" />
                
                <div className="relative p-8 md:p-10 rounded-2xl bg-[#0a0a0a] border border-primary/20">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 mb-4">
                      <Lock className="h-4 w-4 text-primary" />
                      <span className="font-mono text-xs text-primary tracking-wider">PAYMENT_METHOD: CRYPTO_ONLY</span>
                    </div>
                    <h3 className="font-mono text-xl md:text-2xl font-bold text-foreground">
                      Anonymous Settlement
                    </h3>
                  </div>

                  {/* Crypto Icons */}
                  <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
                    {cryptoPayments.map((crypto) => (
                      <motion.div
                        key={crypto.symbol}
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
                *Мы не запрашиваем вашу почту или имя. Только хэш транзакции. Только приватность.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;
