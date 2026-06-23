import { Shield, Zap, Eye, EyeOff, Cpu, Radio, Check, X, ArrowRight, Server } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBlockContent } from '@/hooks/useBlockContent';

const features = [
  {
    icon: Radio,
    title: 'Маскировка параметров',
    subtitle: 'Junk Data',
    description: 'Мы добавляем случайные байты в начало пакетов (Init Packet). Для цензора это выглядит как хаотичный набор данных, который невозможно классифицировать.',
  },
  {
    icon: Zap,
    title: 'Изменение размеров',
    subtitle: 'Packet Resizing',
    description: 'Стандартные пакеты VPN имеют фиксированный размер. AmneziaWG динамически меняет их длину, имитируя передачу обычного HTTPS-трафика.',
  },
  {
    icon: EyeOff,
    title: 'Бесшумное рукопожатие',
    subtitle: 'Silent Handshake',
    description: 'Процесс "рукопожатия" происходит бесшумно и не вызывает подозрений у систем мониторинга провайдера.',
  },
];

const nodeAdvantages = [
  {
    icon: Shield,
    title: 'Работа в "белых списках"',
    description: 'Даже если в вашей сети разрешен только ограниченный список сайтов, AmneziaWG найдет лазейку.',
  },
  {
    icon: Zap,
    title: 'Минимальный пинг',
    description: 'В отличие от тяжелых протоколов маскировки, AmneziaWG работает на уровне ядра (Kernel-space), сохраняя скорость.',
  },
  {
    icon: Cpu,
    title: 'Автоматизация',
    description: 'Вам не нужно знать порты и ключи. Прошивка сама выбирает оптимальные параметры маскировки.',
  },
];

const comparisonData = [
  { feature: 'Скорость', wireguard: 'До 1 Гбит/с', amnezia: 'До 800 Мбит/с' },
  { feature: 'Маскировка', wireguard: 'Базовая', amnezia: 'Ультра (Anti-DPI)' },
  { feature: 'Назначение', wireguard: 'Игры, 4K, Стриминг', amnezia: 'Обход жестких блокировок' },
  { feature: 'Расход батареи', wireguard: 'Минимальный', amnezia: 'Минимальный' },
];

const AmneziaWG = () => {
  const { content } = useBlockContent('amneziawg_page', {
    hero: {
      badge: 'STEALTH_PROTOCOL',
      title: 'Amnezia',
      titleHighlight: 'WG',
      subtitle: 'Невидимый щит',
      subtitleHighlight: '3WG.RU',
      description: 'Протокол, который невозможно заблокировать',
    },
    problem: {
      badge: 'ПРОБЛЕМА',
      title: 'Почему стандартные VPN больше не работают?',
      description: 'Обычные протоколы (WireGuard, OpenVPN) имеют характерный "цифровой почерк". Современные системы анализа трафика (DPI) легко распознают их и блокируют за миллисекунды.',
      solution: 'AmneziaWG — это эволюция WireGuard, созданная для того, чтобы ваш трафик выглядел как обычный шум или безобидный веб-серфинг.',
    },
    howItWorks: {
      badge: 'amzwg.ru',
      title: 'Как это работает в 3WG?',
      description: 'Технология AmneziaWG модифицирует заголовки пакетов WireGuard, лишая их узнаваемых признаков. В нашей инфраструктуре мы довели эту технологию до абсолюта.',
      features,
    },
    nodeAdvantages: {
      title: 'Преимущества для пользователя',
      titleHighlight: 'NODE-1',
      description: 'Использование AmneziaWG на нашем роутере 3WG NODE-1',
      advantages: nodeAdvantages,
    },
    comparison: {
      title: 'Сравнение протоколов',
      rows: comparisonData,
    },
    cta: {
      title: 'Попробуйте AmneziaWG в действии',
      subtitle: 'с роутером',
      subtitleHighlight: 'NODE-1',
      button1Text: 'Купить Hardware',
      button2Text: 'Смотреть тарифы',
    },
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-black">
          {/* Static grid */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="h-full w-full" 
              style={{
                backgroundImage: 'linear-gradient(#FF9900 1px, transparent 1px), linear-gradient(90deg, #FF9900 1px, transparent 1px)',
                backgroundSize: '60px 60px'
              }} 
            />
          </div>

          {/* Data flow lines with particles - LEFT SIDE (blue/cyan - unencrypted) */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div key={`flow-left-${i}`} className="absolute" style={{ top: `${15 + i * 12}%` }}>
                {/* Flow line */}
                <div
                  className="absolute left-0 h-[2px] w-[45%]"
                  style={{
                    background: 'linear-gradient(to right, transparent, #00BFFF, #00BFFF, transparent)',
                    animation: `flowPulse ${2 + i * 0.3}s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                    opacity: 0.6,
                  }}
                />
                {/* Particles on the line */}
                {[...Array(3)].map((_, j) => (
                  <div
                    key={`particle-left-${i}-${j}`}
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                    style={{
                      left: 0,
                      top: 0,
                      boxShadow: '0 0 8px #00BFFF',
                      animation: `particleFlowLeft ${3 + i * 0.2}s linear infinite`,
                      animationDelay: `${j * 0.8}s`,
                    }}
                  />
                ))}
                {/* Wave impulses */}
                <div
                  className="absolute left-0 h-[4px] w-[40px]"
                  style={{
                    background: 'linear-gradient(to right, transparent, #00BFFF, transparent)',
                    boxShadow: '0 0 10px #00BFFF',
                    animation: `waveImpulseLeft ${2.5 + i * 0.2}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`,
                    filter: 'blur(1px)',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Data flow lines with particles - RIGHT SIDE (green/yellow - encrypted) */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div key={`flow-right-${i}`} className="absolute" style={{ top: `${15 + i * 12}%` }}>
                {/* Flow line */}
                <div
                  className="absolute right-0 h-[2px] w-[45%]"
                  style={{
                    background: 'linear-gradient(to left, transparent, #CCFF00, #00FF88, transparent)',
                    animation: `flowPulse ${2 + i * 0.3}s ease-in-out infinite`,
                    animationDelay: `${i * 0.2 + 0.5}s`,
                    opacity: 0.6,
                  }}
                />
                {/* Particles on the line */}
                {[...Array(3)].map((_, j) => (
                  <div
                    key={`particle-right-${i}-${j}`}
                    className="absolute w-1 h-1 bg-[#CCFF00] rounded-full"
                    style={{
                      right: 0,
                      top: 0,
                      boxShadow: '0 0 8px #CCFF00',
                      animation: `particleFlowRight ${3 + i * 0.2}s linear infinite`,
                      animationDelay: `${j * 0.8}s`,
                    }}
                  />
                ))}
                {/* Wave impulses */}
                <div
                  className="absolute right-0 h-[4px] w-[40px]"
                  style={{
                    background: 'linear-gradient(to left, transparent, #CCFF00, transparent)',
                    boxShadow: '0 0 10px #CCFF00',
                    animation: `waveImpulseRight ${2.5 + i * 0.2}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`,
                    filter: 'blur(1px)',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Central encryption shield with neon glow */}
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
            {/* Background image under rings */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] opacity-60"
              style={{
                backgroundImage: 'url(/images/maintenance-bg.png)',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />

            {/* Encryption waves - expanding rings */}
            {[...Array(4)].map((_, i) => (
              <div
                key={`wave-${i}`}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 pointer-events-none"
                style={{
                  width: '200px',
                  height: '200px',
                  borderColor: i % 2 === 0 ? '#FF9900' : '#CCFF00',
                  animation: `expandWave 4s ease-out infinite`,
                  animationDelay: `${i * 1}s`,
                  opacity: 0,
                }}
              />
            ))}

            {/* Large outer glow rings with hover effect */}
            {[...Array(3)].map((_, i) => (
              <div
                key={`glow-ring-${i}`}
                data-ring
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${350 + i * 120}px`,
                  height: `${350 + i * 120}px`,
                  border: `3px solid ${i % 2 === 0 ? '#FF9900' : '#CCFF00'}`,
                  color: i % 2 === 0 ? '#FF9900' : '#CCFF00',
                  opacity: 0.3 - i * 0.08,
                  animation: `pulse ${3 + i * 0.8}s ease-in-out infinite`,
                  animationDelay: `${i * 0.4}s`,
                  boxShadow: `0 0 40px ${i % 2 === 0 ? '#FF9900' : '#CCFF00'}, inset 0 0 40px ${i % 2 === 0 ? '#FF9900' : '#CCFF00'}`,
                }}
              />
            ))}

            {/* Shield pulse effect - placed after rings to be on top */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none z-10"
              style={{
                background: 'radial-gradient(circle, rgba(255, 153, 0, 0.6) 0%, rgba(204, 255, 0, 0.3) 50%, transparent 70%)',
                animation: 'shieldPulse 5s ease-in-out infinite',
                filter: 'blur(30px)',
              }}
            />

            {/* Orbiting energy particles - distributed across 3 rings */}
            {/* Ring 1 - innermost (350px diameter = 175px radius) */}
            {[...Array(4)].map((_, i) => (
              <div
                key={`orbit-ring1-${i}`}
                className="absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{
                  background: i % 2 === 0 ? '#FF9900' : '#CCFF00',
                  boxShadow: `0 0 15px ${i % 2 === 0 ? '#FF9900' : '#CCFF00'}`,
                  top: '50%',
                  left: '50%',
                  animation: `orbit1 6s linear infinite`,
                  animationDelay: `${-i * 1.5}s`,
                }}
              />
            ))}
            
            {/* Ring 2 - middle (470px diameter = 235px radius) */}
            {[...Array(4)].map((_, i) => (
              <div
                key={`orbit-ring2-${i}`}
                className="absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{
                  background: i % 2 === 0 ? '#CCFF00' : '#FF9900',
                  boxShadow: `0 0 15px ${i % 2 === 0 ? '#CCFF00' : '#FF9900'}`,
                  top: '50%',
                  left: '50%',
                  animation: `orbit2 8s linear infinite reverse`,
                  animationDelay: `${-i * 2}s`,
                }}
              />
            ))}
            
            {/* Ring 3 - outermost (590px diameter = 295px radius) */}
            {[...Array(4)].map((_, i) => (
              <div
                key={`orbit-ring3-${i}`}
                className="absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{
                  background: i % 2 === 0 ? '#FF9900' : '#CCFF00',
                  boxShadow: `0 0 15px ${i % 2 === 0 ? '#FF9900' : '#CCFF00'}`,
                  top: '50%',
                  left: '50%',
                  animation: `orbit3 10s linear infinite`,
                  animationDelay: `${-i * 2.5}s`,
                }}
              />
            ))}
          </div>

          {/* Ambient glow layers - increased size */}
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/25 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#CCFF00]/25 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF9900]/5 rounded-full blur-[120px]" />
        </div>

        {/* Text content below animation */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#CCFF00]/10 border border-[#CCFF00]/30 rounded-full mb-8">
              <Eye className="w-4 h-4 text-[#CCFF00]" />
              <span className="text-[#CCFF00] text-sm font-mono">{content.hero.badge}</span>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight" style={{ 
              textShadow: '0 0 80px rgba(0, 0, 0, 1), 0 0 40px rgba(0, 0, 0, 0.95), 0 6px 40px rgba(0, 0, 0, 0.9), 2px 2px 4px rgba(0, 0, 0, 1)'
            }}>
              <span className="text-[#CCFF00]">{content.hero.title}</span>
              <span className="text-[#FF9900]">{content.hero.titleHighlight}</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-2xl md:text-3xl text-white/90 mb-4" style={{ textShadow: '0 0 30px rgba(0, 0, 0, 0.9), 0 2px 15px rgba(0, 0, 0, 0.7)' }}>
              {content.hero.subtitle} <span className="text-[#CCFF00]">{content.hero.subtitleHighlight}</span>
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <p className="text-xl text-white/60 max-w-2xl mx-auto" style={{ textShadow: '0 0 20px rgba(0, 0, 0, 0.9), 0 2px 10px rgba(0, 0, 0, 0.8)' }}>
              {content.hero.description}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-500 font-mono text-sm">{content.problem.badge}</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                {content.problem.title}
              </h2>
              
              <div className="p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <p className="text-lg text-white/70 leading-relaxed">
                  {content.problem.description}
                </p>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-white/90">
                    {content.problem.solution}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF9900]/10 border border-[#FF9900]/30 rounded-full mb-6">
                <Server className="w-4 h-4 text-[#FF9900]" />
                <span className="text-[#FF9900] text-sm font-mono">{content.howItWorks.badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {content.howItWorks.title}
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                {content.howItWorks.description}
              </p>
            </div>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {content.howItWorks.features.map((feature: any, index: number) => (
              <StaggerItem key={feature.title}>
                <div className="group relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#FF9900]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  <div className="relative h-full p-8 bg-white/5 border border-[#FF9900]/20 rounded-2xl hover:border-[#FF9900]/50 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-[#FF9900]/10 rounded-xl flex items-center justify-center border border-[#FF9900]/30">
                        {index === 0 && <Radio className="w-7 h-7 text-[#FF9900]" />}
                        {index === 1 && <Zap className="w-7 h-7 text-[#FF9900]" />}
                        {index === 2 && <EyeOff className="w-7 h-7 text-[#FF9900]" />}
                      </div>
                      <div className="text-[#FF9900] font-mono text-sm">0{index + 1}</div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-[#FF9900] text-sm font-mono mb-4">{feature.subtitle}</p>
                    <p className="text-white/60">{feature.description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* NODE-1 Advantages */}
      <section className="py-24 relative bg-gradient-to-b from-transparent via-[#FF9900]/5 to-transparent">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {content.nodeAdvantages.title} <span className="text-[#CCFF00]">{content.nodeAdvantages.titleHighlight}</span>
              </h2>
              <p className="text-white/60">
                {content.nodeAdvantages.description}
              </p>
            </div>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {content.nodeAdvantages.advantages.map((advantage: any, index: number) => (
              <StaggerItem key={advantage.title}>
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-[#CCFF00]/30 transition-colors">
                  {index === 0 && <Shield className="w-10 h-10 text-[#CCFF00] mb-4" />}
                  {index === 1 && <Zap className="w-10 h-10 text-[#CCFF00] mb-4" />}
                  {index === 2 && <Cpu className="w-10 h-10 text-[#CCFF00] mb-4" />}
                  <h3 className="text-lg font-bold text-white mb-2">{advantage.title}</h3>
                  <p className="text-white/60 text-sm">{advantage.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {content.comparison.title}
              </h2>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-white/10">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white/60 font-mono">Характеристика</TableHead>
                    <TableHead className="text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B10000]/20 border border-[#B10000]/50 rounded-full">
                        <span className="text-[#ff4444] font-mono text-sm">WireGuard</span>
                      </div>
                      <div className="text-white/40 text-xs mt-1 font-mono">wire3.ru</div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF9900]/20 border border-[#FF9900]/50 rounded-full">
                        <span className="text-[#FF9900] font-mono text-sm">AmneziaWG</span>
                      </div>
                      <div className="text-white/40 text-xs mt-1 font-mono">amzwg.ru</div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {content.comparison.rows.map((row: any, index: number) => (
                    <TableRow key={row.feature} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white font-medium">{row.feature}</TableCell>
                      <TableCell className="text-center text-white/70">{row.wireguard}</TableCell>
                      <TableCell className="text-center">
                        <span className={index === 1 ? 'text-[#FF9900] font-semibold' : 'text-white/70'}>
                          {row.amnezia}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <div className="p-12 bg-gradient-to-br from-[#FF9900]/10 to-[#CCFF00]/5 border border-[#FF9900]/30 rounded-3xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  {content.cta.title}
                </h2>
                <p className="text-xl text-white/70 mb-8">
                  {content.cta.subtitle} <span className="text-[#CCFF00]">{content.cta.subtitleHighlight}</span>
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/hardware">
                    <Button className="bg-[#FF9900] hover:bg-[#FF9900]/90 text-black font-bold px-8 py-6 text-lg group">
                      {content.cta.button1Text}
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/pricing">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg">
                      {content.cta.button2Text}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <style>{`
        @keyframes flowPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scaleX(1);
          }
          50% {
            opacity: 0.8;
            transform: scaleX(1.05);
          }
        }

        @keyframes flicker {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        @keyframes particleFlowLeft {
          0% {
            left: 0%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            left: 45%;
            opacity: 0;
          }
        }

        @keyframes particleFlowRight {
          0% {
            right: 0%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            right: 45%;
            opacity: 0;
          }
        }

        @keyframes waveImpulseLeft {
          0% {
            left: 0%;
            opacity: 0;
            transform: scaleX(0.5);
          }
          20% {
            opacity: 1;
            transform: scaleX(1.5);
          }
          100% {
            left: 45%;
            opacity: 0;
            transform: scaleX(0.5);
          }
        }

        @keyframes waveImpulseRight {
          0% {
            right: 0%;
            opacity: 0;
            transform: scaleX(0.5);
          }
          20% {
            opacity: 1;
            transform: scaleX(1.5);
          }
          100% {
            right: 45%;
            opacity: 0;
            transform: scaleX(0.5);
          }
        }

        @keyframes expandWave {
          0% {
            width: 200px;
            height: 200px;
            opacity: 0.8;
          }
          100% {
            width: 800px;
            height: 800px;
            opacity: 0;
          }
        }

        @keyframes shieldPulse {
          0%, 100% {
            opacity: 0.4;
            transform: translate(-50%, -50%) scale(0.95);
          }
          50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.15);
          }
        }

        @keyframes orbit1 {
          from {
            transform: translate(-50%, -50%) rotate(0deg) translateX(175px);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg) translateX(175px);
          }
        }

        @keyframes orbit2 {
          from {
            transform: translate(-50%, -50%) rotate(0deg) translateX(235px);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg) translateX(235px);
          }
        }

        @keyframes orbit3 {
          from {
            transform: translate(-50%, -50%) rotate(0deg) translateX(295px);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg) translateX(295px);
          }
        }

        /* Hover effect for rings */
        .group:hover [data-ring] {
          transform: translate(-50%, -50%) scale(1.15);
          opacity: 0.6 !important;
          box-shadow: 0 0 80px currentColor, inset 0 0 80px currentColor;
        }
      `}</style>
    </Layout>
  );
};

export default AmneziaWG;
