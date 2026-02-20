import { Router, Wifi, Tv, Gamepad2, Package, ArrowRight, Shield, Cpu, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Link } from 'react-router-dom';
import { useBlockContent } from '@/hooks/useBlockContent';
import { highlightUppercase } from '@/lib/textHighlight';
import keeneticImage02 from '@/assets/Image02.png';

export const HardwareSection = () => {
  const { content } = useBlockContent('hardware_section', {
    section_title: '3LAB NODE-1',
    section_subtitle: 'Роутер приватности с VPN из коробки',
    section_description: 'Устали объяснять бабушке, как включать VPN? Мы берём надёжный роутер, прошиваем его нашими алгоритмами и привозим вам. Весь трафик внутри дома автоматически шифруется.',
    feature_1_title: 'Защита всей сети',
    feature_1_description: 'all_devices_protected',
    feature_2_title: 'Zero Config',
    feature_2_description: 'включил → работает',
    feature_3_title: '4K Стриминг',
    feature_3_description: 'youtube • netflix',
    feature_4_title: 'Консоли',
    feature_4_description: 'ps5 • xbox • switch',
    price: '1500',
    price_note: '+ стоимость оборудования (или аренда)',
    button_text: 'Заказать NODE-1',
    button_url: '/node-1',
  });

  const features = [
    {
      icon: Wifi,
      title: content.feature_1_title,
      description: content.feature_1_description,
      gradient: 'primary',
    },
    {
      icon: Package,
      title: content.feature_2_title,
      description: content.feature_2_description,
      gradient: 'accent',
    },
    {
      icon: Tv,
      title: content.feature_3_title,
      description: content.feature_3_description,
      gradient: 'red',
    },
    {
      icon: Gamepad2,
      title: content.feature_4_title,
      description: content.feature_4_description,
      gradient: 'purple',
    },
  ];

  return (
    <section id="hardware" className="py-24 relative overflow-hidden bg-background">
      {/* Background Effects */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ perspective: '1000px' }}
      >
        <div 
          className="absolute w-[200%] h-[200%] left-[-50%] top-[-20%]"
          style={{
            transform: 'rotateX(60deg)',
            backgroundImage: `
              linear-gradient(rgba(204, 255, 0, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(204, 255, 0, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>
      
      {/* Glowing Orbs */}
      <div 
        className="absolute top-20 left-10 w-[400px] h-[400px] rounded-full blur-[150px] opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #CCFF00 0%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full blur-[180px] opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #888888 0%, transparent 70%)' }}
      />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none hardware-gradient"
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm text-primary text-sm font-medium">
                <Router className="h-4 w-4" />
                <span className="font-mono-tech text-xs tracking-wider">HARDWARE_SOLUTION</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#CCFF00]" />
                В наличии
              </span>
            </div>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold font-['Montserrat'] mb-6">
              {highlightUppercase(content.section_title)}
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground font-light mb-4">
              {content.section_subtitle}
            </p>
            <p className="text-sm text-muted-foreground/60 font-mono-tech">
              firmware: amneziaWG • control: telegram mini app v2.0
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            {/* Left: 3D Router Visualization - EXACT COPY FROM NODE1 */}
            <AnimatedSection delay={0.2} direction="left">
              <div className="relative aspect-square max-w-[500px] mx-auto group cursor-pointer">
                {/* Background flash on hover */}
                <motion.div
                  className="absolute inset-[-50%] rounded-full blur-[100px] pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(204, 255, 0, 0.3) 0%, transparent 70%)' }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ 
                    opacity: [0, 1, 0.5],
                    scale: [0.8, 1.2, 1],
                  }}
                  transition={{ duration: 0.6 }}
                />

                {/* Orbital rings */}
                <motion.div
                  className="absolute inset-0 rounded-full border border-primary/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-[10%] rounded-full border border-accent/20"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-[20%] rounded-full border border-primary/10"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                />

                {/* Orbital particles animation styles */}
                <style>
                  {`
                    @keyframes orbitOuter {
                      from { transform: rotate(0deg) translateX(250px) rotate(0deg); }
                      to { transform: rotate(360deg) translateX(250px) rotate(-360deg); }
                    }
                    @keyframes orbitMiddle {
                      from { transform: rotate(0deg) translateX(150px) rotate(0deg); }
                      to { transform: rotate(-360deg) translateX(150px) rotate(360deg); }
                    }
                    @keyframes orbitInner {
                      from { transform: rotate(0deg) translateX(200px) rotate(0deg); }
                      to { transform: rotate(360deg) translateX(200px) rotate(-360deg); }
                    }
                  `}
                </style>

                {/* Single glowing particle on outer orbit */}
                <div 
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    marginTop: '-6px',
                    marginLeft: '-6px',
                    background: '#CCFF00',
                    boxShadow: '0 0 15px 5px rgba(204, 255, 0, 0.8)',
                    animation: 'orbitOuter 8s linear infinite',
                  }}
                />

                {/* Single glowing particle on middle orbit */}
                <div 
                  className="absolute w-2.5 h-2.5 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    marginTop: '-5px',
                    marginLeft: '-5px',
                    background: '#00FFFF',
                    boxShadow: '0 0 12px 4px rgba(0, 255, 255, 0.7)',
                    animation: 'orbitMiddle 6s linear infinite',
                  }}
                />

                {/* Single glowing particle on inner orbit */}
                <div 
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    marginTop: '-4px',
                    marginLeft: '-4px',
                    background: '#FF9900',
                    boxShadow: '0 0 10px 3px rgba(255, 153, 0, 0.6)',
                    animation: 'orbitInner 10s linear infinite',
                  }}
                />

                {/* Center router images */}
                <div className="absolute inset-[-20%] flex items-center justify-center">
                  {/* Main router image with glow */}
                  <motion.div
                    className="relative w-full cursor-pointer group/router"
                    animate={{
                      y: [0, -15, 0],
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: 'easeInOut' 
                    }}
                  >
                    {/* Glow layers */}
                    <div
                      className="absolute inset-[-10%] rounded-full blur-3xl pointer-events-none transition-all duration-500"
                      style={{ 
                        background: 'radial-gradient(circle, rgba(204, 255, 0, 0.4) 0%, transparent 70%)',
                      }}
                    />
                    
                    {/* Hover glow - stronger */}
                    <div
                      className="absolute inset-[-10%] rounded-full blur-3xl pointer-events-none opacity-0 group-hover/router:opacity-100 transition-opacity duration-500"
                      style={{ 
                        background: 'radial-gradient(circle, rgba(204, 255, 0, 0.8) 0%, rgba(204, 255, 0, 0.3) 50%, transparent 70%)',
                        transform: 'scale(1.3)',
                      }}
                    />
                    
                    {/* Router image - no frame, transparent background */}
                    <div className="relative transition-transform duration-300 group-hover/router:scale-110">
                      <img 
                        src={keeneticImage02} 
                        alt="Keenetic Router" 
                        className="relative z-10 w-full"
                      />
                    </div>


                  </motion.div>
                </div>

                {/* WireGuard info text - bottom right where image was */}
                <motion.div
                  className="absolute bottom-4 right-4 font-mono text-sm space-y-2 text-right"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="text-primary font-bold text-lg">[ WireGuard ]</div>
                  <div className="text-accent">[ ULTRA FAST ]</div>
                  <div className="text-muted-foreground text-xs">Modern VPN Protocol</div>
                </motion.div>

                {/* Status labels */}
                <div className="absolute top-4 left-4 font-mono text-xs text-primary space-y-1">
                  <div>[ AmneziaWG ]</div>
                  <div className="text-accent">[ ENCRYPTED ]</div>
                </div>
                <div className="absolute bottom-4 left-4 font-mono text-xs text-muted-foreground space-y-1">
                  <div>[ KEENETIC ]</div>
                  <div className="text-primary">[ ACTIVE ]</div>
                </div>
              </div>
            </AnimatedSection>
            
            {/* Right - Features */}
            <div className="order-1 lg:order-2">
              <h3 className="text-3xl md:text-4xl font-bold font-['Montserrat'] mb-6">
                {highlightUppercase(content.section_title?.split(' ')[0] + ' ' + content.section_title?.split(' ')[1])}
                {' '}
                <span className="text-primary">приватность</span>
              </h3>
              
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                {highlightUppercase(content.section_description)}
              </p>
              
              {/* Feature Cards */}
              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className={`p-5 rounded-2xl bg-gradient-to-br border backdrop-blur-sm hover:border-opacity-60 transition-all duration-300 group ${
                      feature.gradient === 'primary' 
                        ? 'from-primary/10 to-transparent border-primary/20 hover:border-primary/40'
                        : feature.gradient === 'accent'
                        ? 'from-accent/10 to-transparent border-accent/20 hover:border-accent/40'
                        : feature.gradient === 'red'
                        ? 'from-[#B10000]/10 to-transparent border-[#B10000]/20 hover:border-[#B10000]/40'
                        : 'from-purple-500/10 to-transparent border-purple-500/20 hover:border-purple-500/40'
                    }`}
                  >
                    <div 
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                        feature.gradient === 'primary' 
                          ? 'bg-primary/20'
                          : feature.gradient === 'accent'
                          ? 'bg-accent/20'
                          : feature.gradient === 'red'
                          ? 'bg-[#B10000]/20'
                          : 'bg-purple-500/20'
                      }`}
                    >
                      <feature.icon 
                        className={`h-6 w-6 ${
                          feature.gradient === 'primary' 
                            ? 'text-primary'
                            : feature.gradient === 'accent'
                            ? 'text-accent'
                            : feature.gradient === 'red'
                            ? 'text-[#FF3333]'
                            : 'text-purple-400'
                        }`}
                      />
                    </div>
                    <h4 className="font-semibold mb-1">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground font-mono-tech">{feature.description}</p>
                  </div>
                ))}
              </div>
              
              {/* Pricing Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 backdrop-blur-sm mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary" style={{ textShadow: '0 0 20px rgba(204, 255, 0, 0.3)' }}>{content.price}₽</span>
                    <span className="text-muted-foreground font-mono-tech">/мес</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
                    <Zap className="h-3 w-3 text-primary" />
                    <span className="text-xs text-primary font-mono-tech">FAST_SETUP</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground/70 font-mono-tech">{content.price_note}</p>
              </div>
              
              <Link to={content.button_url || '/node-1'}>
                <Button 
                  size="lg"
                  className="w-full h-14 bg-gradient-to-r from-primary via-primary to-[#a8cc00] hover:from-[#a8cc00] hover:to-primary text-background font-bold text-lg transition-all duration-300 hover:scale-[1.02] shadow-[0_0_30px_rgba(204,255,0,0.3)]"
                >
                  {content.button_text}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};